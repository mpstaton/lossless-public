const fs = require('fs');
const path = require('path');

// =============================================================
// Frontmatter Processing
// Extracts frontmatter from markdown files without using YAML libraries
// ===============================

function extractFrontmatterFromString(fileContent) {
    // Check if file starts with frontmatter delimiter
    if (!fileContent.startsWith('---\n')) {
        return null;
    }

    // Find the closing frontmatter delimiter
    const endIndex = fileContent.indexOf('\n---\n', 4);
    if (endIndex === -1) {
        return null;
    }

    // Extract the frontmatter string
    const frontmatterStr = fileContent.slice(4, endIndex);
    
    // Parse frontmatter into object without using YAML
    const frontmatter = {};
    const lines = frontmatterStr.split('\n');
    
    for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
            const key = line.slice(0, colonIndex).trim();
            let value = line.slice(colonIndex + 1).trim();
            
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            
            frontmatter[key] = value;
        }
    }

    return {
        frontmatter,
        content: fileContent.slice(endIndex + 5),
        rawFrontmatter: frontmatterStr
    };
}

// =============================================================
// File Loading and Classification
// Groups files based on their frontmatter and UUID status
// ===============================

function classifyFiles(markdownFiles, userOptions) {
    const fileGroups = {
        readyToProcess: [],
        noFrontmatter: [],
        noUuid: [],
        noUrlOrSiteUrl: [], // Track files missing both url properties
        couldNotLoad: []
    };

    for (const filePath of markdownFiles) {
        try {
            const fileData = extractFrontmatterFromString(fs.readFileSync(filePath, 'utf8'));
            const timestamp = new Date().toISOString();
            
            if (!fileData.frontmatter) {
                if (userOptions.SAFETY_OPTIONS.VERBOSE) {
                    console.log(`[${timestamp}] No frontmatter:`, {
                        file: path.basename(filePath)
                    });
                }
                fileGroups.noFrontmatter.push(filePath);
                continue;
            }

            // Check if file has either url property first and it's not empty
            const hasRequiredUrl = userOptions.MUST_HAVE_ONE_OF_THESE_PROPERTIES.some(
                prop => {
                    const value = fileData.frontmatter[prop];
                    return value && value.trim() !== '';
                }
            );
            
            if (!hasRequiredUrl) {
                if (userOptions.SAFETY_OPTIONS.VERBOSE) {
                    console.log(`[${timestamp}] No URL properties:`, {
                        file: path.basename(filePath),
                        frontmatter: fileData.frontmatter
                    });
                }
                fileGroups.noUrlOrSiteUrl.push(filePath);
                continue;
            }

            // Check for duplicate UUIDs and fix if needed
            const uuidEntries = Object.entries(fileData.frontmatter)
                .filter(([key, value]) => key.includes('uuid'));

            // Keep only the first non-empty UUID
            const validUuid = uuidEntries.find(([key, value]) => value && value.trim() !== '')?.[1];

            if (!validUuid) {
                if (userOptions.SAFETY_OPTIONS.VERBOSE) {
                    console.log(`[${timestamp}] No valid UUID:`, {
                        file: path.basename(filePath),
                        uuids: uuidEntries.map(([key, value]) => ({ [key]: value }))
                    });
                }
                fileGroups.noUuid.push(filePath);
                continue;
            }

            // Update frontmatter to use only the valid UUID
            if (uuidEntries.length > 1) {
                if (userOptions.SAFETY_OPTIONS.VERBOSE) {
                    console.log(`[${timestamp}] Found multiple UUIDs, using:`, {
                        file: path.basename(filePath),
                        uuid: validUuid
                    });
                }

                // Create a new frontmatter object with only the valid UUID
                const newFrontmatter = { ...fileData.frontmatter };
                uuidEntries.forEach(([key]) => {
                    delete newFrontmatter[key];
                });
                newFrontmatter.uuid = validUuid;

                // Convert frontmatter to string
                const frontmatterLines = Object.entries(newFrontmatter)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join('\n');

                // Write the updated frontmatter back to the file
                const updatedContent = `---\n${frontmatterLines}\n---\n${fileData.content}`;
                fs.writeFileSync(filePath, updatedContent, 'utf8');
            }

            if (userOptions.SAFETY_OPTIONS.VERBOSE) {
                console.log(`[${timestamp}] Ready to process:`, {
                    file: path.basename(filePath),
                    url: fileData.frontmatter.url || fileData.frontmatter.site_url,
                    uuid: validUuid
                });
            }
            fileGroups.readyToProcess.push(filePath);
        } catch (err) {
            if (userOptions.SAFETY_OPTIONS.VERBOSE) {
                console.log(`[${timestamp}] Could not load:`, {
                    file: path.basename(filePath),
                    error: err.message
                });
            }
            fileGroups.couldNotLoad.push(filePath);
        }
    }

    return fileGroups;
}

// =============================================================
// File Fixing
// Adds frontmatter and UUID where missing
// ===============================

function addFrontmatterAndUuid(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const title = path.basename(filePath, '.md');
        const uuid = require('crypto').randomUUID();
        
        const newContent = `---
title: ${title}
site_uuid: ${uuid}
---
${fileContent}`;

        fs.writeFileSync(filePath, newContent);
        return true;
    } catch (err) {
        return false;
    }
}

function addUuidToFrontmatter(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const frontmatterData = extractFrontmatterFromString(fileContent);
        const uuid = require('crypto').randomUUID();
        
        // Add UUID to existing frontmatter
        const updatedFrontmatter = frontmatterData.rawFrontmatter + `\nsite_uuid: ${uuid}`;
        const newContent = `---\n${updatedFrontmatter}\n---\n${frontmatterData.content}`;
        
        fs.writeFileSync(filePath, newContent);
        return true;
    } catch (err) {
        return false;
    }
}

// =============================================================
// File Processing
// Processes files based on conditions and target script
// ===============================

async function processFilesForTargetScript(options) {
    const {
        targetDir,
        runConditions,
        processFunction,
        dryRun = false,
        verbose = false,
        userOptions
    } = options;

    // Load all markdown files
    const markdownFiles = [];
    function walkDir(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                walkDir(filePath);
            } else if (file.endsWith('.md')) {
                markdownFiles.push(filePath);
            }
        }
    }
    walkDir(targetDir);

    const fixedWithFrontmatter = [];
    const fixedWithUuid = [];

    const fileGroups = classifyFiles(markdownFiles, userOptions);

    // Fix files with missing frontmatter
    if (!dryRun) {
        for (const filePath of fileGroups.noFrontmatter) {
            try {
                const fixed = await addFrontmatterAndUuid(filePath);
                if (fixed) {
                    fixedWithFrontmatter.push(filePath);
                }
            } catch (err) {
                if (verbose) console.log(`[${new Date().toISOString()}] Error fixing frontmatter:`, {
                    file: path.basename(filePath),
                    error: err.message
                });
            }
        }

        // Fix files with missing UUID
        for (const filePath of fileGroups.noUuid) {
            try {
                const fixed = await addUuidToFrontmatter(filePath);
                if (fixed) {
                    fixedWithUuid.push(filePath);
                }
            } catch (err) {
                if (verbose) console.log(`[${new Date().toISOString()}] Error fixing UUID:`, {
                    file: path.basename(filePath),
                    error: err.message
                });
            }
        }
    }

    const results = { 
        files: [],
        firstFetch: [],
        runConditionMet: [],
        succeeded: [],
        failed: [],
        history: []
    };

    // Process each ready file
    if (!dryRun) {
        for (const filePath of fileGroups.readyToProcess) {
            try {
                const fileData = extractFrontmatterFromString(fs.readFileSync(filePath, 'utf8'));
                const timestamp = new Date().toISOString();

                // Get the URL to use (url or site_url)
                const url = fileData.frontmatter.url || fileData.frontmatter.site_url;
                
                // Check if this is a first fetch
                const neverFetched = !fileData.frontmatter.og_last_fetch && !fileData.frontmatter.og_last_error;
                const emptyFetch = fileData.frontmatter.og_last_fetch === '' && !fileData.frontmatter.og_last_error;
                if (neverFetched || emptyFetch) {
                    results.firstFetch.push(filePath);
                    results.history.push({
                        timestamp,
                        type: 'metadata_update',
                        action: 'first_fetch_attempt',
                        details: {
                            file: filePath,
                            url
                        }
                    });
                }

                // Check run conditions
                const shouldProcess = Object.values(runConditions).some(condition => {
                    try {
                        const result = condition(fileData.frontmatter);
                        if (verbose && result) {
                            console.log(`[${timestamp}] Run condition matched:`, {
                                file: path.basename(filePath),
                                condition: condition.name || 'anonymous',
                                url
                            });
                        }
                        return result;
                    } catch (err) {
                        if (verbose) console.log(`[${timestamp}] Error:`, {
                            file: path.basename(filePath),
                            error: err.message
                        });
                        results.history.push({
                            timestamp,
                            type: 'metadata_update',
                            action: 'run_condition_error',
                            details: {
                                file: filePath,
                                error: err.message
                            }
                        });
                        return false;
                    }
                });

                if (shouldProcess) {
                    results.runConditionMet.push(filePath);
                    results.history.push({
                        timestamp,
                        type: 'metadata_update',
                        action: 'processing_started',
                        details: {
                            file: filePath,
                            url
                        }
                    });

                    if (verbose) console.log(`[${timestamp}] Processing:`, {
                        file: path.basename(filePath),
                        url
                    });

                    const processResult = await processFunction(filePath, {
                        ...fileData.frontmatter,
                        url // Always use the selected URL
                    });
                    
                    if (verbose) console.log(`[${timestamp}] Result:`, {
                        file: path.basename(filePath),
                        success: processResult.success,
                        error: processResult.error || undefined
                    });

                    results.files.push({ 
                        path: filePath,
                        frontmatter: fileData.frontmatter,
                        result: processResult 
                    });
                    
                    if (processResult.success) {
                        results.succeeded.push(filePath);
                        results.history.push({
                            timestamp,
                            type: 'metadata_update',
                            action: 'processing_success',
                            details: {
                                file: filePath,
                                url
                            }
                        });
                    } else {
                        results.failed.push(filePath);
                        results.history.push({
                            timestamp,
                            type: 'metadata_update',
                            action: 'processing_error',
                            details: {
                                file: filePath,
                                error: processResult.error,
                                url
                            }
                        });
                    }
                }
            } catch (err) {
                const timestamp = new Date().toISOString();
                if (verbose) console.log(`[${timestamp}] Error:`, {
                    file: path.basename(filePath),
                    error: err.message
                });
                results.failed.push(filePath);
                results.history.push({
                    timestamp,
                    type: 'metadata_update',
                    action: 'processing_error',
                    details: {
                        file: filePath,
                        error: err.message
                    }
                });
            }
        }
    }

    // Return results following the document tracking system design
    return {
        filesProcessed: markdownFiles.length,
        filesWithIssue: fileGroups.noFrontmatter.concat(fileGroups.noUuid),
        filesCorrected: fixedWithFrontmatter.concat(fixedWithUuid),
        errors: fileGroups.couldNotLoad.map(file => ({ file, error: 'Could not load file' })),
        files: results.files,
        metadata: {
            noFrontmatter: fileGroups.noFrontmatter,
            noUuid: fileGroups.noUuid,
            noUrlOrSiteUrl: fileGroups.noUrlOrSiteUrl,
            fixedWithFrontmatter,
            fixedWithUuid,
            couldNotLoad: fileGroups.couldNotLoad,
            readyToProcess: fileGroups.readyToProcess,
            firstFetch: results.firstFetch,
            runConditionMet: results.runConditionMet,
            succeeded: results.succeeded,
            failed: results.failed,
            history: results.history
        }
    };
}

module.exports = {
    processFilesForTargetScript,
    extractFrontmatterFromString
};