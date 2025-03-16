const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Import user options
const USER_OPTIONS = require('./archive/getUserOptionsForBuild.cjs');

// ============================================================================
// YAML Processing Functions
// ============================================================================

/**
 * Process YAML key to ensure Obsidian format
 * @param {string} key - The key to process
 * @returns {string}
 */
function processYAMLKey(key) {
  return key.toLowerCase()
    .replace(/^["'](.*)["']$/, '$1')  // Remove quotes
    .replace(/[-\s]+/g, '_');         // Convert spaces and hyphens to underscores
}

/**
 * Process YAML value to follow Obsidian format
 * @param {any} value - The value to process
 * @returns {any}
 */
function processYAMLValue(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/^["'](.*)["']$/, '$1');
}

/**
 * Clean and normalize YAML frontmatter
 * @param {string} content - The file content with YAML frontmatter
 * @returns {string} Cleaned content
 */
function cleanYAMLFrontmatter(content) {
  if (!content) return '';
  
  // Use the enhanced preprocessing function from USER_OPTIONS
  return USER_OPTIONS.frontmatter.preprocessing.cleanContent(content);
}

/**
 * Extract and parse YAML frontmatter
 * @param {string} content - Content with YAML frontmatter
 * @returns {Object} Parsed YAML data and the remaining content
 */
function parseYAMLFrontmatter(content) {
  // First clean the YAML to avoid parsing errors
  const cleanedContent = cleanYAMLFrontmatter(content);
  
  try {
    // Use gray-matter to parse the frontmatter
    const { data, content: contentWithoutFrontmatter } = matter(cleanedContent);
    return { data, content: contentWithoutFrontmatter, errors: [] };
  } catch (error) {
    console.error('Error parsing YAML frontmatter:', error);
    return { data: {}, content: cleanedContent, errors: [error.message] };
  }
}

// ============================================================================
// Video Registry Management
// ============================================================================

/**
 * @typedef {Object} VideoRegistryEntry
 * @property {string} randHexId - Unique identifier for the video
 * @property {string} youtubeUrl - Full YouTube URL
 * @property {string} youtubeId - YouTube video ID
 * @property {string} youtubePublishedDate - Publication date
 * @property {string} youtubeTitle - Video title
 * @property {string} youtubeChannelTitle - Channel name
 * @property {string[]} appearsInFiles - List of files where this video appears
 * @property {string} lastUpdated - Timestamp of last registry update
 */

/**
 * Read and parse the video registry
 * @returns {Object.<string, VideoRegistryEntry>} Registry indexed by YouTube URL
 */
function readVideoRegistry() {
  try {
    const registryPath = USER_OPTIONS.directories.video_registry;
    if (!fs.existsSync(registryPath)) {
      return {};
    }
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    // Convert array to object indexed by YouTube URL for efficient lookups
    return registry.reduce((acc, entry) => {
      acc[entry.youtubeUrl] = entry;
      return acc;
    }, {});
  } catch (error) {
    console.error('Error reading video registry:', error);
    return {};
  }
}

// ============================================================================
// Content Evaluation Types
// ============================================================================

/**
 * @typedef {Object} ContentEvaluation
 * @property {YAMLEvaluation} yaml - YAML/Frontmatter evaluation results
 * @property {OpenGraphEvaluation} openGraph - OpenGraph evaluation results
 * @property {YouTubeEvaluation} youtube - YouTube content evaluation results
 * @property {boolean} needsProcessing - Whether any processing is needed
 */

/**
 * @typedef {Object} YAMLEvaluation
 * @property {boolean} needsUUID - Whether a UUID needs to be generated
 * @property {boolean} needsHyphenConversion - Whether hyphens need to be converted to underscores
 * @property {boolean} needsTagFormatting - Whether tags need formatting
 * @property {boolean} hasLowercaseTags - Whether there are lowercase tags to report
 * @property {boolean} needsURLCheck - Whether URL check is needed
 * @property {boolean} needsPathTags - Whether tags from the file path need to be added
 * @property {string[]} missingPathTags - Array of tags that should be added from the path
 * @property {boolean} needsProcessing - Whether any YAML processing is needed
 */

/**
 * @typedef {Object} OpenGraphEvaluation
 * @property {boolean} needsFetch - Whether OpenGraph data needs to be fetched
 * @property {boolean} needsScreenshot - Whether screenshot needs to be fetched
 * @property {boolean} hasErrors - Whether there are existing errors
 * @property {boolean} needsProcessing - Whether any OpenGraph processing is needed
 */

/**
 * @typedef {Object} YouTubeEvaluation
 * @property {string[]} allYoutubeUrls - Array of all found YouTube URLs
 * @property {string[]} danglingUrls - Array of unprocessed YouTube URLs
 * @property {string[]} processedUrls - Array of processed YouTube URLs
 * @property {Object} urlEvaluations - Evaluation results for each URL
 * @property {boolean} needsFootnotesSection - Whether footnotes section needs to be added
 * @property {boolean} needsProcessing - Whether any YouTube processing is needed
 * @property {boolean} needsRegistryUpdate - Whether an entry into the video registry is needed
 */

/**
 * @typedef {Object} YouTubeUrlEvaluation
 * @property {boolean} hasIframe - Whether the URL has an iframe
 * @property {boolean} needsFootnote - Whether a footnote reference is needed
 * @property {boolean} needsFootnoteDefinition - Whether a footnote definition is needed
 * @property {boolean} isInRegistry - Whether the URL exists in the registry
 * @property {boolean} needsRegistryUpdate - Whether the registry entry needs updating
 * @property {VideoRegistryEntry} [registryEntry] - Existing registry entry if available
 */

// ============================================================================
// Content Checks
// ============================================================================

/**
 * Core content evaluation functions
 */
const ContentChecks = {
  // YAML/Frontmatter checks
  hasUUID: (data) => {
    return !!data.site_uuid;
  },

  needsHyphenConversion: (frontmatter) => {
    const hyphenRegex = /^[^:\r\n]+?-[^:\r\n]*?:/m;
    return hyphenRegex.test(frontmatter);
  },

  needsTagFormatting: (tags) => {
    if (!tags) return false;
    const arrayTags = Array.isArray(tags) ? tags : [tags];
    return arrayTags.some(tag => tag.includes(' '));
  },

  hasLowercaseTags: (tags) => {
    if (!tags) return false;
    const arrayTags = Array.isArray(tags) ? tags : [tags];
    return arrayTags.some(tag => tag[0] && tag[0].toLowerCase() === tag[0]);
  },

  needsURLCheck: (data, filePath) => {
    return !data.url && 
      !USER_OPTIONS.directories.excludeUrlCheck.some(dir => filePath.includes(dir));
  },

  getPathTags: (filePath) => {
    // Get the relative path from the content directory
    const contentPath = USER_OPTIONS.directories.content;
    const relativePath = path.relative(contentPath, filePath);
    
    // Split the path and remove the filename and 'tooling' directory
    const pathParts = relativePath.split(path.sep);
    const directories = pathParts.slice(0, -1).filter(dir => dir !== 'tooling');
    
    // Convert directory names to tags (replace spaces with dashes)
    return directories.map(dir => dir.replace(/\s+/g, '-'));
  },

  needsPathTags: (data, filePath) => {
    const currentTags = Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []);
    const pathTags = ContentChecks.getPathTags(filePath);
    
    // Check which path tags are missing from current tags
    const missingTags = pathTags.filter(tag => !currentTags.includes(tag));
    
    return {
      needsPathTags: missingTags.length > 0,
      missingPathTags: missingTags
    };
  },

  // OpenGraph checks
  needsOpenGraphFetch: (data) => {
    // If no URL, no fetch needed
    if (!data.url) {
      return false;
    }

    // If no OpenGraph data at all, needs fetch
    const hasAnyOGData = USER_OPTIONS.openGraph.requiredProperties.some(prop => data[prop]);
    if (!hasAnyOGData) {
      return true;
    }

    // If there are errors, only retry for timeout or rate limit
    if (data.og_errors) {
      const error = String(data.og_error_message || '').toLowerCase();
      return error.includes('timeout') || error.includes('rate limit');
    }

    // If URL has changed since last fetch
    if (data.og_fetched_url && data.og_fetched_url !== data.url) {
      return true;
    }

    // Otherwise, no fetch needed
    return false;
  },

  needsScreenshotFetch: (data) => {
    // Only fetch screenshot if:
    // 1. We have a URL
    // 2. No screenshot exists
    // 3. No errors (except timeout/rate-limit)
    // 4. We have basic OG data
    if (!data.url || data.og_screenshot_url) {
      return false;
    }

    if (data.og_errors) {
      const error = String(data.og_error_message || '').toLowerCase();
      return error.includes('timeout') || error.includes('rate limit');
    }

    // Must have some basic OG data before fetching screenshot
    return USER_OPTIONS.openGraph.requiredProperties.some(prop => data[prop]);
  },

  // YouTube content checks
  hasIframe: (content, videoId) => {
    const iframeRegex = new RegExp(`<iframe[^>]*src=["'][^"']*${videoId}[^"']*["'][^>]*>`, 'i');
    return iframeRegex.test(content);
  },

  hasMarkdownLink: (content, url) => {
    const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const markdownRegex = new RegExp(`\\[([^\\]]+)\\]\\(${escapedUrl}\\)`, 'i');
    return markdownRegex.test(content);
  },

  hasCitationLine: (content, url) => {
    const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const citationRegex = new RegExp(`"\\[[^\\]]+\\]\\(${escapedUrl}\\),"`, 'i');
    return citationRegex.test(content);
  },

  hasFootnoteLine: (content, url) => {
    const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const footnoteRegex = new RegExp(`\\[\\^[a-f0-9]+\\]:[^\\n]*${escapedUrl}`, 'i');
    return footnoteRegex.test(content);
  },

  isProcessedUrl: (content, url, videoId) => {
    return ContentChecks.hasIframe(content, videoId) ||
           ContentChecks.hasMarkdownLink(content, url) ||
           ContentChecks.hasCitationLine(content, url) ||
           ContentChecks.hasFootnoteLine(content, url);
  },

  hasFootnoteReference: (content, randHex) => {
    const footnoteRegex = new RegExp(`\\[\\^${randHex}\\]`, 'i');
    return footnoteRegex.test(content);
  },

  hasFootnoteDefinition: (content, randHex) => {
    const footnoteDefRegex = new RegExp(`\\[\\^${randHex}\\]:.*`, 'i');
    return footnoteDefRegex.test(content);
  },

  hasFootnotesSection: (content) => {
    const { header, sectionLine } = USER_OPTIONS.youtube.footnotes;
    const escapedHeader = header.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedLine = sectionLine.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const footnotesPattern = new RegExp(`${escapedHeader}\\s*${escapedLine}`, 's');
    return footnotesPattern.test(content);
  },

  findYoutubeUrls: (content) => {
    if (!content) return {
      allUrls: [],
      danglingUrls: [],
      processedUrls: []
    };

    // Find all YouTube URLs
    const matches = [...content.matchAll(USER_OPTIONS.regex.youtubeUrl)];
    const allUrls = [...new Set(matches.map(match => match[0]))];
    
    // Categorize URLs
    const danglingUrls = [];
    const processedUrls = [];
    
    allUrls.forEach(url => {
      const videoId = url.match(USER_OPTIONS.regex.youtubeUrl)?.[1];
      if (videoId && ContentChecks.isProcessedUrl(content, url, videoId)) {
        processedUrls.push(url);
      } else {
        danglingUrls.push(url);
      }
    });

    return {
      allUrls,
      danglingUrls: [...new Set(danglingUrls)],
      processedUrls: [...new Set(processedUrls)]
    };
  },

  evaluateYoutubeUrl: (url, content, registry) => {
    const registryEntry = registry[url];
    const videoId = url.match(USER_OPTIONS.regex.youtubeUrl)?.[1];
    
    const evaluation = {
      hasIframe: videoId ? ContentChecks.hasIframe(content, videoId) : false,
      needsFootnote: false,
      needsFootnoteDefinition: false,
      isInRegistry: !!registryEntry,
      needsRegistryUpdate: false,
      registryEntry
    };

    if (registryEntry) {
      // If in registry, check if footnotes are properly formatted
      evaluation.needsFootnote = !ContentChecks.hasFootnoteReference(content, registryEntry.randHexId);
      evaluation.needsFootnoteDefinition = !ContentChecks.hasFootnoteDefinition(content, registryEntry.randHexId);
      
      // Check if current file is in the registry entry's appearsInFiles
      const currentFile = process.env.CURRENT_FILE;
      if (currentFile && !registryEntry.appearsInFiles.includes(currentFile)) {
        evaluation.needsRegistryUpdate = true;
      }
    }

    return evaluation;
  }
};

// ============================================================================
// Main Evaluation Functions
// ============================================================================

/**
 * Evaluate YAML/Frontmatter content
 * @param {string} filePath 
 * @param {Object} parsedFile 
 * @returns {YAMLEvaluation}
 */
function evaluateYAML(filePath, parsedFile) {
  const pathTagsEvaluation = ContentChecks.needsPathTags(parsedFile.data, filePath);
  
  const evaluation = {
    needsUUID: !ContentChecks.hasUUID(parsedFile.data),
    needsHyphenConversion: ContentChecks.needsHyphenConversion(parsedFile.matter),
    needsTagFormatting: ContentChecks.needsTagFormatting(parsedFile.data.tags),
    hasLowercaseTags: ContentChecks.hasLowercaseTags(parsedFile.data.tags),
    needsURLCheck: ContentChecks.needsURLCheck(parsedFile.data, filePath),
    needsPathTags: pathTagsEvaluation.needsPathTags,
    missingPathTags: pathTagsEvaluation.missingPathTags,
    needsProcessing: false
  };

  evaluation.needsProcessing = 
    evaluation.needsUUID ||
    evaluation.needsHyphenConversion ||
    evaluation.needsTagFormatting ||
    evaluation.needsURLCheck ||
    evaluation.needsPathTags;

  return evaluation;
}

/**
 * Evaluate OpenGraph requirements
 * @param {Object} frontmatterData 
 * @returns {OpenGraphEvaluation}
 */
function evaluateOpenGraph(frontmatterData) {
  const evaluation = {
    needsFetch: ContentChecks.needsOpenGraphFetch(frontmatterData),
    needsScreenshot: ContentChecks.needsScreenshotFetch(frontmatterData),
    hasErrors: !!frontmatterData.og_errors,
    needsProcessing: false
  };

  evaluation.needsProcessing = 
    evaluation.needsFetch ||
    evaluation.needsScreenshot;

  return evaluation;
}

/**
 * Evaluate YouTube content requirements
 * @param {string} content 
 * @param {string} currentFile
 * @returns {YouTubeEvaluation}
 */
function evaluateYouTube(content, currentFile) {
  // Set current file for registry checks
  process.env.CURRENT_FILE = currentFile;
  
  const registry = readVideoRegistry();
  const { allUrls, danglingUrls, processedUrls } = ContentChecks.findYoutubeUrls(content);
  const urlEvaluations = {};

  // Evaluate all URLs, both dangling and processed
  allUrls.forEach(url => {
    urlEvaluations[url] = ContentChecks.evaluateYoutubeUrl(url, content, registry);
  });

  const evaluation = {
    allYoutubeUrls: allUrls,
    danglingUrls,
    processedUrls,
    urlEvaluations,
    needsFootnotesSection: allUrls.length > 0 && !ContentChecks.hasFootnotesSection(content),
    needsProcessing: false,
    needsRegistryUpdate: false
  };

  // Only consider dangling URLs for initial processing needs
  evaluation.needsProcessing = 
    danglingUrls.length > 0 ||
    (allUrls.length > 0 &&
     (evaluation.needsFootnotesSection || 
      Object.values(urlEvaluations).some(evaluation => 
        !evaluation.hasIframe || 
        evaluation.needsFootnote || 
        evaluation.needsFootnoteDefinition || 
        !evaluation.isInRegistry || 
        evaluation.needsRegistryUpdate)));

  evaluation.needsRegistryUpdate = 
    allUrls.length > 0 &&
    Object.values(urlEvaluations).some(evaluation => 
      !evaluation.isInRegistry || evaluation.needsRegistryUpdate);

  return evaluation;
}

/**
 * Main evaluation function for a file
 * @param {string} filePath 
 * @returns {ContentEvaluation}
 */
function evaluateFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Clean and parse YAML
    const parsed = parseYAMLFrontmatter(content);
    
    if (parsed.errors.length > 0) {
      throw new Error(`Error evaluating file ${filePath}: ${parsed.errors[0]}`);
    }
    
    const yaml = evaluateYAML(filePath, parsed);
    const openGraph = evaluateOpenGraph(parsed.data);
    const youtube = evaluateYouTube(parsed.content, filePath);

    return {
      success: true,
      evaluation: {
        yaml,
        openGraph,
        youtube,
        needsProcessing: yaml.needsProcessing || 
                        openGraph.needsProcessing || 
                        youtube.needsProcessing
      }
    };
  } catch (error) {
    console.error(`Error evaluating file ${filePath}:`, error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  evaluateFile,
  evaluateYAML,
  evaluateOpenGraph,
  evaluateYouTube,
  ContentChecks,
  readVideoRegistry,
  cleanYAMLFrontmatter,
  parseYAMLFrontmatter
};
