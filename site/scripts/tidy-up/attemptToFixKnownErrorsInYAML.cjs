const USER_OPTIONS = require("../build-scripts/getUserOptions.cjs")
const {knownErrorCases, helperFunctions, correctionFunctions} = require("../build-scripts/getKnownErrorsAndFixes.cjs")
const fs = require("fs")
const path = require("path")

// ================================================
// Configuration by the user
// ================================================
const TARGET_FILES = {
  targetDir: "site/src/content/tooling/AI-Toolkit"
}

const REPORT_FILE = "site/scripts/data-or-content-generation/fixes-needed/errors-processing/Added-Quotes-Around-Errors.md"

// ================================================
// Setup by the user
// ================================================

const issueToAttemptToFix = knownErrorCases.unquotedErrorMessageProperty

// ================================================
// Helper Functions
// ================================================

/**
 * Recursively finds all markdown files in a directory and its subdirectories
 * @param {string} dirPath - The directory to search in
 * @returns {Array<string>} Array of full paths to markdown files
 */
function findMarkdownFilesRecursively(dirPath) {
  let markdownFiles = [];
  
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Recursively search subdirectories
      markdownFiles = markdownFiles.concat(findMarkdownFilesRecursively(fullPath));
    } else if (item.endsWith('.md')) {
      // Add markdown files to the array
      markdownFiles.push(fullPath);
    }
  }
  
  return markdownFiles;
}

  // ================================================
  // Process each file found in the target directory. 
  // Extract the frontmatter with the helper function imported from getKnownErrorsAndFixes.cjs
  // Test the frontmatter with the detectError function imported from getKnownErrorsAndFixes.cjs
  // If the error is detected, count the file for reporting, then call the issueToAttemptToFix.correctionFunction
  // If the correction function returns a success message, count the file for reporting, and add the file name to the namesOfFilesCorrected array
  // ================================================

async function kickoffErrorCorrection() {
  try {
    // Find all markdown files recursively
    const markdownFiles = findMarkdownFilesRecursively(TARGET_FILES.targetDir);
    
    // Track files for reporting
    let filesProcessed = 0;
    let namesOfFilesCorrected = [];
    let namesOfFilesWithIssue = [];

    // Process each file using the imported helper function
    for (const markdownFilePath of markdownFiles) {
      try {
        // Read the file content
        const markdownContent = fs.readFileSync(markdownFilePath, 'utf8');
        
        // Extract frontmatter using helper function
        const extractedFrontmatter = helperFunctions.extractFrontmatter(markdownContent);
        
        if (!extractedFrontmatter.success) {
          console.log(`Error extracting frontmatter from ${markdownFilePath}`);
          continue;
        }

        // Check if the issue exists in the frontmatter
        const issueDetected = issueToAttemptToFix.detectError.test(extractedFrontmatter.frontmatterString);
        
        if (issueDetected) {
          // Add to files with issues count
          namesOfFilesWithIssue.push(path.basename(markdownFilePath));
          
          // Get the correction function name from the issue definition
          const correctionFunctionName = issueToAttemptToFix.correctionFunction;
          
          // Call the appropriate correction function
          const result = await correctionFunctions[correctionFunctionName](markdownContent, markdownFilePath);
          
          if (result.modified) {
            // If file was modified, add to corrected files list
            namesOfFilesCorrected.push(path.basename(markdownFilePath));
            
            // Write the corrected content back to file
            fs.writeFileSync(markdownFilePath, result.content);
          }
        }
        
        filesProcessed++;
        
      } catch (error) {
        console.error(`Error processing ${markdownFilePath}:`, error);
      }
    }

    // ================================================
    // Report the results in the Report File.
    // The stats code here is copy pasted from the context file getReportingFormatForBuild.cjs
    // The last section is a comma separated list of the files that were successfully corrected.
    // The brackets syntax is used because Obsidian is the tool our team uses to manage Markdown files. It is an internal link syntax.
    // ================================================

    const reportTemplate = `
## Summary of Files Processed
Files processed: ${filesProcessed}
Files with issue: ${namesOfFilesWithIssue.length}
Successful corrections: ${namesOfFilesCorrected.length}

### Files with Issues
${namesOfFilesWithIssue.map(file => `[[${file}]]`).join(', ')}

### Files Successfully Corrected
${namesOfFilesCorrected.map(file => `[[${file}]]`).join(', ')}
`

    fs.writeFileSync(REPORT_FILE, reportTemplate);

    // Log summary to console
    console.log(`
Processing complete:
- Total files processed: ${filesProcessed}
- Files with issues: ${namesOfFilesWithIssue.length}
- Files corrected: ${namesOfFilesCorrected.length}
Report written to: ${REPORT_FILE}
`);

  } catch (error) {
    console.error('Error in main process:', error);
    process.exit(1);
  }
}

// Run the async function
kickoffErrorCorrection().catch(error => {
  console.error('Error in main process:', error);
  process.exit(1);
});
