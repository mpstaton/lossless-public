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
 * Main orchestration function - Processes a SINGLE file completely in isolation
 * @param {string} filePath - Path to the file to process
 */
async function processFile(filePath) {
  try {
    console.log(`\nProcessing: ${filePath}`);
    
    // ISOLATION: Create a fresh tracking object for this file only
    let fileState = {
      path: filePath,
      success: false,
      errors: [],
      modified: false,
      changes: {}
    };
    
    // Step 1: Read and process the file's YAML frontmatter to ensure it's valid
    // ISOLATION: Any YAML errors only affect this single file
    let content;
    try {
      content = fs.readFileSync(filePath, 'utf8');
    } catch (readError) {
      fileState.errors.push(`Failed to read file: ${readError.message}`);
      console.log(`Skipped ${filePath} - Failed to read file`);
      return fileState;
    }
    
    // First process the YAML frontmatter to ensure it's valid
    // ISOLATION: Clean content is not shared between files
    const yamlResult = await assureYAMLProperties(filePath);
    if (!yamlResult.success) {
      fileState.errors = yamlResult.errors || ['Failed to process YAML'];
      console.log(`Skipped ${filePath} - Failed to process YAML: ${fileState.errors.join(', ')}`);
      return fileState;
    }
    
    // ISOLATION: We use a local modifications object that only tracks changes for this file
    fileState.modified = yamlResult.modified || false;
    fileState.changes = yamlResult.changes || {};
    fileState.evaluation = yamlResult.evaluation || null;

    // Step 2: Process OpenGraph if needed - completely isolated to this file
    if (fileState.evaluation && fileState.evaluation.openGraph && fileState.evaluation.openGraph.needsProcessing) {
      try {
        await processOpenGraph(filePath, fileState.evaluation);
        // Note: We don't store the result of processOpenGraph in the fileState,
        // as it directly modifies the file
      } catch (ogError) {
        // ISOLATION: OpenGraph errors don't stop processing or affect other files
        console.error(`Warning: OpenGraph processing error for ${filePath}: ${ogError.message}`);
        // Continue processing rather than failing the entire file
      }
    }

    // Mark as successful if we got this far
    fileState.success = true;
    
    return fileState;
  } catch (error) {
    // ISOLATION: Any unexpected errors only affect this file
    console.error(`Error processing ${filePath}:`, error);
    return { 
      path: filePath,
      success: false, 
      errors: [error.message] 
    };
  }
}

/**
 * Get all content files to process
 * @param {Object} userOptions - User configuration options
 * @returns {Promise<string[]>} Array of file paths
 */
async function getContentFiles(userOptions) {
  try {
    const contentDir = userOptions.directories.content;
    
    // Use glob to find files
    const files = await glob(`**/*.md`, {
      cwd: contentDir,
      absolute: true
    });
    
    return files;
  } catch (error) {
    console.error('Error finding content files:', error);
    return [];
  }
}

/**
 * Main function to orchestrate all processing with complete isolation between files
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

    // Initialize processing stats - this only stores paths and counts, not actual frontmatter data
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

    // Process each file IN ISOLATION
    // IMPORTANT: We only store the processing results, not the actual frontmatter content
    // This prevents any cross-contamination between files
    const results = {};
    
    for (const file of files) {
      console.log(`Processing: ${file}`);
      
      // ISOLATION: Each file is processed completely independently
      // No state is shared between iterations
      const result = await processFile(file);
      
      if (!result.success) {
        processingStats.skipped.count++;
        processingStats.skipped.paths.push(file);
        console.log(`Skipped ${file} - ${result.errors ? result.errors.join(', ') : 'Could not process'}`);
        continue;
      }

      processingStats.processed.count++;
      processingStats.processed.paths.push(file);
      
      // ISOLATION: We only store the result object, not the actual file content
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
    // DON'T EXIT - just log the error
    console.error('Continuing despite error.');
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
  // ISOLATION: Create fresh state for this file
  const fileState = {
    path: file,
    success: false,
    errors: []
  };
  
  try {
    // ISOLATION: Process this file completely independently
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
    
    // ISOLATION: Return error state for this file only
    fileState.errors.push(error.message);
    return fileState;
  }
}

async function buildSite() {
  console.log('Building site with non-blocking error handling and strict isolation...');
  
  try {
    // Step A: Get user options - this should never fail
    let userOptions;
    try {
      userOptions = getUserOptionsForBuild();
      
      // Fix paths to be site-relative
      if (userOptions && userOptions.directories) {
        // Ensure all paths include 'site/' prefix if not already absolute
        for (const key in userOptions.directories) {
          const dir = userOptions.directories[key];
          if (!path.isAbsolute(dir) && !dir.startsWith('site/')) {
            userOptions.directories[key] = path.join('site', dir);
          }
        }
      }
    } catch (error) {
      console.error(`Warning: Error loading user options: ${error.message}`);
      console.error('Continuing with default options...');
      userOptions = {
        directories: {
          content: path.join(process.cwd(), 'site/src/content')
        }
      };
    }
    
    // Step B: Run prescreening to classify files - non-blocking
    console.log('Prescreening files for YAML issues (logging only)...');
    
    // Run prescreening but don't let it block the process
    let screenedOutFiles = [];
    let screenedInFiles = [];
    
    try {
      // Try to run prescreening directly (faster)
      const screeningResult = sortFilesIntoTwoArraysBasedOnFilesystemRegex();
      screenedInFiles = getScreenedInFiles();
      screenedOutFiles = screeningResult.corruptedFiles || [];
      console.log(`Prescreening complete: ${screenedInFiles.length} files passed, ${screenedOutFiles.length} files filtered out.`);
    } catch (error) {
      console.warn(`Warning: Error during prescreening: ${error.message}`);
      console.warn('Continuing without prescreening...');
      
      // Try to read the existing screening files if available
      try {
        const screenedOutPath = path.resolve(process.cwd(), 'site/scripts/data-or-content-generation/fixes-needed/Screened-Out-Files.md');
        const screenedInPath = path.resolve(process.cwd(), 'site/scripts/data-or-content-generation/fixes-needed/Screened-In-Files.md');
        
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
        
        console.log(`Read existing screening files: ${screenedInFiles.length} passed, ${screenedOutFiles.length} filtered out.`);
      } catch (readError) {
        console.warn(`Warning: Could not read screening files: ${readError.message}`);
        console.warn('Continuing with no file filtering...');
      }
    }
    
    // Step C: Get content files - non-blocking
    console.log('Finding content files to process...');
    let files = [];
    
    try {
      files = await getContentFiles(userOptions);
      console.log(`Found ${files.length} total content files.`);
    } catch (error) {
      console.error(`Warning: Error finding content files: ${error.message}`);
      console.error('Continuing with empty file list...');
    }
    
    // Filter out screened out files if available
    const filesToProcess = screenedOutFiles.length > 0 
      ? files.filter(file => !screenedOutFiles.includes(file))
      : files;
    
    console.log(`Processing ${filesToProcess.length} content files (skipping ${files.length - filesToProcess.length} screened out files)...`);
    
    // Step D: Process each file with improved non-blocking error handling and STRICT ISOLATION
    const processedFiles = [];
    const failedFiles = [];
    
    // Process files sequentially to avoid overwhelming the system
    for (const file of filesToProcess) {
      const fileName = path.basename(file);
      const processPrefix = `[${fileName}] `;
      
      // ISOLATION: Each iteration starts with fresh state
      let fileResult = null;
      
      try {
        console.log(`${processPrefix}Processing...`);
        
        // Process the file - but NEVER let an error stop the loop
        // ISOLATION: Each file processed completely independently
        try {
          fileResult = await processFile(file);
        } catch (processError) {
          console.error(`${processPrefix}Error during processing: ${processError.message}`);
          // Log but don't stop the loop
          failedFiles.push({
            path: file,
            error: processError.message
          });
          // Continue with next file
          continue;
        }
        
        if (fileResult && fileResult.success) {
          // ISOLATION: We only store the result object, not raw file content
          processedFiles.push(fileResult);
          console.log(`${processPrefix}Successfully processed.`);
        } else {
          const errorMessage = fileResult ? 
            (fileResult.errors ? fileResult.errors.join(', ') : 'Unknown error') : 
            'Failed to process';
          
          failedFiles.push({
            path: file,
            error: errorMessage
          });
          console.error(`${processPrefix}Skipped: ${errorMessage}`);
        }
      } catch (outerError) {
        // This catch should never be reached due to the inner try/catch
        // But include it for complete safety - never stop the loop
        console.error(`${processPrefix}Unexpected error (skipping): ${outerError.message}`);
        failedFiles.push({
          path: file,
          error: `Unexpected error: ${outerError.message}`
        });
      }
      
      // ISOLATION: Explicitly nullify the result to ensure no references persist
      fileResult = null;
    }
    
    console.log(`\nProcessing summary: ${processedFiles.length} files processed, ${failedFiles.length} files skipped.`);
    
    // Step E: Write failed files to a report - non-blocking
    try {
      if (failedFiles.length > 0) {
        console.log('\nSkipped files:');
        failedFiles.forEach(file => console.log(`- ${file.path}: ${file.error}`));
        
        // Write failed files to a report
        const failedFilesReport = 
          `# Skipped Files\n\n` +
          `The following files were skipped during the build:\n\n` +
          failedFiles.map(file => `- ${file.path}: ${file.error}`).join('\n');
        
        const failedFilesPath = path.resolve(process.cwd(), 'site/scripts/data-or-content-generation/fixes-needed/Skipped-Files.md');
        
        // Ensure directory exists
        const dirPath = path.dirname(failedFilesPath);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        
        fs.writeFileSync(failedFilesPath, failedFilesReport);
        console.log(`Skipped files report written to ${failedFilesPath}`);
      }
    } catch (reportError) {
      console.error(`Warning: Could not write skipped files report: ${reportError.message}`);
      console.error('Continuing with final step...');
    }
    
    // Step F: Write output report - non-blocking
    try {
      // ISOLATION: We're only passing result objects, not file content
      await writeOutput(processedFiles, userOptions);
      console.log('Build complete! All files processed or skipped as needed.');
    } catch (outputError) {
      console.error(`Warning: Error writing output: ${outputError.message}`);
      console.error('Build completed with warnings.');
    }
    
    // ISOLATION: Explicitly clear arrays to free memory and prevent leaks
    screenedOutFiles = null;
    screenedInFiles = null;
    files = null;
    filesToProcess = null;
  } catch (fatalError) {
    // This catch block should never be reached due to internal error handling
    console.error(`Unexpected fatal error: ${fatalError.message}`);
    console.error('Build completed with errors.');
  }
}
