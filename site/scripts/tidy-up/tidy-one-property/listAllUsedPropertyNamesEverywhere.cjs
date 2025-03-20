const fs = require('fs');
const path = require('path');

/**
 * Extract frontmatter from markdown content
 * @param {string} content - Markdown content
 * @returns {Object} Frontmatter data
 */
function extractFrontmatter(content) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
        return { success: false };
    }
    
    return {
        success: true,
        frontmatterString: match[1]
    };
}

/**
 * Get all unique property names from YAML frontmatter
 * @param {string} contentDir - Directory to scan for markdown files
 * @returns {Set<string>} Set of unique property names
 */
async function getAllPropertyNames(contentDir) {
    const propertyNames = new Set();

    // Walk through directory recursively
    function walkDir(dir) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            if (fs.statSync(filePath).isDirectory()) {
                walkDir(filePath);
            } else if (file.endsWith('.md')) {
                const content = fs.readFileSync(filePath, 'utf8');
                const frontmatterData = extractFrontmatter(content);
                
                if (frontmatterData.success) {
                    const frontmatterLines = frontmatterData.frontmatterString.split('\n');
                    frontmatterLines.forEach(line => {
                        const match = line.match(/^([^:]+):/);
                        if (match) {
                            propertyNames.add(match[1].trim());
                        }
                    });
                }
            }
        });
    }

    walkDir(contentDir);
    return propertyNames;
}

async function main() {
    const contentDir = path.join(process.cwd(), 'site/src/content/tooling');
    const propertyNames = await getAllPropertyNames(contentDir);
    
    // Sort and print properties
    const sortedProperties = Array.from(propertyNames).sort();
    console.log('\nAll unique YAML frontmatter properties:\n');
    sortedProperties.forEach(prop => console.log(prop));
    console.log(`\nTotal unique properties: ${sortedProperties.length}`);
}

main().catch(console.error);