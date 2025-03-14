const path = require('path');
const matter = require('gray-matter');
const fs = require('fs');
const glob = require('glob');

/**
 * @typedef {Object} ProcessingStats
 * @property {number} totalFound - Total number of files found
 * @property {Object} excluded - Info about excluded files
 * @property {number} excluded.count - Number of excluded files
 * @property {string[]} excluded.paths - Paths of excluded files
 * @property {Object} skipped - Info about skipped files
 * @property {number} skipped.count - Number of skipped files
 * @property {string[]} skipped.paths - Paths of skipped files
 * @property {Object} processed - Info about processed files
 * @property {number} processed.count - Number of processed files
 * @property {string[]} processed.paths - Paths of processed files
 */

/**
 * Calculate statistics from evaluation results
 * @param {Object} results - Evaluation results by file
 * @param {ProcessingStats} processingStats - Processing statistics
 * @returns {Object} Calculated statistics
 */
function calculateStats(results, processingStats) {
  const stats = {
    totalFiles: Object.keys(results).length,
    // YAML stats
    yamlValid: {
      beforeRun: 0,
      updatedThisRun: 0,
      errorsDuringRun: 0
    },
    // OpenGraph stats
    openGraph: {
      validBeforeRun: 0,
      updatedThisRun: 0,
      newThisRun: 0,
      errorsDuringRun: 0,
      totalValidAfterRun: 0
    },
    // Screenshot stats
    screenshots: {
      validBeforeRun: 0,
      updatedThisRun: 0,
      newThisRun: 0,
      errorsDuringRun: 0,
      totalValidAfterRun: 0
    },
    // Hero image stats
    heroImages: {
      validBeforeRun: 0,
      updatedThisRun: 0,
      newThisRun: 0,
      errorsDuringRun: 0,
      totalValidAfterRun: 0
    },
    // URL stats
    noUrls: 0,
    noFallbackProps: 0
  };

  // Track files needing attention
  const filesNoUrls = [];
  const filesWithOGErrors = [];

  // Calculate statistics from results
  Object.entries(results).forEach(([filePath, result]) => {
    const og = result.evaluation.openGraph;
    const yaml = result.evaluation.yaml;

    // YAML tracking
    if (!yaml.needsProcessing) {
      stats.yamlValid.beforeRun++;
    }
    if (result.modifications.modified) {
      stats.yamlValid.updatedThisRun++;
    }
    if (yaml.needsProcessing && !result.modifications.modified) {
      stats.yamlValid.errorsDuringRun++;
    }

    // OpenGraph tracking
    if (og.needsFetch === false && og.needsScreenshot === false && !og.hasErrors) {
      stats.openGraph.validBeforeRun++;
    }
    if (og.isUpdate) {
      stats.openGraph.updatedThisRun++;
    }
    if (og.isNew) {
      stats.openGraph.newThisRun++;
    }
    if (og.hasErrors) {
      stats.openGraph.errorsDuringRun++;
    }
    if (!og.needsFetch && !og.hasErrors) {
      stats.openGraph.totalValidAfterRun++;
    }

    // Screenshot tracking
    if (!og.needsScreenshot && !og.hasErrors) {
      stats.screenshots.validBeforeRun++;
    }
    if (og.screenshotUpdated) {
      stats.screenshots.updatedThisRun++;
    }
    if (og.screenshotNew) {
      stats.screenshots.newThisRun++;
    }
    if (og.hasErrors && og.needsScreenshot) {
      stats.screenshots.errorsDuringRun++;
    }
    if (!og.needsScreenshot && !og.hasErrors) {
      stats.screenshots.totalValidAfterRun++;
    }

    // URL tracking
    if (!yaml.needsURLCheck) {
      stats.noUrls++;
      filesNoUrls.push(path.basename(filePath, '.md'));
    }

    // Error tracking
    if (og.hasErrors && !og.hasFallbackProperties) {
      stats.noFallbackProps++;
      filesWithOGErrors.push(path.basename(filePath, '.md'));
    }
  });

  return { stats, filesNoUrls, filesWithOGErrors };
}

/**
 * Format the summary section of the report
 * @param {Object} stats - Calculated statistics
 * @param {ProcessingStats} processingStats - Processing statistics
 * @returns {string} Formatted summary markdown
 */
function formatSummary(stats, processingStats) {
  // Calculate percentages
  const getPercent = (num, total) => ((num / total) * 100).toFixed(1);
  const total = processingStats.totalFound;

  return `## Summary
### File Processing Overview
Total markdown files found: ${total}
Files evaluated: ${stats.totalFiles} (${getPercent(stats.totalFiles, total)}%)
Files processed: ${processingStats.processed.count} (${getPercent(processingStats.processed.count, total)}%)

### Processing Breakdown
Files skipped (could not evaluate): ${processingStats.skipped.count} (${getPercent(processingStats.skipped.count, total)}%)
Files excluded by pattern: ${processingStats.excluded.count} (${getPercent(processingStats.excluded.count, total)}%)

### Content Updates This Run
YAML modifications: ${stats.yamlValid.updatedThisRun} (${getPercent(stats.yamlValid.updatedThisRun, total)}%)
OpenGraph fetches: ${stats.openGraph.updatedThisRun + stats.openGraph.newThisRun} (${getPercent(stats.openGraph.updatedThisRun + stats.openGraph.newThisRun, total)}%)
Screenshot fetches: ${stats.screenshots.updatedThisRun + stats.screenshots.newThisRun} (${getPercent(stats.screenshots.updatedThisRun + stats.screenshots.newThisRun, total)}%)

### Current State After Run
Files with valid YAML: ${stats.yamlValid.beforeRun + stats.yamlValid.updatedThisRun} (${getPercent(stats.yamlValid.beforeRun + stats.yamlValid.updatedThisRun, total)}%)
Files with valid OpenGraph: ${stats.openGraph.totalValidAfterRun} (${getPercent(stats.openGraph.totalValidAfterRun, total)}%)
Files with valid screenshots: ${stats.screenshots.totalValidAfterRun} (${getPercent(stats.screenshots.totalValidAfterRun, total)}%)

### Error States
YAML errors: ${stats.yamlValid.errorsDuringRun} (${getPercent(stats.yamlValid.errorsDuringRun, total)}%)
OpenGraph errors: ${stats.openGraph.errorsDuringRun} (${getPercent(stats.openGraph.errorsDuringRun, total)}%)
Screenshot errors: ${stats.screenshots.errorsDuringRun} (${getPercent(stats.screenshots.errorsDuringRun, total)}%)`;
}

/**
 * Format the detailed statistics section of the report
 * @param {Object} stats - Calculated statistics
 * @param {ProcessingStats} processingStats - Processing statistics
 * @returns {string} Formatted detailed stats markdown
 */
function formatDetailedStats(stats, processingStats) {
  return `# Of ${processingStats.totalFound} markdown files found:

   ## Summary of Completed Files Needing No Action
   Files already complete before this run: ${stats.yamlValid.beforeRun}/${processingStats.totalFound}
   Files successfully completed during this run: ${stats.yamlValid.updatedThisRun}/${processingStats.totalFound}
   Total files complete after this run: ${stats.yamlValid.beforeRun + stats.yamlValid.updatedThisRun}/${processingStats.totalFound}
  
   ### Specific on Tidiness
   Files with valid YAML: ${stats.yamlValid.beforeRun + stats.yamlValid.updatedThisRun}/${processingStats.totalFound}
   Files with valid Open Graph data: ${stats.openGraph.totalValidAfterRun}/${processingStats.totalFound}
   Files with valid Screenshot: ${stats.screenshots.totalValidAfterRun}/${processingStats.totalFound}
   Files excluded by user set pattern: ${processingStats.excluded.count}/${processingStats.totalFound}

   ### Processing Results
   Files that underwent processes this run: ${stats.openGraph.updatedThisRun + stats.openGraph.newThisRun}/${processingStats.totalFound}
   YAML updated or tidied:
    - Outstanding Errors: ${stats.yamlValid.errorsDuringRun}
   Open Graph data fetches:
    - Updates: ${stats.openGraph.updatedThisRun}
    - New: ${stats.openGraph.newThisRun}
    - Outstanding Errors: ${stats.openGraph.errorsDuringRun}
   Screenshots:
    - Updates: ${stats.screenshots.updatedThisRun}
    - New: ${stats.screenshots.newThisRun}
    - Outstanding Errors: ${stats.screenshots.errorsDuringRun}`;
}

/**
 * Format the action items section of the report
 * @param {Object} stats - Calculated statistics
 * @param {ProcessingStats} processingStats - Processing statistics
 * @param {string[]} filesNoUrls - Files with no URLs
 * @param {string[]} filesWithOGErrors - Files with OpenGraph errors
 * @returns {string} Formatted action items markdown
 */
function formatActionItems(stats, processingStats, filesNoUrls, filesWithOGErrors) {
  return `## Action Items for Users: ${stats.openGraph.errorsDuringRun}/${processingStats.totalFound}
  #to-do

   Files skipped due to errors: ${stats.openGraph.errorsDuringRun}/${processingStats.totalFound}
   Files with outstanding issues needing attention as of this run: ${stats.openGraph.errorsDuringRun}/${processingStats.totalFound}
   Files that now have outstanding errors as of this run: ${stats.openGraph.errorsDuringRun}/${processingStats.totalFound}

  ### Files with no urls: ${stats.noUrls}/${processingStats.totalFound}

  ${filesNoUrls.map(file => `[[${file}]]`).join(', ')}

  ### Files with errors in Open Graph Data and no fallback properties: ${stats.noFallbackProps}/${processingStats.totalFound}

  ${filesWithOGErrors.map(file => `[[${file}]]`).join(', ')}`;
}

/**
 * Format the detailed results section for a single file
 * @param {string} filePath - Path to the file
 * @param {Object} result - Evaluation result for the file
 * @returns {string} Formatted file details markdown
 */
function formatFileDetails(filePath, result) {
  const fileName = path.basename(filePath);
  const fileNameNoExt = path.basename(fileName, '.md');
  
  // Get the path starting from src/content
  const pathParts = filePath.split(path.sep);
  const srcContentIndex = pathParts.findIndex((part, index) => 
    pathParts[index - 1] === 'src' && part === 'content'
  );
  const relativePath = srcContentIndex !== -1 
    ? pathParts.slice(srcContentIndex + 1).join('/')
    : filePath;

  let markdown = `### ${fileName}\n`;
  markdown += `current_path::${relativePath}\n`;
  markdown += `internal_link::[[${fileNameNoExt}]]\n`;

  // Display UUID
  const existingUUID = result.evaluation.yaml.needsUUID ? null : 
                      matter(fs.readFileSync(filePath, 'utf8')).data.site_uuid;
  const generatedUUID = result.modifications.changes.uuid;
  const uuid = existingUUID || generatedUUID;
  
  if (uuid) {
    markdown += `site_uuid::${uuid}\n`;
  }
  markdown += '\n';

  // Add all the evaluation sections
  markdown += formatYAMLDetails(result);
  markdown += formatOpenGraphDetails(result);
  markdown += formatYouTubeDetails(result);
  
  return markdown + '---\n\n';
}

/**
 * Format YAML details for a file
 * @param {Object} result - Evaluation result for the file
 * @returns {string} Formatted YAML details markdown
 */
function formatYAMLDetails(result) {
  let markdown = '';
  
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

  return markdown;
}

/**
 * Format OpenGraph details for a file
 * @param {Object} result - Evaluation result for the file
 * @returns {string} Formatted OpenGraph details markdown
 */
function formatOpenGraphDetails(result) {
  const og = result.evaluation.openGraph;
  return `#### OpenGraph Status\n` +
    `- Needs Fetch: ${og.needsFetch}\n` +
    `- Needs Screenshot: ${og.needsScreenshot}\n` +
    `- Has Errors: ${og.hasErrors}\n` +
    `- Processing Required: ${og.needsProcessing}\n\n`;
}

/**
 * Format YouTube details for a file
 * @param {Object} result - Evaluation result for the file
 * @returns {string} Formatted YouTube details markdown
 */
function formatYouTubeDetails(result) {
  let markdown = `#### YouTube Content Status\n` +
    `- Total URLs Found: ${result.evaluation.youtube.allYoutubeUrls.length}\n` +
    `  - Unique Unprocessed URLs: ${result.evaluation.youtube.danglingUrls.length}\n` +
    `  - Already Processed URLs: ${result.evaluation.youtube.processedUrls.length}\n` +
    `- Needs Footnotes Section: ${result.evaluation.youtube.needsFootnotesSection}\n` +
    `- Needs Registry Update: ${result.evaluation.youtube.needsRegistryUpdate}\n` +
    `- Processing Required: ${result.evaluation.youtube.needsProcessing}\n\n`;

  if (result.evaluation.youtube.allYoutubeUrls.length > 0) {
    markdown += formatYouTubeURLs(result.evaluation.youtube);
  }

  return markdown;
}

/**
 * Format YouTube URL details
 * @param {Object} youtube - YouTube evaluation results
 * @returns {string} Formatted YouTube URLs markdown
 */
function formatYouTubeURLs(youtube) {
  let markdown = `##### YouTube URLs Evaluation\n`;
  
  if (youtube.danglingUrls.length > 0) {
    markdown += `###### Unprocessed URLs:\n`;
    youtube.danglingUrls.forEach(url => {
      const urlEval = youtube.urlEvaluations[url];
      markdown += `URL: ${url}\n` +
        `- In Registry: ${urlEval.isInRegistry}\n` +
        `- Needs Registry Update: ${urlEval.needsRegistryUpdate}\n\n`;
    });
  }

  if (youtube.processedUrls.length > 0) {
    markdown += `###### Processed URLs:\n`;
    youtube.processedUrls.forEach(url => {
      const urlEval = youtube.urlEvaluations[url];
      markdown += `URL: ${url}\n` +
        `- Has Iframe: ${urlEval.hasIframe}\n` +
        `- Needs Footnote: ${urlEval.needsFootnote}\n` +
        `- Needs Footnote Definition: ${urlEval.needsFootnoteDefinition}\n` +
        `- In Registry: ${urlEval.isInRegistry}\n` +
        `- Needs Registry Update: ${urlEval.needsRegistryUpdate}\n\n`;
    });
  }

  return markdown;
}

/**
 * Format the complete evaluation report
 * @param {Object} results - Evaluation results by file
 * @param {ProcessingStats} processingStats - Processing statistics
 * @returns {string} Complete formatted markdown report
 */
function formatEvaluationReport(results, processingStats) {
  const timestamp = new Date().toISOString();
  const { stats, filesNoUrls, filesWithOGErrors } = calculateStats(results, processingStats);

  let markdown = `# Content Evaluation and Modification Results
Generated: ${timestamp}

---\n\n`;

  // Add main sections
  markdown += formatSummary(stats, processingStats) + '\n\n';
  markdown += formatDetailedStats(stats, processingStats) + '\n\n---\n\n';
  markdown += formatActionItems(stats, processingStats, filesNoUrls, filesWithOGErrors) + '\n\n---\n\n';
  markdown += '## Detailed Results\n\n';

  // Add individual file details
  const sortedFiles = Object.entries(results)
    .sort(([filePathA], [filePathB]) => {
      const baseNameA = path.basename(filePathA).toLowerCase();
      const baseNameB = path.basename(filePathB).toLowerCase();
      return baseNameA.localeCompare(baseNameB);
    });

  for (const [filePath, result] of sortedFiles) {
    if (!result.evaluation) continue;
    markdown += formatFileDetails(filePath, result);
  }

  return markdown;
}

/**
 * Write the evaluation report to a file
 * @param {string} markdown - The formatted markdown report
 * @param {Object} options - Output options from USER_OPTIONS.evaluationOutput
 * @returns {string} Path to the written file
 */
function writeOutput(markdown, options) {
  const dir = path.dirname(options.baseFile);
  const ext = options.pattern.extension;
  const baseName = path.basename(options.baseFile, ext);
  const sep = options.pattern.separator;
  
  // Format date according to pattern
  const today = new Date();
  const datePrefix = today.toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // Find existing iteration files for today
  const pattern = `${datePrefix}${sep}${baseName}${sep}*${ext}`;
  const existingFiles = glob.sync(pattern, { cwd: dir });
  
  // Get next iteration number
  const iterations = existingFiles
    .map(file => {
      const match = file.match(new RegExp(`${sep}(\\d+)${ext}$`));
      return match ? parseInt(match[1]) : 0;
    })
    .filter(num => !isNaN(num));
  
  const nextIteration = iterations.length > 0 ? Math.max(...iterations) + 1 : 1;
  const iterationNum = nextIteration.toString().padStart(2, '0');
  
  // Create output file path
  const outputFile = path.join(dir, `${datePrefix}${sep}${baseName}${sep}${iterationNum}${ext}`);
  
  // Ensure directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Write the file
  fs.writeFileSync(outputFile, markdown);
  
  return outputFile;
}

module.exports = {
  formatEvaluationReport,
  writeOutput
};
