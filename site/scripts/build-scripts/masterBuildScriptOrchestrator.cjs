const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const matter = require('gray-matter');
const { v4: uuidv4 } = require('uuid');

// Import configurations and evaluation functions
const USER_OPTIONS = require('./getUserOptionsForBuild.cjs');
const { 
  evaluateFile, 
  cleanYAMLFrontmatter 
} = require('./evaluateTargetContent.cjs');
const { 
  getFromOpenGraphIo, 
  fetchScreenshotUrlInBackground, 
  cleanDuplicateYamlKeys,
  markFileWithError 
} = require('./fetchOpenGraphData.cjs');
const { formatEvaluationReport, writeOutput } = require('./getReportingFormatForBuild.cjs');
const {
  processFile: processYAMLFile
} = require('./assureYAMLPropertiesCorrect.cjs');
const {
  sortFilesIntoTwoArraysBasedOnFilesystemRegex,
  getScreenedInFiles
} = require('./prescreenFilesWithFilesystemRegex.cjs');

// ============================================================================
// YAML Processing Functions
// ============================================================================

/**
 * Process and validate YAML frontmatter before any other operations
 * @param {string} content - Raw file content
 * @returns {Object} Processed content and validation info
 */
function preProcessYAML(content) {
  // First clean the content using the comprehensive rules
  const cleanedContent = USER_OPTIONS.frontmatter.preprocessing.cleanContent(content);
  
  // Validate basic YAML structure
  const preCheckErrors = USER_OPTIONS.frontmatter.validation.preCheck(cleanedContent);
  if (preCheckErrors.length > 0) {
    return { content: cleanedContent, valid: false, errors: preCheckErrors };
  }

  // Parse and validate YAML
  const { data: frontmatter, content: bodyContent } = matter(cleanedContent);
  const postCheckErrors = USER_OPTIONS.frontmatter.validation.postCheck(frontmatter);

  return {
    content: cleanedContent,
    frontmatter,
    bodyContent,
    valid: postCheckErrors.length === 0,
    errors: [...preCheckErrors, ...postCheckErrors]
  };
}

/**
 * Ensure YAML properties are correctly formatted
 * @param {string} filePath - Path to the file
 * @returns {Promise<Object>} Processing results
 */
async function assureYAMLProperties(filePath) {
  try {
    console.log(`Processing YAML in ${filePath}`);
    
    // First, clean the YAML to prevent parsing issues
    const content = fs.readFileSync(filePath, 'utf8');
    const cleanedContent = USER_OPTIONS.frontmatter.preprocessing.cleanContent(content);
    
    // Write the cleaned content back to the file
    fs.writeFileSync(filePath, cleanedContent, 'utf8');
    
    // Now process the file with the YAML properties processor
    const result = processYAMLFile(filePath);
    
    if (!result.success) {
      console.error(`YAML processing failed for ${filePath}:`, result.errors);
    }
    
    return result;
  } catch (error) {
    console.error(`Error in assureYAMLProperties for ${filePath}:`, error);
    return { success: false, errors: [error.message], filePath };
  }
}

/**
 * Evaluate content and write results
 * @param {string} filePath - Path to the file
 * @returns {Promise<Object>} Evaluation results
 */
async function evaluateContent(filePath) {
  try {
    const result = await evaluateFile(filePath);
    if (!result) {
      return { success: false, error: "Failed to evaluate file" };
    }
    return { success: true, evaluation: result };
  } catch (error) {
    console.error(`Error evaluating ${filePath}:`, error);
    return { success: false, error: error.message };
  }
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
  const ext = USER_OPTIONS.evaluationOutputPathAndFile.pattern.extension;
  const baseName = path.basename(baseFilePath, ext);
  const sep = USER_OPTIONS.evaluationOutputPathAndFile.pattern.separator;
  
  // Format date according to pattern
  const today = new Date();
  const datePrefix = today.toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // Find existing iteration files for today
  const pattern = `${datePrefix}${sep}${baseName}${sep}*${ext}`;
  const existingFiles = glob.sync(pattern, { cwd: dir });
  
  // Extract existing iteration numbers
  const iterations = existingFiles
    .map(file => {
      const match = file.match(new RegExp(`${sep}(\\d+)${ext}$`));
      return match ? parseInt(match[1]) : 0;
    })
    .filter(num => !isNaN(num));
  
  // Get next iteration number
  const nextIteration = iterations.length > 0 ? Math.max(...iterations) + 1 : 1;
  const iterationNum = nextIteration.toString().padStart(2, '0');
  
  return path.join(dir, `${datePrefix}${sep}${baseName}${sep}${iterationNum}${ext}`);
}

// ============================================================================
// Main Processing
// ============================================================================

/**
 * Main orchestration function
 * @param {string} filePath - Path to the file to process
 */
async function processFile(filePath) {
  try {
    console.log(`\nProcessing: ${filePath}`);
    
    // First process the YAML frontmatter to ensure it's valid
    const yamlResult = await assureYAMLProperties(filePath);
    if (!yamlResult.success) {
      console.log(`Skipped ${filePath} - Failed to process YAML`);
      return { success: false, errors: yamlResult.errors };
    }
    
    // Track modifications
    let modifications = { modified: false, replacements: 0, changes: {} };

    // Step 2: Process OpenGraph if needed
    if (yamlResult.evaluation && yamlResult.evaluation.openGraph && yamlResult.evaluation.openGraph.needsProcessing) {
      await processOpenGraph(filePath, yamlResult.evaluation);
    }

    return { 
      success: true, 
      evaluation: yamlResult.evaluation,
      modifications
    };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return { success: false, errors: [error.message] };
  }
}

/**
 * Main function to orchestrate all processing
 */
async function main() {
  try {
    console.log('Starting content prescreening and evaluation...');

    // Run the prescreening to filter out files with potential YAML issues
    console.log('Prescreening files for potential YAML corruption...');
    sortFilesIntoTwoArraysBasedOnFilesystemRegex();
    
    // Get the files that passed the prescreening
    const files = getScreenedInFiles();
    console.log(`Prescreening complete. ${files.length} files are safe for processing.`);

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

    console.log(`Processing ${files.length} safe files...`);

    // Process each file
    const results = {};
    for (const file of files) {
      console.log(`Processing: ${file}`);
      
      const result = await processFile(file);
      
      if (!result.success) {
        processingStats.skipped.count++;
        processingStats.skipped.paths.push(file);
        console.log(`Skipped ${file} - ${result.error || 'Could not process'}`);
        continue;
      }

      processingStats.processed.count++;
      processingStats.processed.paths.push(file);
      results[file] = result;
    }

    // Generate output file path with iteration number
    const outputFile = getNextIterationFilePath(USER_OPTIONS.evaluationOutputPathAndFile.baseFile);
    
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

// Export for use in other scripts
module.exports = {
  processFile,
  preProcessYAML,
  assureYAMLProperties,
  evaluateContent,
  processOpenGraph,
  main
};

// Run main function if this script is executed directly
if (require.main === module) {
  main();
}

// Function to process a file with better error handling
async function processFileWithErrorHandling(file, userOptions, errorLogPrefix = '') {
  try {
    const result = await processFile(file);
    return result;
  } catch (error) {
    const fileName = path.basename(file);
    
    // Create a more detailed error message
    let errorDetails = `Error processing ${fileName}: ${error.message}`;
    
    // Add helpful context based on common errors
    if (error.message.includes('Unexpected token')) {
      errorDetails += `\nThis appears to be a YAML syntax error, possibly with quotes or special characters.`;
    } else if (error.message.includes('duplicate key')) {
      errorDetails += `\nCheck for duplicate property names in the frontmatter.`;
    } else if (error.message.includes('end of the stream')) {
      errorDetails += `\nCheck for missing closing delimiter (---) in the YAML frontmatter.`;
    }
    
    // Log to console with colors for better visibility
    console.error(`\x1b[31m${errorLogPrefix}${errorDetails}\x1b[0m`);
    
    // Return null to indicate failure but allow processing to continue
    return null;
  }
}

async function buildSite() {
  console.log('Building site with advanced error handling...');
  
  try {
    // Step 1: Get user options
    const userOptions = getUserOptionsForBuild();
    
    // Step 2: Run prescreening to filter out files with known YAML issues
    console.log('Prescreening files for potential YAML issues...');
    await runCommand('node ./scripts/build-scripts/prescreenFilesWithFilesystemRegex.cjs');
    
    // Read screened files lists
    let screenedOutFiles = [];
    let screenedInFiles = [];
    
    try {
      const screenedOutPath = path.resolve(process.cwd(), './site/@Screened-Out-Files.md');
      const screenedInPath = path.resolve(process.cwd(), './site/@Screened-In-Files.md');
      
      if (fs.existsSync(screenedOutPath)) {
        const screenedOutContent = fs.readFileSync(screenedOutPath, 'utf8');
        screenedOutFiles = screenedOutContent
          .split('\n')
          .filter(line => line.startsWith('- '))
          .map(line => line.substring(2).trim());
      }
      
      if (fs.existsSync(screenedInPath)) {
        const screenedInContent = fs.readFileSync(screenedInPath, 'utf8');
        screenedInFiles = screenedInContent
          .split('\n')
          .filter(line => line.startsWith('- '))
          .map(line => line.substring(2).trim());
      }
      
      console.log(`Prescreening complete: ${screenedInFiles.length} files passed, ${screenedOutFiles.length} files filtered out.`);
    } catch (error) {
      console.warn(`Warning: Error reading prescreened files lists: ${error.message}`);
      // Continue with normal processing if prescreening fails
    }
    
    // Step 3: Get content files
    console.log('Getting content files...');
    const files = await getContentFiles(userOptions);
    
    // Filter out screened out files if available
    const filteredFiles = screenedOutFiles.length > 0 
      ? files.filter(file => !screenedOutFiles.includes(file))
      : files;
    
    console.log(`Processing ${filteredFiles.length} content files...`);
    
    // Step 4: Process each file with improved error handling
    const processedFiles = [];
    const failedFiles = [];
    
    for (const file of filteredFiles) {
      const fileName = path.basename(file);
      const processPrefix = `[${fileName}] `;
      
      try {
        console.log(`${processPrefix}Processing...`);
        
        // Use our new error handling wrapper
        const processed = await processFileWithErrorHandling(file, userOptions, processPrefix);
        
        if (processed) {
          processedFiles.push(processed);
          console.log(`${processPrefix}Successfully processed.`);
        } else {
          failedFiles.push(file);
          console.error(`${processPrefix}Failed to process.`);
        }
      } catch (error) {
        // This catch block should rarely be needed since processFileWithErrorHandling has its own error handling
        failedFiles.push(file);
        console.error(`${processPrefix}Unexpected error: ${error.message}`);
      }
    }
    
    console.log(`\nProcessing complete: ${processedFiles.length} files processed successfully, ${failedFiles.length} files failed.`);
    
    if (failedFiles.length > 0) {
      console.log('\nFailed files:');
      failedFiles.forEach(file => console.log(`- ${file}`));
      
      // Write failed files to a report
      const failedFilesReport = 
        `# Failed Files\n\n` +
        `The following files failed to process during the build:\n\n` +
        failedFiles.map(file => `- ${file}`).join('\n');
      
      const failedFilesPath = path.resolve(process.cwd(), './site/@Failed-Files.md');
      fs.writeFileSync(failedFilesPath, failedFilesReport);
      console.log(`Failed files report written to ${failedFilesPath}`);
    }
    
    // Step 5: Write output
    await writeOutput(processedFiles, userOptions);
    
    console.log('Build complete!');
  } catch (error) {
    console.error(`Build failed: ${error.message}`);
    process.exit(1);
  }
}
