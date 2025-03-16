const USER_OPTIONS = require('./getUserOptions.cjs');
const path = require('path');
const fs = require('fs');

const ERROR_MESSAGE_PROPERTIES = USER_OPTIONS.frontmatterPropertySets.errorMessageProperties;
const URL_PROPERTIES = USER_OPTIONS.frontmatterPropertySets.urlProperties;
const PLAIN_TEXT_PROPERTIES = USER_OPTIONS.frontmatterPropertySets.plainTextProperties;
const TIMESTAMP_PROPERTIES = USER_OPTIONS.frontmatterPropertySets.timestampProperties;

const knownErrorCases = {

    // Example frontmatter section in full with many errors and issuesl:
    exampleCorruptedFrontmatterSectionInFull:`---
    site_uuid: 2547def5-fc19-49e2-9c17-e1651c8b6fb5
    url: https://www.capcut.com/
    tags:
    - AI-Toolkit
    - Generative-AI
    og_screenshot_url: "https://og-screenshots-prod.s3.amazonaws.com/1366x768/80/false/080b8ca5fc3b8b4fff4e350e8d4d501f167b01c72862170bfe22b70c4d62041e.jpeg
    og_errors: 'true
    og_last_error: 2025-03-07T10:19:45.897Z'
    og_error_message: "''"HTTP error 401"
    last_jina_request: "2025-03-09T06:45:08.064Z"
    jina_error: "Error occurred"
    og_last_fetch: 2025-03-07T06:12:36.466Z
    ---`,

   // Unquoted error message properties (critical)
   // Surround the error message property with single mark quotes
   unquotedErrorMessageProperty: {
      exampleErrors: [
         "HTTP error!",
         "Error occurred 404"
      ],
      properSyntax: "'Error occurred 404'", // only one set of single mark quotes. 
      detectError: new RegExp(`^(${ERROR_MESSAGE_PROPERTIES.join('|')}):[ \t]*(?![ \t]*'[^']*'[ \t]*$)(.+)$`, 'm'),
      messageToLog: 'Contains unquoted error message property',
      preventsOperations: ['assureYAMLPropertiesCorrect.cjs'],
      correctionFunction: 'surroundErrorMessagePropertiesWithSingleMarkQuotes',
      isCritical: true
   },

   // Improper character set surrounding error message
   // This is a critical error that prevents any script from running
   // Remove the improper character set and add single mark quotes
   improperCharacterSetSurroundingErrorMessage: {
      exampleErrors: [
         "jina_error: \"Error occurred 404\"",           // double quotes
         "jina_error: 'Error occurred 404'",             // single quotes (when not the only quotes)
         "jina_error: \"'Error occurred 404'\"",         // nested quotes
         "jina_error: '\"Error occurred 404\"'",         // nested quotes reversed
         "jina_error: \"\"\"Error occurred 404\"\"\"",   // multiple double quotes
         "jina_error: '''Error occurred 404'''",         // multiple single quotes
         "jina_error: '\"\"Error occurred 404\"\"'",     // mixed multiple quotes
         "jina_error: \"''Error occurred 404''\"",       // mixed multiple quotes reversed
      ],
      properSyntax: "jina_error: 'Error occurred 404'", // only one set of single mark quotes
      detectError: new RegExp(`^(${ERROR_MESSAGE_PROPERTIES.join('|')}):[ \t]*(?:["'].*["']|["'].*|.*["'])[ \t]*$`, 'm'),
      messageToLog: 'Error message with improperly formatted character set',
      preventsOperations: ['assureYAMLPropertiesCorrect.cjs'],
      correctionFunction: 'removeImproperCharacterSetAddSingleMarkQuotes',
      isCritical: true
   },

   // Quotes present in the URL property
   // Quotes surrounding a URL throw errors in the fetchOpenGraphData.cjs script
   // Remove any quotes found on on either side of a URL
   undesiredQuotesPresentInURLProperty: {
      exampleErrors: [
         `""'https://www.archonlabs.com/'""`, 
         "\"https://cdn.prod.website-files.com/66c5c2bab55d37d8e443322b/66cc6d2f0f6b41b86ea33f83_archon-og.jpg\"",
         `""https://example.com""`,
         `"'https://example.com'"`,
         `" 'https://example.com' "`,
         `url: ""'https://www.numbersstation.ai'""`,
         `favicon: ""https://www.numbersstation.ai/wp-content/uploads/2024/08/cropped-logo-3-192x192.png""`
      ],
      detectError: new RegExp(`^(${URL_PROPERTIES.join('|')}):[ \t]*["'\`]`, 'gm'),
      properSyntax: "url: https://www.archonlabs.com/", //only the URL, NO QUOTES
      messageToLog: 'Removed quotes from URL property',
      preventsOperations: ['assureYAMLPropertiesCorrect.cjs', 'fetchOpenGraphData.cjs', 'trackVideosInRegistry.cjs'],
      correctionFunction: 'removeAnyQuoteCharactersfromEitherOrBothSidesOfURL',
      isCritical: true
   },

   // Block scalar syntax found in property
   // Remove block scalar syntax, and assure one single string
      blockScalarSyntaxFoundInProperty: { 
         exampleErrors: [
            `>-https://cdn.prod.website-files.com/
            669970bc2507a55cf11c7d5e/66cf98288874e4463ad16e65_spotter-studio-img.png`
         ],
         propertSyntax: 'https://cdn.prod.website-files.com/669970bc2507a55cf11c7d5e/66cf98288874e4463ad16e65_spotter-studio-img.png',
         detectError: /^([^:\n]+):[ \t]*(>-|>|[|][-]?)[ \t]*(\S.*)$/gm, 
         messageToLog: 'Block scalar syntax found in property',
         preventsOperations: ['assureYAMLPropertiesCorrect.cjs'],
         correctionFunction: 'attemptToFixBlockScalar',
         isCritical: true
   },
      // Unbalanced quotes (critical)
      // This is when one or more quotes on either side is not balanced by the other side. 
      // This is a critical error that prevents any script from running.
   unbalancedQuotesFoundInProperty: {
         exampleErrors: [
            "description: 'Supercharge your LLM's understanding of JavaScript/TypeScript codebases",  // missing closing single quote
            "title: \"My awesome title",                                                             // missing closing double quote
            "summary: This is a summary'",                                                          // only closing quote
            "description: My description\"",                                                        // only closing quote
            "tags: ['tag1\", \"tag2']",                                                            // mixed quotes
            "image: 'undefined: 'https://example.com/image.jpg",                                    // malformed with embedded colon
            "url: 'https://example.com",                                                           // unbalanced quote in URL
            "og_screenshot_url: \"https://example.com"                                             // unbalanced quote in URL
         ],
         properSyntax: {
            nonUrl: "description: 'Supercharge your LLM's understanding of JavaScript/TypeScript codebases.'",
            url: "url: https://example.com"
         },
         // Regex patterns to be used in correction function
         patterns: {
            propertyAndValue: /^([^:]+):[ \t]*(.+)$/,
            embeddedColon: /^.*?:\s*['"]?/,
            undefined: /undefined:?\s*/
         },
         // Match if:
         // 1. Property has unbalanced quotes (opening without matching closing or vice versa)
         // 2. Property has malformed value with embedded colons
         // 3. URL property has any quotes (balanced or unbalanced)
         detectError: /^([^:]+):[ \t]*(?:(?:['"][^'"]*(?:$|[^'"]*$))|(?:[^'"]*['"][^'"]*$)|(?:['"][^'"]*:[ \t]*['"][^\n]*$)|(?:['"]https?:\/\/[^'"]*['"]?))/m,
         messageToLog: 'Contains unbalanced quotes or incorrectly quoted URL',
         preventsOperations: ['assureYAMLPropertiesCorrect.cjs', 'fetchOpenGraphData.cjs'],
         correctionFunction: 'attemptToFixUnbalancedQuotes',
         isCritical: true
      },
   // More than one instance of the same key
   // Delete all instances of the key, further scripting will add the key back in with the correct value
   duplicateKeysInFrontmatter: { 
      exampleErrors: [
         `og_last_fetch: 2025-03-07T05:19:02.891Z
         og_last_fetch: '2025-03-09T06:45:20.458Z'`,
         `title: First Title
         description: Some description
         title: Second Title`,
         `  og_last_fetch: 2025-03-07T05:19:02.891Z
            og_last_fetch: '2025-03-09T06:45:20.458Z'`
      ],
      properSyntax: "og_last_fetch: '2025-03-09T06:45:20.458Z'", // only the last instance remains
      detectError: /^[ \t]*([\w-]+):.*\r?\n(?:.*\r?\n)*?[ \t]*\1:/m,
      messageToLog: 'Duplicate keys in frontmatter',
      preventsOperations: ['assureYAMLPropertiesCorrect.cjs'],
      correctionFunction: 'deleteAllInstancesOfDuplicateKeys',
      isCritical: true
   },

   unnecessarySpacingFoundInProperty: {
      //YAML syntax is only one space between the colon and the value. 
      //This is a common error that can cause issues in rendering.
      //Also removes newlines and escape characters from plain text properties
      exampleErrors: [
         "description:   Supercharge your LLM's understanding of JavaScript/TypeScript codebases.",
         "description:   Experience the power of advanced text-to-speech synthesis with F5-TTS.\nTransform your text into natural, expressive speech with precision and ease\nusing our cutting-edge AI technology.",
         "description_site_cp:   The platform where the machine learning community collaborates on models,\ndatasets, and applications."
      ],
      properSyntax: "description: Experience the power of advanced text-to-speech synthesis with F5-TTS. Transform your text into natural, expressive speech with precision and ease using our cutting-edge AI technology.",
      detectError: new RegExp(`^(${PLAIN_TEXT_PROPERTIES.join('|')}):[ \\t]{2,}|^(${PLAIN_TEXT_PROPERTIES.join('|')}):[ \\t]*[^\\n]*(\\n|\\r\\n|\\r)[^\\n]*`, 'gm'),
      messageToLog: 'Fixed spacing and merged multiline text in property',
      preventsOperations: ['assureYAMLPropertiesCorrect.cjs'],
      correctionFunction: 'removeUnnecessarySpacing',
      isCritical: false
   },
   
   // URLs broken across multiple lines
   // Replace the broken url with the intended url as one continguous sting with no surrounding quotes
   brokenUrlAcrossMultipleLines: { 
      exampleErrors: [
         `https://og-screenshots-prod.s3.amazonaws.com/1366x768/80\n
         /false/e2b5f9e76d2b3da32ce84112d40beb0858f9089bebe6bc88ce9b7bbe1911f582.jpeg`
      ],
      properSyntax: "https://og-screenshots-prod.s3.amazonaws.com/1366x768/80/false/e2b5f9e76d2b3da32ce84112d40beb0858f9089bebe6bc88ce9b7bbe1911f582.jpeg",
      // Any time a URL is not in contiguous form. This would only happen as a leftover from a previous scripting oversight. 
      // For instance, a script was run to remove block scalar syntax and instead of assuring a continguous url, the script left a space between the colon and the url. 
      detectError: /^([\w-]+):[ \t]*https?:[ \t]*$/m, 
      messageToLog: 'URL split across multiple lines',
      preventsOperations: ['fetchOpenGraphData.cjs'],
      correctionFunction: 'attemptToFixBrokenUrl',
      isCritical: true
   },
   
   // Missing URL property not found within a directory not found in the excludeUrlCheck array
   // No corection, just a message to log.
   missingUrlPropertyNeededForOpenGraph: {
      exampleErrors: [
         `tags:
         - AI-Toolkit
         - creative-tools`,
         `tags:
         - AI-Toolkit
         - creative-tools
         url:`,
         `tags:
         - AI-Toolkit
         url: ` // empty url property
      ],
      // Simple check - if we can't find "url:" followed by non-whitespace
      detectError: /^(?![\s\S]*?\burl:[ \t]*\S)/,
      messageToLog: 'Missing URL property needed for OpenGraph',
      preventsOperations: ['fetchOpenGraphData.cjs'],
      correctionFunction: 'addFileNameToMissingUrlList',
      isCritical: false
   },

   // uuid properties should not have quotes around them, it will cause unnecessary issues in the future. 
   uuidPropertyWithQuotes: {
      exampleErrors: [
         'uuid: "123e4567-e89b-12d3-a456-426614174000"',
         "uuid: '123e4567-e89b-12d3-a456-426614174000'",
         'site_uuid: "41dc16a2-1ae7-492f-a3b1-f6362ff61ffc"'
      ],
      properSyntax: "uuid: 123e4567-e89b-12d3-a456-426614174000",
      detectError: /^((?:site_)?uuid):[ \t]*["'\`]+([\w-]+)["'\`]+$/m,
      messageToLog: 'UUID property with quotes',
      preventsOperations: ['assureYAMLPropertiesCorrect.cjs'],
      correctionFunction: 'removeQuotesFromUUIDProperty',
      isCritical: false
   },

   // assure only one single set of single mark quotes around any Timestamp property
   // There can be any number of timestamp properties in the 
   // Timestamp property values may have no quotes, 
   // or may have double quotes, or may have mixed quotes or unclosing quotes. It doesn't matter.
   // If there are no quotes, then add one single set of single mark quotes.
   // Detect any variation of existing quotes before and aftera valid timestamp syntax 
   // and remove all of them and replace them with one single set of single mark quotes.
   // If there is one set of single mark quotes, then leave it alone and add an "alreadyCorrect" message.
   // In the reporting also report the number of timestamps alreadyCorrect. 
   assureOnlyOneSetOfSingleMarkQuotesAroundTimestampProperties: {
    exampleErrors: [
      "og_last_error: `'\"2025-03-09T06:45:20.458Z\"",
      "last_jina_request: \"2025-03-09T06:45:20.458Z\"",
      "og_last_fetch: 2025-03-09T06:45:20.458Z",
      "og_last_fetch: 2025-03-09T06:45:20.458Z'",
      "og_last_fetch: '2025-03-09T06:45:20.458Z\"",
      "og_last_fetch: \"2025-03-09T06:45:20.458Z\""
    ],
    properSyntax: "og_last_error: '2025-03-09T06:45:20.458Z'",
    detectError: new RegExp(`^(${TIMESTAMP_PROPERTIES.join('|')}):[ \t]*(?![ \t]*'[^']*'[ \t]*$)(.+)$`, 'm'),
    messageToLog: 'Assured only one set of single mark quotes around timestamp properties',
    preventsOperations: ['assureYAMLPropertiesCorrect.cjs'],
    correctionFunction: 'assureProperQuotesAroundTimestampProperties',
    isCritical: false
   }
};

// ===================================
// Helper Functions
// ===================================

const helperFunctions = {
    /**
     * Extracts frontmatter from markdown file content
     * @param {string} markdownFileContent - Raw content of markdown file
     * @returns {Object} Object containing frontmatter string and indices
     */
    extractFrontmatter(markdownFileContent) {
        // First check for opening delimiter
        const openingMatch = markdownFileContent.match(/^---\n/m);
        if (!openingMatch) {
            return {
                success: true, // Still return success but with empty frontmatter
                frontmatterString: '',
                startIndex: 0,
                endIndex: 0,
                noFrontmatter: true // Flag to indicate no frontmatter found
            };
        }

        // Look for closing delimiter only after the opening delimiter
        const remainingContent = markdownFileContent.slice(openingMatch.index + 4); // Skip past opening ---\n
        const closingMatch = remainingContent.match(/\n---/m);
        
        // If no closing delimiter found, treat everything after opening as frontmatter
        // This allows us to still attempt fixes on malformed frontmatter
        const endIndex = closingMatch 
            ? openingMatch.index + 4 + closingMatch.index + closingMatch[0].length
            : markdownFileContent.length;
        
        const frontmatterString = closingMatch
            ? remainingContent.slice(0, closingMatch.index)
            : remainingContent;

        return {
            success: true,
            frontmatterString,
            startIndex: openingMatch.index,
            endIndex,
            hasClosingDelimiter: !!closingMatch
        };
    },

    /**
     * Creates a standardized success message object
     * @param {string} markdownFilePath - Path to the markdown file
     * @param {boolean} wasModified - Whether the file was modified
     * @param {Array} modifications - Array of modifications made
     * @returns {Object} Standardized success message
     */
    createSuccessMessage(markdownFilePath, wasModified, modifications = []) {
        return {
            success: true,
            modified: wasModified,
            modifications,
            filePath: markdownFilePath,
            fileName: path.basename(markdownFilePath),
            errors: []
        };
    },

    /**
     * Creates a standardized error message object
     * @param {string} markdownFilePath - Path to the markdown file
     * @param {string} errorMessage - Error message
     * @returns {Object} Standardized error message
     */
    createErrorMessage(markdownFilePath, errorMessage) {
        return {
            success: false,
            modified: false,
            modifications: [],
            filePath: markdownFilePath,
            fileName: path.basename(markdownFilePath),
            errors: [errorMessage]
        };
    },

    /**
     * Processes an array of markdown files with a correction function
     * @param {Array<string>} markdownFilePaths - Array of file paths
     * @param {Function} correctionFunction - Function to apply to each file
     * @returns {Array<Object>} Array of results for each file
     */
    async processMarkdownFiles(markdownFilePaths, correctionFunction) {
        const processingResults = [];

        for (const markdownFilePath of markdownFilePaths) {
            try {
                // Process each file independently
                const markdownFileContent = fs.readFileSync(markdownFilePath, 'utf8');
                
                // Extract frontmatter (this will work even if there's no frontmatter or no closing delimiter)
                const frontmatterData = this.extractFrontmatter(markdownFileContent);
                
                // Skip files with no frontmatter but don't treat it as an error
                if (frontmatterData.noFrontmatter) {
                    processingResults.push(this.createSuccessMessage(markdownFilePath, false));
                    continue;
                }

                // Apply the correction function
                const result = await correctionFunction(markdownFileContent, markdownFilePath);
                
                // If the file was modified, write the changes
                if (result.modified && result.content) {
                    try {
                        fs.writeFileSync(markdownFilePath, result.content);
                    } catch (writeError) {
                        // If we can't write the file, add it as an error but continue processing
                        result.errors.push(`Failed to write changes: ${writeError.message}`);
                        result.modified = false;
                        delete result.content;
                    }
                }
                
                processingResults.push(result);
            } catch (error) {
                // Log the error but continue processing other files
                processingResults.push(this.createErrorMessage(
                    markdownFilePath,
                    `Error processing file: ${error.message}`
                ));
            }
        }

        return processingResults;
    }   
};

// ===================================
// Correction Functions
// ===================================

/**
 * Collection of correction functions that attempt to fix common issues
 */
const correctionFunctions = {
    // Once detected from the detectError regular expression, 
    // the correction function will attempt to fix the error
    // by surrounding error messages with a ' single mark quote on both sides 
    async surroundErrorMessagePropertiesWithSingleMarkQuotes(markdownContent, markdownFilePath) {
        let wasModified = false;
        const modifications = [];
        const frontmatterData = helperFunctions.extractFrontmatter(markdownContent);
        
        if (!frontmatterData.success) {
            return helperFunctions.createErrorMessage(markdownFilePath, frontmatterData.error);
        }

        let isolatedFrontmatterString = frontmatterData.frontmatterString;
        
        // Process each error message property
        for (const errorProperty of ERROR_MESSAGE_PROPERTIES) {
            const propertyRegex = new RegExp(`^(${errorProperty}):[ \t]*(?![ \t]*'[^']*'[ \t]*$)(.+)$`, 'm');
            const propertyMatch = isolatedFrontmatterString.match(propertyRegex);
            
            if (propertyMatch) {
                const [fullMatch, propertyName, valueWithError] = propertyMatch;
                // Clean the value by removing any existing quotes and trimming
                const cleanValue = valueWithError.replace(/['"]/g, '').trim();
                const correctedValue = `${propertyName}: '${cleanValue}'`;
                
                modifications.push({
                    property: propertyName,
                    from: fullMatch,
                    to: correctedValue
                });

                isolatedFrontmatterString = isolatedFrontmatterString.replace(
                    fullMatch,
                    correctedValue
                );
                wasModified = true;
            }
        }

        if (wasModified) {
            const correctedContent = markdownContent.slice(0, frontmatterData.startIndex) +
                '---\n' + isolatedFrontmatterString + '\n---' +
                markdownContent.slice(frontmatterData.endIndex);

            return {
                ...helperFunctions.createSuccessMessage(markdownFilePath, true, modifications),
                content: correctedContent
            };
        }

        return helperFunctions.createSuccessMessage(markdownFilePath, false);
    },

    // Once detected from the detectError regular expression, 
    // the correction function will attempt to fix the error
    // by removing the improper character set and adding a ' single mark quote on both sides
    // the primary cause of this error is a mix of double and single mark quotes in sequence
    // so be sure to remove all instances of single or double mark quotes as well as any other characters that are not part of the URL
    async removeImproperCharacterSetAddSingleMarkQuotes(markdownFileContent, markdownFilePath) {
        const frontmatterData = helperFunctions.extractFrontmatter(markdownFileContent);
        if (!frontmatterData.success) {
            return helperFunctions.createErrorMessage(markdownFilePath, frontmatterData.error);
        }

        let isolatedFrontmatterString = frontmatterData.frontmatterString;
        let wasModified = false;
        const modifications = [];

        // Process each error message property
        for (const errorProperty of ERROR_MESSAGE_PROPERTIES) {
            const propertyRegex = new RegExp(`^(${errorProperty}):[ \t]*(?:["'].*["']|["'].*|.*["'])[ \t]*$`, 'm');
            const propertyMatch = isolatedFrontmatterString.match(propertyRegex);
            
            if (propertyMatch) {
                const [fullMatch, propertyName] = propertyMatch;
                // Extract the value part (everything after the colon)
                const valueWithQuotes = fullMatch.slice(fullMatch.indexOf(':') + 1).trim();
                
                // Clean the value by removing all quotes and trimming
                const cleanValue = valueWithQuotes
                    .replace(/^['"]+|['"]+$/g, '') // Remove quotes from start/end
                    .replace(/['"]/g, '')          // Remove any remaining quotes
                    .trim();

                const correctedValue = `${propertyName}: '${cleanValue}'`;

                modifications.push({
                    property: propertyName,
                    from: fullMatch,
                    to: correctedValue
                });

                isolatedFrontmatterString = isolatedFrontmatterString.replace(
                    fullMatch,
                    correctedValue
                );
                wasModified = true;
            }
        }

        if (wasModified) {
            const correctedContent = markdownFileContent.slice(0, frontmatterData.startIndex) +
                '---\n' + isolatedFrontmatterString + '\n---' +
                markdownFileContent.slice(frontmatterData.endIndex);

            return {
                ...helperFunctions.createSuccessMessage(markdownFilePath, true, modifications),
                content: correctedContent
            };
        }

        return helperFunctions.createSuccessMessage(markdownFilePath, false);
    },

    // Once detected from the detectError regular expression, 
    // the correction function will attempt to fix the error
    // by removing any quotes found on on either side of a URL
    async removeAnyQuoteCharactersfromEitherOrBothSidesOfURL(markdownFileContent, markdownFilePath) {
        const frontmatterData = helperFunctions.extractFrontmatter(markdownFileContent);
        if (!frontmatterData.success) {
            return helperFunctions.createErrorMessage(markdownFilePath, frontmatterData.error);
        }

        let isolatedFrontmatterString = frontmatterData.frontmatterString;
        let wasModified = false;
        const modifications = [];

        // Function to process a single line
        function processLine(line) {
            // Check if this is a URL property line
            const urlPropMatch = line.match(new RegExp(`^(${URL_PROPERTIES.join('|')}):[ \t]*(.+)$`));
            if (!urlPropMatch) return line;

            const [fullMatch, propName, value] = urlPropMatch;
            
            // Extract URL by removing all quotes and spaces around it
            let cleanValue = value;
            let hadQuotes = false;

            // Keep removing quotes until no more quotes exist
            let previousValue;
            do {
                previousValue = cleanValue;
                cleanValue = cleanValue
                    .replace(/^[\s"'`]+/, '') // Remove leading quotes and spaces
                    .replace(/[\s"'`]+$/, '') // Remove trailing quotes and spaces
                    .replace(/["'`]/g, '');   // Remove any remaining quotes
                
                if (cleanValue !== previousValue) {
                    hadQuotes = true;
                }
            } while (cleanValue !== previousValue);

            if (hadQuotes) {
                return `${propName}: ${cleanValue}`;
            }
            return line;
        }

        // Process each line
        const lines = isolatedFrontmatterString.split('\n');
        const processedLines = lines.map(line => {
            const processed = processLine(line.trim());
            if (processed !== line.trim()) {
                wasModified = true;
                modifications.push({
                    property: line.split(':')[0],
                    from: line,
                    to: processed
                });
            }
            return processed;
        });

        if (wasModified) {
            const newFrontmatter = processedLines.join('\n');
            const correctedContent = markdownFileContent.slice(0, frontmatterData.startIndex) +
                '---\n' + newFrontmatter + '\n---' +
                markdownFileContent.slice(frontmatterData.endIndex);

            return {
                ...helperFunctions.createSuccessMessage(markdownFilePath, true, modifications),
                content: correctedContent
            };
        }

        return helperFunctions.createSuccessMessage(markdownFilePath, false);
    },

    // Once detected from the detectError regular expression, 
    // the correction function will attempt to fix the error
    // by removing any block scalar syntax found in the property
    async attemptToFixBlockScalar(markdownFileContent, markdownFilePath) {
        const frontmatterData = helperFunctions.extractFrontmatter(markdownFileContent);
        if (!frontmatterData.success) {
            return helperFunctions.createErrorMessage(markdownFilePath, frontmatterData.error);
        }

        let isolatedFrontmatterString = frontmatterData.frontmatterString;
        let wasModified = false;
        const modifications = [];

        // Process each line
        const lines = isolatedFrontmatterString.split('\n');
        const processedLines = [];
        let inBlockScalar = false;
        let currentProperty = null;
        let blockLines = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const blockScalarMatch = line.match(knownErrorCases.blockScalarSyntaxFoundInProperty.detectError);

            if (blockScalarMatch) {
                // Start of a block scalar
                inBlockScalar = true;
                currentProperty = blockScalarMatch[1];
                if (blockScalarMatch[3]) {
                    blockLines.push(blockScalarMatch[3]);
                }
            } else if (inBlockScalar && line.match(/^\s+\S/)) {
                // Continuation of block scalar
                blockLines.push(line.trim());
            } else if (inBlockScalar) {
                // End of block scalar
                const value = blockLines.join(' ').trim();
                processedLines.push(`${currentProperty}: ${value}`);
                wasModified = true;
                modifications.push({
                    property: currentProperty,
                    from: `${currentProperty}: >-\n${blockLines.join('\n')}`,
                    to: `${currentProperty}: ${value}`
                });
                inBlockScalar = false;
                currentProperty = null;
                blockLines = [];
                if (line) processedLines.push(line);
            } else {
                processedLines.push(line);
            }
        }

        // Handle any remaining block scalar
        if (inBlockScalar) {
            const value = blockLines.join(' ').trim();
            processedLines.push(`${currentProperty}: ${value}`);
            wasModified = true;
            modifications.push({
                property: currentProperty,
                from: `${currentProperty}: >-\n${blockLines.join('\n')}`,
                to: `${currentProperty}: ${value}`
            });
        }

        if (wasModified) {
            const newFrontmatter = processedLines.join('\n');
            const correctedContent = markdownFileContent.slice(0, frontmatterData.startIndex) +
                '---\n' + newFrontmatter + '\n---' +
                markdownFileContent.slice(frontmatterData.endIndex);

            return {
                ...helperFunctions.createSuccessMessage(markdownFilePath, true, modifications),
                content: correctedContent
            };
        }

        return helperFunctions.createSuccessMessage(markdownFilePath, false);
    },

    // Once detected from the detectError regular expression, 
    // the correction function will attempt to fix the error
    // by attempting to fix unbalanced quotes
    async attemptToFixUnbalancedQuotes(markdownFileContent, markdownFilePath) {
        const frontmatterData = helperFunctions.extractFrontmatter(markdownFileContent);
        if (!frontmatterData.success) {
            return helperFunctions.createErrorMessage(markdownFilePath, frontmatterData.error);
        }

        let isolatedFrontmatterString = frontmatterData.frontmatterString;
        let wasModified = false;
        const modifications = [];

        // Get regex patterns from knownErrorCases
        const { propertyAndValue, embeddedColon, undefined: undefinedPattern } = knownErrorCases.unbalancedQuotesFoundInProperty.patterns;

        // Process each line
        const lines = isolatedFrontmatterString.split('\n');
        const processedLines = lines.map(line => {
            const propertyMatch = line.match(propertyAndValue);
            if (!propertyMatch) return line;

            const [fullMatch, propertyName, value] = propertyMatch;
            const trimmedValue = value.trim();

            // For URL properties, remove all quotes
            if (URL_PROPERTIES.includes(propertyName)) {
                if (trimmedValue.includes("'") || trimmedValue.includes('"')) {
                    const cleanUrl = trimmedValue.replace(/['"]/g, '').trim();
                    const correctedValue = `${propertyName}: ${cleanUrl}`;
                    
                    if (correctedValue !== line) {
                        wasModified = true;
                        modifications.push({
                            property: propertyName,
                            from: line,
                            to: correctedValue
                        });
                        return correctedValue;
                    }
                }
                return line;
            }

            // Handle malformed properties with embedded colons
            if (trimmedValue.includes(": '") || trimmedValue.includes(': "')) {
                const cleanValue = trimmedValue
                    .replace(embeddedColon, '')
                    .replace(/['"]$/, '')
                    .replace(undefinedPattern, '')
                    .trim();

                const correctedValue = `${propertyName}: ${cleanValue}`;
                wasModified = true;
                modifications.push({
                    property: propertyName,
                    from: line,
                    to: correctedValue
                });
                return correctedValue;
            }

            // Check for unbalanced quotes
            const openingSingle = trimmedValue.startsWith("'");
            const closingSingle = trimmedValue.endsWith("'");
            const openingDouble = trimmedValue.startsWith('"');
            const closingDouble = trimmedValue.endsWith('"');

            // If quotes are balanced (both present or both absent), leave it alone
            if ((openingSingle === closingSingle) && (openingDouble === closingDouble)) {
                return line;
            }

            // Determine which quote type to use based on what's present
            let quoteType = "'"; // default to single quotes
            if (openingDouble || closingDouble) {
                quoteType = '"';
            }

            // Clean the value and reapply the correct quotes
            const cleanValue = trimmedValue
                .replace(/^['"]/, '')
                .replace(/['"]$/, '')
                .replace(undefinedPattern, '')
                .trim();

            const correctedValue = `${propertyName}: ${quoteType}${cleanValue}${quoteType}`;

            if (correctedValue !== line) {
                wasModified = true;
                modifications.push({
                    property: propertyName,
                    from: line,
                    to: correctedValue
                });
                return correctedValue;
            }
            return line;
        });

        if (wasModified) {
            const newFrontmatter = processedLines.join('\n');
            const correctedContent = markdownFileContent.slice(0, frontmatterData.startIndex) +
                '---\n' + newFrontmatter + '\n---' +
                markdownFileContent.slice(frontmatterData.endIndex);

            return {
                ...helperFunctions.createSuccessMessage(markdownFilePath, true, modifications),
                content: correctedContent
            };
        }

        return helperFunctions.createSuccessMessage(markdownFilePath, false);
    },

    // Once detected from the detectError regular expression, 
    // the correction function will attempt to fix the error
    // by deleting all instances of the key
    async deleteAllInstancesOfDuplicateKeys(markdownFileContent, markdownFilePath) {
        const frontmatterData = helperFunctions.extractFrontmatter(markdownFileContent);
        if (!frontmatterData.success) {
            return helperFunctions.createErrorMessage(markdownFilePath, frontmatterData.error);
        }

        let wasModified = false;
        const modifications = [];

        // Split into lines and process
        const lines = frontmatterData.frontmatterString.split('\n');
        const seenKeys = new Map(); // key -> {lineNum, value}

        // First pass: find all keys and their last occurrence
        lines.forEach((line, index) => {
            const match = line.trim().match(/^([\w-]+):(.*)$/);
            if (match) {
                const [, key, value] = match;
                seenKeys.set(key, { lineNum: index, value: value.trim() });
            }
        });

        // Second pass: remove duplicate keys (keeping only the last instance)
        const linesToRemove = new Set();
        lines.forEach((line, index) => {
            const match = line.trim().match(/^([\w-]+):/);
            if (match) {
                const [, key] = match;
                const lastInstance = seenKeys.get(key);
                if (lastInstance && lastInstance.lineNum !== index) {
                    linesToRemove.add(index);
                    wasModified = true;
                    modifications.push({
                        property: key,
                        from: line.trim(),
                        to: `${key}: ${lastInstance.value}`
                    });
                }
            }
        });

        if (wasModified) {
            // Create new content without the duplicate lines
            const newLines = lines.filter((_, index) => !linesToRemove.has(index));
            const correctedContent = markdownFileContent.slice(0, frontmatterData.startIndex) +
                '---\n' + newLines.join('\n') + '\n---' +
                markdownFileContent.slice(frontmatterData.endIndex);

            return {
                ...helperFunctions.createSuccessMessage(markdownFilePath, true, modifications),
                content: correctedContent
            };
        }

        return helperFunctions.createSuccessMessage(markdownFilePath, false);
    },
   
   // Once detected from the detectError regular expression, 
   // the correction function will attempt to fix the error
   // by removing unnecessary spacing
   async removeUnnecessarySpacing(markdownFileContent, markdownFilePath) {
      const frontmatterData = helperFunctions.extractFrontmatter(markdownFileContent);
      if (!frontmatterData.success) {
         return helperFunctions.createErrorMessage(markdownFilePath, frontmatterData.error);
      }

      let isolatedFrontmatterString = frontmatterData.frontmatterString;
      let wasModified = false;
      const modifications = [];

      // Function to process a property value
      function cleanPropertyValue(value) {
         return value
            .split(/\r?\n/)         // Split on any type of newline
            .map(line => line.trim()) // Trim each line
            .join(' ')              // Join with spaces
            .replace(/\s+/g, ' ')   // Replace multiple spaces with one
            .trim();                // Final trim
      }

      // Process each line
      const lines = isolatedFrontmatterString.split('\n');
      let currentProperty = null;
      let currentValue = [];
      let processedLines = [];

      for (let i = 0; i < lines.length; i++) {
         const line = lines[i];
         const propMatch = line.match(new RegExp(`^(${PLAIN_TEXT_PROPERTIES.join('|')}):[ \\t]*(.*)$`));

         if (propMatch) {
            // If we were processing a previous property, clean and add it
            if (currentProperty) {
               const cleanValue = cleanPropertyValue(currentValue.join('\n'));
               processedLines.push(`${currentProperty}: ${cleanValue}`);
               wasModified = true;
            }

            // Start new property
            currentProperty = propMatch[1];
            currentValue = [propMatch[2]];
         } else if (currentProperty && line.match(/^\s+\S/)) {
            // This line is a continuation of the current property
            currentValue.push(line);
         } else {
            // If we were processing a property, finish it
            if (currentProperty) {
               const cleanValue = cleanPropertyValue(currentValue.join('\n'));
               processedLines.push(`${currentProperty}: ${cleanValue}`);
               wasModified = true;
               currentProperty = null;
               currentValue = [];
            }
            // Add non-matching line as is
            processedLines.push(line);
         }
      }

      // Handle the last property if any
      if (currentProperty) {
         const cleanValue = cleanPropertyValue(currentValue.join('\n'));
         processedLines.push(`${currentProperty}: ${cleanValue}`);
         wasModified = true;
      }

      if (wasModified) {
         const newFrontmatter = processedLines.join('\n');
         const correctedContent = markdownFileContent.slice(0, frontmatterData.startIndex) +
            '---\n' + newFrontmatter + '\n---' +
            markdownFileContent.slice(frontmatterData.endIndex);

         return {
            ...helperFunctions.createSuccessMessage(markdownFilePath, true, modifications),
            content: correctedContent
         };
      }

      return helperFunctions.createSuccessMessage(markdownFilePath, false);
   },
   
   // Once detected from the detectError regular expression, 
   // the correction function will attempt to fix the error
   // by attempting to fix a broken url
   async attemptToFixBrokenUrl(markdownFileContent, markdownFilePath) {
      const frontmatterData = helperFunctions.extractFrontmatter(markdownFileContent);
      if (!frontmatterData.success) {
         return helperFunctions.createErrorMessage(markdownFilePath, frontmatterData.error);
      }

      let isolatedFrontmatterString = frontmatterData.frontmatterString;
      let wasModified = false;
      const modifications = [];

      const errorDetectionRegex = knownErrorCases.brokenUrlAcrossMultipleLines.detectError;

      const propertyMatch = isolatedFrontmatterString.match(errorDetectionRegex);
      if (propertyMatch) {
         const [fullMatch, propertyName, valueWithError] = propertyMatch;
         const correctedValue = `${propertyName}: '${valueWithError.trim()}'`;

         modifications.push({
            property: propertyName,
            from: fullMatch,
            to: correctedValue
         });

         isolatedFrontmatterString = isolatedFrontmatterString.replace(
            fullMatch,
            correctedValue
         );
         wasModified = true;
      }

      if (wasModified) {
         const correctedContent = markdownFileContent.slice(0, frontmatterData.startIndex) +
            '---\n' + isolatedFrontmatterString + '\n---' +
            markdownFileContent.slice(frontmatterData.endIndex);

         return {
            ...helperFunctions.createSuccessMessage(markdownFilePath, true, modifications),
            content: correctedContent
         };
      }

      return helperFunctions.createSuccessMessage(markdownFilePath, false);
   },
   
   // This function should first be sure the file is not in a directory that is excluded from URL checks. 
   // The single source of truth is in getUserOptions.cjs as USER_OPTIONS.directories.excludeUrlCheck
   // Once detected from the detectError regular expression, 
   // the correction function will attempt to fix the error
   // by adding the file name to the missing url list 
   // which will then be used in otherscripts for reporting purposes.
   async addFileNameToMissingUrlList(markdownFileContent, markdownFilePath) {
      const frontmatterData = helperFunctions.extractFrontmatter(markdownFileContent);
      if (!frontmatterData.success) {
         return helperFunctions.createErrorMessage(markdownFilePath, frontmatterData.error);
      }

      let isolatedFrontmatterString = frontmatterData.frontmatterString;
      let wasModified = false;
      const modifications = [];

      // Use regex from knownErrorCases
      const errorDetectionRegex = knownErrorCases.missingUrlPropertyNeededForOpenGraph.detectError;

      const propertyMatch = isolatedFrontmatterString.match(errorDetectionRegex);
      if (propertyMatch) {
         const [fullMatch, propertyName, valueWithError] = propertyMatch;
         // Remove missing url property and add file name to missing url list
         isolatedFrontmatterString = isolatedFrontmatterString.replace(
            fullMatch,
            ''
         );
         wasModified = true;
      }

      if (wasModified) {
         const correctedContent = markdownFileContent.slice(0, frontmatterData.startIndex) +
            '---\n' + isolatedFrontmatterString + '\n---' +
            markdownFileContent.slice(frontmatterData.endIndex);

         return {
            ...helperFunctions.createSuccessMessage(markdownFilePath, true, modifications),
            content: correctedContent
         };
      }

      return helperFunctions.createSuccessMessage(markdownFilePath, false);
   },
   
   // Once detected from the detectError regular expression, 
   // the correction function will attempt to fix the error
   // by removing quotes from the UUID property
   async removeQuotesFromUUIDProperty(markdownFileContent, markdownFilePath) {
      const frontmatterData = helperFunctions.extractFrontmatter(markdownFileContent);
      if (!frontmatterData.success) {
         return helperFunctions.createErrorMessage(markdownFilePath, frontmatterData.error);
      }

      let isolatedFrontmatterString = frontmatterData.frontmatterString;
      let wasModified = false;
      const modifications = [];

      const propertyRegex = /^((?:site_)?uuid):[ \t]*["'\`]+([\w-]+)["'\`]+$/m;
      const propertyMatch = isolatedFrontmatterString.match(propertyRegex);
      
      if (propertyMatch) {
         const [fullMatch, propertyName, uuid] = propertyMatch;
         // Remove quotes from UUID property
         const correctedValue = `${propertyName}: ${uuid}`;

         modifications.push({
            property: propertyName,
            from: fullMatch,
            to: correctedValue
         });

         isolatedFrontmatterString = isolatedFrontmatterString.replace(
            fullMatch,
            correctedValue
         );
         wasModified = true;
      }

      if (wasModified) {
         const correctedContent = markdownFileContent.slice(0, frontmatterData.startIndex) +
            '---\n' + isolatedFrontmatterString + '\n---' +
            markdownFileContent.slice(frontmatterData.endIndex);

         return {
            ...helperFunctions.createSuccessMessage(markdownFilePath, true, modifications),
            content: correctedContent
         };
      }

      return helperFunctions.createSuccessMessage(markdownFilePath, false);
   },

   // Once detected from the detectError regular expression,
   // the correction function will attempt to fix the error
   // by ensuring timestamp properties have exactly one set of single quotes
   async assureProperQuotesAroundTimestampProperties(markdownFileContent, markdownFilePath) {
      const frontmatterData = helperFunctions.extractFrontmatter(markdownFileContent);
      if (!frontmatterData.success) {
         return helperFunctions.createErrorMessage(markdownFilePath, frontmatterData.error);
      }

      let isolatedFrontmatterString = frontmatterData.frontmatterString;
      let wasModified = false;
      const modifications = [];
      const alreadyCorrect = [];

      const errorDetectionRegex = knownErrorCases.assureOnlyOneSetOfSingleMarkQuotesAroundTimestampProperties.detectError;
      const matches = [...isolatedFrontmatterString.matchAll(new RegExp(errorDetectionRegex.source, 'gm'))];
      
      for (const match of matches) {
         const [fullMatch, propertyName] = match;
         const valueWithQuotes = fullMatch.slice(propertyName.length + 1).trim();
         const cleanValue = valueWithQuotes
            .replace(/^[`'"]+/g, '')
            .replace(/[`'"]+$/g, '')
            .replace(/[`'"]/g, '')
            .trim();

         if (valueWithQuotes === `'${cleanValue}'`) {
            alreadyCorrect.push(propertyName);
            continue;
         }

         const correctedValue = `${propertyName}: '${cleanValue}'`;
         modifications.push({
            property: propertyName,
            from: fullMatch,
            to: correctedValue
         });

         isolatedFrontmatterString = isolatedFrontmatterString.replace(
            fullMatch,
            correctedValue
         );
         wasModified = true;
      }

      if (wasModified || alreadyCorrect.length > 0) {
         const correctedContent = wasModified ? (
            markdownFileContent.slice(0, frontmatterData.startIndex) +
            '---\n' + isolatedFrontmatterString + '\n---' +
            markdownFileContent.slice(frontmatterData.endIndex)
         ) : markdownFileContent;

         return {
            ...helperFunctions.createSuccessMessage(markdownFilePath, wasModified, modifications),
            content: correctedContent,
            alreadyCorrect
         };
      }

      return helperFunctions.createSuccessMessage(markdownFilePath, false);
   }
};

module.exports = {
   knownErrorCases,
   helperFunctions,
   correctionFunctions
};