const fs = require('fs');
const path = require('path');

// ======================================================================
// USER CONFIGURATION OPTIONS
// ======================================================================

// Mode options: 'sample', 'specific', 'all'
// - 'sample': Process a random sample of corrupted files (uses MAX_SAMPLE_SIZE)
// - 'specific': Process only the files listed in SPECIFIC_FILES_TO_PROCESS
// - 'all': Process all corrupted files found in the report
const PROCESSING_MODE = 'all';

// Maximum number of files to process when in 'sample' mode
const MAX_SAMPLE_SIZE = 5;

// Specific files to process when in 'specific' mode (relative or absolute paths)
const SPECIFIC_FILES_TO_PROCESS = [
    // Include files with known severe issues
    '/Users/mpstaton/code/lossless/202503_lossless-public/site/src/content/tooling/AI-Toolkit/Agentic AI/smolagents.md',
    '/Users/mpstaton/code/lossless/202503_lossless-public/site/src/content/tooling/AI-Toolkit/Agentic AI/Pydantic AI.md',
    '/Users/mpstaton/code/lossless/202503_lossless-public/site/src/content/tooling/AI-Toolkit/Agentic AI/Lindy AI.md'
];

// Properties to fix and the correction method to apply
// Available correction methods:
// - 'assureQuotesOrReplaceLineAndSurroundValueWithQuotes': For properties with values containing colons
// - 'replaceWithSimpleStringNoQuotes': For properties with block scalar indicators
// - 'cleanExtraSpacesInProperty': For properties with extra spaces before values
const PROPERTIES_TO_FIX = [
    // Error messages that might contain colons
    { key: 'og_error_message', method: 'assureQuotesOrReplaceLineAndSurroundValueWithQuotes' },
    { key: 'jina_error', method: 'assureQuotesOrReplaceLineAndSurroundValueWithQuotes' },
    
    // URLs and other properties that might have block scalar issues
    { key: 'title', method: 'replaceWithSimpleStringNoQuotes' },
    { key: 'description', method: 'replaceWithSimpleStringNoQuotes' },
    { key: 'url', method: 'cleanExtraSpacesInProperty' },
    { key: 'image', method: 'cleanExtraSpacesInProperty' },
    { key: 'og_screenshot_url', method: 'cleanExtraSpacesInProperty' },
    { key: 'favicon', method: 'cleanExtraSpacesInProperty' },
    
    // Additional properties that commonly have formatting issues
    { key: 'date', method: 'cleanExtraSpacesInProperty' },
    { key: 'author', method: 'cleanExtraSpacesInProperty' },
    { key: 'category', method: 'cleanExtraSpacesInProperty' },
    { key: 'site_uuid', method: 'cleanExtraSpacesInProperty' }
    // Add more properties as needed
];

// ======================================================================
// FILE PATHS
// ======================================================================

// Input file containing the list of corrupted files
const REPORT_INPUT_PATH = path.resolve(process.cwd(), 'scripts/data-or-content-generation/fixes-needed/Corrupted-Frontmatter-List.md');

// Output file for the list of fixed files
const TARGET_OUTPUT_FILE_PATH = path.resolve(process.cwd(), 'scripts/data-or-content-generation/fixes-needed/Completed-Glitch-Corrections.md');

// ======================================================================
// IMPLEMENTATION - No need to modify below this line
// ======================================================================

// Functions to apply to different types of YAML glitches
const GLITCH_CORRECTIONS = {
    // For error messages that contain colons and need to be quoted
    assureQuotesOrReplaceLineAndSurroundValueWithQuotes: (line, key) => {
        // Extract the value after the key
        const keyPattern = new RegExp(`^(${key}:\\s*)(.*)$`, 'm');
        const match = line.match(keyPattern);
        
        if (!match) return line;
        
        const [fullLine, keyPart, value] = match;
        const trimmedValue = value.trim();
        
        // Case 1: Value is already surrounded by double quotes - check for double quotes
        if (/^".*"$/.test(trimmedValue)) {
            // Check for double double quotes - e.g. ""value""
            if (/^"".*""$/.test(trimmedValue)) {
                const innerContent = trimmedValue.slice(2, -2);
                return `${keyPart}"${innerContent}"`;
            }
            return line;
        }
        
        // Case 2: Value is surrounded by single quotes - replace with double quotes
        if (/^'.*'$/.test(trimmedValue)) {
            // Extract the content inside single quotes
            const innerContent = trimmedValue.slice(1, -1);
            // Escape any double quotes in the content
            const escapedContent = innerContent.replace(/"/g, '\\"');
            // Surround with double quotes
            return `${keyPart}"${escapedContent}"`;
        }
        
        // Case 3: Value contains a colon but no quotes - add double quotes
        if (trimmedValue.includes(':')) {
            return `${keyPart}"${trimmedValue.replace(/"/g, '\\"')}"`;
        }
        
        return line;
    },
    
    // For block scalar values that should be simple strings
    replaceWithSimpleStringNoQuotes: (content, key) => {
        // Find various block scalar patterns more comprehensively
        const blockScalarPatterns = [
            // Standard block scalar notation
            new RegExp(`^(${key}:)\\s*(>-|>|\\|[-]?)\\s*$(\\n[ \\t]+.*)*`, 'm'),
            // Multiline without explicit block scalar
            new RegExp(`^(${key}:)\\s*$(\\n[ \\t]+.*)+`, 'm')
        ];
        
        let match = null;
        for (const pattern of blockScalarPatterns) {
            match = content.match(pattern);
            if (match) break;
        }
        
        if (!match) return content;
        
        // Extract the block content
        const lines = match[0].split('\n');
        const keyPart = match[1]; // Just the "key:" part
        
        // Get the indented content and join as a single line
        let valueLines = lines.slice(1);
        
        // Process each line to handle spacing correctly
        let combinedValue = valueLines
            // Trim each line
            .map(line => line.trim())
            // Replace escaped newlines with spaces
            .map(line => line.replace(/\\n/g, ' '))
            // Join lines with spaces
            .join(' ')
            // Normalize multiple spaces
            .replace(/\s{2,}/g, ' ')
            // Trim the final result
            .trim();
            
        // Additional cleaning for any remaining escape characters that might need spaces
        combinedValue = combinedValue
            // Replace other common escaped characters that might need spacing
            .replace(/\\t/g, ' ')
            // Fix cases where punctuation might not need spaces
            .replace(/ ([,.!?:;])(\s|$)/g, '$1$2');
        
        // Replace the block scalar with a simple string, ensuring exactly one space after the colon
        return content.replace(match[0], `${keyPart} ${combinedValue}`);
    },
    
    // For cleaning up extra spaces in front of property values
    cleanExtraSpacesInProperty: (line, key) => {
        // Match key and any number of spaces, followed by the value
        const keyPattern = new RegExp(`^(${key}:)(\\s*)(.*?)$`, 'm');
        const match = line.match(keyPattern);
        
        if (!match) return line;
        
        const [fullLine, keyPart, spaces, value] = match;
        const trimmedValue = value.trim();
        
        // If there are multiple spaces (more than one), fix it
        if (spaces.length > 1) {
            return `${keyPart} ${trimmedValue}`;
        }
        
        // If there's a newline in the value and it's not quoted, fix it
        if (trimmedValue.includes('\n') && !(/^["'].*["']$/.test(trimmedValue))) {
            // If it contains a newline, make it a simple string
            return `${keyPart} ${trimmedValue.replace(/\n/g, ' ')}`;
        }
        
        return line;
    }
};

// Track which files were evaluated and which ones were fixed
const evaluatedFiles = new Set();
const fixedFiles = new Map(); // Map of filePath -> Set of fixed properties

/**
 * Process a single file to fix a specific type of glitch
 * @param {string} filePath - Path to the file to process
 * @param {string} glitchKey - Key of the YAML field to fix
 * @param {string} correctionType - Type of correction to apply
 * @returns {boolean} Whether the file was modified
 */
function cleanFrontmatterGlitch(filePath, glitchKey, correctionType) {
    try {
        console.log(`\nChecking ${filePath} for ${glitchKey}...`);
        
        // Add to evaluated files
        evaluatedFiles.add(filePath);

        // Read the file
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check if the file has YAML frontmatter
        if (!content.startsWith('---\n')) {
            console.log(`SKIPPED: ${filePath} - No YAML frontmatter`);
            return false;
        }
        
        // Extract the frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) {
            console.log(`SKIPPED: ${filePath} - Malformed YAML frontmatter`);
            return false;
        }
        
        const originalFrontmatter = frontmatterMatch[0];
        const frontmatter = frontmatterMatch[1];
        
        // More flexible pattern to find the property regardless of spacing
        const keyPattern = new RegExp(`^\\s*${glitchKey}\\s*:`, 'm');
        if (!keyPattern.test(frontmatter)) {
            console.log(`SKIPPED: ${filePath} - No ${glitchKey} property found in frontmatter`);
            return false;
        }
        
        // Debug: Show matched property and surrounding context
        const contextLines = frontmatter.split('\n');
        for (let i = 0; i < contextLines.length; i++) {
            if (keyPattern.test(contextLines[i])) {
                console.log(`Found property at line ${i+1}: ${contextLines[i]}`);
                // Show a few lines of context
                const start = Math.max(0, i-2);
                const end = Math.min(contextLines.length, i+3);
                console.log("Context:");
                for (let j = start; j < end; j++) {
                    console.log(`${j === i ? '> ' : '  '}${contextLines[j]}`);
                }
                break;
            }
        }
        
        // Apply the correction
        let newContent;
        
        switch (correctionType) {
            case 'assureQuotesOrReplaceLineAndSurroundValueWithQuotes':
                // Process each line, looking for the key
                const lines = frontmatter.split('\n');
                const newLines = lines.map(line => {
                    if (line.trim().startsWith(`${glitchKey}:`)) {
                        const original = line;
                        const fixed = GLITCH_CORRECTIONS.assureQuotesOrReplaceLineAndSurroundValueWithQuotes(line, glitchKey);
                        if (original !== fixed) {
                            console.log(`Fixing line: "${original}" => "${fixed}"`);
                        }
                        return fixed;
                    }
                    return line;
                });
                
                // Reconstruct the frontmatter
                const newFrontmatter = newLines.join('\n');
                newContent = content.replace(originalFrontmatter, `---\n${newFrontmatter}\n---`);
                break;
                
            case 'replaceWithSimpleStringNoQuotes':
                newContent = GLITCH_CORRECTIONS.replaceWithSimpleStringNoQuotes(content, glitchKey);
                break;
                
            case 'cleanExtraSpacesInProperty':
                // Process each line, looking for the key
                const spaceLines = frontmatter.split('\n');
                const newSpaceLines = spaceLines.map(line => {
                    if (line.trim().startsWith(`${glitchKey}:`)) {
                        const original = line;
                        const fixed = GLITCH_CORRECTIONS.cleanExtraSpacesInProperty(line, glitchKey);
                        if (original !== fixed) {
                            console.log(`Fixing line: "${original}" => "${fixed}"`);
                        }
                        return fixed;
                    }
                    return line;
                });
                
                // Reconstruct the frontmatter
                const newSpaceFrontmatter = newSpaceLines.join('\n');
                newContent = content.replace(originalFrontmatter, `---\n${newSpaceFrontmatter}\n---`);
                break;
                
            default:
                console.error(`Unknown correction type: ${correctionType}`);
                return false;
        }
        
        // Check if anything was changed
        if (newContent === content) {
            console.log(`SKIPPED: ${filePath} - No changes needed for ${glitchKey}`);
            return false;
        }
        
        // Write the modified content back to the file
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`FIXED: ${filePath} - Fixed ${glitchKey}`);
        
        // Mark as fixed
        if (!fixedFiles.has(filePath)) {
            fixedFiles.set(filePath, new Set());
        }
        fixedFiles.get(filePath).add(glitchKey);
        
        return true;
    } catch (error) {
        console.error(`ERROR processing ${filePath}: ${error.message}`);
        return false;
    }
}

/**
 * Get the list of files to process based on the configured mode
 * @param {Array} allCorruptedFiles - All corrupted files from the report
 * @returns {Array} Files to process
 */
function getFilesToProcess(allCorruptedFiles) {
    switch (PROCESSING_MODE) {
        case 'sample':
            // Get a random sample of files
            const sampleSize = Math.min(MAX_SAMPLE_SIZE, allCorruptedFiles.length);
            const shuffled = [...allCorruptedFiles].sort(() => 0.5 - Math.random());
            const sampleFiles = shuffled.slice(0, sampleSize);
            console.log(`\nSelected ${sampleFiles.length} sample files:`);
            sampleFiles.forEach(file => console.log(`- ${file.path}`));
            return sampleFiles;
            
        case 'specific':
            // Filter the corrupted files to only include the specific files
            console.log(`\nLooking for these specific files:`);
            SPECIFIC_FILES_TO_PROCESS.forEach(path => console.log(`- ${path}`));
            
            const specificFiles = allCorruptedFiles.filter(file => 
                SPECIFIC_FILES_TO_PROCESS.some(specificPath => 
                    file.path.includes(specificPath) || specificPath.includes(file.path)
                )
            );
            
            console.log(`\nFound ${specificFiles.length} specified files in the corrupted files list:`);
            specificFiles.forEach(file => console.log(`- ${file.path}`));
            
            return specificFiles;
            
        case 'all':
        default:
            console.log(`\nProcessing all ${allCorruptedFiles.length} corrupted files`);
            return allCorruptedFiles;
    }
}

/**
 * Read the report of corrupted files and fix the specified glitches
 */
function processCorruptedFiles() {
    try {
        // Check if report file exists
        if (!fs.existsSync(REPORT_INPUT_PATH)) {
            console.error(`Report file not found: ${REPORT_INPUT_PATH}`);
            console.log(`Current working directory: ${process.cwd()}`);
            console.log('Please make sure the report has been generated first.');
            return;
        }

        console.log(`Reading report from: ${REPORT_INPUT_PATH}`);
        
        // Read the report file
        const reportContent = fs.readFileSync(REPORT_INPUT_PATH, 'utf8');
        
        // Extract the file paths
        const filePathPattern = /^- (.*?) \(Issues: (.*?)\)$/gm;
        let match;
        let allCorruptedFiles = [];
        
        while ((match = filePathPattern.exec(reportContent)) !== null) {
            const filePath = match[1];
            const issues = match[2];
            
            // Verify the file exists
            if (fs.existsSync(filePath)) {
                allCorruptedFiles.push({
                    path: filePath,
                    issues: issues
                });
            } else {
                console.warn(`File does not exist: ${filePath}`);
            }
        }
        
        console.log(`Found ${allCorruptedFiles.length} corrupted files in the report.`);
        
        if (allCorruptedFiles.length === 0) {
            console.log('No files to process. Exiting.');
            return;
        }
        
        // Get the files to process based on the configured mode
        const filesToProcess = getFilesToProcess(allCorruptedFiles);
        console.log(`Will process ${filesToProcess.length} files in '${PROCESSING_MODE}' mode.`);
        
        // Process each property for each file
        for (const propertyConfig of PROPERTIES_TO_FIX) {
            const { key, method } = propertyConfig;
            console.log(`\nProcessing property: ${key} with method: ${method}`);
            
            let count = 0;
            let fixedCount = 0;
            
            for (const file of filesToProcess) {
                count++;
                const fixed = cleanFrontmatterGlitch(file.path, key, method);
                if (fixed) {
                    fixedCount++;
                }
                
                // Log progress for large batches
                if (count % 20 === 0) {
                    console.log(`Processed ${count}/${filesToProcess.length} files...`);
                }
            }
            
            console.log(`\nProcessed ${count} files for property '${key}'`);
            console.log(`Fixed ${fixedCount} files with '${key}' issues`);
        }
        
        // Write the summary of fixed files
        writeFixedFilesReport();
        
    } catch (error) {
        console.error(`Error processing corrupted files: ${error.message}`);
        console.error(error.stack);
    }
}

/**
 * Ensure a directory exists, creating it if needed
 * @param {string} dirPath - Path to the directory
 */
function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        console.log(`Creating directory: ${dirPath}`);
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

/**
 * Write a report of all files that were fixed
 */
function writeFixedFilesReport() {
    const fixedFilesCount = fixedFiles.size;
    const fixedPropertiesMap = new Map(); // Property -> count
    
    // Count how many times each property was fixed
    for (const [_, properties] of fixedFiles.entries()) {
        for (const property of properties) {
            fixedPropertiesMap.set(property, (fixedPropertiesMap.get(property) || 0) + 1);
        }
    }
    
    // Build the report content
    let reportContent = `# YAML Glitch Corrections
Last updated: ${new Date().toISOString()}

Processing mode: ${PROCESSING_MODE}
${PROCESSING_MODE === 'sample' ? `Sample size: ${MAX_SAMPLE_SIZE}` : ''}
${PROCESSING_MODE === 'specific' ? `Specific files: ${SPECIFIC_FILES_TO_PROCESS.length}` : ''}

## Properties Checked
${PROPERTIES_TO_FIX.map(prop => `- ${prop.key} (${prop.method})`).join('\n')}

## Files Evaluated (${evaluatedFiles.size})
${Array.from(evaluatedFiles).map(file => `- ${file}`).join('\n')}

## Summary of Fixes
- Total files fixed: ${fixedFilesCount}
- Total properties fixed: ${Array.from(fixedPropertiesMap.entries()).reduce((sum, [_, count]) => sum + count, 0)}

## Properties Successfully Fixed
${Array.from(fixedPropertiesMap.entries())
    .map(([property, count]) => `- ${property}: ${count} instances`)
    .join('\n')}

## Files Modified
`;

    if (fixedFilesCount > 0) {
        for (const [filePath, properties] of fixedFiles.entries()) {
            reportContent += `\n### ${filePath}\n`;
            reportContent += `Fixed properties:\n`;
            for (const property of properties) {
                reportContent += `- ${property}\n`;
            }
        }
    } else {
        reportContent += "\nNo files were modified.";
    }
    
    // Make sure the directory exists before writing the file
    const targetDir = path.dirname(TARGET_OUTPUT_FILE_PATH);
    ensureDirectoryExists(targetDir);
    
    // Write the report file
    try {
        fs.writeFileSync(TARGET_OUTPUT_FILE_PATH, reportContent, 'utf8');
        console.log(`\nFix report written to ${TARGET_OUTPUT_FILE_PATH}`);
    } catch (error) {
        console.error(`Error writing report to ${TARGET_OUTPUT_FILE_PATH}:`, error);
    }
}

// Run the script
console.log('Starting to fix YAML glitches...');
processCorruptedFiles();