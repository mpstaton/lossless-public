const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const matter = require('gray-matter');
const { v4: uuidv4 } = require('uuid');

// Import configurations and evaluation functions
const USER_OPTIONS = require('./getUserOptionsForBuild.cjs');
const { evaluateFile } = require('./evaluateTargetContent.cjs');

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

/**
 * Format evaluation and modification results as markdown
 * @param {Object} results - Combined evaluation and modification results by file
 * @returns {string} Formatted markdown content
 */
function formatResults(results) {
  const timestamp = new Date().toISOString();
  let markdown = `---
title: Content Evaluation and Modification Results
date: ${timestamp}
type: evaluation-report
---

# Content Evaluation and Modification Results
Generated: ${timestamp}

## Summary
Total files processed: ${Object.keys(results).length}

## Detailed Results\n\n`;

  // Sort files by basename
  const sortedFiles = Object.entries(results)
    .sort(([filePathA], [filePathB]) => {
      const baseNameA = path.basename(filePathA).toLowerCase();
      const baseNameB = path.basename(filePathB).toLowerCase();
      return baseNameA.localeCompare(baseNameB);
    });

  for (const [filePath, result] of sortedFiles) {
    if (!result.evaluation) continue;

    const fileName = path.basename(filePath);
    const fileNameNoExt = path.basename(fileName, '.md');
    
    // Get the path after 'content/'
    const contentBasePath = 'site/src/content/';
    const relativePath = filePath.split(contentBasePath)[1] || filePath;
    
    markdown += `### ${fileName}\n`;
    markdown += `current_path::${relativePath}\n`;
    markdown += `internal_link::[[${fileNameNoExt}]]\n`;

    // Display existing UUID if present, or the one just generated
    const existingUUID = result.evaluation.yaml.needsUUID ? null : 
                        matter(fs.readFileSync(filePath, 'utf8')).data.site_uuid;
    const generatedUUID = result.modifications.changes.uuid;
    const uuid = existingUUID || generatedUUID;
    
    if (uuid) {
      markdown += `site_uuid::${uuid}\n`;
    }
    markdown += '\n';

    // YAML Modifications (if any were made)
    if (result.modifications.modified) {
      markdown += `#### YAML Modifications Made\n`;
      markdown += `- Total replacements: ${result.modifications.replacements}\n`;
      
      const changes = result.modifications.changes;
      if (changes.uuid) {
        markdown += `- Generated UUID: ${changes.uuid}\n`;
      }
      if (changes.hyphenConversions) {
        markdown += `- Variable name conversions:\n`;
        changes.hyphenConversions.forEach(conv => {
          markdown += `  - "${conv.from}" → "${conv.to}"\n`;
        });
      }
      if (changes.tagFormatting) {
        markdown += `- Tag formatting:\n`;
        markdown += `  - Before: [${changes.tagFormatting.from.join(', ')}]\n`;
        markdown += `  - After: [${changes.tagFormatting.to.join(', ')}]\n`;
      }
      if (changes.addedTags) {
        markdown += `- Added path tags: ${changes.addedTags.join(', ')}\n`;
      }
      markdown += '\n';
    }

    // YAML Evaluation
    markdown += `#### YAML/Frontmatter Status\n`;
    const yaml = result.evaluation.yaml;
    markdown += `- Needs UUID: ${yaml.needsUUID}\n`;
    markdown += `- Needs Hyphen Conversion: ${yaml.needsHyphenConversion}\n`;
    markdown += `- Needs Tag Formatting: ${yaml.needsTagFormatting}\n`;
    markdown += `- Has Lowercase Tags: ${yaml.hasLowercaseTags}\n`;
    markdown += `- Needs URL Check: ${yaml.needsURLCheck}\n`;
    markdown += `- Needs Path Tags: ${yaml.needsPathTags}\n`;
    if (yaml.needsPathTags) {
      markdown += `  - Missing Tags: ${yaml.missingPathTags.join(', ')}\n`;
    }
    markdown += `- Processing Required: ${yaml.needsProcessing}\n\n`;

    // OpenGraph Evaluation
    markdown += `#### OpenGraph Status\n`;
    markdown += `- Needs Fetch: ${result.evaluation.openGraph.needsFetch}\n`;
    markdown += `- Needs Screenshot: ${result.evaluation.openGraph.needsScreenshot}\n`;
    markdown += `- Has Errors: ${result.evaluation.openGraph.hasErrors}\n`;
    markdown += `- Processing Required: ${result.evaluation.openGraph.needsProcessing}\n\n`;

    // YouTube Evaluation
    markdown += `#### YouTube Content Status\n`;
    markdown += `- Total URLs Found: ${result.evaluation.youtube.allYoutubeUrls.length}\n`;
    markdown += `  - Unique Unprocessed URLs: ${result.evaluation.youtube.danglingUrls.length}\n`;
    markdown += `  - Already Processed URLs: ${result.evaluation.youtube.processedUrls.length}\n`;
    markdown += `- Needs Footnotes Section: ${result.evaluation.youtube.needsFootnotesSection}\n`;
    markdown += `- Needs Registry Update: ${result.evaluation.youtube.needsRegistryUpdate}\n`;
    markdown += `- Processing Required: ${result.evaluation.youtube.needsProcessing}\n\n`;

    if (result.evaluation.youtube.allYoutubeUrls.length > 0) {
      markdown += `##### YouTube URLs Evaluation\n`;
      
      if (result.evaluation.youtube.danglingUrls.length > 0) {
        markdown += `###### Unprocessed URLs:\n`;
        result.evaluation.youtube.danglingUrls.forEach(url => {
          const urlEval = result.evaluation.youtube.urlEvaluations[url];
          markdown += `URL: ${url}\n`;
          markdown += `- In Registry: ${urlEval.isInRegistry}\n`;
          markdown += `- Needs Registry Update: ${urlEval.needsRegistryUpdate}\n\n`;
        });
      }

      if (result.evaluation.youtube.processedUrls.length > 0) {
        markdown += `###### Processed URLs:\n`;
        result.evaluation.youtube.processedUrls.forEach(url => {
          const urlEval = result.evaluation.youtube.urlEvaluations[url];
          markdown += `URL: ${url}\n`;
          markdown += `- Has Iframe: ${urlEval.hasIframe}\n`;
          markdown += `- Needs Footnote: ${urlEval.needsFootnote}\n`;
          markdown += `- Needs Footnote Definition: ${urlEval.needsFootnoteDefinition}\n`;
          markdown += `- In Registry: ${urlEval.isInRegistry}\n`;
          markdown += `- Needs Registry Update: ${urlEval.needsRegistryUpdate}\n\n`;
        });
      }
    }

    markdown += `---\n\n`;
  }

  return markdown;
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
    console.log(`Found ${files.length} files to process`);

    // Process each file
    const results = {};
    for (const file of files) {
      console.log(`Processing: ${file}`);
      
      // First evaluate
      const evaluation = evaluateFile(file);
      
      // Then apply YAML modifications if needed
      const modifications = evaluation?.yaml.needsProcessing 
        ? assureYAMLProperties(file, evaluation)
        : { modified: false, replacements: 0, changes: {} };

      if (evaluation) {
        results[file] = { evaluation, modifications };
      }
    }

    // Generate output file path with iteration number
    const outputFile = getNextIterationFilePath(USER_OPTIONS.evaluationOutputFile);
    
    // Format and write results
    const markdown = formatResults(results);
    
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
