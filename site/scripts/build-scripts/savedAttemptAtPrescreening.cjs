/**
 * prescreenFilesWithFilesystemRegex.cjs
 * 
 * This script performs initial content validation and screening of markdown files.
 * It processes the YAML frontmatter as raw text without full YAML parsing to catch
 * and potentially correct basic formatting issues before further processing.
 */

const fs = require('fs');
const path = require('path');

// Import user options
const USER_OPTIONS = require('./archive/getUserOptionsForBuild.cjs');

// Constants for file paths
const CONTENT_DIR = path.resolve(process.cwd(), USER_OPTIONS.directories.content || 'site/src/content/tooling');
const TARGET_INVALID_FRONTMATTER_FILE_PATH = path.resolve(process.cwd(), 'site/scripts/data-or-content-generation/fixes-needed/Invalid-Frontmatter-Files.md');
const TARGET_SCREENED_OUT_FILES_FILE_PATH = path.resolve(process.cwd(), 'site/scripts/data-or-content-generation/fixes-needed/Screened-Out-Files.md');
const TARGET_SCREENED_IN_FILES_FILE_PATH = path.resolve(process.cwd(), 'site/scripts/data-or-content-generation/fixes-needed/Screened-In-Files.md');

// Add debug logs
console.log('Content directory path:', CONTENT_DIR);

// Arrays to track file processing
let filesWithValidFrontmatter = [];
let filesWithInvalidFrontmatter = [];

// Properties that are URLs
const URL_PROPERTIES = [
  'url',
  'image',
  'favicon',
  'og_screenshot_url',
  'og_image'
];

// Properties that should always be quoted (error messages, etc.)
const ERROR_MESSAGE_PROPERTIES = [
  'jina_error',
  'og_errors',
];

const PLAIN_TEXT_PROPERTIES = [
    'description',
    'og_description',
    'zinger',
    'site_description_cp'
];

/**
 * Recursive function to find all markdown files in a directory
 * @param {string} dir - Directory to search
 * @returns {string[]} - Array of file paths
 */
function findMarkdownFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      results = results.concat(findMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  
  return results;
}


  // If we got here, there was an error. Write it to the screened out file
  const screenedOutContent = `---
updated_on: "${timestamp}"
error_code: "${errorContent.code}"
---

# Frontmatter Processing Error
Last updated: ${timestamp}

## Error Details
- Code: ${errorContent.code}
- Message: ${errorContent.message}

## Content Preview
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
}

/**
 * Attempts to remove quotes from URL properties
 * @param {string} content - Raw markdown file content
 * @param {string} filePath - Path to the file
 * @param {string} fileName - Name of the file (without extension)
 * @returns {Object} - Result object with success flag and processed content
 */
function attemptToRemoveQuotesFromUrl(content, filePath, fileName) {
  let isolatedFrontmatter = content.match(/^---\n[\s\S]*?\n---/m)[0];
  const result = {
    success: false,
    modified: false,
    content: content
  };

  try {
    let modified = false;
    
    // Process each URL property
    for (const prop of URL_PROPERTIES) {
      // Look for quoted URL properties
      const quotedUrlRegex = new RegExp(`^(${prop}):[ \\t]*["']([^"'\\n]+)["'][ \\t]*$`, 'm');
      if (quotedUrlRegex.test(isolatedFrontmatter)) {
        // Replace with unquoted version
        isolatedFrontmatter = isolatedFrontmatter.replace(
          quotedUrlRegex,
          (match, key, url) => `${key}: ${url}`
        );
        modified = true;
      }
    }

    if (modified) {
      // Replace the original frontmatter with the corrected one
      result.content = content.replace(/^---\n[\s\S]*?\n---/m, isolatedFrontmatter);
      result.modified = true;
      result.success = true;
    } else {
      // No changes needed
      result.success = true;
    }
  } catch (error) {
    console.error(`Error removing quotes from URL in ${filePath}:`, error);
  }

  return result;
}

/**
 * Attempts to fix block scalar syntax in YAML
 * @param {string} content - Raw markdown file content
 * @param {string} filePath - Path to the file
 * @param {string} fileName - Name of the file (without extension)
 * @returns {Object} - Result object with success flag and processed content
 */
function attemptToFixBlockScalar(content, filePath, fileName) {
  let isolatedFrontmatter = content.match(/^---\n[\s\S]*?\n---/m)[0];
  const result = {
    success: false,
    modified: false,
    content: content
  };

  try {
    // Find block scalar syntax in frontmatter
    const blockScalarPattern = /^([^:\n]+):[ \t]*(>-|>|[|][-]?)[ \t]*(\S.*)$/gm;
    let match;
    let modified = false;
    
    // Process all matches
    while ((match = blockScalarPattern.exec(isolatedFrontmatter)) !== null) {
      const [fullMatch, key, scalarType, value] = match;
      
      // Replace block scalar with simple string
      const replacement = `${key}: "${value.replace(/"/g, '\\"')}"`;
      isolatedFrontmatter = isolatedFrontmatter.replace(fullMatch, replacement);
      modified = true;
    }

    if (modified) {
      // Replace the original frontmatter with the corrected one
      result.content = content.replace(/^---\n[\s\S]*?\n---/m, isolatedFrontmatter);
      result.modified = true;
      result.success = true;
    } else {
      // No changes needed
      result.success = true;
    }
  } catch (error) {
    console.error(`Error fixing block scalar in ${filePath}:`, error);
  }

  return result;
}

/**
 * Surrounds error message properties with quotes
 * @param {string} content - Raw markdown file content
 * @param {string} filePath - Path to the file
 * @param {string} fileName - Name of the file (without extension)
 * @returns {Object} - Result object with success flag and processed content
 */
function surroundErrorMessagePropertyWithQuotes(content, filePath, fileName) {
  let isolatedFrontmatter = content.match(/^---\n[\s\S]*?\n---/m)[0];
  const result = {
    success: false,
    modified: false,
    content: content
  };

  try {
    // Pattern to find unquoted error message properties
    const unquotedErrorMsgPattern = new RegExp(`^(${ERROR_MESSAGE_PROPERTIES.join('|')}):[ \\t]+([^\\n"'][^\\n]*:[^\\n]*)$`, 'm');
    let match;
    let modified = false;
    
    // Process all matches
    if ((match = unquotedErrorMsgPattern.exec(isolatedFrontmatter)) !== null) {
      const [fullMatch, key, value] = match;
      
      // Replace with quoted version
      const replacement = `${key}: "${value.replace(/"/g, '\\"')}"`;
      isolatedFrontmatter = isolatedFrontmatter.replace(fullMatch, replacement);
      modified = true;
    }

    if (modified) {
      // Replace the original frontmatter with the corrected one
      result.content = content.replace(/^---\n[\s\S]*?\n---/m, isolatedFrontmatter);
      result.modified = true;
      result.success = true;
    } else {
      // No changes needed
      result.success = true;
    }
  } catch (error) {
    console.error(`Error quoting error message in ${filePath}:`, error);
  }

  return result;
}

/**
 * Attempts to fix unbalanced quotes in YAML values
 * @param {string} content - Raw markdown file content
 * @param {string} filePath - Path to the file
 * @param {string} fileName - Name of the file (without extension)
 * @returns {Object} - Result object with success flag and processed content
 */
function attemptToFixUnbalancedQuotes(content, filePath, fileName) {
  let isolatedFrontmatter = content.match(/^---\n[\s\S]*?\n---/m)[0];
  const result = {
    success: false,
    modified: false,
    content: content
  };

  try {
    // Pattern to find lines with unbalanced quotes
    const unbalancedQuotesPattern = /^([^:\n]+):[ \t]*"([^"\n]*)$/m;
    let match;
    let modified = false;
    
    // Process all matches
    if ((match = unbalancedQuotesPattern.exec(isolatedFrontmatter)) !== null) {
      const [fullMatch, key, value] = match;
      
      // Replace with balanced quotes
      const replacement = `${key}: "${value}"`;
      isolatedFrontmatter = isolatedFrontmatter.replace(fullMatch, replacement);
      modified = true;
    }

    if (modified) {
      // Replace the original frontmatter with the corrected one
      result.content = content.replace(/^---\n[\s\S]*?\n---/m, isolatedFrontmatter);
      result.modified = true;
      result.success = true;
    } else {
      // No changes needed
      result.success = true;
    }
  } catch (error) {
    console.error(`Error fixing unbalanced quotes in ${filePath}:`, error);
  }

  return result;
}

/**
 * Deletes all instances of a duplicated key
 * @param {string} content - Raw markdown file content
 * @param {string} filePath - Path to the file
 * @param {string} fileName - Name of the file (without extension)
 * @returns {Object} - Result object with success flag and processed content
 */
function deleteAllInstancesOfKey(content, filePath, fileName) {
  let isolatedFrontmatter = content.match(/^---\n[\s\S]*?\n---/m)[0];
  const result = {
    success: false,
    modified: false,
    content: content
  };

  try {
    // Detect duplicate keys
    const keyOccurrences = {};
    const lines = isolatedFrontmatter.split('\n');
    let duplicateKeys = [];
    
    // Find duplicate keys
    for (const line of lines) {
      const keyMatch = line.match(/^([^:\n]+):/);
      if (keyMatch) {
        const key = keyMatch[1].trim();
        keyOccurrences[key] = (keyOccurrences[key] || 0) + 1;
        if (keyOccurrences[key] > 1 && !duplicateKeys.includes(key)) {
          duplicateKeys.push(key);
        }
      }
    }
    
    let modified = false;
    if (duplicateKeys.length > 0) {
      // Create new frontmatter without duplicate keys
      const newLines = [];
      const processedKeys = {};
      
      for (const line of lines) {
        const keyMatch = line.match(/^([^:\n]+):/);
        if (keyMatch) {
          const key = keyMatch[1].trim();
          if (duplicateKeys.includes(key)) {
            if (!processedKeys[key]) {
              newLines.push(line);
              processedKeys[key] = true;
            }
            // Skip duplicate keys
          } else {
            newLines.push(line);
          }
        } else {
          newLines.push(line);
        }
      }
      
      isolatedFrontmatter = newLines.join('\n');
      modified = true;
    }

    if (modified) {
      // Replace the original frontmatter with the corrected one
      result.content = content.replace(/^---\n[\s\S]*?\n---/m, isolatedFrontmatter);
      result.modified = true;
      result.success = true;
    } else {
      // No changes needed
      result.success = true;
    }
  } catch (error) {
    console.error(`Error removing duplicate keys in ${filePath}:`, error);
  }

  return result;
}

/**
 * Replaces single quotes with double quotes
 * @param {string} content - Raw markdown file content
 * @param {string} filePath - Path to the file
 * @param {string} fileName - Name of the file (without extension)
 * @returns {Object} - Result object with success flag and processed content
 */
function replaceSingleMarkQuotesWithDoubleMarkQuotes(content, filePath, fileName) {
  let isolatedFrontmatter = content.match(/^---\n[\s\S]*?\n---/m)[0];
  const result = {
    success: false,
    modified: false,
    content: content
  };

  try {
    // Pattern to find error properties with single quotes
    const singleQuotePattern = new RegExp(`^(${ERROR_MESSAGE_PROPERTIES.join('|')}):[ \\t]*'([^'\\n]*)'[ \\t]*$`, 'm');
    let match;
    let modified = false;
    
    // Process all matches
    if ((match = singleQuotePattern.exec(isolatedFrontmatter)) !== null) {
      const [fullMatch, key, value] = match;
      
      // Replace with double quotes
      const replacement = `${key}: "${value.replace(/"/g, '\\"')}"`;
      isolatedFrontmatter = isolatedFrontmatter.replace(fullMatch, replacement);
      modified = true;
    }

    if (modified) {
      // Replace the original frontmatter with the corrected one
      result.content = content.replace(/^---\n[\s\S]*?\n---/m, isolatedFrontmatter);
      result.modified = true;
      result.success = true;
    } else {
      // No changes needed
      result.success = true;
    }
  } catch (error) {
    console.error(`Error replacing single quotes in ${filePath}:`, error);
  }

  return result;
}

/**
 * Removes improper character sets and adds proper quotes
 * @param {string} content - Raw markdown file content
 * @param {string} filePath - Path to the file
 * @param {string} fileName - Name of the file (without extension)
 * @returns {Object} - Result object with success flag and processed content
 */
function removeImproperCharacterSetThenAddDoubleMarkQuotes(content, filePath, fileName) {
  let isolatedFrontmatter = content.match(/^---\n[\s\S]*?\n---/m)[0];
  const result = {
    success: false,
    modified: false,
    content: content
  };

  try {
    // Pattern to find improper character sets around error messages
    const improperCharsPattern = new RegExp(`^(${ERROR_MESSAGE_PROPERTIES.join('|')}):[ \\t]*["'\\\\]+(.*?)["'\\\\]+[ \\t]*$`, 'm');
    let match;
    let modified = false;
    
    // Process all matches
    if ((match = improperCharsPattern.exec(isolatedFrontmatter)) !== null) {
      const [fullMatch, key, value] = match;
      
      // Replace with properly quoted value
      const replacement = `${key}: "${value.replace(/"/g, '\\"')}"`;
      isolatedFrontmatter = isolatedFrontmatter.replace(fullMatch, replacement);
      modified = true;
    }

    if (modified) {
      // Replace the original frontmatter with the corrected one
      result.content = content.replace(/^---\n[\s\S]*?\n---/m, isolatedFrontmatter);
      result.modified = true;
      result.success = true;
    } else {
      // No changes needed
      result.success = true;
    }
  } catch (error) {
    console.error(`Error fixing improper character sets in ${filePath}:`, error);
  }

  return result;
}

/**
 * Attempts to fix URLs split across multiple lines
 * @param {string} content - Raw markdown file content
 * @param {string} filePath - Path to the file
 * @param {string} fileName - Name of the file (without extension)
 * @returns {Object} - Result object with success flag and processed content
 */
function attemptToFixMultilineUrl(content, filePath, fileName) {
  let isolatedFrontmatter = content.match(/^---\n[\s\S]*?\n---/m)[0];
  const result = {
    success: false,
    modified: false,
    content: content
  };

  try {
    // Find broken URLs
    const brokenUrlPattern = /^([\w-]+):[ \t]*https?:[ \t]*$/m;
    const match = brokenUrlPattern.exec(isolatedFrontmatter);
    
    if (match) {
      const key = match[1];
      const frontmatterLines = isolatedFrontmatter.split('\n');
      let urlParts = [];
      let foundStart = false;
      let linesToRemove = [];
      
      // Collect URL parts from multiple lines
      for (let i = 0; i < frontmatterLines.length; i++) {
        const line = frontmatterLines[i];
        
        if (foundStart) {
          // If we've found the start, collect continuation
          if (line.trim() === '---') {
            break; // End of frontmatter
          }
          
          // If the next line starts a new property, we've reached the end of the URL
          if (/^[\w-]+:/.test(line)) {
            break;
          }
          
          urlParts.push(line.trim());
          linesToRemove.push(i);
        } else if (line.match(new RegExp(`^${key}:[ \\t]*https?:[ \\t]*$`))) {
          // Found the start of the broken URL
          foundStart = true;
          urlParts.push(line.match(/^[\w-]+:[ \t]*(.*)/)[1].trim());
          linesToRemove.push(i);
        }
      }
      
      if (foundStart && urlParts.length > 0) {
        // Reconstruct the URL
        const fullUrl = urlParts.join('');
        const newUrlLine = `${key}: ${fullUrl}`;
        
        // Remove the old lines and add the new one
        for (let i = linesToRemove.length - 1; i >= 0; i--) {
          frontmatterLines.splice(linesToRemove[i], 1);
        }
        frontmatterLines.splice(linesToRemove[0], 0, newUrlLine);
        
        const newFrontmatter = frontmatterLines.join('\n');
        result.content = content.replace(/^---\n[\s\S]*?\n---/m, newFrontmatter);
        result.modified = true;
        result.success = true;
      }
    } else {
      // No broken URLs found
      result.success = true;
    }
  } catch (error) {
    console.error(`Error fixing broken URL in ${filePath}:`, error);
  }

  return result;
}

/**
 * Adds filename to the list of files missing URL property
 * @param {string} content - Raw markdown file content
 * @param {string} filePath - Path to the file
 * @param {string} fileName - Name of the file (without extension)
 * @returns {Object} - Result object with success flag
 */
function addFileNameToMissingUrlList(content, filePath, fileName) {
  const result = {
    success: true,
    modified: false,
    content: content
  };

  try {
    // This is just a tracking function, so we don't modify content
    // Just log the missing URL to the console
    console.log(`Missing URL property in file: ${filePath}`);
    
    // In a real implementation, this would add to a centralized list
    // but for simplicity, we're just returning success
  } catch (error) {
    console.error(`Error adding file to missing URL list: ${filePath}`, error);
  }

  return result;
}

/**
 * Attempts to fix plain text properties by removing quotes and trimming whitespace
 * @param {string} content - Raw markdown file content
 * @param {string} filePath - Path to the file
 * @param {string} fileName - Name of the file (without extension)
 * @returns {Object} - Result object with success flag and processed content
 */
function formatPlainTextProperties(content, filePath, fileName) {
  let isolatedFrontmatter = content.match(/^---\n[\s\S]*?\n---/m)[0];
  const result = {
    success: false,
    modified: false,
    content: content
  };

  try {
    let modified = false;
    
    // Process each plain text property
    for (const prop of PLAIN_TEXT_PROPERTIES) {
      // Look for quoted plain text properties
      const quotedTextRegex = new RegExp(`^(${prop}):[ \\t]*["']([^"'\\n]+)["'][ \\t]*$`, 'm');
      if (quotedTextRegex.test(isolatedFrontmatter)) {
        // Replace with unquoted version, maintaining spacing within the text but trimming surrounding whitespace
        isolatedFrontmatter = isolatedFrontmatter.replace(
          quotedTextRegex,
          (match, key, text) => `${key}: ${text.trim()}`
        );
        modified = true;
      }
      
      // Also check for properties with unnecessary whitespace
      const whitespaceRegex = new RegExp(`^(${prop}):[ \\t]*(\\S.*\\S)[ \\t]*$`, 'm');
      if (!quotedTextRegex.test(isolatedFrontmatter) && whitespaceRegex.test(isolatedFrontmatter)) {
        // Trim any unnecessary whitespace
        isolatedFrontmatter = isolatedFrontmatter.replace(
          whitespaceRegex,
          (match, key, text) => `${key}: ${text.trim()}`
        );
        modified = true;
      }
    }

    if (modified) {
      // Replace the original frontmatter with the corrected one
      result.content = content.replace(/^---\n[\s\S]*?\n---/m, isolatedFrontmatter);
      result.modified = true;
      result.success = true;
    } else {
      // No changes needed
      result.success = true;
    }
  } catch (error) {
    console.error(`Error formatting plain text properties in ${filePath}:`, error);
  }

  return result;
}

/**
 * Defines patterns that indicate potential YAML corruption with prevention and correction information
 */
const CORRUPTION_PATTERNS = [
  // Any quote characters surrounding a URL
  {
    pattern: new RegExp(`^(${URL_PROPERTIES.join('|')}):[ \\t]*["']([^"'\\n]+)["'][ \\t]*$`, 'm'),
    messageToLog: 'URL property has quotes that need to be removed',
    preventsOperations: ['assureYAMLPropertiesCorrect.cjs', 'fetchOpenGraphData.cjs', 'trackVideosInRegistry.cjs'],
    correctionFunction: attemptToRemoveQuotesFromUrl,
    isCritical: true
  },

  // Block scalar syntax found in property
  { 
    pattern: /^([^:\n]+):[ \t]*(>-|>|[|][-]?)[ \t]*(\S.*)$/gm, 
    messageToLog: 'Block scalar syntax found in property',
    preventsOperations: ['assureYAMLPropertiesCorrect.cjs'],
    correctionFunction: attemptToFixBlockScalar,
    isCritical: true
  },
   
  // Unquoted error message properties
  {
    pattern: new RegExp(`^(${ERROR_MESSAGE_PROPERTIES.join('|')}):[ \\t]+([^\\n"'][^\\n]*:[^\\n]*)$`, 'm'),
    messageToLog: 'Contains unquoted error message property',
    preventsOperations: ['assureYAMLPropertiesCorrect.cjs'],
    correctionFunction: surroundErrorMessagePropertyWithQuotes,
    isCritical: true
  },

  // Unbalanced quotes
  {
    pattern: /^([^:\n]+):[ \t]*"([^"\n]*)$/m,
    messageToLog: 'Contains unbalanced quotes in value',
    preventsOperations: ['assureYAMLPropertiesCorrect.cjs', 'fetchOpenGraphData.cjs'],
    correctionFunction: attemptToFixUnbalancedQuotes,
    isCritical: true
  },
  
  // Duplicate keys
  { 
    pattern: /^([^:\n]+):.*\n(?:.*\n)*\1:/m,
    messageToLog: 'Duplicate keys in frontmatter',
    preventsOperations: ['assureYAMLPropertiesCorrect.cjs'],
    correctionFunction: deleteAllInstancesOfKey,
    isCritical: true
  },
  
  // Single quotes in error messages
  { 
    pattern: new RegExp(`^(${ERROR_MESSAGE_PROPERTIES.join('|')}):[ \\t]*'([^'\\n]*)'[ \\t]*$`, 'm'),
    messageToLog: 'Error message with single mark quotes',
    preventsOperations: ['assureYAMLPropertiesCorrect.cjs'],
    correctionFunction: replaceSingleMarkQuotesWithDoubleMarkQuotes,
    isCritical: true
  },

  // Improper character set around error message
  {
    pattern: new RegExp(`^(${ERROR_MESSAGE_PROPERTIES.join('|')}):[ \\t]*["'\\\\]+(.*?)["'\\\\]+[ \\t]*$`, 'm'),
    messageToLog: 'Error message with improperly formatted character set',
    preventsOperations: ['assureYAMLPropertiesCorrect.cjs'],
    correctionFunction: removeImproperCharacterSetThenAddDoubleMarkQuotes,
    isCritical: true
  },

  // URLs broken across multiple lines
  { 
    pattern: /^([\w-]+):[ \t]*https?:[ \t]*$/m, 
    messageToLog: 'URL split across multiple lines',
    preventsOperations: ['fetchOpenGraphData.cjs'],
    correctionFunction: attemptToFixMultilineUrl,
    isCritical: true
  },
  
  // Missing URL property
  {
    pattern: /^(?!.*\burl:).*$/m,
    messageToLog: 'Missing URL property needed for OpenGraph',
    preventsOperations: ['fetchOpenGraphData.cjs'],
    correctionFunction: addFileNameToMissingUrlList,
    isCritical: false
  },

  // Plain text properties
  {
    pattern: new RegExp(`^(${PLAIN_TEXT_PROPERTIES.join('|')}):[ \\t]*["']([^"'\\n]+)["'][ \\t]*$`, 'm'),
    messageToLog: 'Plain text property has quotes that need to be removed',
    preventsOperations: ['assureYAMLPropertiesCorrect.cjs'],
    correctionFunction: formatPlainTextProperties,
    isCritical: true
  }
];

/**
 * Process a single file to check and potentially fix frontmatter issues
 * @param {string} content - Raw file content
 * @param {string} filePath - Path to the file
 * @param {string} fileName - Name of the file (without extension)
 * @returns {Object} - Processing result with status and modified content if applicable
 */
function processFile(content, filePath, fileName) {
  // Extract frontmatter for inspection
  const frontmatter = returnsOnlyFilesWithValidFrontmatter(content);
  
  // If frontmatter extraction failed, return early
  if (!frontmatter) {
    return {
      success: false,
      error: 'Failed to extract frontmatter',
      filePath,
      fileName
    };
  }
  
  let modifiedContent = content;
  let wasModified = false;
  const appliedCorrections = [];
  
  // Check for each corruption pattern
  for (const pattern of CORRUPTION_PATTERNS) {
    // Skip if the pattern doesn't match
    if (!pattern.pattern.test(modifiedContent)) {
      continue;
    }
    
    console.log(`Found issue in ${fileName}: ${pattern.messageToLog}`);
    
    // Apply correction function if available
    if (typeof pattern.correctionFunction === 'function') {
      const result = pattern.correctionFunction(modifiedContent, filePath, fileName);
      
      if (result.success && result.modified) {
        modifiedContent = result.content;
        wasModified = true;
        appliedCorrections.push(pattern.messageToLog);
      }
    }
  }
  
  return {
    success: true,
    wasModified,
    content: modifiedContent,
    appliedCorrections,
    filePath,
    fileName
  };
}

/**
 * Screens a file to check if it has valid frontmatter, and if it does, it adds it to the screenedInFiles array
 * If the file does not have valid frontmatter, it adds it to the screenedOutFiles array
 * @param {string} content - Raw file content
 * @param {string} filePath - Path to the file
 * @param {string} fileName - Name of the file (without extension)
 * @returns {boolean} - Whether the file has valid frontmatter
 */
function returnsOnlyFilesWithValidFrontmatter(content, filePath, fileName) {
  try {
    // Check for critical frontmatter issues
    const frontmatter = extractPlainTextFrontmatter(content);
    
    if (!frontmatter) {
      // Add to invalid frontmatter list
      filesWithInvalidFrontmatter.push({
        filePath,
        fileName,
        error: 'Failed to extract frontmatter'
      });
      return false;
    }
    
    // Add to valid frontmatter list
    filesWithValidFrontmatter.push({
      content,
      filePath,
      fileName
    });
    
    return true;
  } catch (error) {
    // Add to invalid frontmatter list
    filesWithInvalidFrontmatter.push({
      filePath,
      fileName,
      error: error.message
    });
    
    return false;
  }
}

/**
 * Main function to sort files into two arrays based on frontmatter validity
 * @returns {Object} - Arrays of valid and invalid files
 */
function sortFilesIntoTwoArraysBasedOnFilesystemRegex(filesWithValidFrontmatter) {
  // Reset arrays
  screenedOutFiles = [];
  screenedInFiles = [];
  
  try {
    // Find all markdown files
    console.log(`Looking for markdown files in ${CONTENT_DIR} with pattern: ${CONTENT_DIR}/**/*.md`);
    const files = findMarkdownFiles(CONTENT_DIR);
    console.log(`Found ${files.length} markdown files in ${CONTENT_DIR}`);
    
    // List first 5 files for debugging
    if (files.length > 0) {
      console.log("First 5 files found:");
      files.slice(0, 5).forEach(file => console.log(`  - ${file}`));
    }
    
    // Process each file
    for (const filePath of files) {
      const fileName = path.basename(filePath, '.md');
      
      try {
        // Read the file content
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Screen the file
        returnsOnlyFilesWithValidFrontmatter(content, filePath, fileName);
      } catch (error) {
        // Add to invalid frontmatter list
        filesWithInvalidFrontmatter.push({
          filePath,
          fileName,
          error: `Failed to read file: ${error.message}`
        });
      }
    }
    
    // Write results to files
    writeScreeningResults();
    
    // Log results
    console.log(`Files with valid frontmatter: ${filesWithValidFrontmatter.length}`);
    console.log(`Files with invalid frontmatter: ${filesWithInvalidFrontmatter.length}`);
    
    // Process files with valid frontmatter
    const processedFiles = processFilesWithValidFrontmatter();
    
    return {
      validFiles: filesWithValidFrontmatter,
      corruptedFiles: filesWithInvalidFrontmatter,
      processedFiles
    };
  } catch (error) {
    console.error('Error sorting files:', error);
    return {
      validFiles: [],
      corruptedFiles: [],
      processedFiles: []
    };
  }
}

/**
 * Processes all files with valid frontmatter to fix any issues
 * @returns {Array} - Processed files
 */
function processFilesWithValidFrontmatter() {
  const processedFiles = [];
  
  for (const file of filesWithValidFrontmatter) {
    try {
      const result = processFile(file.content, file.filePath, file.fileName);
      
      // If the file was modified, write it back
      if (result.success && result.wasModified) {
        fs.writeFileSync(file.filePath, result.content, 'utf8');
        console.log(`Fixed issues in ${file.fileName}: ${result.appliedCorrections.join(', ')}`);
      }
      
      processedFiles.push(result);
    } catch (error) {
      console.error(`Error processing ${file.fileName}:`, error);
    }
  }
  
  return processedFiles;
}

/**
 * Writes the screening results to files
 */
function writeScreeningResults() {
  // Ensure directories exist
  const screenedOutDir = path.dirname(TARGET_SCREENED_OUT_FILES_FILE_PATH);
  fs.mkdirSync(screenedOutDir, { recursive: true });
  
  // Write invalid frontmatter files
  let invalidContent = `# Files with Invalid Frontmatter\n\nLast updated: ${new Date().toISOString()}\n\n`;
  invalidContent += `Total: ${filesWithInvalidFrontmatter.length}\n\n`;
  
  for (const file of filesWithInvalidFrontmatter) {
    invalidContent += `- ${file.filePath}: ${file.error}\n`;
  }
  
  fs.writeFileSync(TARGET_INVALID_FRONTMATTER_FILE_PATH, invalidContent, 'utf8');
  
  // Write screened out files
  let screenedOutContent = `# Files Screened Out Due to Issues\n\nLast updated: ${new Date().toISOString()}\n\n`;
  screenedOutContent += `Total: ${filesWithInvalidFrontmatter.length}\n\n`;
  
  for (const file of filesWithInvalidFrontmatter) {
    screenedOutContent += `- ${file.filePath}\n`;
  }
  
  fs.writeFileSync(TARGET_SCREENED_OUT_FILES_FILE_PATH, screenedOutContent, 'utf8');
  
  // Write screened in files
  let screenedInContent = `# Files Passed Screening\n\nLast updated: ${new Date().toISOString()}\n\n`;
  screenedInContent += `Total: ${filesWithValidFrontmatter.length}\n\n`;
  
  for (const file of filesWithValidFrontmatter) {
    screenedInContent += `- ${file.filePath}\n`;
  }
  
  fs.writeFileSync(TARGET_SCREENED_IN_FILES_FILE_PATH, screenedInContent, 'utf8');
}

/**
 * Get the array of files that passed the screening
 * @returns {Array} - Array of file paths that passed screening
 */
function getScreenedInFiles() {
  return filesWithValidFrontmatter.map(file => file.filePath);
}

// If this module is run directly, execute the main function
if (require.main === module) {
  sortFilesIntoTwoArraysBasedOnFilesystemRegex();
}

// Export functions for use in other modules
module.exports = {
  extractPlainTextFrontmatter,
  sortFilesIntoTwoArraysBasedOnFilesystemRegex,
  getScreenedInFiles,
  processFile,
  CORRUPTION_PATTERNS
};
