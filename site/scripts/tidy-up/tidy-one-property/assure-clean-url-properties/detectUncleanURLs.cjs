const path = require('path');
const fs = require('fs');

/**
 * Extract frontmatter from markdown content
 * Following DRY principles from our memories
 * 
 * @param {string} content - Markdown file content
 * @returns {Object} Frontmatter data object
 */
function extractFrontmatter(content) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
        return {
            success: false,
            error: 'No frontmatter found'
        };
    }

    return {
        success: true,
        frontmatterString: match[1],
        startIndex: 0,
        endIndex: match[0].length
    };
}

/**
 * Detects unclean URL properties in YAML frontmatter
 * Following error patterns from memory:
 * - Double quotes around single quotes
 * - Quotes around URLs
 * - Inconsistent quote usage
 * - Malformed property values
 * 
 * @param {string} markdownContent - Content of the markdown file
 * @param {string} markdownFilePath - Path to the markdown file
 * @returns {Object} Result object with detection information
 */
async function detectUncleanURLs(markdownContent, markdownFilePath) {
    // Extract frontmatter using our own helper function
    const frontmatterData = extractFrontmatter(markdownContent);
    if (!frontmatterData.success) {
        return {
            success: false,
            filePath: markdownFilePath,
            error: frontmatterData.error,
            detectedIssues: [] // Always include detectedIssues array
        };
    }

    // Initialize detection results
    const detectionResult = {
        success: true,
        modified: false,
        filePath: markdownFilePath,
        detectedIssues: []
    };

    // Split frontmatter into lines
    const lines = frontmatterData.frontmatterString.split('\n');
    
    // Regular expression to detect URLs with characters before http
    // Matches any property line that:
    // 1. Has a property name followed by colon
    // 2. Has any non-space characters before 'http'
    const urlWithPrefixRegex = /^([^:\n]+):\s*([^\s].*?)(https?:\/\/.*?)$/;

    // Check each line
    for (const line of lines) {
        const match = line.trim().match(urlWithPrefixRegex);
        if (match) {
            const [_, propertyName, prefix, url] = match;
            // If there's anything other than a single space before the URL
            if (prefix.trim().length > 0) {
                detectionResult.detectedIssues.push({
                    propertyName: propertyName.trim(),
                    line: line.trim(),
                    prefix: prefix.trim(),
                    url: url.trim()
                });
            }
        }
    }

    return detectionResult;
}

module.exports = {
    detectUncleanURLs
};