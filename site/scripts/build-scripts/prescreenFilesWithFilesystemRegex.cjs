const fs = require('fs');
const path = require('path');

// Configuration
const CONTENT_DIR = path.resolve(process.cwd(), 'src/content');
const TARGET_SCREENED_OUT_FILES_FILE_PATH = path.resolve(process.cwd(), 'scripts/data-or-content-generation/fixes-needed/Screened-Out-Files.md');
const TARGET_SCREENED_IN_FILES_FILE_PATH = path.resolve(process.cwd(), 'scripts/data-or-content-generation/fixes-needed/Screened-In-Files.md');

// Patterns that indicate YAML corruption
const CORRUPTION_PATTERNS = [
  // Missing YAML frontmatter
  { pattern: /^(?!---\n)/, message: 'Missing opening YAML frontmatter delimiter' },
  { pattern: /^---\n(?:[\s\S]*?)(?!\n---)/, message: 'Missing closing YAML frontmatter delimiter' },
  
  // Block scalar issues
  { pattern: /^([^:\n]+):[ \t]*(>-|>|[|][-]?)[ \t]*(?:\S)/m, message: 'Block scalar indicator without newline' },
  
  // Duplicate keys
  { pattern: /^([\w-]+):[^\n]*\n(?:[\s\S]*?)^\1:/m, message: 'Duplicate keys in frontmatter' },
  
  // Incorrect indentation
  { pattern: /^([^:\n]+):[ \t]*\n[ ]{1,3}\S/m, message: 'Incorrect indentation (should be 2 or 4+ spaces)' },
  
  // Line contains both tabs and spaces for indentation
  { pattern: /^[ \t]*[ ][ \t]*\t[ \t]*/m, message: 'Mixed tabs and spaces in indentation' },
  
  // Improperly quoted values with colons
  { pattern: /^([\w-]+):[ \t]*[^"\'\n]*:[^"\'\n]*$/m, message: 'Unquoted value containing a colon' },
  
  // Broken multiline strings
  { pattern: /^([\w-]+):[ \t]*(?:>-|>|[|][-]?)[ \t]*\n(?:(?!  ).)*$/m, message: 'Broken multiline string' },
  
  // Incomplete quotes
  { pattern: /^([\w-]+):[ \t]*["'](?:(?!\n["']).)*$/m, message: 'Incomplete quotes in value' },
  
  // Improper error message formatting
  { 
    pattern: /^---\n(?:[\s\S]*?)((?:jina_error|og_error_message):[ \t]*(?:["'](?:.*?)['"](?:.*?)["']|'(?:.*?)'|[^"\n]*:[^"\n]*))/m, 
    message: 'Error message with improper quotes or nested quotes' 
  },
  
  // Deeply nested quotes with escapes (like "\"'HTTP error!'\""
  {
    pattern: /^---\n(?:[\s\S]*?)((?:jina_error|og_error_message):[ \t]*(?:\\["']|["']\\["']|["'].*\\["'].*["']))/m,
    message: 'Error message with deeply nested or escaped quotes'
  },
  
  // URLs broken across multiple lines
  { pattern: /^([\w-]+):[ \t]*https?:[ \t]*$/m, message: 'URL split across multiple lines' },
];

// Common properties in files that often have errors
const listOfCommonKnownErrors = [
    'og_error_message',
    'image',
    'og_screenshot_url',
    'favicon',
    'jina_error',
    'url'
];

// Arrays to store our file paths
let filesWithCommonKnownErrors = [];
let filesWithoutCommonKnownErrors = [];
let totalFileCount = 0;

/**
 * Read all files recursively in a directory
 * @param {string} dir - Directory to read
 * @param {string[]} fileList - Array to store file paths
 * @returns {string[]} List of file paths
 */
function readFilesRecursive(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      readFilesRecursive(filePath, fileList);
    } else if (path.extname(filePath).toLowerCase() === '.md') {
      fileList.push(filePath);
      totalFileCount++;
    }
  });
  
  return fileList;
}

/**
 * Checks if a file is likely corrupted based on the content and defined patterns
 */
function isLikelyCorrupted(filePath, content) {
  try {
    // Check for common corruption patterns
    for (const { pattern, message } of CORRUPTION_PATTERNS) {
      if (pattern.test(content)) {
        console.log(`${filePath} - Corruption detected: ${message}`);
        return true;
      }
    }
    
    // Extract frontmatter if present
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) return false;
    
    const frontmatter = frontmatterMatch[1];
    
    // Check for error message properties with improper formatting
    const listOfCommonKnownErrors = ['jina_error', 'og_error_message'];
    for (const errorProp of listOfCommonKnownErrors) {
      // Look for the property in the frontmatter
      const propRegex = new RegExp(`^${errorProp}:[ \\t]*(.*)$`, 'm');
      const match = frontmatter.match(propRegex);
      
      if (match) {
        const value = match[1].trim();
        
        // Check for complex nested quotes like "\"'HTTP error! status: 429'\""
        if (value.includes('\\"') || value.includes("\\'")) {
          console.log(`${filePath} - Error property ${errorProp} has escaped quotes: ${value}`);
          return true;
        }
        
        // Check for nested quotes like "'value'" or '"value"'
        if ((value.startsWith('"') && value.includes("'")) || 
            (value.startsWith("'") && value.includes('"'))) {
          console.log(`${filePath} - Error property ${errorProp} has nested quotes: ${value}`);
          return true;
        }
        
        // Check for single quotes instead of double quotes
        if (value.startsWith("'") && value.endsWith("'")) {
          console.log(`${filePath} - Error property ${errorProp} uses single quotes instead of double: ${value}`);
          return true;
        }
        
        // Check for unquoted value containing a colon
        if (!value.startsWith('"') && !value.startsWith("'") && value.includes(':')) {
          console.log(`${filePath} - Error property ${errorProp} has unquoted value with colon: ${value}`);
          return true;
        }
        
        // Check for excessive quoting (more than one pair)
        const quoteCount = (value.match(/["']/g) || []).length;
        if (quoteCount > 2) {
          console.log(`${filePath} - Error property ${errorProp} has excessive quoting: ${value}`);
          return true;
        }
      }
    }
    
    // Check URL properties for formatting issues
    const urlProps = ['url', 'image', 'og_screenshot_url', 'favicon'];
    for (const urlProp of urlProps) {
      const propRegex = new RegExp(`^${urlProp}:[ \\t]*(.*)$`, 'm');
      const match = frontmatter.match(propRegex);
      
      if (match) {
        const value = match[1].trim();
        
        // Check for URLs that contain spaces but aren't quoted
        if (value.includes(' ') && !value.startsWith('"') && !value.startsWith("'")) {
          console.log(`${filePath} - URL property ${urlProp} contains spaces but isn't quoted: ${value}`);
          return true;
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error(`Error checking file ${filePath}: ${error.message}`);
    return true; // Assume corrupted if we can't check
  }
}

/**
 * Sort files into two arrays based on likely YAML corruption
 * @returns {Object} Object containing both arrays of file paths
 */
function sortFilesIntoTwoArraysBasedOnFilesystemRegex() {
  console.log('Scanning content directory for markdown files...');
  
  // Reset arrays
  filesWithCommonKnownErrors = [];
  filesWithoutCommonKnownErrors = [];
  totalFileCount = 0;
  
  // Get all markdown files recursively
  const allFiles = readFilesRecursive(CONTENT_DIR);
  
  console.log(`Found ${allFiles.length} markdown files. Checking for YAML corruption...`);
  
  // Sort files based on likely corruption
  let processedCount = 0;
  
  for (const filePath of allFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      if (isLikelyCorrupted(filePath, content)) {
        filesWithCommonKnownErrors.push(filePath);
      } else {
        filesWithoutCommonKnownErrors.push(filePath);
      }
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error.message);
      filesWithCommonKnownErrors.push(filePath);
    }
    
    processedCount++;
    if (processedCount % 100 === 0) {
      console.log(`Processed ${processedCount}/${allFiles.length} files...`);
    }
  }
  
  console.log(`\nResults:`);
  console.log(`- Safe files: ${filesWithoutCommonKnownErrors.length}`);
  console.log(`- Potentially corrupted files: ${filesWithCommonKnownErrors.length}`);
  
  // Write results to files
  writeResultsToFile();
  
  return {
    safeFiles: filesWithoutCommonKnownErrors,
    corruptedFiles: filesWithCommonKnownErrors
  };
}

/**
 * Write the results to the designated output files
 */
function writeResultsToFile() {
  // Format for both files
  const timestamp = new Date().toISOString();
  
  // Write screened-in files
  const screenedInContent = `---
updated_on: "${timestamp}"
included_file_count: ${filesWithoutCommonKnownErrors.length}
total_file_count: ${totalFileCount}
---

# Markdown Files Screened-In for Processing
Last updated: ${timestamp}

These ${filesWithoutCommonKnownErrors.length} files (out of ${totalFileCount} total) have been screened as safe for YAML processing:

${filesWithoutCommonKnownErrors.map(file => `- ${file}`).join('\n')}
`;

  // Write screened-out files
  const screenedOutContent = `---
updated_on: "${timestamp}"
included_file_count: ${filesWithCommonKnownErrors.length}
total_file_count: ${totalFileCount}
---

# Markdown Files Screened-Out from Processing
Last updated: ${timestamp}

These ${filesWithCommonKnownErrors.length} files (out of ${totalFileCount} total) have been screened out due to potential YAML corruption:

${filesWithCommonKnownErrors.map(file => `- ${file}`).join('\n')}
`;

  // Ensure directories exist
  const screenedInDir = path.dirname(TARGET_SCREENED_IN_FILES_FILE_PATH);
  const screenedOutDir = path.dirname(TARGET_SCREENED_OUT_FILES_FILE_PATH);
  
  if (!fs.existsSync(screenedInDir)) {
    fs.mkdirSync(screenedInDir, { recursive: true });
  }
  
  if (!fs.existsSync(screenedOutDir)) {
    fs.mkdirSync(screenedOutDir, { recursive: true });
  }
  
  // Write files
  fs.writeFileSync(TARGET_SCREENED_IN_FILES_FILE_PATH, screenedInContent);
  fs.writeFileSync(TARGET_SCREENED_OUT_FILES_FILE_PATH, screenedOutContent);
  
  console.log(`\nOutputs written to:`);
  console.log(`- ${TARGET_SCREENED_IN_FILES_FILE_PATH}`);
  console.log(`- ${TARGET_SCREENED_OUT_FILES_FILE_PATH}`);
}

// Export functions for use in other scripts
module.exports = {
  sortFilesIntoTwoArraysBasedOnFilesystemRegex,
  getScreenedInFiles: () => filesWithoutCommonKnownErrors
};

// If this script is run directly, execute the sorting function
if (require.main === module) {
  sortFilesIntoTwoArraysBasedOnFilesystemRegex();
}

