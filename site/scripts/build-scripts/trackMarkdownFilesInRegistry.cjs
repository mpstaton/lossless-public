// =============================================================
// User Options
// All configurable options for the content registry script
// ===============================

const USER_OPTIONS = {
    // Directory to process for markdown files
    TARGET_DIR: 'site/src/content/tooling/Productivity',
    
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
    
    // Ensure file has UUID
    const uuidResult = await createUUIDinFrontmatterIfNone(content, filePath);
    const processedContent = uuidResult.content || content;
    
    // Extract frontmatter
    const frontmatterData = extractFrontmatter(processedContent);
    if (!frontmatterData.success) {
        console.error(`Failed to extract frontmatter from ${filePath}`);
        return null;
    }

    // Parse frontmatter
    const frontmatterLines = frontmatterData.frontmatterString.split('\n');
    const frontmatter = {};
    const history = [];
    
    frontmatterLines.forEach(line => {
        const match = line.match(/^([^:]+):\s*(.+)$/);
        if (match) {
            const [, key, value] = match;
            frontmatter[key.trim()] = value.trim().replace(/^['"](.*)['"]$/, '$1'); // Remove quotes
        }
    });

    // Create registry entry structure following the model
    const registryEntry = {
        referredToAs: {
            primaryFileName: path.basename(filePath, '.md'),
            aliases: []
        },
        urls: {},
        primaryFiles: {
            canonical: {
                path: filePath
            },
            document_variants: []
        },
        connectedDocuments: {
            connected_documents: []
        },
        history: [],
        metadata: {
            siteVisibility: "public",
            semanticVersion: {
                version: 1,
                created_at: new Date().toISOString(),
                last_modified: new Date().toISOString(),
                status: "active"
            }
        },
        mediaInContent: {
            media: []
        }
    };

    // Process direct mappings and URLs
    Object.entries(USER_OPTIONS.frontmatterMappings.direct).forEach(([frontmatterKey, registryKey]) => {
        if (frontmatter[frontmatterKey]) {
            // Check if this is a URL property that should go in urls object
            if (USER_OPTIONS.registryConfig.documents.urls.includes(registryKey)) {
                // Clean and validate URL
                let urlValue = frontmatter[frontmatterKey].trim();
                // Remove quotes if present
                urlValue = urlValue.replace(/^['"](.*)['"]$/, '$1');
                // Add history entry for URL update
                history.push(createHistoryEntry(
                    new Date().toISOString(),
                    "content_update",
                    "url_added",
                    {
                        property: registryKey,
                        value: urlValue,
                        source: "frontmatter"
                    }
                ));
                registryEntry.urls[registryKey] = urlValue;
            } else {
                registryEntry[registryKey] = frontmatter[frontmatterKey];
            }
        }
    });

    // Handle parent organization separately
    if (frontmatter['parent_org']) {
        const parentOrgValue = frontmatter['parent_org'].trim().replace(/^['"](.*)['"]$/, '$1');
        const parentOrgRef = {
            type: "parentOrganization",
            reference: `${parentOrgValue}`
        };
        registryEntry.connectedDocuments.connected_documents.push(parentOrgRef);
        
        // Add history entry for parent organization update
        history.push(createHistoryEntry(
            new Date().toISOString(),
            "reference_update",
            "parent_org_linked",
            {
                type: "parentOrganization",
                value: parentOrgValue,
                source: "frontmatter"
            }
        ));
    }

    // Process snake_case URLs
    USER_OPTIONS.frontmatterMappings.snakeToCamel.forEach(prop => {
        if (frontmatter[prop]) {
            const camelProp = snakeToCamelCase(prop);
            // Ensure URL is properly formatted
            let urlValue = frontmatter[prop].trim();
            // Remove quotes if present
            urlValue = urlValue.replace(/^['"](.*)['"]$/, '$1');
            // Add history entry for URL update
            history.push(createHistoryEntry(
                new Date().toISOString(),
                "content_update",
                "url_added",
                {
                    property: camelProp,
                    original_property: prop,
                    value: urlValue,
                    source: "frontmatter"
                }
            ));
            registryEntry.urls[camelProp] = urlValue;
        }
    });

    // Process history entries
    Object.entries(USER_OPTIONS.frontmatterMappings.historyProperties).forEach(([prop, config]) => {
        if (frontmatter[prop]) {
            history.push(createHistoryEntry(
                frontmatter[prop],
                config.type,
                config.action,
                {
                    ...config.details,
                    original_property: prop,
                    original_value: frontmatter[prop]
                }
            ));
        }
    });

    // Add UUID issuance to history if it was just created
    if (uuidResult.modified) {
        history.push(createHistoryEntry(
            new Date().toISOString(),
            'content_creation',
            'site_uuid_issued',
            { 
                uuid: frontmatter.site_uuid,
                path: filePath
            }
        ));
    }

    registryEntry.history = history.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

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
    try {
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
            try {
                console.log('Found existing registry, loading...');
                const content = fs.readFileSync(outputFile, 'utf8');
                if (content && content.trim()) {
                    const existingRegistry = JSON.parse(content);
                    registry = existingRegistry;
                    console.log(`Loaded ${Object.keys(registry.documents).length} existing documents`);
                } else {
                    console.log('Existing registry file is empty, starting fresh');
                }
            } catch (error) {
                if (error instanceof SyntaxError) {
                    console.error('Registry file contains invalid JSON, starting fresh');
                    console.error('Parse error:', error.message);
                } else {
                    console.error('Error reading existing registry:', error);
                    throw new Error(`Failed to read registry file: ${error.message}`);
                }
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
            if (!fs.existsSync(dir)) {
                throw new Error(`Directory does not exist: ${dir}`);
            }
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
            try {
                const result = await processMarkdownFile(filePath);
                if (result) {
                    processedCount++;
                    const uuid = Object.keys(result.document)[0];
                    
                    if (registry.documents[uuid]) {
                        updatedCount++;
                        const existingDoc = registry.documents[uuid];
                        
                        // Check for meaningful changes that warrant a version increment
                        const hasContentChanges = JSON.stringify(existingDoc.urls) !== JSON.stringify(result.document[uuid].urls) ||
                                        existingDoc.referredToAs.primaryFileName !== result.document[uuid].referredToAs.primaryFileName;
                        
                        if (hasContentChanges) {
                            // Increment version and update timestamps
                            registry.documents[uuid].metadata.semanticVersion = {
                                ...registry.documents[uuid].metadata.semanticVersion,
                                version: registry.documents[uuid].metadata.semanticVersion.version + 1,
                                last_modified: new Date().toISOString()
                            };
                            
                            // Add version update to history with URL changes
                            const urlChanges = {};
                            Object.entries(result.document[uuid].urls).forEach(([key, value]) => {
                                if (!existingDoc.urls[key] || existingDoc.urls[key] !== value) {
                                    urlChanges[key] = {
                                        previous: existingDoc.urls[key] || null,
                                        new: value
                                    };
                                }
                            });
                            
                            registry.documents[uuid].history.push(createHistoryEntry(
                                new Date().toISOString(),
                                "metadata_update",
                                "version_increment",
                                {
                                    previous_version: registry.documents[uuid].metadata.semanticVersion.version - 1,
                                    new_version: registry.documents[uuid].metadata.semanticVersion.version,
                                    reason: "Content changes detected",
                                    changes: {
                                        urls: urlChanges,
                                        primaryFileName: existingDoc.referredToAs.primaryFileName !== result.document[uuid].referredToAs.primaryFileName ? {
                                            previous: existingDoc.referredToAs.primaryFileName,
                                            new: result.document[uuid].referredToAs.primaryFileName
                                        } : null
                                    }
                                }
                            ));
                        }

                        // Merge the new document with the existing one
                        registry.documents[uuid] = {
                            ...existingDoc,
                            ...result.document[uuid],
                            history: [
                                ...existingDoc.history,
                                ...result.document[uuid].history.filter(
                                    newEntry => !existingDoc.history.some(
                                        existingEntry => 
                                            existingEntry.timestamp === newEntry.timestamp &&
                                            existingEntry.type === newEntry.type &&
                                            existingEntry.action === newEntry.action
                                    )
                                )
                            ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
                            connectedDocuments: {
                                connected_documents: [
                                    ...result.document[uuid].connectedDocuments.connected_documents
                                ]
                            }
                        };

                        // Check if this is a new or changed parent organization
                        const newParentOrg = result.document[uuid].connectedDocuments.connected_documents.find(
                            doc => doc.type === "parentOrganization"
                        );
                        const existingParentOrg = existingDoc.connectedDocuments.connected_documents.find(
                            doc => doc.type === "parentOrganization"
                        );
                        
                        if (newParentOrg && (!existingParentOrg || existingParentOrg.reference !== newParentOrg.reference)) {
                            registry.documents[uuid].history.push(createHistoryEntry(
                                new Date().toISOString(),
                                "reference_update",
                                "parent_org_changed",
                                {
                                    type: "parentOrganization",
                                    previous: existingParentOrg ? existingParentOrg.reference : null,
                                    new: newParentOrg.reference,
                                    source: "frontmatter"
                                }
                            ));
                        }
                    } else {
                        newCount++;
                        registry.documents[uuid] = result.document[uuid];
                    }
                    
                    // Update indices
                    Object.assign(registry.indices.by_filename, result.indices.by_filename);
                    Object.assign(registry.indices.by_path, result.indices.by_path);
                    Object.assign(registry.indices.by_uuid, result.indices.by_uuid);
                }
            } catch (error) {
                console.error(`Error processing file ${filePath}:`, error);
                throw error;
            }
        }

        // Write registry to file
        try {
            fs.writeFileSync(outputFile, JSON.stringify(registry, null, 2));
            console.log(`
Content registry updated successfully:
- Total files processed: ${processedCount}
- New documents added: ${newCount}
- Existing documents updated: ${updatedCount}
- Output written to: ${outputFile}
            `);
        } catch (error) {
            console.error('Error writing registry file:', error);
            throw new Error(`Failed to write registry file: ${error.message}`);
        }
    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
}

main().catch(console.error);