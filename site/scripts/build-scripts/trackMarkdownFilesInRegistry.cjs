// =============================================================
// User Options
// All configurable options for the content registry script
// ===============================

const USER_OPTIONS = {
    // Directory to process for markdown files
    TARGET_DIR: 'site/src/content/tooling/',
    
    // Output file for the content registry
    TARGET_OUTPUT_FILE: 'site/src/content/data/markdown-content-registry.json',

    // Registry structure configuration
    registryConfig: {
        // Document structure
        documents: {
            referredToAs: ['primaryFileName', 'aliases'],
            urls: ['siteUrl', 'youtubeChannelUrl', 'githubProfileUrl', 'githubProjectUrl', 'xUrl', 'linkedinUrl', 'wikipediaUrl', 'ogImageUrl'],
            primaryFiles: ['canonical', 'document_variants'],
            connectedDocuments: ['connected_documents'],
            history: ['timestamp', 'type', 'action', 'details'],
            mediaInContent: ['media'],
            metadata: {
                "properties": {
                    "siteVisibility": {
                        "allowedValues": ["featured", "public", "protected", "internal", "unlisted", "draft", "data"],
                        "default": "public"
                    },
                    "semanticVersion": {
                        "properties": {
                            "version": "number",
                            "gitCommitHash": "string",
                            "githubCommitUrl": "string",
                            "created_at": "timestamp",
                            "last_modified": "timestamp",
                            "status": {
                                "allowedValues": ["featured", "public", "protected", "internal", "unlisted", "draft", "data"],
                                "default": "public"
                            }
                        }
                    }
                }
            }
        },
        // Index configuration
        indices: {
            by_filename: true,
            by_path: true,
            by_uuid: true
        }
    },

    // Frontmatter property mappings
    frontmatterMappings: {
        // Direct mappings (property name in frontmatter -> property name in registry)
        direct: {
            'site_uuid': 'uuid',
            'youtube_url': 'youtubeChannelUrl',
            'github_profile_url': 'githubProfileUrl',
            'github_project_url': 'githubProjectUrl',
            'x': 'xUrl',
            'url': 'siteUrl',
            'og_last_error': 'ogLastFetchError'
        },

        // Properties to convert from snake_case to camelCase
        snakeToCamel: [
            'og_image_url',
            'site_url',
            'x_url',
            'github_url',
            'linkedin_url',
            'wikipedia_url'
        ],

        // Properties to include in history with type mapping
        historyProperties: {
            'og_last_fetch': {
                type: 'metadata_update',
                action: 'og_fetch_01',
                details: {
                    source: 'opengraph',
                    operation: 'fetch'
                }
            },
            'jina_first_request': {
                type: 'ai_interaction',
                action: 'jina_request_01',
                details: {
                    service: 'jina',
                    operation: 'embedding_generation'
                }
            }
        }
    }
};

// =============================================================
// Required Dependencies
// ===============================
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// =============================================================
// Helper Functions
// ===============================

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
 * Create UUID in frontmatter if none exists
 * @param {string} content - File content
 * @param {string} filePath - Path to file
 * @returns {Object} Modified content and status
 */
async function createUUIDinFrontmatterIfNone(content) {
    const frontmatterData = extractFrontmatter(content);
    if (!frontmatterData.success) {
        return { modified: false, content };
    }

    const frontmatterLines = frontmatterData.frontmatterString.split('\n');
    const hasUUID = frontmatterLines.some(line => line.trim().startsWith('site_uuid:'));

    if (!hasUUID) {
        const uuid = uuidv4();
        const newFrontmatter = `site_uuid: ${uuid}\n${frontmatterData.frontmatterString}`;
        const newContent = content.replace(frontmatterData.frontmatterString, newFrontmatter);
        return { modified: true, content: newContent };
    }

    return { modified: false, content };
}

/**
 * Converts snake_case to camelCase
 * @param {string} str - String in snake_case
 * @returns {string} String in camelCase
 */
function snakeToCamelCase(str) {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

/**
 * Extract primary file name from path
 * @param {string} filePath - Full path to the file
 * @returns {string} Primary file name without extension
 */
function extractPrimaryFileName(filePath) {
    // Get the file name without extension
    const fileName = path.basename(filePath, '.md');
    return fileName;
}

/**
 * Helper to check if a history entry already exists
 * @param {Array} history - Array of history entries
 * @param {string} type - Type of history entry
 * @param {string} action - Action of history entry
 * @param {Object} details - Details of history entry
 * @returns {boolean} Whether a matching history entry exists
 */
function hasMatchingHistoryEntry(history, type, action, details) {
    return history.some(entry => 
        entry.type === type && 
        entry.action === action && 
        JSON.stringify(entry.details) === JSON.stringify(details)
    );
}

/**
 * Creates a history entry
 * @param {string} timestamp - ISO timestamp
 * @param {string} type - Event type
 * @param {string} action - Specific action
 * @param {Object} details - Additional details
 * @returns {Object} History entry
 */
function createHistoryEntry(timestamp, type, action, details = {}) {
    return {
        timestamp,
        type,
        action,
        details
    };
}

// =============================================================
// Main Processing Functions
// ===============================

/**
 * Process a single markdown file
 * @param {string} filePath - Path to markdown file
 * @returns {Object} Registry entry for the file
 */
async function processMarkdownFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const frontmatterData = extractFrontmatter(content);
    const frontmatter = frontmatterData?.frontmatter || {};
    
    // Create registry entry structure following the model
    const registryEntry = {
        referredToAs: {
            primaryFileName: path.basename(filePath, '.md'),
            aliases: []
        },
        urls: {},
        primaryFiles: {
            canonical: { path: filePath },
            document_variants: []
        },
        connectedDocuments: {
            connected_documents: []
        },
        history: [],
        metadata: {
            siteVisibility: "public"
        },
        mediaInContent: {
            media: []
        }
    };

    // Process direct mappings and URLs
    Object.entries(USER_OPTIONS.frontmatterMappings.direct).forEach(([frontmatterKey, registryKey]) => {
        if (frontmatter[frontmatterKey]) {
            registryEntry[registryKey] = frontmatter[frontmatterKey];
        }
    });

    // Process URLs
    Object.entries(USER_OPTIONS.frontmatterMappings.urls).forEach(([frontmatterKey, urlType]) => {
        if (frontmatter[frontmatterKey]) {
            const urlValue = frontmatter[frontmatterKey];
            registryEntry.urls[urlType] = urlValue;
            const urlDetails = {
                type: urlType,
                value: urlValue,
                source: "frontmatter"
            };
            if (!hasMatchingHistoryEntry(registryEntry.history, "content_update", "url_added", urlDetails)) {
                registryEntry.history.push(createHistoryEntry(
                    new Date().toISOString(),
                    "content_update",
                    "url_added",
                    urlDetails
                ));
            }
        }
    });

    // Process parent organization
    if (frontmatter.parent_org) {
        const parentOrgValue = frontmatter.parent_org;
        registryEntry.connectedDocuments.connected_documents.push({
            type: "parentOrganization",
            reference: parentOrgValue,
            source: "frontmatter"
        });
        const parentOrgDetails = {
            type: "parentOrganization",
            value: parentOrgValue,
            source: "frontmatter"
        };
        if (!hasMatchingHistoryEntry(registryEntry.history, "reference_update", "parent_org_linked", parentOrgDetails)) {
            registryEntry.history.push(createHistoryEntry(
                new Date().toISOString(),
                "reference_update",
                "parent_org_linked",
                parentOrgDetails
            ));
        }
    }

    // Process history entries
    Object.entries(USER_OPTIONS.frontmatterMappings.historyProperties).forEach(([prop, config]) => {
        if (frontmatter[prop]) {
            registryEntry.history.push(createHistoryEntry(
                frontmatter[prop],
                config.type,
                config.action,
                {
                    source: "frontmatter",
                    value: frontmatter[prop]
                }
            ));
        }
    });

    registryEntry.history.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Create indices
    const indices = {
        by_filename: {},
        by_path: {},
        by_uuid: {}
    };

    if (USER_OPTIONS.registryConfig.indices.by_filename) {
        indices.by_filename[registryEntry.referredToAs.primaryFileName] = {
            uuid: frontmatter.site_uuid,
            context: path.dirname(filePath).split('/').slice(-2).join('/'),
            is_canonical: true
        };
    }

    if (USER_OPTIONS.registryConfig.indices.by_path) {
        indices.by_path[filePath] = frontmatter.site_uuid;
    }

    if (USER_OPTIONS.registryConfig.indices.by_uuid) {
        indices.by_uuid[frontmatter.site_uuid] = {
            memory: process.memoryUsage().heapUsed / (1024 * 1024),
            timestamp: new Date().toISOString()
        };
    }

    return {
        document: { [frontmatter.site_uuid]: registryEntry },
        indices
    };
}

// =============================================================
// Main Execution
// ===============================

async function main() {
    const contentDir = path.join(process.cwd(), USER_OPTIONS.TARGET_DIR);
    const outputFile = path.join(process.cwd(), USER_OPTIONS.TARGET_OUTPUT_FILE);
    
    console.log(`Processing content from: ${contentDir}`);
    console.log(`Output will be written to: ${outputFile}`);
    
    // Load existing registry if it exists
    let registry = {
        documents: {},
        indices: {
            by_filename: {},
            by_path: {},
            by_uuid: {}
        }
    };
    
    if (fs.existsSync(outputFile)) {
        console.log('Found existing registry, loading...');
        const content = fs.readFileSync(outputFile, 'utf8');
        if (content && content.trim()) {
            registry = JSON.parse(content);
            console.log(`Loaded ${Object.keys(registry.documents).length} existing documents`);
        } else {
            console.log('Existing registry file is empty, starting fresh');
        }
    } else {
        console.log('No existing registry found, creating new one');
        // Ensure directory exists
        const dir = path.dirname(outputFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Created directory: ${dir}`);
        }
    }
    
    // Get all markdown files
    const markdownFiles = [];
    function walkDir(dir) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            if (fs.statSync(filePath).isDirectory()) {
                walkDir(filePath);
            } else if (file.endsWith('.md')) {
                markdownFiles.push(filePath);
            }
        });
    }
    walkDir(contentDir);
    
    console.log(`Found ${markdownFiles.length} markdown files to process`);

    // Process each file
    let processedCount = 0;
    let updatedCount = 0;
    let newCount = 0;

    for (const filePath of markdownFiles) {
        const result = await processMarkdownFile(filePath);
        if (result) {
            processedCount++;
            const uuid = Object.keys(result.document)[0];
            
            if (registry.documents[uuid]) {
                updatedCount++;
                const existingDoc = registry.documents[uuid];
                
                // Merge the new document with the existing one
                registry.documents[uuid] = {
                    ...existingDoc,
                    ...result.document[uuid],
                    // Merge histories without duplicates
                    history: [
                        ...existingDoc.history,
                        ...result.document[uuid].history.filter(newEntry => 
                            !hasMatchingHistoryEntry(existingDoc.history, 
                                newEntry.type, 
                                newEntry.action, 
                                newEntry.details)
                        )
                    ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                };
            } else {
                newCount++;
                registry.documents[uuid] = result.document[uuid];
            }

            // Update indices
            Object.entries(result.indices).forEach(([indexType, indexData]) => {
                if (!registry.indices[indexType]) {
                    registry.indices[indexType] = {};
                }
                Object.assign(registry.indices[indexType], indexData);
            });
        }
    }

    // Write registry to file
    fs.writeFileSync(outputFile, JSON.stringify(registry, null, 2));
    console.log(`
Content registry updated successfully:
- Total files processed: ${processedCount}
- New documents added: ${newCount}
- Existing documents updated: ${updatedCount}
- Output written to: ${outputFile}
    `);
}

main().catch(console.error);