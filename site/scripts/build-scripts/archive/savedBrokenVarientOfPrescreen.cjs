const fs = require('fs');
const path = require('path');

// Configuration
const CONTENT_DIR = process.env.CONTENT_DIR ? path.resolve(process.cwd(), process.env.CONTENT_DIR) : path.resolve(process.cwd(), 'site/src/content/tooling');
const TARGET_INVALID_FRONTMATTER_FILE_PATH = path.resolve(process.cwd(), 'site/scripts/data-or-content-generation/fixes-needed/errors-processing/Invalid-Frontmatter-Files.md');
const TARGET_SCREENED_OUT_FILES_FILE_PATH = path.resolve(process.cwd(), 'site/scripts/data-or-content-generation/fixes-needed/errors-processing/Screened-Out-Files.md');
const TARGET_SCREENED_IN_FILES_FILE_PATH = path.resolve(process.cwd(), 'site/scripts/data-or-content-generation/fixes-needed/errors-processing/Screened-In-Files.md');
const TARGET_NON_BLOCKING_OBSERVATIONS_FILE_PATH = path.resolve(process.cwd(), 'site/scripts/data-or-content-generation/fixes-needed/errors-processing/Non-Blocking-Observations.md');



// Property lists imported from getUserOptionsForBuild.cjs to enhance prescreening
const URL_PROPERTIES = [
  'url', 'image', 'favicon', 'og_screenshot_url', 'og_image'
];

const PLAIN_TEXT_PROPERTIES = [
  'title', 'description', 'zinger'
];

const ERROR_MESSAGE_PROPERTIES = [
  'jina_error', 'og_error_message'
];

/**
 * Extracts YAML frontmatter as raw text from markdown content
 * Returns the valid frontmatter text if successful, null if there was an error (error is written to file)

 * @param {string} content - Raw markdown file content
 * @param {string} filePath - Path to the file
 * @param {string} fileName - Name of the file
 */

const isolatedFrontmatter = content.match(/^---\n[\s\S]*?\n---/m)[0];
const filePath = filePath;
const fileName = fileName;

let filesWithValidFrontmatter = [];
let filesWithInvalidFrontmatter = [];


function extractPlainTextFrontmatter(filepPath, fileName, isolatedFrontmatter) {
  const timestamp = new Date().toISOString();
  let errorContent;

  // Case 1: Invalid input (null, undefined, or not a string)
  if (isolatedFrontmatter === null || isolatedFrontmatter === undefined) {
    errorContent = {
      code: 'FRONTMATTER_INVALID_INPUT',
      message: `${fileName}: Unable to process the frontmatter: input is null or undefined`
    };
    return errorContent; } 
    
    else if (typeof content !== 'string') {
    errorContent = {
      code: 'FRONTMATTER_INVALID_INPUT',
      message: `${fileName}: Unable to process the frontmatter: input is not a string`
    };
    return errorContent;
  }
  // Case 2: Empty content
  else if (content.trim() === '') {
    errorContent = {
      code: 'FRONTMATTER_EMPTY_CONTENT',
      message: `${fileName}: Unable to process the frontmatter: content is empty`
    };
    return errorContent;
  }
  // Case 3: No frontmatter delimiters at all
  else if (!content.startsWith('---\n')) {
    errorContent = {
      code: 'FRONTMATTER_MISSING',
      message: `${fileName} Unable to process the frontmatter: no opening delimiter found`
    };
    return errorContent;
  }
  // Case 4: Has opening delimiter but missing closing delimiter
  else if (content.startsWith('---\n') && !content.includes('\n---')) {
    errorContent = {
      code: 'FRONTMATTER_INCOMPLETE',
      message: `${fileName}: Unable to process the frontmatter: has opening delimiter but missing closing delimiter`
    };
    return errorContent
  } 
    // Case 5: Regex match failed for other reasons
  else if (!frontmatterMatch) {
      errorContent = {
        code: 'FRONTMATTER_IMPORT_FAILURE',
        message: `Unable to process the frontmatter: malformed structure detected`
      };
      return errorContent;
    } 
    // Success case: Return the extracted frontmatter and the file path
  else {
    // Isolate the frontmatter as a string and return as valid frontmatter
    };
      return { 
        validFrontmatter: frontmatterMatch[1],
        filePath: filePath,
        fileName: fileName
      };
    }
  }

  // If we got here, there was an error. Write it to the screened out file
  const screenedOutContentMarkdown(filePath, fileName, errorContent) = `
    File Name: ${fileName}, Timestamp: ${timestamp}\n
    Path: ${filePath}\n
    - Code: ${errorContent.code}\n
    - Message: ${errorContent.message}\n\n
    \`\`\`
    ${content ? content.slice(0, 500) + (content.length > 500 ? '...' : '') : 'No content available'}
    \`\`\`
`;

  try {
    // Ensure the directory exists
    const outputDir = path.dirname(TARGET_SCREENED_OUT_FILES_FILE_PATH);
    fs.mkdirSync(outputDir, { recursive: true });
    
    // Write the error content
    fs.writeFileSync(TARGET_SCREENED_OUT_FILES_FILE_PATH, screenedOutContent, 'utf8');
  } catch (e) {
    console.error('Failed to write to screened out file:', e);
  }

  return null;

// Patterns that indicate YAML corruption with prevention and correction info
const CORRUPTION_PATTERNS = [



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
let filesWithCriticalIssues = []; // Files with issues that prevent all processing
let filesWithMinorInconsistencies = []; // Files with issues that prevent specific operations
let totallyCleanFiles = []; // Files with no issues at all
let fileOperationMap = {}; // Maps filePath -> list of prevented operations
let correctionAttempts = {}; // Maps filePath -> {issue, result, message}
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
    * Attempt to fix missing YAML delimiter
    * @param {string} filePath - Path to the file
    * @param {string} content - Content of the file
    * @returns {Object} Result with success flag, message, and updated content if successful
    */
  attemptToFixMissingDelimiter: (filePath, content) => {
    try {
      // Check if content has opening delimiter but not closing
      if (content.startsWith('---\n') && !content.includes('\n---\n')) {
        // Look for common patterns that might indicate where content starts
        const contentStartMatches = [
          content.match(/\n#+\s+/m), // Headers
          content.match(/\n\s*[-*]\s+/m), // List items
          content.match(/\n\n[A-Z]/m) // Paragraph starting with capital letter
        ].filter(Boolean);
        
        if (contentStartMatches.length > 0) {
          // Find the earliest match
          const earliestMatch = contentStartMatches.reduce((earliest, match) => 
            match.index < earliest.index ? match : earliest
          );
          
          // Insert closing delimiter before content starts
          const updatedContent = content.slice(0, earliestMatch.index) + '\n---\n' + content.slice(earliestMatch.index);
          return {
            success: true,
            message: 'Added closing YAML delimiter before content start',
            updatedContent
          };
        }
      }
      
      return {
        success: false,
        message: 'Could not automatically determine where to add closing delimiter'
      };
    } catch (error) {
      return {
        success: false,
        message: `Error while attempting to fix: ${error.message}`
      };
    }
  },
  
  /**
   * Attempt to fix block scalar formatting
   * @param {string} filePath - Path to the file
   * @param {string} content - Content of the file
   * @returns {Object} Result with success flag, message, and updated content if successful
   */
  attemptToFixBlockScalar: (filePath, content) => {
    try {
      // Extract frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) return { success: false, message: 'Could not extract frontmatter' };
      
      let frontmatter = frontmatterMatch[1];
      
      // Find and fix malformed block scalars
      const blockScalarRegex = /^([^:\n]+):[ \t]*(>-|>|[|][-]?)[ \t]*(\S.*)$/gm;
      let match;
      let fixed = false;
      
      while ((match = blockScalarRegex.exec(frontmatter)) !== null) {
        const [fullMatch, key, indicator, value] = match;
        const fixedLine = `${key}: ${indicator}\n  ${value}`;
        frontmatter = frontmatter.replace(fullMatch, fixedLine);
        fixed = true;
      }
      
      if (fixed) {
        const updatedContent = content.replace(frontmatterMatch[1], frontmatter);
        return {
          success: true,
          message: 'Fixed block scalar formatting',
          updatedContent
        };
      }
      
      return {
        success: false,
        message: 'No fixable block scalar issues found'
      };
    } catch (error) {
      return {
        success: false,
        message: `Error while attempting to fix: ${error.message}`
      };
    }
  },
  
  /**
   * Attempt to fix duplicate keys
   * @param {string} filePath - Path to the file
   * @param {string} content - Content of the file
   * @returns {Object} Result with success flag, message, and updated content if successful
   */
  attemptToFixDuplicateKeys: (filePath, content) => {
    try {
      // Extract frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) return { success: false, message: 'Could not extract frontmatter' };
      
      const frontmatter = frontmatterMatch[1];
      const lines = frontmatter.split('\n');
      const seenKeys = new Set();
      const uniqueLines = [];
      let fixed = false;
      
      for (const line of lines) {
        const keyMatch = line.match(/^(\w+(?:[-_]\w+)*?):\s*/);
        if (keyMatch) {
          const key = keyMatch[1];
          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            uniqueLines.push(line);
          } else {
            fixed = true;
            // Skip this line as the key is already present
          }
        } else {
          uniqueLines.push(line);
        }
      }
      
      if (fixed) {
        const updatedFrontmatter = uniqueLines.join('\n');
        const updatedContent = content.replace(frontmatterMatch[1], updatedFrontmatter);
        return {
          success: true,
          message: 'Removed duplicate keys',
          updatedContent
        };
      }
      
      return {
        success: false,
        message: 'No duplicate keys found to fix'
      };
    } catch (error) {
      return {
        success: false,
        message: `Error while attempting to fix: ${error.message}`
      };
    }
  },
  
  /**
   * Attempt to fix quotes in error messages
   * @param {string} filePath - Path to the file
   * @param {string} content - Content of the file
   * @returns {Object} Result with success flag, message, and updated content if successful
   */
  attemptToFixQuotes: (filePath, content) => {
    try {
      // Extract frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) return { success: false, message: 'Could not extract frontmatter' };
      
      let frontmatter = frontmatterMatch[1];
      
      // Regex for error message properties with quote issues
      const errorPropRegex = /^(jina_error|og_error_message):[ \t]*(.+)$/gm;
      let match;
      let fixed = false;
      
      while ((match = errorPropRegex.exec(frontmatter)) !== null) {
        const [fullMatch, key, value] = match;
        // Clean the value and surround with double quotes
        let cleanedValue = value.replace(/^["']|["']$/g, '').replace(/["']/g, '\\"');
        const fixedLine = `${key}: "${cleanedValue}"`;
        frontmatter = frontmatter.replace(fullMatch, fixedLine);
        fixed = true;
      }
      
      if (fixed) {
        const updatedContent = content.replace(frontmatterMatch[1], frontmatter);
        return {
          success: true,
          message: 'Fixed quotes in error messages',
          updatedContent
        };
      }
      
      return {
        success: false,
        message: 'No fixable quote issues found'
      };
    } catch (error) {
      return {
        success: false,
        message: `Error while attempting to fix: ${error.message}`
      };
    }
  },
  
  /**
   * Attempt to fix nested/escaped quotes
   * @param {string} filePath - Path to the file
   * @param {string} content - Content of the file
   * @returns {Object} Result with success flag, message, and updated content if successful
   */
  attemptToFixNestedQuotes: (filePath, content) => {
    // This is similar to attemptToFixQuotes but focused on nested quotes
    try {
      // Extract frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) return { success: false, message: 'Could not extract frontmatter' };
      
      let frontmatter = frontmatterMatch[1];
      
      // Regex for error message properties with nested quotes
      const nestedQuotesRegex = /^(jina_error|og_error_message):[ \t]*(?:\\["']|["']\\["']|["'].*\\["'].*["'])(.*)$/gm;
      let match;
      let fixed = false;
      
      while ((match = nestedQuotesRegex.exec(frontmatter)) !== null) {
        const [fullMatch, key, rest] = match;
        // Simplify to a basic quoted string
        const fixedLine = `${key}: "Error occurred"`;
        frontmatter = frontmatter.replace(fullMatch, fixedLine);
        fixed = true;
      }
      
      if (fixed) {
        const updatedContent = content.replace(frontmatterMatch[1], frontmatter);
        return {
          success: true,
          message: 'Simplified nested quotes in error messages',
          updatedContent
        };
      }
      
      return {
        success: false,
        message: 'No fixable nested quote issues found'
      };
    } catch (error) {
      return {
        success: false,
        message: `Error while attempting to fix: ${error.message}`
      };
    }
  },
  
  /**
   * Attempt to fix broken URLs
   * @param {string} filePath - Path to the file
   * @param {string} content - Content of the file
   * @returns {Object} Result with success flag, message, and updated content if successful
   */
  attemptToFixBrokenUrl: (filePath, content) => {
    try {
      // Extract frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) return { success: false, message: 'Could not extract frontmatter' };
      
      let frontmatter = frontmatterMatch[1];
      
      // Find broken URLs
      const brokenUrlRegex = /^([\w-]+):[ \t]*https?:[ \t]*$/m;
      const match = brokenUrlRegex.exec(frontmatter);
      
      if (match) {
        const [fullMatch, key] = match;
        // Remove the broken URL line
        frontmatter = frontmatter.replace(fullMatch, `${key}: "https://example.com"`);
        
        const updatedContent = content.replace(frontmatterMatch[1], frontmatter);
        return {
          success: true,
          message: 'Fixed broken URL by replacing with placeholder',
          updatedContent
        };
      }
      
      return {
        success: false,
        message: 'No fixable broken URL found'
      };
    } catch (error) {
      return {
        success: false,
        message: `Error while attempting to fix: ${error.message}`
      };
    }
  },
  
  /**
   * Attempt to fix unquoted URL with special characters
   * @param {string} filePath - Path to the file
   * @param {string} content - Content of the file
   * @returns {Object} Result with success flag, message, and updated content if successful
   */
  attemptToFixUnquotedUrl: (filePath, content) => {
    try {
      // Extract frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) return { success: false, message: 'Could not extract frontmatter' };
      
      let frontmatter = frontmatterMatch[1];
      
      // Find unquoted URLs with special characters
      const unquotedUrlRegex = /^(url):[ \t]+([^\n"'][&?][^\n"']*)$/m;
      const match = unquotedUrlRegex.exec(frontmatter);
      
      if (match) {
        const [fullMatch, key, url] = match;
        // Add quotes around the URL
        frontmatter = frontmatter.replace(fullMatch, `${key}: "${url}"`);
        
        const updatedContent = content.replace(frontmatterMatch[1], frontmatter);
        return {
          success: true,
          message: 'Added quotes around URL with special characters',
          updatedContent
        };
      }
      
      return {
        success: false,
        message: 'No fixable unquoted URL found'
      };
    } catch (error) {
      return {
        success: false,
        message: `Error while attempting to fix: ${error.message}`
      };
    }
  },
  
  /**
   * Attempt to fix unbalanced quotes
   * @param {string} filePath - Path to the file
   * @param {string} content - Content of the file
   * @returns {Object} Result with success flag, message, and updated content if successful
   */
  attemptToFixUnbalancedQuotes: (filePath, content) => {
    try {
      // Extract frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) return { success: false, message: 'Could not extract frontmatter' };
      
      let frontmatter = frontmatterMatch[1];
      
      // Find unbalanced quotes
      const unbalancedQuotesRegex = /^([^:]+):[ \t]*(['"])((?:(?!\2).)*(?=\n|$))/gm;
      let match;
      let fixed = false;
      
      while ((match = unbalancedQuotesRegex.exec(frontmatter)) !== null) {
        const [fullMatch, key, openQuote, value] = match;
        // Add the closing quote
        const fixedLine = `${key}: ${openQuote}${value}${openQuote}`;
        frontmatter = frontmatter.replace(fullMatch, fixedLine);
        fixed = true;
      }
      
      if (fixed) {
        const updatedContent = content.replace(frontmatterMatch[1], frontmatter);
        return {
          success: true,
          message: 'Fixed unbalanced quotes',
          updatedContent
        };
      }
      
      return {
        success: false,
        message: 'No fixable unbalanced quotes found'
      };
    } catch (error) {
      return {
        success: false,
        message: `Error while attempting to fix: ${error.message}`
      };
    }
  },
  
  /**
   * Attempt to fix special properties with unquoted colons
   * @param {string} filePath - Path to the file
   * @param {string} content - Content of the file
   * @returns {Object} Result with success flag, message, and updated content if successful
   */
  surroundSpecialPropertyWithQuotes: (filePath, content) => {
    try {
      // Extract frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) return { success: false, message: 'Could not extract frontmatter' };
      
      let frontmatter = frontmatterMatch[1];
      let fixed = false;
      
      // Regular expression to find special properties with unquoted colons
      const specialPropRegex = new RegExp(`^(${SPECIAL_PROPERTIES.join('|')}):[ \\t]+([^\\n"'][^\\n]*:[^\\n]*)$`, 'gm');
      let match;
      
      while ((match = specialPropRegex.exec(frontmatter)) !== null) {
        const [fullMatch, key, value] = match;
        // Quote the value if it contains a colon
        const fixedLine = `${key}: "${value.replace(/"/g, '\\"')}"`;
        frontmatter = frontmatter.replace(fullMatch, fixedLine);
        fixed = true;
      }
      
      if (fixed) {
        const updatedContent = content.replace(frontmatterMatch[1], frontmatter);
        return {
          success: true,
          message: 'Added quotes to special properties containing colons',
          updatedContent
        };
      }
      
      return {
        success: false,
        message: 'No fixable unquoted special properties found'
      };
    } catch (error) {
      return {
        success: false,
        message: `Error while attempting to fix: ${error.message}`
      };
    }
  },
  
  /**
   * Attempt to fix multi-line URL properties
   * @param {string} filePath - Path to the file
   * @param {string} content - Content of the file
   * @returns {Object} Result with success flag, message, and updated content if successful
   */
  attemptToFixMultilineUrl: (filePath, content) => {
    try {
      // Extract frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) return { success: false, message: 'Could not extract frontmatter' };
      
      let frontmatter = frontmatterMatch[1];
      let fixed = false;
      
      // Process each line to look for URL properties
      const lines = frontmatter.split('\n');
      const processedLines = [];
      let inUrlProperty = false;
      let currentUrlProp = null;
      let currentUrlValue = '';
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check if this is a URL property start
        const urlPropMatch = line.match(new RegExp(`^(${URL_PROPERTIES.join('|')}):\\s*(.*)$`));
        
        if (urlPropMatch) {
          // Start of a URL property
          currentUrlProp = urlPropMatch[1];
          currentUrlValue = urlPropMatch[2];
          inUrlProperty = true;
          
          // Skip adding to processedLines as we'll add a complete version later
        } else if (inUrlProperty) {
          // Check if this is a continuation of URL or start of a new property
          const newPropMatch = line.match(/^[a-zA-Z0-9_-]+:[ \t]*/);
          
          if (newPropMatch) {
            // This is a new property, so add the collected URL property
            // Note: we're explicitly NOT adding quotes here
            processedLines.push(`${currentUrlProp}: ${currentUrlValue.trim().replace(/^["']|["']$/g, '')}`);
            processedLines.push(line);
            inUrlProperty = false;
            fixed = true;
          } else if (line.trim() === '') {
            // Empty line, end of URL property
            // Note: we're explicitly NOT adding quotes here
            processedLines.push(`${currentUrlProp}: ${currentUrlValue.trim().replace(/^["']|["']$/g, '')}`);
            processedLines.push('');
            inUrlProperty = false;
            fixed = true;
          } else {
            // Continuation of URL value, append to current value
            currentUrlValue += ' ' + line.trim();
          }
        } else {
          // Regular line, just add it
          processedLines.push(line);
        }
      }
      
      // Handle case where URL property is at the end of frontmatter
      if (inUrlProperty) {
        // Note: we're explicitly NOT adding quotes here
        processedLines.push(`${currentUrlProp}: ${currentUrlValue.trim().replace(/^["']|["']$/g, '')}`);
        fixed = true;
      }
      
      if (fixed) {
        const updatedFrontmatter = processedLines.join('\n');
        const updatedContent = content.replace(frontmatterMatch[1], updatedFrontmatter);
        return {
          success: true,
          message: 'Fixed multi-line URL property (without quotes)',
          updatedContent
        };
      }
      
      return {
        success: false,
        message: 'No fixable multi-line URL properties found'
      };
    } catch (error) {
      return {
        success: false,
        message: `Error while attempting to fix: ${error.message}`
      };
    }
  },
  
  /**
   * Attempt to remove quotes from URL properties
   * @param {string} filePath - Path to the file
   * @param {string} content - Content of the file
   * @returns {Object} Result with success flag, message, and updated content if successful
   */
  attemptToRemoveQuotesFromUrl: (filePath, content) => {
    try {
      // Extract frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) return { success: false, message: 'Could not extract frontmatter' };
      
      let frontmatter = frontmatterMatch[1];
      let updated = false;
      
      // For each URL property, find and remove quotes
      for (const urlProp of URL_PROPERTIES) {
        const urlPropRegex = new RegExp(`^(${urlProp}:[ \\t]*)["']([^"'\\n]+)["'][ \\t]*$`, 'gm');
        let match;
        
        while ((match = urlPropRegex.exec(frontmatter)) !== null) {
          const [fullMatch, prefix, url] = match;
          // Replace with unquoted version
          const corrected = `${prefix}${url}`;
          frontmatter = frontmatter.replace(fullMatch, corrected);
          updated = true;
        }
      }
      
      if (updated) {
        const updatedContent = content.replace(frontmatterMatch[1], frontmatter);
        return {
          success: true,
          message: 'Removed quotes from URL properties',
          updatedContent
        };
      }
      
      return {
        success: false,
        message: 'No quoted URL properties found'
      };
    } catch (error) {
      return {
        success: false,
        message: `Error while attempting to fix: ${error.message}`
      };
    }
  }
};
  
  try {
    // Special pre-check for properly formatted frontmatter
    // This helps avoid false positives in pattern detection
    const frontmatterCheck = /^---\n([\s\S]*?)\n---\n/m.exec(content);
    if (frontmatterCheck && frontmatterCheck[1]) {
      // File has proper frontmatter, do detailed checks on the content
      const frontmatter = frontmatterCheck[1];
      
      // Check for specific issues in frontmatter
      const issues = [];
      const preventedOperations = new Set();
      const corrections = [];
      
      // Only check patterns that apply to frontmatter content
      for (const pattern of CORRUPTION_PATTERNS) {
        // Skip the missing delimiter pattern since we already confirmed frontmatter is present
        if (pattern.messageToLog === 'Has opening delimiter but missing closing YAML frontmatter delimiter') {
          continue;
        }
        
        // For patterns that look at frontmatter content, test against the extracted frontmatter
        const testContent = pattern.pattern.toString().includes('---') ? content : frontmatter;
        
        if (pattern.pattern.test(testContent)) {
          issues.push(pattern.messageToLog);
          
          // Add prevented operations
          if (pattern.preventsOperations) {
            pattern.preventsOperations.forEach(op => preventedOperations.add(op));
          }
          
          // Attempt correction if available
          if (pattern.correctionFunction && correctionFunctions[pattern.correctionFunction]) {
            const correction = correctionFunctions[pattern.correctionFunction](filePath, content);
            
            corrections.push({
              issue: pattern.messageToLog,
              success: correction.success,
              message: correction.message
            });
            
            // If correction was successful, update the content
            if (correction.success && correction.updatedContent) {
              content = correction.updatedContent;
              fs.writeFileSync(filePath, content, 'utf8');
              console.log(`${filePath} - Correction applied: ${pattern.messageToLog}`);
              
              if (pattern.preventsOperations) {
                pattern.preventsOperations.forEach(op => preventedOperations.delete(op));
              }
            }
            
            // Critical issue but couldn't fix
            if (pattern.isCritical && (!correction.success)) {
              return {
                hasCriticalIssues: true,
                preventedOperations: ['all'],
                correctionAttempts: corrections
              };
            }
          }
        }
      }
      
      return {
        hasCriticalIssues: false,
        preventedOperations: Array.from(preventedOperations),
        correctionAttempts: corrections
      };
    }
    
    // If we didn't find proper frontmatter, proceed with regular pattern checks
    const issues = [];
    const preventedOperations = new Set();
    const corrections = [];
    
    // Check each corruption pattern
    for (const pattern of CORRUPTION_PATTERNS) {
      if (pattern.pattern.test(content)) {
        issues.push(pattern.messageToLog);
        
        // Add prevented operations
        if (pattern.preventsOperations) {
          pattern.preventsOperations.forEach(op => preventedOperations.add(op));
        }
        
        // If there's a correction function, attempt to correct
        if (pattern.correctionFunction && correctionFunctions[pattern.correctionFunction]) {
          const correction = correctionFunctions[pattern.correctionFunction](filePath, content);
          
          corrections.push({
            issue: pattern.messageToLog,
            success: correction.success,
            message: correction.message
          });
          
          // If correction was successful, update the content for subsequent checks
          if (correction.success && correction.updatedContent) {
            content = correction.updatedContent;
            
            // Write the corrected content back to the file
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`${filePath} - Correction applied: ${pattern.messageToLog}`);
            
            // Remove this operation from prevented list since we fixed it
            if (pattern.preventsOperations) {
              pattern.preventsOperations.forEach(op => preventedOperations.delete(op));
            }
          }
        }
        
        // If this is a critical issue and we couldn't fix it, mark for exclusion
        if (pattern.isCritical && (!pattern.correctionFunction || 
            !corrections.some(c => c.issue === pattern.messageToLog && c.success))) {
          return {
            hasCriticalIssues: true,
            preventedOperations: ['all'],
            correctionAttempts: corrections
          };
        }
      }
    }
    
    return {
      hasCriticalIssues: false,
      preventedOperations: Array.from(preventedOperations),
      correctionAttempts: corrections
    };
  } catch (error) {
    console.error(`Error checking file ${filePath}: ${error.message}`);
    return {
      hasCriticalIssues: true,
      preventedOperations: ['all'],
      correctionAttempts: [{
        issue: 'Exception during analysis',
        success: false,
        message: error.message
      }]
    };
  }
}

/**
 * Sort files into arrays based on issues and track operations and corrections
 * @returns {Object} Object containing arrays of file paths, operation map, and correction attempts
 */
function sortFilesIntoTwoArraysBasedOnFilesystemRegex() {
  console.log('Scanning content directory for markdown files...');
  
  // Reset arrays and maps
  filesWithCriticalIssues = [];
  filesWithMinorInconsistencies = [];
  totallyCleanFiles = [];
  fileOperationMap = {};
  correctionAttempts = {};
  totalFileCount = 0;
  
  // Get all markdown files recursively
  const allFiles = readFilesRecursive(CONTENT_DIR);
  
  console.log(`Found ${allFiles.length} markdown files. Checking for issues...`);
  
  // Process files
  let processedCount = 0;
  
  for (const filePath of allFiles) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Check and attempt to correct the file
      const result = checkAndCorrectFile(filePath, content);
      
      // Store correction attempts
      if (result.correctionAttempts.length > 0) {
        correctionAttempts[filePath] = result.correctionAttempts;
      }
      
      if (result.hasCriticalIssues) {
        filesWithCriticalIssues.push(filePath);
      } else if (result.preventedOperations.length > 0) {
        filesWithMinorInconsistencies.push(filePath);
        fileOperationMap[filePath] = result.preventedOperations;
      } else {
        totallyCleanFiles.push(filePath);
      }
    } catch (error) {
      console.error(`Error processing file ${filePath}: ${error.message}`);
      filesWithCriticalIssues.push(filePath);
    }
    
    processedCount++;
    if (processedCount % 100 === 0) {
      console.log(`Processed ${processedCount}/${allFiles.length} files...`);
    }
  }
  
  console.log(`\nResults:`);
  console.log(`- Totally clean files: ${totallyCleanFiles.length}`);
  console.log(`- Files with minor inconsistencies: ${filesWithMinorInconsistencies.length}`);
  console.log(`- Files with critical issues: ${filesWithCriticalIssues.length}`);
  console.log(`- Correction attempts: ${Object.keys(correctionAttempts).length}`);
  
  // Write results to files
  writeResultsToFile();
  
  return {
    safeFiles: [...totallyCleanFiles, ...filesWithMinorInconsistencies],
    corruptedFiles: filesWithCriticalIssues,
    fileOperationMap: fileOperationMap,
    correctionAttempts: correctionAttempts
  };
}

/**
 * Write the results to the designated output files
 * ALWAYS overwrites existing files without validation
 */
function writeResultsToFile() {
  // Format for both files
  const timestamp = new Date().toISOString();
  
  // Force-create output directories
  const outputDir = path.dirname(TARGET_SCREENED_IN_FILES_FILE_PATH);
  try {
    fs.mkdirSync(outputDir, { recursive: true });
  } catch (e) {
    // Ignore directory errors and continue
  }
  
  // Count successful corrections
  const successfulCorrections = Object.values(correctionAttempts)
    .flat()
    .filter(attempt => attempt.success)
    .length;
  
  // Write screened-in files
  const screenedInContent = `---
updated_on: "${timestamp}"
included_file_count: ${totallyCleanFiles.length + filesWithMinorInconsistencies.length}
totally_clean_files: ${totallyCleanFiles.length}
files_with_minor_inconsistencies: ${filesWithMinorInconsistencies.length}
total_file_count: ${totalFileCount}
successful_corrections: ${successfulCorrections}
---

# Markdown Files Screened-In for Processing
Last updated: ${timestamp}

## Summary
- Totally clean files: ${totallyCleanFiles.length}
- Files with minor inconsistencies: ${filesWithMinorInconsistencies.length}
- Total included files: ${totallyCleanFiles.length + filesWithMinorInconsistencies.length} (out of ${totalFileCount} total)
- Successful auto-corrections: ${successfulCorrections}

## Files with Minor Inconsistencies
These files have issues that prevent specific operations, but can still be processed by other operations:

${Object.entries(fileOperationMap).map(([file, ops]) => 
  `- ${file}\n  - Prevented operations: ${ops.join(', ')}`
).join('\n') || "No files with minor inconsistencies found."}

## Auto-Correction Attempts
${Object.entries(correctionAttempts)
  .filter(([file, _]) => !filesWithCriticalIssues.includes(file))
  .map(([file, attempts]) => 
    `- ${file}\n${attempts.map(a => `  - ${a.issue}: ${a.success ? '✅ ' : '❌ '}${a.message}`).join('\n')}`
  ).join('\n') || "No correction attempts for screened-in files."}

## Totally Clean Files
These files have no issues and can be fully processed:

${totallyCleanFiles.map(file => `- ${file}`).join('\n') || "No totally clean files found."}
`;

  // Write non-blocking observations
  const nonBlockingContent = `---
updated_on: "${timestamp}"
---

# Non-Blocking Observations
Last updated: ${timestamp}

## Files with Minor Inconsistencies
These files have issues that might affect some operations but are not critical:

${filesWithMinorInconsistencies.map(file => {
  const ops = fileOperationMap[file] || [];
  return `- ${file}\n  - Prevented operations: ${ops.join(', ')}`;
}).join('\n') || "No files with minor inconsistencies found."}

## Operation Impact Summary
The following operations are affected by minor inconsistencies:

${(() => {
  const operationCounts = {};
  Object.values(fileOperationMap).forEach(ops => {
    ops.forEach(op => {
      operationCounts[op] = (operationCounts[op] || 0) + 1;
    });
  });
  return Object.entries(operationCounts)
    .map(([op, count]) => `- ${op}: ${count} files affected`)
    .join('\n') || "No operations affected";
})()}
`;

  // Write screened-out files
  const screenedOutContent = `---
updated_on: "${timestamp}"
included_file_count: ${filesWithCriticalIssues.length}
total_file_count: ${totalFileCount}
---

# Markdown Files Screened-Out from Processing
Last updated: ${timestamp}

These ${filesWithCriticalIssues.length} files (out of ${totalFileCount} total) have been screened out due to critical YAML issues:

${filesWithCriticalIssues.map(file => {
  const fileAttempts = correctionAttempts[file] || [];
  if (fileAttempts.length > 0) {
    return `- ${file}\n  - Correction attempts:\n${fileAttempts.map(a => 
      `    - ${a.issue}: ${a.success ? '✅ ' : '❌ '}${a.message}`
    ).join('\n')}`;
  }
  return `- ${file}`;
}).join('\n') || "No files with critical issues found."}
`;

  // Force-write all files without error checking
  try { fs.writeFileSync(TARGET_SCREENED_IN_FILES_FILE_PATH, screenedInContent, {flag: 'w'}); } catch (e) {}
  try { fs.writeFileSync(TARGET_NON_BLOCKING_OBSERVATIONS_FILE_PATH, nonBlockingContent, {flag: 'w'}); } catch (e) {}
  try { fs.writeFileSync(TARGET_SCREENED_OUT_FILES_FILE_PATH, screenedOutContent, {flag: 'w'}); } catch (e) {}
  
  console.log(`\nOutputs written to:`);
  console.log(`- ${TARGET_SCREENED_IN_FILES_FILE_PATH}`);
  console.log(`- ${TARGET_NON_BLOCKING_OBSERVATIONS_FILE_PATH}`);
  console.log(`- ${TARGET_SCREENED_OUT_FILES_FILE_PATH}`);
}

// Export functions for use in other scripts
module.exports = {
  sortFilesIntoTwoArraysBasedOnFilesystemRegex,
  getScreenedInFiles: () => [...totallyCleanFiles, ...filesWithMinorInconsistencies],
  getFileOperationMap: () => fileOperationMap,
  getSuccessfulCorrections: () => Object.values(correctionAttempts)
    .flat()
    .filter(attempt => attempt.success)
    .length,
  canPerformOperation: (filePath, operation) => {
    // If file has critical issues, it can't perform any operations
    if (filesWithCriticalIssues.includes(filePath)) {
      return false;
    }
    
    // If file has minor inconsistencies, check if the operation is prevented
    if (filesWithMinorInconsistencies.includes(filePath)) {
      const preventedOps = fileOperationMap[filePath] || [];
      return !preventedOps.includes(operation);
    }
    
    // If file is totally clean, it can perform all operations
    return true;
  }
};

// If this script is run directly, execute the sorting function
if (require.main === module) {
  sortFilesIntoTwoArraysBasedOnFilesystemRegex();
}

