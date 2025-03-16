import { USER_OPTIONS } from './getUserOptions.cjs';
import path from 'path';
import fs from 'fs';

const ERROR_MESSAGE_PROPERTIES = USER_OPTIONS.frontmatterPropertySets.errorMessageProperties;
const URL_PROPERTIES = USER_OPTIONS.frontmatterPropertySets.urlProperties;
const PLAIN_TEXT_PROPERTIES = USER_OPTIONS.frontmatterPropertySets.plainTextProperties;

const knownErrorCases = {

   // Unquoted error message properties (critical)
   // Surround the error message property with double mark quotes
   unquotedErrorMessageProperty: {
      exampleErrors: [
         "HTTP error!",
         "Error occurred 404"
      ],
      properSyntax: "'Error occurred 404'", // only one set of single mark quotes. 
      detectError: /^(error_message|og_errors|jine_error|validation_errors):[ \t]*[^"'][^"\n]+$/m,
      messageToLog: 'Contains unquoted error message property',
      preventsOperations: ['assureYAMLPropertiesCorrect.cjs'],
      correctionFunction: 'surroundErrorMessagePropertyWithSingleMarkQuotes',
      isCritical: true
   },

   // Improper character set surrounding error message
   // This is a critical error that prevents any script from running
   // Remove the improper character set and add double mark quotes
   improperCharacterSetSurroundingErrorMessage: {
      exampleErrors: [
         "\'\"Error occurred 404\"\'"
      ],
      properSyntax: "'Error occurred 404'", // only one set of single mark quotes. 
      detectError: /^["']{2,}|["']{2,}$|^"|"$/m,
      messageToLog: 'Error message with improperly formatted character set',
      preventsOperations: ['assureYAMLPropertiesCorrect.cjs'],
      correctionFunction: 'removeImproperCharacterSetThenAddSingleMarkQuotes',
      isCritical: true
   },

   // Quotes present in the URL property
   // Quotes surrounding a URL throw errors in the fetchOpenGraphData.cjs script
   // Remove any quotes found on on either side of a URL
   undesiredQuotesPresentInURLProperty: {
      exampleErrors: [
         `""'https://www.archonlabs.com/'""`, 
         "\"https://cdn.prod.website-files.com/66c5c2bab55d37d8e443322b/66cc6d2f0f6b41b86ea33f83_archon-og.jpg\""
      ], //any kind of quote on eitherside of a url witll throw errors in several crucial build scripts.  
      detectError: /^(https?:\/\/[^\s"']+)["']+|["']+(https?:\/\/[^\s"']+)$/m,
      propertSyntax: "https://www.archonlabs.com/", //only the URL, NO QUOTES, quotes will later throw errors. The quotes are in this proper esyntax but only to demarcate a string. 
      messageToLog: '',
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
   unbalancedQuotesFoundInProperty:     {
         exampleErrors: [
            "description: 'Supercharge your LLM's understanding of JavaScript/TypeScript codebases.",
            "last_jina_request: '2025-03-09T06:45:20.458Z'"
         ],
         properSyntax: "description: 'Supercharge your LLM's understanding of JavaScript/TypeScript codebases.'",
         detectError: /^([^:]+):[ \t]*(?:(['"])(?:(?!\2)|$)|[^'"]*['"][^'"]*$)/m,
         messageToLog: 'Contains unbalanced quotes in value',
         preventsOperations: ['assureYAMLPropertiesCorrect.cjs', 'fetchOpenGraphData.cjs'],
         correctionFunction: 'attemptToFixUnbalancedQuotes',
         isCritical: true
      },
   // More than one instance of the same key
   // Delete all instances of the key, further scripting will add the key back in with the correct value
   duplicateKeysInFrontmatter: { 
      exampleErrors: [
         "og_last_fetch: 2025-03-07T05:19:02.891Z",
         "og_last_fetch: '2025-03-09T06:45:20.458Z'"
      ],
      //Detect when the same key is used more than once in the frontmatter. 
      //This is a critical error that prevents any script from running.
      detectError: /^([\w-]+):[^\n]*\n(?:[\s\S]*?)^\1:/m, 
      messageToLog: 'Duplicate keys in frontmatter',
      preventsOperations: ['assureYAMLPropertiesCorrect.cjs'],
      correctionFunction: 'deleteAllInstancesOfKey',
      isCritical: true
   },

   unnecessarySpacingFoundInProperty: {
      //YAML syntax is only one space between the colon and the value. 
      //This is a common error that can cause issues in rendering.
      exampleErrors: [
         "description:   Supercharge your LLM's understanding of JavaScript/TypeScript codebases."
      ],
      properSyntax: "description: Supercharge your LLM's understanding of JavaScript/TypeScript codebases.",
      detectError: /^([^:]+):[ \t]{2,}/m,
      messageToLog: 'Unnecessary spacing found in property',
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
         `---
         tags:
         - AI-Toolkit
         - creative-tools
         ---`,
         `---
         tags:
         - AI-Toolkit
         - creative-tools
         url: 
         ---`
      ],
      detectError: /^---\n(?:(?!url:[\s\S]+[^\s]).)*\n---/m,
      messageToLog: 'Missing URL property needed for OpenGraph',
      preventsOperations: ['fetchOpenGraphData.cjs'],
      correctionFunction: 'addToMissingUrlListForReporting',
      isCritical: false
   },

   // uuid properties should not have quotes around them, it will cause unnecessary issues in the future. 
   uuidPropertyWithQuotes: {
      exampleErrors: [
         'uuid: "123e4567-e89b-12d3-a456-426614174000"',
         "uuid: '123e4567-e89b-12d3-a456-426614174000'",
      ],
      properSyntax: "uuid: 123e4567-e89b-12d3-a456-426614174000",
      detectError: /^(uuid+):[ \t]*['"]+[ \t]*$/m,
      messageToLog: 'UUID property with quotes',
      preventsOperations: ['assureYAMLPropertiesCorrect.cjs'],
      correctionFunction: 'removeQuotesFromUUIDProperty',
      isCritical: false
   }
}

// ===================================
// Helper Functions
// ===================================

/**
 * Extracts frontmatter from markdown file content
 * @param {string} markdownFileContent - Raw content of markdown file
 * @returns {Object} Object containing frontmatter string and indices
 */
function extractFrontmatter(markdownFileContent) {
    const frontmatterMatch = markdownFileContent.match(/^---\n([\s\S]*?)\n---/m);
    if (!frontmatterMatch) {
        return {
            success: false,
            error: 'No frontmatter found'
        };
    }

    return {
        success: true,
        frontmatterString: frontmatterMatch[1],
        startIndex: frontmatterMatch.index,
        endIndex: frontmatterMatch.index + frontmatterMatch[0].length
    };
}

/**
 * Creates a standardized success message object
 * @param {string} markdownFilePath - Path to the markdown file
 * @param {boolean} wasModified - Whether the file was modified
 * @param {Array} modifications - Array of modifications made
 * @returns {Object} Standardized success message
 */
function createSuccessMessage(markdownFilePath, wasModified, modifications = []) {
    return {
        success: true,
        modified: wasModified,
        modifications,
        filePath: markdownFilePath,
        fileName: path.basename(markdownFilePath),
        errors: []
    };
}

/**
 * Creates a standardized error message object
 * @param {string} markdownFilePath - Path to the markdown file
 * @param {string} errorMessage - Error message
 * @returns {Object} Standardized error message
 */
function createErrorMessage(markdownFilePath, errorMessage) {
    return {
        success: false,
        modified: false,
        modifications: [],
        filePath: markdownFilePath,
        fileName: path.basename(markdownFilePath),
        errors: [errorMessage]
    };
}

/**
 * Processes an array of markdown files with a correction function
 * @param {Array<string>} markdownFilePaths - Array of file paths
 * @param {Function} correctionFunction - Function to apply to each file
 * @returns {Array<Object>} Array of results for each file
 */
async function processMarkdownFiles(markdownFilePaths, correctionFunction) {
    const processingResults = [];

    for (const markdownFilePath of markdownFilePaths) {
        try {
            const markdownFileContent = fs.readFileSync(markdownFilePath, 'utf8');
            const result = await correctionFunction(markdownFileContent, markdownFilePath);
            
            if (result.modified) {
                fs.writeFileSync(markdownFilePath, result.content);
            }
            
            processingResults.push(result);
        } catch (error) {
            processingResults.push(createErrorMessage(markdownFilePath, error.message));
        }
    }

    return processingResults;
}

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
    async surroundErrorMessagePropertyWithSingleMarkQuotes(markdownFileContent, markdownFilePath) {
        // Extract frontmatter using helper function
        const frontmatterData = extractFrontmatter(markdownFileContent);
        if (!frontmatterData.success) {
            return createErrorMessage(markdownFilePath, frontmatterData.error);
        }

        let isolatedFrontmatterString = frontmatterData.frontmatterString;
        let wasModified = false;
        const modifications = [];

        // Use regex from knownErrorCases
        const errorDetectionRegex = knownErrorCases.unquotedErrorMessageProperty.detectError;
        
        // Process each error message property
        for (const errorProperty of ERROR_MESSAGE_PROPERTIES) {
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
        }

        if (wasModified) {
            const correctedContent = markdownFileContent.slice(0, frontmatterData.startIndex) +
                '---\n' + isolatedFrontmatterString + '\n---' +
                markdownFileContent.slice(frontmatterData.endIndex);

            return {
                ...createSuccessMessage(markdownFilePath, true, modifications),
                content: correctedContent
            };
        }

        return createSuccessMessage(markdownFilePath, false);
    },

    // Once detected from the detectError regular expression, 
    // the correction function will attempt to fix the error
    // by removing the improper character set and adding a ' single mark quote on both sides
    // the primary cause of this error is a mix of double and single mark quotes in sequence
    // so be sure to remove all instances of single or double mark quotes as well as any other characters that are not part of the URL
    async removeImproperCharacterSetAddSingleMarkQuotes(markdownFileContent, markdownFilePath) {
        const frontmatterData = extractFrontmatter(markdownFileContent);
        if (!frontmatterData.success) {
            return createErrorMessage(markdownFilePath, frontmatterData.error);
        }

        let isolatedFrontmatterString = frontmatterData.frontmatterString;
        let wasModified = false;
        const modifications = [];

        // Use regex from knownErrorCases
        const errorDetectionRegex = knownErrorCases.improperCharacterSetSurroundingErrorMessage.detectError;

        const propertyMatch = isolatedFrontmatterString.match(errorDetectionRegex);
        if (propertyMatch) {
            const [fullMatch, propertyName, valueWithError] = propertyMatch;
            // Remove all quotes and add single quotes
            const cleanValue = valueWithError.replace(/["']/g, '').trim();
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

        if (wasModified) {
            const correctedContent = markdownFileContent.slice(0, frontmatterData.startIndex) +
                '---\n' + isolatedFrontmatterString + '\n---' +
                markdownFileContent.slice(frontmatterData.endIndex);

            return {
                ...createSuccessMessage(markdownFilePath, true, modifications),
                content: correctedContent
            };
        }

        return createSuccessMessage(markdownFilePath, false);
    },

    // Once detected from the detectError regular expression, 
    // the correction function will attempt to fix the error
    // by removing any quotes found on on either side of a URL
    async removeAnyQuoteCharactersfromEitherOrBothSidesOfURL(markdownFileContent, markdownFilePath) {
        const frontmatterData = extractFrontmatter(markdownFileContent);
        if (!frontmatterData.success) {
            return createErrorMessage(markdownFilePath, frontmatterData.error);
        }

        let isolatedFrontmatterString = frontmatterData.frontmatterString;
        let wasModified = false;
        const modifications = [];

        // Use regex from knownErrorCases
        const errorDetectionRegex = knownErrorCases.undesiredQuotesPresentInURLProperty.detectError;

        const propertyMatch = isolatedFrontmatterString.match(errorDetectionRegex);
        if (propertyMatch) {
            const [fullMatch, propertyName, valueWithError] = propertyMatch;
            // Remove all quotes and add single quotes
            const cleanValue = valueWithError.replace(/["']/g, '').trim();
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

        if (wasModified) {
            const correctedContent = markdownFileContent.slice(0, frontmatterData.startIndex) +
                '---\n' + isolatedFrontmatterString + '\n---' +
                markdownFileContent.slice(frontmatterData.endIndex);

            return {
                ...createSuccessMessage(markdownFilePath, true, modifications),
                content: correctedContent
            };
        }

        return createSuccessMessage(markdownFilePath, false);
    },

    // Once detected from the detectError regular expression, 
    // the correction function will attempt to fix the error
    // by removing any block scalar syntax found in the property
    async attemptToFixBlockScalar(markdownFileContent, markdownFilePath) {
        const frontmatterData = extractFrontmatter(markdownFileContent);
        if (!frontmatterData.success) {
            return createErrorMessage(markdownFilePath, frontmatterData.error);
        }

        let isolatedFrontmatterString = frontmatterData.frontmatterString;
        let wasModified = false;
        const modifications = [];

        // Use regex from knownErrorCases
        const errorDetectionRegex = knownErrorCases.blockScalarSyntaxFoundInProperty.detectError;

        const propertyMatch = isolatedFrontmatterString.match(errorDetectionRegex);
        if (propertyMatch) {
            const [fullMatch, propertyName, valueWithError] = propertyMatch;
            // Remove block scalar syntax and add single quotes
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
                ...createSuccessMessage(markdownFilePath, true, modifications),
                content: correctedContent
            };
        }

        return createSuccessMessage(markdownFilePath, false);
    },

    // Once detected from the detectError regular expression, 
    // the correction function will attempt to fix the error
    // by attempting to fix unbalanced quotes
    async attemptToFixUnbalancedQuotes(markdownFileContent, markdownFilePath) {
        const frontmatterData = extractFrontmatter(markdownFileContent);
        if (!frontmatterData.success) {
            return createErrorMessage(markdownFilePath, frontmatterData.error);
        }

        let isolatedFrontmatterString = frontmatterData.frontmatterString;
        let wasModified = false;
        const modifications = [];

        // Use regex from knownErrorCases
        const errorDetectionRegex = knownErrorCases.unbalancedQuotesFoundInProperty.detectError;

        const propertyMatch = isolatedFrontmatterString.match(errorDetectionRegex);
        if (propertyMatch) {
            const [fullMatch, propertyName, valueWithError] = propertyMatch;
            // Attempt to fix unbalanced quotes
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
                ...createSuccessMessage(markdownFilePath, true, modifications),
                content: correctedContent
            };
        }

        return createSuccessMessage(markdownFilePath, false);
    },

    // Once detected from the detectError regular expression, 
    // the correction function will attempt to fix the error
    // by deleting all instances of the key
    async deleteAllInstancesOfKey(markdownFileContent, markdownFilePath) {
        const frontmatterData = extractFrontmatter(markdownFileContent);
        if (!frontmatterData.success) {
            return createErrorMessage(markdownFilePath, frontmatterData.error);
        }

        let isolatedFrontmatterString = frontmatterData.frontmatterString;
        let wasModified = false;
        const modifications = [];

        // Use regex from knownErrorCases
        const errorDetectionRegex = knownErrorCases.duplicateKeysInFrontmatter.detectError;

        const propertyMatch = isolatedFrontmatterString.match(errorDetectionRegex);
        if (propertyMatch) {
            const [fullMatch, propertyName] = propertyMatch;
            // Remove all instances of the key
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
                ...createSuccessMessage(markdownFilePath, true, modifications),
                content: correctedContent
            };
        }

        return createSuccessMessage(markdownFilePath, false);
    },
   
   // Once detected from the detectError regular expression, 
   // the correction function will attempt to fix the error
   // by removing unnecessary spacing
   async removeUnnecessarySpacing(markdownFileContent, markdownFilePath) {
      const frontmatterData = extractFrontmatter(markdownFileContent);
      if (!frontmatterData.success) {
         return createErrorMessage(markdownFilePath, frontmatterData.error);
      }

      let isolatedFrontmatterString = frontmatterData.frontmatterString;
      let wasModified = false;
      const modifications = [];

      // Use regex from knownErrorCases
      const errorDetectionRegex = knownErrorCases.unnecessarySpacingFoundInProperty.detectError;

      const propertyMatch = isolatedFrontmatterString.match(errorDetectionRegex);
      if (propertyMatch) {
         const [fullMatch, propertyName, valueWithError] = propertyMatch;
         // Remove unnecessary spacing
         const correctedValue = `${propertyName}: ${valueWithError.trim()}`;

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
            ...createSuccessMessage(markdownFilePath, true, modifications),
            content: correctedContent
         };
      }

      return createSuccessMessage(markdownFilePath, false);
   },
   
   // Once detected from the detectError regular expression, 
   // the correction function will attempt to fix the error
   // by attempting to fix a broken url
   async attemptToFixBrokenUrl(markdownFileContent, markdownFilePath) {
      const frontmatterData = extractFrontmatter(markdownFileContent);
      if (!frontmatterData.success) {
         return createErrorMessage(markdownFilePath, frontmatterData.error);
      }

      let isolatedFrontmatterString = frontmatterData.frontmatterString;
      let wasModified = false;
      const modifications = [];

      // Use regex from knownErrorCases
      const errorDetectionRegex = knownErrorCases.brokenUrlAcrossMultipleLines.detectError;

      const propertyMatch = isolatedFrontmatterString.match(errorDetectionRegex);
      if (propertyMatch) {
         const [fullMatch, propertyName, valueWithError] = propertyMatch;
         // Remove broken url and add correct url
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
            ...createSuccessMessage(markdownFilePath, true, modifications),
            content: correctedContent
         };
      }

      return createSuccessMessage(markdownFilePath, false);
   },
   
   // This function should first be sure the file is not in a directory that is excluded from URL checks. 
   // The single source of truth is in getUserOptions.cjs as USER_OPTIONS.directories.excludeUrlCheck
   // Once detected from the detectError regular expression, 
   // the correction function will attempt to fix the error
   // by adding the file name to the missing url list 
   // which will then be used in otherscripts for reporting purposes.
   async addFileNameToMissingUrlList(markdownFileContent, markdownFilePath) {
      const frontmatterData = extractFrontmatter(markdownFileContent);
      if (!frontmatterData.success) {
         return createErrorMessage(markdownFilePath, frontmatterData.error);
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
            ...createSuccessMessage(markdownFilePath, true, modifications),
            content: correctedContent
         };
      }

      return createSuccessMessage(markdownFilePath, false);
   },
   
   // Once detected from the detectError regular expression, 
   // the correction function will attempt to fix the error
   // by removing quotes from the UUID property
   async removeQuotesFromUUIDProperty(markdownFileContent, markdownFilePath) {
      const frontmatterData = extractFrontmatter(markdownFileContent);
      if (!frontmatterData.success) {
         return createErrorMessage(markdownFilePath, frontmatterData.error);
      }

      let isolatedFrontmatterString = frontmatterData.frontmatterString;
      let wasModified = false;
      const modifications = [];

      // Use regex from knownErrorCases
      const errorDetectionRegex = knownErrorCases.uuidPropertyWithQuotes.detectError;

      const propertyMatch = isolatedFrontmatterString.match(errorDetectionRegex);
      if (propertyMatch) {
         const [fullMatch, propertyName, valueWithError] = propertyMatch;
         // Remove quotes from UUID property
         const correctedValue = `${propertyName}: ${valueWithError.trim()}`;

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
            ...createSuccessMessage(markdownFilePath, true, modifications),
            content: correctedContent
         };
      }

      return createSuccessMessage(markdownFilePath, false);
   }
};

export { knownErrorCases, correctionFunctions, processMarkdownFiles };