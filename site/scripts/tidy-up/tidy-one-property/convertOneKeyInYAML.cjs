// ================================================
// Only run audits and corrections of YAML without typical
// YAML processing modules.  If there are corruptions we get a bunch of errors. 
// The idea is to find and correct corruptions so that we can use YAML processors in live code. 
// =======================

const fs = require('fs');
const path = require('path');

const helperFunctions = require('../build-scripts/getKnownErrorsAndFixes.cjs').helperFunctions;
const knownErrorCases = require('../build-scripts/getKnownErrorsAndFixes.cjs').knownErrorCases;
const singleIssueReportTemplate = require('../build-scripts/getReportingFormatForBuild.cjs').singleIssueReportTemplate;

// ================================================
// Configuration by the user
// ================================================
const keyToConvert = "github-url";
const keyToReplaceWith = "github_project_url";
const TARGET_FILES = { targetDir: "site/src/content/tooling/" };
const REPORTS_DIR = "site/scripts/data-or-content-generation/fixes-needed/errors-processing/";

// ================================================
// Pull in all Markdown files within the target directory
// Recursively walk the directory structure, capturing all .md files however nested. 
// Return an array of file paths.
// ================================================
async function main() {
    const markdownFiles = [];
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
    async function convertKey(markdownContent, markdownFilePath) {
        const frontmatterData = helperFunctions.extractFrontmatter(markdownContent);
        if (!frontmatterData.success) {
            return helperFunctions.createErrorMessage(markdownFilePath, frontmatterData.error);
        }

        const propertyRegex = new RegExp(`^${keyToConvert}:(.*)$`, 'm');
        const propertyMatch = frontmatterData.frontmatterString.match(propertyRegex);
        
        if (propertyMatch) {
            const [fullMatch, value] = propertyMatch;
            const correctedValue = `${keyToReplaceWith}: ${value.trim()}`;
            
            const newFrontmatter = frontmatterData.frontmatterString.replace(
                fullMatch,
                correctedValue
            );

            const correctedContent = markdownContent.slice(0, frontmatterData.startIndex) +
                '---\n' + newFrontmatter + '\n---' +
                markdownContent.slice(frontmatterData.endIndex);

            return {
                ...helperFunctions.createSuccessMessage(markdownFilePath, true),
                content: correctedContent
            };
        }

        return helperFunctions.createSuccessMessage(markdownFilePath, false);
    }

    // Process files using the helper function
    const results = await helperFunctions.processMarkdownFiles(markdownFiles, convertKey);

    // Generate report
    const today = new Date().toISOString().split('T')[0];
    const reportName = 'Property-Rename-Report';
    let reportIndex = 1;
    let reportPath;
    
    do {
        const paddedIndex = String(reportIndex).padStart(2, '0');
        reportPath = path.join(REPORTS_DIR, `${today}_${reportName}_${paddedIndex}.md`);
        reportIndex++;
    } while (fs.existsSync(reportPath));

    const filesProcessed = results.length;
    const namesOfFilesWithIssue = results.filter(r => r.hadIssue).map(r => r.filePath);
    const namesOfFilesCorrected = results.filter(r => r.modified).map(r => r.filePath);

    const report = singleIssueReportTemplate
        .replace('${errorCase.reportName}', reportName)
        .replace('${today}', today)
        .replace('${filesProcessed}', filesProcessed)
        .replace('${namesOfFilesWithIssue.length}', namesOfFilesWithIssue.length)
        .replace('${namesOfFilesCorrected.length}', namesOfFilesCorrected.length)
        .replace('${namesOfFilesWithIssue.map(file => `[[${path.basename(file, \'.md\')}]]`).join(\', \')}', 
            namesOfFilesWithIssue.map(file => `[[${path.basename(file, '.md')}]]`).join(', '))
        .replace('${namesOfFilesCorrected.map(file => `[[${path.basename(file, \'.md\')}]]`).join(\', \')}',
            namesOfFilesCorrected.map(file => `[[${path.basename(file, '.md')}]]`).join(', '));

    fs.writeFileSync(reportPath, report);
}

// ================================================
// Run the main function
// ================================================
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});