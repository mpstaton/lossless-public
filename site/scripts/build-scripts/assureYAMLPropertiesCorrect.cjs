const fs = require('fs');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');
const USER_OPTIONS = require('./getUserOptionsForBuild.cjs');

// ============================================================================
// YAML Processing Functions
// ============================================================================

/**
 * Pre-process and clean YAML content before parsing
 * @param {string} content - Raw file content
 * @returns {string} Cleaned content
 */
function preprocessYAML(content) {
  return USER_OPTIONS.frontmatter.preprocessing.cleanContent(content);
}

// Get the properties definition from the user options
const { properties } = USER_OPTIONS.frontmatter;

/**
 * Format a YAML value according to its property definition
 * @param {string} key - Property key
 * @param {any} value - Property value
 * @param {Object} propertyDef - Property definition
 * @returns {any} Formatted value
 */
function formatYAMLValue(key, value, propertyDef) {
  // Handle null/undefined values safely
  if (value === null || value === undefined) {
    return value;
  }

  try {
    if (propertyDef && typeof propertyDef.format === 'function') {
      return propertyDef.format(value);
    }
    
    // Use default formatting if no specific formatter exists
    if (typeof value === 'string') {
      return USER_OPTIONS.frontmatter.formatting.string(value);
    }
    
    return value;
  } catch (error) {
    console.error(`Error formatting value for key '${key}':`, error);
    // Return the original value if formatting fails
    return value;
  }
}

/**
 * Validate a YAML value against its property definition
 * @param {string} key - Property key
 * @param {any} value - Property value
 * @returns {boolean} Whether the value is valid
 */
function validateYAMLValue(key, value) {
  const propertyDef = USER_OPTIONS.frontmatter.properties[key];
  if (!propertyDef || !propertyDef.validate) return true;

  if (propertyDef.isArray && Array.isArray(value)) {
    return value.every(v => propertyDef.validate(v));
  }

  return propertyDef.validate(value);
}

/**
 * Process YAML frontmatter to ensure it follows defined rules
 * @param {string} content - File content
 * @returns {Object} Processed content and modifications info
 */
function processYAMLFrontmatter(content) {
  // First, clean the content using the enhanced preprocessing function
  const cleanedContent = USER_OPTIONS.frontmatter.preprocessing.cleanContent(content);
  
  // Check for basic YAML structure issues
  const preCheckErrors = USER_OPTIONS.frontmatter.validation.preCheck(cleanedContent);
  if (preCheckErrors.length > 0) {
    console.log('Pre-check validation errors:', preCheckErrors);
    return { content, modified: false, errors: preCheckErrors };
  }
  
  try {
    // Parse the frontmatter with gray-matter (after cleaning)
    const parsed = matter(cleanedContent);
    
    let modified = false;
    const data = parsed.data || {};
    
    // Process each property from the property definitions
    Object.entries(properties).forEach(([key, def]) => {
      // Skip properties that don't need processing
      if (!def) return;
      
      // Check if property is required but missing
      if (def.required && data[key] === undefined) {
        // Generate the property value if a generator is available
        if (typeof def.generate === 'function') {
          data[key] = def.generate();
          modified = true;
        }
      } else if (data[key] !== undefined) {
        // Property exists, format it according to its definition
        
        // Special case for arrays (like tags)
        if (def.isArray && Array.isArray(data[key])) {
          // Format each item in the array
          data[key] = data[key].map(item => formatYAMLValue(key, item, def));
        } else {
          // Format regular values
          const formattedValue = formatYAMLValue(key, data[key], def);
          
          // Only update if the value has changed to avoid unnecessary modifications
          if (formattedValue !== data[key]) {
            data[key] = formattedValue;
            modified = true;
          }
        }
      }
    });
    
    // Post-validation to check the final data
    const postCheckErrors = USER_OPTIONS.frontmatter.validation.postCheck(data);
    if (postCheckErrors.length > 0) {
      console.log('Post-check validation errors:', postCheckErrors);
      return { content: cleanedContent, modified: false, errors: postCheckErrors };
    }
    
    // If any properties were changed, rebuild the content with the updated frontmatter
    if (modified) {
      // Create updated content with new frontmatter
      const updatedContent = matter.stringify(parsed.content, data);
      return { content: updatedContent, modified: true, errors: [] };
    }
    
    // Return cleaned content even if no properties were modified
    return { content: cleanedContent, modified: false, errors: [] };
  } catch (error) {
    console.error('Error processing YAML frontmatter:', error);
    return { content, modified: false, errors: [error.message] };
  }
}

/**
 * Process all markdown files in the specified directory
 * @param {string} contentDirectory - Directory containing markdown files 
 * @returns {Object} Processing results
 */
function processAllFiles(contentDirectory) {
  // Ensure the fixes directory exists
  const fixesDir = USER_OPTIONS.directories.fixes;
  if (!fs.existsSync(fixesDir)) {
    fs.mkdirSync(fixesDir, { recursive: true });
  }

  // Process all markdown files
  const markdownFiles = glob.sync('**/*.md', {
    cwd: contentDirectory,
    absolute: true
  });

  let filesModified = 0;
  let totalReplacements = 0;
  const errors = new Map();

  markdownFiles.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const result = processYAMLFrontmatter(content);

      if (result.errors.length > 0) {
        errors.set(filePath, result.errors);
      }

      if (result.modified) {
        fs.writeFileSync(filePath, result.content, 'utf8');
        filesModified++;
        totalReplacements += result.replacements;
        console.log(`Modified ${path.relative(process.cwd(), filePath)}:`, result.changes);
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
      errors.set(filePath, [error.message]);
    }
  });

  // Write error report
  if (errors.size > 0) {
    const errorReport = Array.from(errors.entries())
      .map(([file, fileErrors]) => `${file}:\n${fileErrors.map(e => `  - ${e}`).join('\n')}`)
      .join('\n\n');
    fs.writeFileSync(
      path.join(fixesDir, 'YAML-Errors.md'),
      errorReport,
      'utf8'
    );
  }

  // Return summary
  return {
    filesProcessed: markdownFiles.length,
    filesModified,
    totalReplacements,
    errorsCount: errors.size
  };
}

/**
 * Process a single file
 * @param {string} filePath - Path to the file to process
 * @returns {Object} Processing result
 */
function processFile(filePath) {
  try {
    console.log('Processing file:', filePath);
    
    // Read the file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Clean and process the frontmatter
    const result = processYAMLFrontmatter(content);
    
    // Write back to the file if modified
    if (result.modified) {
      fs.writeFileSync(filePath, result.content);
      console.log(`Updated YAML in ${filePath}`);
      return { success: true, modified: true, filePath };
    }
    
    // Check for errors
    if (result.errors && result.errors.length > 0) {
      console.log('YAML processing failed.');
      return { success: false, errors: result.errors, filePath };
    }
    
    // File was processed but not modified
    return { success: true, modified: false, filePath };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return { success: false, errors: [error.message], filePath };
  }
}

// Export the functions for use by other scripts
module.exports = {
  processYAMLFrontmatter,
  processAllFiles,
  processFile,
  preprocessYAML,
  formatYAMLValue,
  validateYAMLValue
};

// Execute if run directly
if (require.main === module) {
  const contentDir = USER_OPTIONS.directories.content;
  const results = processAllFiles(contentDir);
  
  console.log('\nSummary:');
  console.log(`Files processed: ${results.filesProcessed}`);
  console.log(`Files modified: ${results.filesModified}`);
  console.log(`Total replacements: ${results.totalReplacements}`);
  console.log(`Files with errors: ${results.errorsCount}`);
}
