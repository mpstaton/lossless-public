const fs = require('fs');
const path = require('path');

// ======================================================================
// USER CONFIGURATION OPTIONS
// ======================================================================

// Mode options: 'sample', 'specific', 'all'
// - 'sample': Process a random sample of corrupted files (uses MAX_SAMPLE_SIZE)
// - 'specific': Process only the files listed in SPECIFIC_FILES_TO_PROCESS
// - 'all': Process all corrupted files found in the report
const PROCESSING_MODE = 'sample';

// Maximum number of files to process when in 'sample' mode
const MAX_SAMPLE_SIZE = 5;

// Specific files to process when in 'specific' mode (relative or absolute paths)
const SPECIFIC_FILES_TO_PROCESS = [
    '/Users/mpstaton/code/lossless/202503_lossless-public/site/src/content/tooling/Web Browsers/Firefox.md',
    '/Users/mpstaton/code/lossless/202503_lossless-public/site/src/content/tooling/Web Browsers/Chrome.md'
];

// Properties to fix and the correction method to apply
// Available correction methods:
// - 'assureQuotesOrReplaceLineAndSurroundValueWithQuotes': For properties with values containing colons
// - 'replaceWithSimpleStringNoQuotes': For properties with block scalar indicators
const PROPERTIES_TO_FIX = [
    { key: 'og_error_message', method: 'assureQuotesOrReplaceLineAndSurroundValueWithQuotes' },
    { key: 'jina_error', method: 'assureQuotesOrReplaceLineAndSurroundValueWithQuotes' },
    // Uncomment these when ready to process them
    // { key: 'description', method: 'replaceWithSimpleStringNoQuotes' },
    // { key: 'title', method: 'replaceWithSimpleStringNoQuotes' },
    // { key: 'site_description_cp', method: 'replaceWithSimpleStringNoQuotes' },
    // { key: 'site_title_cp', method: 'replaceWithSimpleStringNoQuotes' }
];

// ======================================================================
// FILE PATHS
// ======================================================================

// Output file for the list of fixed files
const TARGET_OUTPUT_FILE_PATH = './scripts/data-or-content-generation/fixes-needed/Completed-Glitch-Corrections.md';

// Input file containing the list of corrupted files
const REPORT_INPUT_PATH = './scripts/data-or-content-generation/fixes-needed/Corrupted-Frontmatter-List.md';

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
        
        // If value is already quoted, return as is
        if (/^".*"$/.test(value.trim())) return line;
        
        // If value contains a colon, quote it
        if (value.includes(':')) {
            return `${keyPart}"${value.replace(/"/g, '\\"')}"`;
        }
        
        return line;
    },
    
    // For block scalar values that should be simple strings
    replaceWithSimpleStringNoQuotes: (content, key) => {
        // Find the block scalar pattern for this key
        const blockScalarPattern = new RegExp(`^(${key}:\\s*)(>-|>|\\|[-]?)\\s*$(\\n[ \\t]+.*)*`, 'm');
        const match = content.match(blockScalarPattern);
        
        if (!match) return content;
        
        // Extract the block content
        const lines = match[0].split('\n');
        const keyLine = lines[0];
        
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
        
        // Replace the block scalar with a simple string
        return content.replace(match[0], `${key}: ${combinedValue}`);
    }
};

// Track which files we've fixed
const fixedFiles = new Set();

/**
 * Process a single file to fix a specific type of glitch
 * @param {string} filePath - Path to the file to process
 * @param {string} glitchKey - Key of the YAML field to fix
 * @param {string} correctionType - Type of correction to apply
 * @returns {boolean} Whether the file was modified
 */
function cleanFrontmatterGlitch(filePath, glitchKey, correctionType) {
    try {
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
        
        // Look for the glitch key in the frontmatter
        const keyPattern = new RegExp(`^${glitchKey}:.+`, 'm');
        if (!keyPattern.test(frontmatter)) {
            // Key not found, nothing to fix
            return false;
        }
        
        // Apply the correction
        let newContent;
        
        switch (correctionType) {
            case 'assureQuotesOrReplaceLineAndSurroundValueWithQuotes':
                // Process each line, looking for the key
                const lines = frontmatter.split('\n');
                const newLines = lines.map(line => {
                    if (line.trim().startsWith(`${glitchKey}:`)) {
                        return GLITCH_CORRECTIONS.assureQuotesOrReplaceLineAndSurroundValueWithQuotes(line, glitchKey);
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
                
            default:
                console.error(`Unknown correction type: ${correctionType}`);
                return false;
        }
        
        // Check if anything was changed
        if (newContent === content) {
            return false;
        }
        
        // Write the modified content back to the file
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`FIXED: ${filePath} - Fixed ${glitchKey}`);
        
        // Mark as fixed
        fixedFiles.add(filePath);
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
            return shuffled.slice(0, sampleSize);
            
        case 'specific':
            // Filter the corrupted files to only include the specific files
            return allCorruptedFiles.filter(file => 
                SPECIFIC_FILES_TO_PROCESS.some(specificPath => 
                    file.path.includes(specificPath) || specificPath.includes(file.path)
                )
            );
            
        case 'all':
        default:
            // Process all corrupted files
            return allCorruptedFiles;
    }
}

/**
 * Read the report of corrupted files and fix the specified glitches
 */
function processCorruptedFiles() {
    try {
        // Read the report file
        const reportContent = fs.readFileSync(REPORT_INPUT_PATH, 'utf8');
        
        // Extract the file paths
        const filePathPattern = /^- (.*?) \(Issues: (.*?)\)$/gm;
        let match;
        let allCorruptedFiles = [];
        
        while ((match = filePathPattern.exec(reportContent)) !== null) {
            const filePath = match[1];
            const issues = match[2];
            
            allCorruptedFiles.push({
                path: filePath,
                issues: issues
            });
        }
        
        console.log(`Found ${allCorruptedFiles.length} corrupted files in the report.`);
        
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
    }
}

/**
 * Write a report of all files that were fixed
 */
function writeFixedFilesReport() {
    const reportContent = `# YAML Glitch Corrections
Last updated: ${new Date().toISOString()}

Processing mode: ${PROCESSING_MODE}
${PROCESSING_MODE === 'sample' ? `Sample size: ${MAX_SAMPLE_SIZE}` : ''}
${PROCESSING_MODE === 'specific' ? `Specific files: ${SPECIFIC_FILES_TO_PROCESS.length}` : ''}

Properties fixed:
${PROPERTIES_TO_FIX.map(prop => `- ${prop.key} (${prop.method})`).join('\n')}

Fixed ${fixedFiles.size} files:

${Array.from(fixedFiles).map(file => `- ${file}`).join('\n')}
`;
    
    fs.writeFileSync(TARGET_OUTPUT_FILE_PATH, reportContent, 'utf8');
    console.log(`\nFix report written to ${TARGET_OUTPUT_FILE_PATH}`);
}

// Run the script
console.log('Starting to fix YAML glitches...');
processCorruptedFiles();