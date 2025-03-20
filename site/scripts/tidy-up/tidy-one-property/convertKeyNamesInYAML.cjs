// ================================================
// Only run audits and corrections of YAML without typical
// YAML processing modules.  If there are corruptions we get a bunch of errors. 
// The idea is to find and correct corruptions so that we can use YAML processors in live code. 
// ================================================

const fs = require('fs');
const path = require('path');

// ================================================
// Configuration by the user
// All the configuration is done in this section
// NEVER change the configuration in this section.
// ================================================

const helperFunctions = require('../../build-scripts/getKnownErrorsAndFixes.cjs').helperFunctions;
const knownErrorCases = require('../../build-scripts/getKnownErrorsAndFixes.cjs').knownErrorCases;

const TARGET_FILES = { targetDir: "site/src/content/tooling" };
const REPORTS_DIR = "site/scripts/data-or-content-generation/fixes-needed/errors-processing/";

// ================================================
// Key replacement configuration
// ================================================

/*
//  All undesiredSyntax properties should be an identified through a full and complete regex match.  
//  Partial regex matches will create mission critical, epic problems that will cause my company
//  hundreds of man hours of extra work.  

//  We will replace the undesiredSyntax with the desiredSyntax..  That's it.  Shouldbe simple.  
//  There should be no hard validation rules. Many files will have none of these cases, some will have one
//  some may have all.  

// Any user should be able to run this script with any sit of key replacements.  So, the script must have the 
// flexibility to handle any number of key replacements.
*/

const keyReplacementPairs = {
    case01: {
        undesiredSyntax: "github-url",
        desiredSyntax: "github_repo_url",
        reportName: "Convert-GitHub-URL-Keys"
    },
    case02: {
        undesiredSyntax: "github_url",
        desiredSyntax: "github_repo_url",
        reportName: "Convert-GitHub-URL-Keys"
    },
    case03: {
        undesiredSyntax: "last_jina_request",
        desiredSyntax: "jina_last_request",
        reportName: "Convert-Jina-Request-Keys"
    }
};

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

    // Process each key replacement pair
    for (const [caseId, replacementPair] of Object.entries(keyReplacementPairs)) {
        console.log(`Processing ${caseId}: ${replacementPair.undesiredSyntax} -> ${replacementPair.desiredSyntax}`);
        
        // Define the correction function for this key replacement
        async function convertKeyNames(markdownContent, markdownFilePath) {
            const frontmatterData = helperFunctions.extractFrontmatter(markdownContent);
            if (!frontmatterData.success) {
                return helperFunctions.createErrorMessage(markdownFilePath, frontmatterData.error);
            }

            let modified = false;
            let newFrontmatter = frontmatterData.frontmatterString;
            const lines = newFrontmatter.split('\n');
            const updatedLines = [];

            for (const line of lines) {
                // Check for EXACT match of the undesired key syntax
                if (line.trim().startsWith(replacementPair.undesiredSyntax + ':')) {
                    const updatedLine = line.replace(
                        new RegExp(`^${replacementPair.undesiredSyntax}:`), 
                        `${replacementPair.desiredSyntax}:`
                    );
                    updatedLines.push(updatedLine);
                    modified = true;
                } else {
                    updatedLines.push(line);
                }
            }

            if (!modified) {
                return helperFunctions.createSuccessMessage(markdownFilePath, false);
            }

            newFrontmatter = updatedLines.join('\n');
            const correctedContent = markdownContent.slice(0, frontmatterData.startIndex) +
                '---\n' + newFrontmatter + '\n---' +
                markdownContent.slice(frontmatterData.endIndex);

            return {
                ...helperFunctions.createSuccessMessage(markdownFilePath, true),
                content: correctedContent
            };
        }

        // Process files using the helper function
        const results = await helperFunctions.processMarkdownFiles(markdownFiles, convertKeyNames);

        // Generate report using the template
        const today = new Date().toISOString().split('T')[0];
        let reportIndex = 1;
        let reportPath;
        
        do {
            const paddedIndex = String(reportIndex).padStart(2, '0');
            reportPath = path.join(REPORTS_DIR, `${today}_${replacementPair.reportName}_${paddedIndex}.md`);
            reportIndex++;
        } while (fs.existsSync(reportPath));

        const errorCase = { reportName: replacementPair.reportName };
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
        
        // Log progress
        console.log(`
Processing complete for ${replacementPair.reportName}:
- Total files processed: ${filesProcessed}
- Files with issues: ${namesOfFilesWithIssue.length}
- Files corrected: ${namesOfFilesCorrected.length}
Report written to: ${reportPath}
`);
    }
}

// ================================================
// Run the main function
// ================================================
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});