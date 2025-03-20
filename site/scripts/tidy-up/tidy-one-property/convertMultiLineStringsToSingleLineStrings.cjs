// ================================================
// Only run audits and corrections of YAML without typical
// YAML processing modules.  If there are corruptions we get a bunch of errors. 
// The idea is to find and correct corruptions so that we can use YAML processors in live code. 
// ================================================

const fs = require('fs');
const path = require('path');

// ================================================
// Configuration by the user
// ================================================

const helperFunctions = require('../../build-scripts/getKnownErrorsAndFixes.cjs').helperFunctions;
const knownErrorCases = require('../../build-scripts/getKnownErrorsAndFixes.cjs').knownErrorCases;

const TARGET_FILES = { targetDir: "site/src/content/tooling/" };
const REPORTS_DIR = "site/scripts/data-or-content-generation/fixes-needed/errors-processing/";

// ================================================
// Main function to process files
// Change the name of the function in this file to something that makes sense for your desired operation.
// The getUserOptions, getKnownErrorsAndFixes, and getReportingFormatForBuild.cjs are the SINGLE SOURCE OF TRUTH.
// Make sure developers nor coding assistants violate the DRY principle, always import 
// helper functions, regular expressions, and reporting templates. 
// ================================================

async function main() {
    const markdownFiles = [];
    
    // Walk directory recursively to find all markdown files
    const walkDir = (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                walkDir(fullPath);
            } else if (file.endsWith('.md')) {
                markdownFiles.push(fullPath);
            }
        }
    };
    walkDir(TARGET_FILES.targetDir);

    // Define the correction function
    async function convertMultiLineStrings(markdownContent, markdownFilePath) {
        const frontmatterData = helperFunctions.extractFrontmatter(markdownContent);
        if (!frontmatterData.success) {
            return helperFunctions.createErrorMessage(markdownFilePath, frontmatterData.error);
        }

        let modified = false;
        let newFrontmatter = frontmatterData.frontmatterString;
        const lines = newFrontmatter.split('\n');
        let i = 0;

        while (i < lines.length) {
            const line = lines[i];
            // Check if line starts with any of our target properties
            const propertyMatch = line.match(/^([^:\n]+):\s*(.*)$/);
            
            if (propertyMatch) {
                const [, key, initialValue] = propertyMatch;
                const values = [initialValue.trim()];
                let nextLine = i + 1;
                let isMultiLine = false;
                
                // Collect any continuation lines (either indented or direct newlines)
                while (nextLine < lines.length) {
                    const nextLineContent = lines[nextLine];
                    // Stop if we hit another property or a list item
                    if (nextLineContent.match(/^[^-\s].*?:/)) break;
                    if (nextLineContent.trim().startsWith('-')) break;
                    
                    // If it's an indented line or a direct continuation
                    if (nextLineContent.match(/^\s/) || !nextLineContent.includes(':')) {
                        values.push(nextLineContent.trim());
                        isMultiLine = true;
                        nextLine++;
                    } else {
                        break;
                    }
                }
                
                // If we found multiple lines, join them and replace
                if (isMultiLine) {
                    const singleLineValue = values.join(' ').replace(/\s+/g, ' ').trim();
                    lines.splice(i, nextLine - i, `${key}: ${singleLineValue}`);
                    modified = true;
                }
            }
            i++;
        }

        if (!modified) {
            return helperFunctions.createSuccessMessage(markdownFilePath, false);
        }

        newFrontmatter = lines.join('\n');
        const correctedContent = markdownContent.slice(0, frontmatterData.startIndex) +
            '---\n' + newFrontmatter + '\n---' +
            markdownContent.slice(frontmatterData.endIndex);

        return {
            ...helperFunctions.createSuccessMessage(markdownFilePath, true),
            content: correctedContent
        };
    }

    // Process files using the helper function
    const results = await helperFunctions.processMarkdownFiles(markdownFiles, convertMultiLineStrings);

    // Generate report using the template from single source of truth
    const today = new Date().toISOString().split('T')[0];
    let reportIndex = 1;
    let reportPath;
    
    do {
        const paddedIndex = String(reportIndex).padStart(2, '0');
        reportPath = path.join(REPORTS_DIR, `${today}_multi-line-strings-to-single-line-strings_${paddedIndex}.md`);
        reportIndex++;
    } while (fs.existsSync(reportPath));

    const errorCase = { reportName: 'Multi-Line Strings to Single Line Strings Report' };
    const filesProcessed = results.length;
    const namesOfFilesWithIssue = results.filter(r => r.hadIssue)
        .map(r => path.basename(r.filePath, '.md'));
    const namesOfFilesCorrected = results.filter(r => r.modified)
        .map(r => path.basename(r.filePath, '.md'));

    // Create report using the template
    const reportTemplate = `---
title: ${errorCase.reportName}
date: ${today}
---
## Summary of Files Processed
Files processed: ${filesProcessed}
Files with issue: ${namesOfFilesWithIssue.length}
Successful corrections: ${namesOfFilesCorrected.length}

### Files with Issues
${namesOfFilesWithIssue.map(file => `[[${file}]]`).join(', ')}

### Files Successfully Corrected
${namesOfFilesCorrected.map(file => `[[${file}]]`).join(', ')}
`;

    fs.writeFileSync(reportPath, reportTemplate);
}

// ================================================
// Run the main function
// ================================================
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});