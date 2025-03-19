const fs = require('fs').promises;
const path = require('path'); 
const { detectUncleanURLs } = require('/Users/mpstaton/code/lossless/202503_lossless-public/site/scripts/tidy-up/tidy-one-property/assure-clean-url-properties/detectUncleanURLs.cjs');
const { report_data_accumulator, writeReport } = require('/Users/mpstaton/code/lossless/202503_lossless-public/site/scripts/tidy-up/tidy-one-property/assure-clean-url-properties/reportQuoteCharactersOfAnyType.cjs');

/**
 * Process a single markdown file for URL property validation
 * Following DRY principles and Single Source of Truth
 * 
 * Called by:
 * 1. processDirectory() in this file at line 57
 * 2. /Users/mpstaton/code/lossless/202503_lossless-public/site/scripts/tidy-up/tidy-one-property/assure-clean-url-properties/test-url-detection.cjs for individual file testing
 * 
 * @param {string} filePath - Absolute path to markdown file
 * @param {Object} reportData - Accumulator for report data
 * @returns {Promise<Object>} Updated report data
 */
async function processOneFile(filePath, reportData) {
    try {
        // Read file content
        const content = await fs.readFile(filePath, 'utf8');
        
        // Increment total files counter
        reportData.content.summary.total_files++;

        // Detect URL issues
        const detectionResult = await detectUncleanURLs(content, filePath);
        
        // If issues found, add to report
        if (detectionResult.detectedIssues.length > 0) {
            reportData.content.summary.files_with_issues++;
            reportData.content.details.yaml_lines_with_urls_that_have_quote_characters_at_start_of_value.push({
                filePath,
                issues: detectionResult.detectedIssues
            });
        }

        return reportData;
    } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
        return reportData;
    }
}

/**
 * Process a directory of markdown files recursively
 * Follows single file processing principle from Fix-one-YAML-Issue-at-a-Time prompt
 * 
 * Called by:
 * 1. Command line from project root: node site/scripts/tidy-up/tidy-one-property/assure-clean-url-properties/test-url-detection.cjs
 * 
 * @param {string} directoryPath - Path to directory containing markdown files
 * @returns {Promise<void>}
 */
async function processDirectory(directoryPath) {
    try {
        // Initialize report data
        const reportData = { ...report_data_accumulator };
        
        // Process directory recursively
        async function processDir(dir) {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    await processDir(fullPath);
                } else if (entry.isFile() && entry.name.endsWith('.md')) {
                    await processOneFile(fullPath, reportData);
                }
            }
        }

        // Start recursive processing
        await processDir(directoryPath);

        // Write final report
        await writeReport(reportData);

    } catch (error) {
        console.error('Error processing directory:', error);
    }
}

module.exports = {
    processOneFile,
    processDirectory
};