const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const USER_OPTIONS = {
    // Directory to process for markdown files
    TARGET_DIR: 'site/src/content/tooling/',
    
    // Frontmatter fields and their default values
    // Set to null to exclude a field
    FRONTMATTER_FIELDS: {
        // Core identification
        site_uuid: null,  // Will be generated
        title: null,      // Will be extracted from filename
        
        // Content organization
        tags: null,       // Will be extracted from path
        
        // Access control
        site_visibility: 'public'
    },

    // Safety options
    DRY_RUN: false,  // Set to false to actually make changes
    VERBOSE: true  // Show detailed logs
};

function extractTitleFromPath(filePath) {
    // Get the filename without extension
    const fileName = path.basename(filePath, '.md');
    return fileName;
}

function extractTagsFromPath(filePath) {
    // Get directory structure as tags
    const relativePath = path.relative(USER_OPTIONS.TARGET_DIR, filePath);
    const dirs = path.dirname(relativePath).split(path.sep);
    return dirs.filter(dir => dir !== '.');
}

async function processFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check if file already has frontmatter
        if (content.startsWith('---\n') && content.substring(4).includes('\n---\n')) {
            if (USER_OPTIONS.VERBOSE) {
                console.log(`Skipping ${filePath} - already has frontmatter`);
            }
            return { status: 'skipped', reason: 'has_frontmatter' };
        }

        // Generate frontmatter
        const frontmatter = {};
        for (const [key, value] of Object.entries(USER_OPTIONS.FRONTMATTER_FIELDS)) {
            if (value === null) {
                // Handle special fields
                switch (key) {
                    case 'site_uuid':
                        frontmatter[key] = uuidv4();
                        break;
                    case 'title':
                        frontmatter[key] = extractTitleFromPath(filePath);
                        break;
                    case 'tags':
                        frontmatter[key] = extractTagsFromPath(filePath);
                        break;
                    default:
                        // Skip null fields
                        continue;
                }
            } else {
                frontmatter[key] = value;
            }
        }

        // Format frontmatter
        const frontmatterYaml = ['---'];
        for (const [key, value] of Object.entries(frontmatter)) {
            if (Array.isArray(value)) {
                frontmatterYaml.push(`${key}:`);
                value.forEach(item => frontmatterYaml.push(`  - ${item}`));
            } else if (typeof value === 'object') {
                frontmatterYaml.push(`${key}:`);
                for (const [subKey, subValue] of Object.entries(value)) {
                    if (Array.isArray(subValue)) {
                        frontmatterYaml.push(`  ${subKey}:`);
                        subValue.forEach(item => frontmatterYaml.push(`    - ${item}`));
                    } else {
                        frontmatterYaml.push(`  ${subKey}: ${subValue}`);
                    }
                }
            } else {
                frontmatterYaml.push(`${key}: ${value}`);
            }
        }
        frontmatterYaml.push('---\n');

        // Combine with original content, removing any empty frontmatter
        const cleanContent = content.replace(/---\s*---/, '').trim();
        const newContent = frontmatterYaml.join('\n') + '\n' + cleanContent;

        if (USER_OPTIONS.DRY_RUN) {
            if (USER_OPTIONS.VERBOSE) {
                console.log(`\nWould update ${filePath} with:`);
                console.log('--- New Frontmatter ---');
                console.log(frontmatterYaml.join('\n'));
                console.log('--- Original Content Preview ---');
                console.log(cleanContent.split('\n').slice(0, 3).join('\n') + '\n...');
            }
            return { status: 'would_update', preview: frontmatterYaml.join('\n') };
        }

        // Write back to file
        fs.writeFileSync(filePath, newContent);
        return { status: 'updated', file: filePath };
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
        return { status: 'error', error: error.message };
    }
}

async function findMarkdownFiles(dir) {
    const files = [];
    
    function traverse(currentDir) {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);
            
            if (entry.isDirectory()) {
                traverse(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
                files.push(fullPath);
            }
        }
    }
    
    traverse(dir);
    return files;
}

async function main() {
    try {
        const targetDir = path.resolve(USER_OPTIONS.TARGET_DIR);
        console.log(`\nFrontmatter Addition Script`);
        console.log(`=========================`);
        console.log(`Mode: ${USER_OPTIONS.DRY_RUN ? 'DRY RUN (no changes)' : 'LIVE RUN'}`);
        console.log(`Target: ${targetDir}`);
        console.log(`\nFrontmatter Fields:`);
        for (const [key, value] of Object.entries(USER_OPTIONS.FRONTMATTER_FIELDS)) {
            if (value === null) {
                console.log(`  ${key}: <auto-generated>`);
            } else {
                console.log(`  ${key}: ${value}`);
            }
        }
        console.log('');

        // Find all markdown files
        const files = await findMarkdownFiles(targetDir);
        console.log(`Found ${files.length} markdown files to process\n`);

        // Process each file
        const results = {
            would_update: 0,
            updated: 0,
            skipped: 0,
            error: 0
        };

        for (const file of files) {
            const result = await processFile(file);
            results[result.status]++;
        }

        console.log(`\nProcessing complete:`);
        console.log(`- Total files found: ${files.length}`);
        if (USER_OPTIONS.DRY_RUN) {
            console.log(`- Files that would be updated: ${results.would_update}`);
        } else {
            console.log(`- Files updated: ${results.updated}`);
        }
        console.log(`- Files skipped: ${results.skipped}`);
        console.log(`- Files with errors: ${results.error}`);
        
        if (USER_OPTIONS.DRY_RUN) {
            console.log(`\nThis was a DRY RUN. No files were modified.`);
            console.log(`To make actual changes, set DRY_RUN: false in USER_OPTIONS`);
        }

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main();
