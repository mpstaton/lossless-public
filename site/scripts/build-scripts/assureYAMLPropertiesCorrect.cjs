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

/**
 * Format a YAML value according to its property definition
 * @param {string} key - Property key
 * @param {any} value - Property value
 * @returns {any} Formatted value
 */
function formatYAMLValue(key, value) {
  const propertyDef = USER_OPTIONS.frontmatter.properties[key];
  if (!propertyDef) return value;

  if (propertyDef.isArray && Array.isArray(value)) {
    const formatted = propertyDef.format ? value.map(v => propertyDef.format(v)) : value;
    const { prefix, itemPrefix, itemSuffix, suffix } = USER_OPTIONS.frontmatter.formatting.array;
    return `${prefix}${formatted.map(v => `${itemPrefix}${v}${itemSuffix}`).join('')}${suffix}`;
  }

  return propertyDef.format ? propertyDef.format(value) : value;
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
  // Pre-process content
  let processedContent = preprocessYAML(content);
  
  // Validate basic YAML structure
  const preCheckErrors = USER_OPTIONS.frontmatter.validation.preCheck(processedContent);
  if (preCheckErrors.length > 0) {
    console.error('Pre-check validation errors:', preCheckErrors);
    return { content: processedContent, modified: false, errors: preCheckErrors };
  }

  // Parse YAML
  const { data: frontmatter, content: bodyContent } = matter(processedContent);
  let modified = false;
  let replacements = 0;
  const changes = {};

  // Process each property
  Object.entries(USER_OPTIONS.frontmatter.properties).forEach(([key, def]) => {
    // Generate missing required properties
    if (def.required && !frontmatter[key] && def.generate) {
      frontmatter[key] = def.generate();
      modified = true;
      replacements++;
      changes[key] = { action: 'generated', value: frontmatter[key] };
    }

    // Format existing properties
    if (frontmatter[key] !== undefined) {
      const formatted = formatYAMLValue(key, frontmatter[key]);
      if (formatted !== frontmatter[key]) {
        frontmatter[key] = formatted;
        modified = true;
        replacements++;
        changes[key] = { action: 'formatted', value: formatted };
      }

      // Validate formatted value
      if (!validateYAMLValue(key, frontmatter[key])) {
        console.warn(`Invalid value for ${key}:`, frontmatter[key]);
      }
    }
  });

  // Post-validation
  const postCheckErrors = USER_OPTIONS.frontmatter.validation.postCheck(frontmatter);
  if (postCheckErrors.length > 0) {
    console.error('Post-check validation errors:', postCheckErrors);
  }

  // Generate new content if modified
  if (modified) {
    processedContent = matter.stringify(bodyContent, frontmatter);
  }

  return {
    content: processedContent,
    modified,
    replacements,
    changes,
    errors: [...preCheckErrors, ...postCheckErrors]
  };
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
    const content = fs.readFileSync(filePath, 'utf8');
    const result = processYAMLFrontmatter(content);

    if (result.modified) {
      fs.writeFileSync(filePath, result.content, 'utf8');
      console.log(`Modified ${path.relative(process.cwd(), filePath)}:`, result.changes);
    }

    return {
      modified: result.modified,
      replacements: result.replacements,
      changes: result.changes,
      errors: result.errors
    };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return {
      modified: false,
      replacements: 0,
      changes: {},
      errors: [error.message]
    };
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
