const fs = require('fs');
const path = require('path');

// ======================================================================
// CONFIGURATION - Set User Options file, the content directory, and the target report file
// ======================================================================


// Import user options
const USER_OPTIONS = require('./archive/getUserOptions.cjs');

// Constants for file paths
const CONTENT_DIR = path.resolve(process.cwd(), USER_OPTIONS.directories.toolingContentDir || 'site/src/content/tooling');

// Target file for invalid frontmatter files
const TARGET_INVALID_FRONTMATTER_REPORT = path.resolve(process.cwd(), 
  USER_OPTIONS.reporting.preprocessingOutputPathAndFile.baseFile || 
    'site/scripts/data-or-content-generation/fixes-needed/Invalid-Frontmatter-Files.md');

// ======================================================================
// IMPLEMENTATION - No need to modify below this line
// ======================================================================

// Add debug logs
console.log('Content directory path:', CONTENT_DIR);
console.log('Writing error report to:', TARGET_INVALID_FRONTMATTER_REPORT);

/**
 * Recursive function to find all markdown files in a directory
 * @param {string} dir - Directory to search
 * @returns {string[]} - Array of file paths
 */
function findMarkdownFiles(CONTENT_DIR) {
    let markdownFilesArray = [];
    const markdownFilesDir = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const markdownFile of markdownFilesDir) {
      const fullPath = path.join(dir, markdownFile.name);
      
      if (markdownFile.isDirectory()) {
        markdownFilesArray = markdownFilesArray.concat(findMarkdownFiles(fullPath));
      } else if (markdownFile.isFile() && markdownFile.name.endsWith('.md')) {
        markdownFilesArray.push(fullPath);
      }
    }
    
    return markdownFilesArray;
  }

/**
 * A function that returns an array of files with valid frontmatter while 
 * creating a report of files with invalid frontmatter and their errors.
 */

  // Setting up Arrays to track file processing
let filesWithValidFrontmatter = [];
let filesWithInvalidFrontmatter = [];


/**
 * Extracts YAML frontmatter as raw text from markdown content
 * @param {string} content - Raw markdown file content
 * @returns {string|null} - Returns the valid frontmatter text if successful, null if there was an error (error is written to file)
 */
function returnsOnlyFilesWithValidFrontmatter(content) {
    const timestamp = new Date().toISOString();
    let errorContent;
  
    // Case 1: Invalid input (null, undefined, or not a string)
    if (content === null || content === undefined) {
      errorContent = {
        code: 'FRONTMATTER_IS_NULL_OR_UNDEFINED',
        message: 'Unable to process the frontmatter: input is null or undefined'
      };
    } else if (typeof content !== 'string') {
      errorContent = {
        code: 'FRONTMATTER_INVALID_INPUT',
        message: 'Unable to process the frontmatter: input is not a string'
      };
    }
    // Case 2: Empty content
    else if (content.trim() === '') {
      errorContent = {
        code: 'FRONTMATTER_EMPTY_CONTENT',
        message: 'Unable to process the frontmatter: content is empty'
      };
    }
    // Case 3: No frontmatter delimiters at all
    else if (!content.startsWith('---\n')) {
      errorContent = {
        code: 'FRONTMATTER_MISSING',
        message: 'Unable to process the frontmatter: no opening delimiter found'
      };
    }
    // Case 4: Has opening delimiter but missing closing delimiter
    else if (content.startsWith('---\n') && !content.includes('\n---')) {
      errorContent = {
        code: 'FRONTMATTER_INCOMPLETE',
        message: 'Unable to process the frontmatter: has opening delimiter but missing closing delimiter'
      };
    } else {
      // Look for frontmatter delimiters (--- at start of content and --- after)
      const markdownFilesWithValidFrontmatter = content.match(/^---\n([\s\S]*?)\n---/m);
      
      // Case 5: Regex match failed for other reasons
      if (!markdownFilesWithValidFrontmatter) {
        errorContent = {
          code: 'FRONTMATTER_IMPORT_FAILURE',
          message: 'Unable to process the frontmatter: malformed structure detected'
        };
      } else {
        // Success case: Return the extracted frontmatter
        return markdownFilesWithValidFrontmatter[1];
      }
    }

      // If we got here, there was an error. Write it to the screened out file
  const filteredOutMarkdownFiles(filePath, fileName, errorContent) = `
    File Name: ${fileName}, Timestamp: ${timestamp}\n
    Path: ${filePath}\n
    - Code: ${errorContent.code}\n
    - Message: ${errorContent.message}\n\n
  `;

  try {
    // Ensure the directory exists
    const outputDir = path.dirname(TARGET_INVALID_FRONTMATTER_REPORT);
    fs.mkdirSync(outputDir, { recursive: true });
    
    // Write the error content
    fs.writeFileSync(TARGET_INVALID_FRONTMATTER_REPORT, filteredOutMarkdownFiles, 'utf8');
  } catch (e) {
    console.error('Failed to write to screened out file:', e);
  }

return null;

export { returnsOnlyFilesWithValidFrontmatter };

