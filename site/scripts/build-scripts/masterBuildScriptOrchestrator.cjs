const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const matter = require('gray-matter');
const { v4: uuidv4 } = require('uuid');

// Import configurations and evaluation functions
const USER_OPTIONS = require('./getUserOptionsForBuild.cjs');
const { evaluateFile } = require('./evaluateTargetContent.cjs');
const { 
  getFromOpenGraphIo, 
  fetchScreenshotUrlInBackground, 
  cleanDuplicateYamlKeys,
  markFileWithError 
} = require('./fetchOpenGraphData.cjs');
const { formatEvaluationReport } = require('./getReportingFormatForBuild.cjs');

// ============================================================================
// YAML Assurance Functions
// ============================================================================

/**
 * @typedef {Object} YAMLModifications
 * @property {boolean} modified - Whether the file was modified
 * @property {number} replacements - Number of replacements made
 * @property {Object} changes - Detailed changes made
 */

/**
 * Process and correct YAML frontmatter
 * @param {string} filePath - Path to the file
 * @param {Object} evaluation - Evaluation results for the file
 * @returns {YAMLModifications} Modification results
 */
function assureYAMLProperties(filePath, evaluation) {
  const content = fs.readFileSync(filePath, 'utf8');
  const parsedFile = matter(content);
  
  // Get the raw frontmatter string
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { modified: false, replacements: 0, changes: {} };
  
  const frontmatter = match[1];
  let modifiedFrontmatter = frontmatter;
  let replacements = 0;
  const changes = {};
  
  // Add UUID if missing
  if (evaluation.yaml.needsUUID) {
    const generatedUUID = uuidv4();
    const newProperty = `site_uuid: "${generatedUUID}"`;
    modifiedFrontmatter = `${newProperty}\n${modifiedFrontmatter}`;
    replacements++;
    changes.uuid = generatedUUID;
  }

  // Convert hyphens to underscores in variable names
  if (evaluation.yaml.needsHyphenConversion) {
    modifiedFrontmatter = modifiedFrontmatter.replace(/^([^:\r\n]+?):/gm, (match, varName) => {
      const newVarName = varName.trim().replace(/-/g, '_');
      if (newVarName !== varName.trim()) {
        replacements++;
        changes.hyphenConversions = changes.hyphenConversions || [];
        changes.hyphenConversions.push({ from: varName.trim(), to: newVarName });
        return `${newVarName}:`;
      }
      return match;
    });
  }

  // Format tags
  if (evaluation.yaml.needsTagFormatting || evaluation.yaml.needsPathTags) {
    const currentTags = Array.isArray(parsedFile.data.tags) ? parsedFile.data.tags : 
                       (parsedFile.data.tags ? [parsedFile.data.tags] : []);
    
    let newTags = currentTags.map(tag => tag.replace(/\s+/g, '-'));
    
    // Add missing path tags
    if (evaluation.yaml.needsPathTags) {
      newTags = [...new Set([...newTags, ...evaluation.yaml.missingPathTags])];
      changes.addedTags = evaluation.yaml.missingPathTags;
    }
    
    if (JSON.stringify(currentTags) !== JSON.stringify(newTags)) {
      modifiedFrontmatter = modifiedFrontmatter.replace(
        /^tags:.*$/m,
        `tags: [${newTags.map(t => `"${t}"`).join(', ')}]`
      );
      replacements++;
      changes.tagFormatting = { from: currentTags, to: newTags };
    }
  }

  const modified = frontmatter !== modifiedFrontmatter;
  if (modified) {
    // Replace the original frontmatter with modified version
    const newContent = content.replace(frontmatter, modifiedFrontmatter);
    fs.writeFileSync(filePath, newContent, 'utf8');
  }

  return { modified, replacements, changes };
}

// ============================================================================
// OpenGraph Processing Functions
// ============================================================================

/**
 * Process OpenGraph data for a file based on evaluation results
 * @param {string} filePath - Path to the file
 * @param {Object} evaluation - Evaluation results
 * @returns {Promise<void>}
 */
async function processOpenGraph(filePath, evaluation) {
  if (!evaluation.openGraph.needsProcessing) {
    return;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const cleanedContent = cleanDuplicateYamlKeys(content);
    const { data: frontmatter, content: fileContent } = matter(cleanedContent);

    // Skip if no URL is present
    if (!frontmatter.url) {
      console.log(`⚠️ Skipping OpenGraph processing for ${path.basename(filePath)} - No URL present`);
      return;
    }

    // Fetch new OpenGraph data if needed
    if (evaluation.openGraph.needsFetch) {
      console.log(`Fetching OpenGraph data for ${path.basename(filePath)}`);
      const ogData = await getFromOpenGraphIo(frontmatter.url, filePath);
      
      if (ogData) {
        Object.entries(ogData).forEach(([key, value]) => {
          if (value && !frontmatter[key]) frontmatter[key] = value;
        });
        frontmatter.og_last_fetch = new Date().toISOString();
      }
    }

    // Start screenshot fetch if needed
    if (evaluation.openGraph.needsScreenshot && !frontmatter.og_errors) {
      console.log(`Initiating screenshot fetch for ${path.basename(filePath)}`);
      fetchScreenshotUrlInBackground(frontmatter.url, filePath);
    }

    // Save updates
    fs.writeFileSync(filePath, matter.stringify(fileContent, frontmatter));
    console.log(`✅ Updated OpenGraph data for ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`Error processing OpenGraph for ${path.basename(filePath)}:`, error);
    markFileWithError(filePath, `OpenGraph processing error: ${error.message}`);
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get the next iteration number for the output file
 * @param {string} baseFilePath - Base file path without iteration number
 * @returns {string} Complete file path with iteration number
 */
function getNextIterationFilePath(baseFilePath) {
  const dir = path.dirname(baseFilePath);
  const ext = path.extname(baseFilePath);
  const baseName = path.basename(baseFilePath, ext);
  
  // Find existing iteration files
  const pattern = `${baseName}_*${ext}`;
  const existingFiles = glob.sync(pattern, { cwd: dir });
  
  // Extract existing iteration numbers
  const iterations = existingFiles
    .map(file => {
      const match = file.match(/_(\d+)\.md$/);
      return match ? parseInt(match[1]) : 0;
    })
    .filter(num => !isNaN(num));
  
  // Get next iteration number
  const nextIteration = iterations.length > 0 ? Math.max(...iterations) + 1 : 1;
  const iterationNum = nextIteration.toString().padStart(2, '0');
  
  return path.join(dir, `${baseName}_${iterationNum}${ext}`);
}

// ============================================================================
// Main Orchestration
// ============================================================================

async function main() {
  try {
    console.log('Starting content evaluation and YAML assurance...');

    // Get all content files
    const contentPath = USER_OPTIONS.directories.content;
    const excludeDirs = USER_OPTIONS.directories.excludeUrlCheck;
    
    const excludePattern = excludeDirs.length > 0 
      ? `!(${excludeDirs.join('|')})` 
      : '*';
    const globPattern = path.join(contentPath, '**', excludePattern, '*.md');

    console.log(`Searching for files with pattern: ${globPattern}`);
    const files = await glob(globPattern);
    
    // Initialize processing stats
    const processingStats = {
      totalFound: files.length,
      excluded: {
        count: 0,
        paths: []
      },
      skipped: {
        count: 0,
        paths: []
      },
      processed: {
        count: 0,
        paths: []
      }
    };

    console.log(`Found ${files.length} files to process`);

    // Process each file
    const results = {};
    for (const file of files) {
      console.log(`Processing: ${file}`);
      
      // First evaluate
      let evaluation = evaluateFile(file);
      
      if (!evaluation) {
        processingStats.skipped.count++;
        processingStats.skipped.paths.push(file);
        console.log(`Skipped ${file} - Could not evaluate`);
        continue;
      }

      processingStats.processed.count++;
      processingStats.processed.paths.push(file);
      
      // Then apply YAML modifications if needed
      const modifications = evaluation?.yaml.needsProcessing 
        ? assureYAMLProperties(file, evaluation)
        : { modified: false, replacements: 0, changes: {} };

      // Process OpenGraph if needed
      if (evaluation?.openGraph.needsProcessing) {
        await processOpenGraph(file, evaluation);
        
        // Re-evaluate after OpenGraph processing to get updated status
        evaluation = evaluateFile(file);
      }

      results[file] = { evaluation, modifications };
    }

    // Generate output file path with iteration number
    const outputFile = getNextIterationFilePath(USER_OPTIONS.evaluationOutputFile);
    
    // Format and write results using the reporting module
    const markdown = formatEvaluationReport(results, processingStats);
    
    // Ensure directory exists
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write the file
    fs.writeFileSync(outputFile, markdown);
    console.log(`Results written to: ${outputFile}`);

  } catch (error) {
    console.error('Error in build script orchestration:', error);
    process.exit(1);
  }
}

// Run the script
main();
