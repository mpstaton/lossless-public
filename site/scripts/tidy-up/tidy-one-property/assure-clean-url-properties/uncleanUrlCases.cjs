/**
 * Collection of unique unclean URL cases found in YAML frontmatter
 * Each case represents a different pattern of quote character misuse
 * 
 * Following error patterns from memory:
 * - Double quotes around single quotes
 * - Quotes around URLs
 * - Inconsistent quote usage
 * - Malformed property values
 * 
 * @see Memory[879780c9-764b-415a-a4f0-3ee65ce2c67d] for original error cases
 */
const uncleanUrlCases = {
    // Single quotes around URL
    singleQuotes: {
        example: `docs_url: 'https://jan.ai/docs'`,
        description: 'URL wrapped in single quotes'
    },
    
    // Double quotes around single quotes around URL
    doubleQuotesAroundSingleQuotes: {
        example: `favicon: ""'https://github.githubassets.com/favicons/favicon.svg'""`,
        description: 'URL wrapped in single quotes, then wrapped in double quotes'
    },
    
    // Double quotes around URL
    doubleQuotes: {
        example: `image: "https://arangodb.com/wp-content/uploads/2024/02/Image-5-2.gif"`,
        description: 'URL wrapped in double quotes'
    },
    
    // Markdown image syntax with quotes
    markdownImageWithQuotes: {
        example: `hero: '![Trae AI Hero](https://i.imgur.com/qJI4eV9.png)'`,
        description: 'Markdown image syntax wrapped in quotes'
    },

    // Double quotes around URL with extra spaces
    doubleQuotesWithSpaces: {
        example: `url: "  https://example.com/path  "`,
        description: 'URL wrapped in double quotes with extra spaces'
    },

    // Mixed quote types
    mixedQuotes: {
        example: `image: "'https://example.com/image.jpg'"`,
        description: 'URL wrapped in alternating quote types'
    },

    // Multiple sets of quotes
    multipleQuotes: {
        example: `favicon: """"https://example.com/favicon.ico""""`,
        description: 'URL wrapped in multiple sets of quotes'
    },

    // Inconsistent quote usage in same file
    inconsistentQuotes: {
        example: `url: 'https://example.com/path1'
image: "https://example.com/path2"`,
        description: 'Different quote types used for URLs in same file'
    },

    // Malformed property with HTML-like syntax
    malformedHtml: {
        example: `image: <img src="https://example.com/image.jpg">`,
        description: 'URL property using HTML-like syntax'
    },

    // Malformed property with markdown and quotes
    malformedMarkdown: {
        example: `image: "[Image](  'https://example.com/image.jpg'  )"`,
        description: 'URL property using markdown with nested quotes and spaces'
    },

    // Malformed property with escaped quotes
    malformedEscapedQuotes: {
        example: `url: \\"https://example.com/path\\"`,
        description: 'URL with escaped quotes, often from automated tools'
    }
};

module.exports = {
    uncleanUrlCases
};