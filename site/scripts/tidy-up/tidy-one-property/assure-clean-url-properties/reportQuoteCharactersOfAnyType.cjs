const path = require('path');
const fs = require('fs');

// Report destination with absolute path from root
const TARGET_REPORT = path.resolve('/Users/mpstaton/code/lossless/202503_lossless-public/site/src/content/changelog--content/reports/2025-03-19_unclean-url-report_01.md');

// Data structure for accumulating report data
const report_data_accumulator = {
    content: {
        summary: {
            total_files: 0,
            files_with_issues: 0
        },
        details: {
            yaml_lines_with_urls_that_have_quote_characters_at_start_of_value: []
        }
    }
};

/**
 * Generate report content from data
 * @param {Object} report - Report data object
 * @returns {string} Formatted report content
 */
function generateReportContent(report) {
    const timestamp = new Date().toISOString();
    const fileDetails = report.content.details.yaml_lines_with_urls_that_have_quote_characters_at_start_of_value
        .map(file => {
            const fileName = path.basename(file.filePath, '.md');
            const issueDetails = file.issues
                .map(issue => [
                    `Property: \`${issue.propertyName}\``,
                    `Line: \`${issue.line}\``,
                    `Quote characters found: \`${issue.prefix}\``,
                    `URL: \`${issue.url}\``,
                ].join('\n')).join('\n\n');

            return [
                `#### [[${fileName}]]`,
                `File: \`${file.filePath}\``,
                issueDetails
            ].join('\n');
        }).join('\n\n');

    return `---
report_title: "URL Property Quote Character Detection Report"
date_generated: "${timestamp}"
tags:
- YAML-Validation
- Error-Handling
- Build-Scripts
- URL-Properties
---

## Summary
Total files processed: ${report.content.summary.total_files}
Files with URL quote issues: ${report.content.summary.files_with_issues}

## Details

### Files with quote characters found before start of url property:
${fileDetails}`;
}

/**
 * Writes the report to the target file
 * @param {Object} reportData - Accumulated report data
 */
async function writeReport(reportData) {
    try {
        const reportContent = generateReportContent(reportData);
        await fs.promises.writeFile(TARGET_REPORT, reportContent, 'utf8');
        console.log(`Report written to ${TARGET_REPORT}`);
    } catch (error) {
        console.error('Error writing report:', error);
    }
}

module.exports = {
    report_data_accumulator,
    writeReport
};
