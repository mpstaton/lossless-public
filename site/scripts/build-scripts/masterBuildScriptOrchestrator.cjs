const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Import configurations and evaluation functions
const USER_OPTIONS = require('./getUserOptionsForBuild.cjs');
const { evaluateFile } = require('./evaluateTargetContent.cjs');

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
  const ext = path.extname(baseFilePath);
  const baseName = path.basename(baseFilePath, ext);
  
  // Find existing iteration files
  const pattern = `${baseName}_*${ext}`;
  const existingFiles = glob.sync(pattern, { cwd: dir });
  
  // Extract existing iteration numbers
  const iterations = existingFiles
    .map(file => {
      const match = file.match(/_(\d+)\.md$/);
      return match ? parseInt(match[1]) : 0;
    })
    .filter(num => !isNaN(num));
  
  // Get next iteration number
  const nextIteration = iterations.length > 0 ? Math.max(...iterations) + 1 : 1;
  const iterationNum = nextIteration.toString().padStart(2, '0');
  
  return path.join(dir, `${baseName}_${iterationNum}${ext}`);
}

/**
 * Format evaluation results as markdown
 * @param {Object} results - Evaluation results by file
 * @returns {string} Formatted markdown content
 */
function formatEvaluationResults(results) {
  const timestamp = new Date().toISOString();
  let markdown = `---
title: Content Evaluation Results
date: ${timestamp}
type: evaluation-report
---

# Content Evaluation Results
Generated: ${timestamp}

## Summary
Total files evaluated: ${Object.keys(results).length}

## Detailed Results\n\n`;

  for (const [filePath, evaluation] of Object.entries(results)) {
    if (!evaluation) continue;

    markdown += `### ${path.basename(filePath)}\n`;
    markdown += `Path: \`${filePath}\`\n\n`;

    // YAML Evaluation
    markdown += `#### YAML/Frontmatter Status\n`;
    markdown += `- Needs UUID: ${evaluation.yaml.needsUUID}\n`;
    markdown += `- Needs Hyphen Conversion: ${evaluation.yaml.needsHyphenConversion}\n`;
    markdown += `- Needs Tag Formatting: ${evaluation.yaml.needsTagFormatting}\n`;
    markdown += `- Has Lowercase Tags: ${evaluation.yaml.hasLowercaseTags}\n`;
    markdown += `- Needs URL Check: ${evaluation.yaml.needsURLCheck}\n`;
    markdown += `- Processing Required: ${evaluation.yaml.needsProcessing}\n\n`;

    // OpenGraph Evaluation
    markdown += `#### OpenGraph Status\n`;
    markdown += `- Needs Fetch: ${evaluation.openGraph.needsFetch}\n`;
    markdown += `- Needs Screenshot: ${evaluation.openGraph.needsScreenshot}\n`;
    markdown += `- Has Errors: ${evaluation.openGraph.hasErrors}\n`;
    markdown += `- Processing Required: ${evaluation.openGraph.needsProcessing}\n\n`;

    // YouTube Evaluation
    markdown += `#### YouTube Content Status\n`;
    markdown += `- Found URLs: ${evaluation.youtube.youtubeUrls.length}\n`;
    markdown += `- Needs Footnotes Section: ${evaluation.youtube.needsFootnotesSection}\n`;
    markdown += `- Needs Registry Update: ${evaluation.youtube.needsRegistryUpdate}\n`;
    markdown += `- Processing Required: ${evaluation.youtube.needsProcessing}\n\n`;

    if (evaluation.youtube.youtubeUrls.length > 0) {
      markdown += `##### YouTube URLs Evaluation\n`;
      for (const [url, urlEval] of Object.entries(evaluation.youtube.urlEvaluations)) {
        markdown += `URL: ${url}\n`;
        markdown += `- Has Iframe: ${urlEval.hasIframe}\n`;
        markdown += `- Needs Footnote: ${urlEval.needsFootnote}\n`;
        markdown += `- Needs Footnote Definition: ${urlEval.needsFootnoteDefinition}\n`;
        markdown += `- In Registry: ${urlEval.isInRegistry}\n`;
        markdown += `- Needs Registry Update: ${urlEval.needsRegistryUpdate}\n\n`;
      }
    }

    markdown += `---\n\n`;
  }

  return markdown;
}

// ============================================================================
// Main Orchestration
// ============================================================================

async function main() {
  try {
    console.log('Starting content evaluation...');

    // Get all content files
    const contentPath = USER_OPTIONS.directories.content;
    const excludeDirs = USER_OPTIONS.directories.excludeUrlCheck;
    
    // Create glob pattern that excludes specified directories
    const excludePattern = excludeDirs.length > 0 
      ? `!(${excludeDirs.join('|')})` 
      : '*';
    const globPattern = path.join(contentPath, '**', excludePattern, '*.md');

    console.log(`Searching for files with pattern: ${globPattern}`);
    const files = await glob(globPattern);
    console.log(`Found ${files.length} files to evaluate`);

    // Evaluate each file
    const evaluationResults = {};
    for (const file of files) {
      console.log(`Evaluating: ${file}`);
      const result = evaluateFile(file);
      if (result) {
        evaluationResults[file] = result;
      }
    }

    // Generate output file path with iteration number
    const outputFile = getNextIterationFilePath(USER_OPTIONS.evaluationOutputFile);
    
    // Format and write results
    const markdown = formatEvaluationResults(evaluationResults);
    
    // Ensure directory exists
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write the file
    fs.writeFileSync(outputFile, markdown);
    console.log(`Evaluation results written to: ${outputFile}`);

  } catch (error) {
    console.error('Error in build script orchestration:', error);
    process.exit(1);
  }
}

// Run the script
main();
