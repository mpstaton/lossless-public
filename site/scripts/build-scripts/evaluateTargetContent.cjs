const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Import user options
const USER_OPTIONS = require('./getUserOptionsForBuild.cjs');

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
 * @property {string[]} youtubeUrls - Array of found YouTube URLs
 * @property {Object} urlEvaluations - Evaluation results for each URL
 * @property {boolean} needsFootnotesSection - Whether footnotes section needs to be added
 * @property {boolean} needsProcessing - Whether any YouTube processing is needed
 * @property {boolean} needsEntryIntoVideoRegistry - Whether an entry into the video registry is needed
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

  // OpenGraph checks
  needsOpenGraphFetch: (data) => {
    const requiredProps = USER_OPTIONS.openGraph.requiredProperties;
    return requiredProps.some(prop => !data[prop]) && !data.og_errors;
  },

  needsScreenshotFetch: (data) => {
    return !data.og_screenshot_url && !data.og_errors;
  },

  // YouTube content checks
  hasIframe: (content, videoId) => {
    const iframeRegex = new RegExp(`<iframe[^>]*src=["'][^"']*${videoId}[^"']*["'][^>]*>`, 'i');
    return iframeRegex.test(content);
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
    if (!content) return [];
    const matches = [...content.matchAll(USER_OPTIONS.regex.youtubeUrl)];
    return [...new Set(matches.map(match => match[0]))];
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
  const evaluation = {
    needsUUID: !ContentChecks.hasUUID(parsedFile.data),
    needsHyphenConversion: ContentChecks.needsHyphenConversion(parsedFile.matter),
    needsTagFormatting: ContentChecks.needsTagFormatting(parsedFile.data.tags),
    hasLowercaseTags: ContentChecks.hasLowercaseTags(parsedFile.data.tags),
    needsURLCheck: ContentChecks.needsURLCheck(parsedFile.data, filePath),
    needsProcessing: false
  };

  evaluation.needsProcessing = 
    evaluation.needsUUID ||
    evaluation.needsHyphenConversion ||
    evaluation.needsTagFormatting ||
    evaluation.needsURLCheck;

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
  const youtubeUrls = ContentChecks.findYoutubeUrls(content);
  const urlEvaluations = {};

  youtubeUrls.forEach(url => {
    urlEvaluations[url] = ContentChecks.evaluateYoutubeUrl(url, content, registry);
  });

  const evaluation = {
    youtubeUrls,
    urlEvaluations,
    needsFootnotesSection: youtubeUrls.length > 0 && !ContentChecks.hasFootnotesSection(content),
    needsProcessing: false,
    needsRegistryUpdate: false
  };

  evaluation.needsProcessing = 
    youtubeUrls.length > 0 &&
    (evaluation.needsFootnotesSection || 
     Object.values(urlEvaluations).some(evaluation => 
       !evaluation.hasIframe || 
       evaluation.needsFootnote || 
       evaluation.needsFootnoteDefinition || 
       !evaluation.isInRegistry || 
       evaluation.needsRegistryUpdate));

  evaluation.needsRegistryUpdate = 
    youtubeUrls.length > 0 &&
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
    const parsedFile = matter(content);

    const yaml = evaluateYAML(filePath, parsedFile);
    const openGraph = evaluateOpenGraph(parsedFile.data);
    const youtube = evaluateYouTube(parsedFile.content, filePath);

    return {
      yaml,
      openGraph,
      youtube,
      needsProcessing: yaml.needsProcessing || 
                      openGraph.needsProcessing || 
                      youtube.needsProcessing
    };
  } catch (error) {
    console.error(`Error evaluating file ${filePath}:`, error);
    return null;
  }
}

module.exports = {
  evaluateFile,
  evaluateYAML,
  evaluateOpenGraph,
  evaluateYouTube,
  ContentChecks,
  readVideoRegistry
};
