const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const matter = require('gray-matter');
const dotenv = require('dotenv');
const { fetch } = require('undici');

// Load environment variables
dotenv.config();

const openGraphKey = process.env.PUBLIC_OPEN_GRAPH_API_KEY;

// Track URLs that we've already started fetching screenshots for
const screenshotFetchInProgress = new Set();

/**
 * Clean duplicate YAML keys from raw content
 * @param {string} content - Raw file content
 * @returns {string} Cleaned content
 */
function cleanDuplicateYamlKeys(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return content;

  const frontmatter = frontmatterMatch[1];
  const lines = frontmatter.split('\n');
  const seenKeys = new Set();
  const cleanedLines = [];
  let mostRecentOgLastFetch = null;

  lines.forEach(line => {
    const keyMatch = line.match(/^(\w+(?:-\w+)*?):/);
    if (keyMatch) {
      const key = keyMatch[1];
      if (key === 'og_last_fetch' || key === 'og-last-fetch') {
        const dateMatch = line.match(/: '?([\d-T:.Z]+)'?/);
        if (dateMatch) {
          const date = new Date(dateMatch[1]);
          if (!mostRecentOgLastFetch || date > new Date(mostRecentOgLastFetch)) {
            mostRecentOgLastFetch = dateMatch[1];
          }
        }
      } else if (!seenKeys.has(key)) {
        seenKeys.add(key);
        cleanedLines.push(line);
      }
    } else {
      cleanedLines.push(line);
    }
  });

  if (mostRecentOgLastFetch) {
    cleanedLines.push(`og_last_fetch: ${mostRecentOgLastFetch}`);
  }

  return `---\n${cleanedLines.join('\n')}\n---${content.slice(frontmatterMatch[0].length)}`;
}

/**
 * Fetch screenshot URL from OpenGraph.io and save it to the file
 * @param {string} url - URL to fetch screenshot for
 * @param {string} filePath - Path to the markdown file
 * @returns {Promise<void>}
 */
async function fetchScreenshotUrlInBackground(url, filePath) {
  if (!openGraphKey) {
    console.error('OpenGraph API key not found in environment variables');
    return;
  }

  if (screenshotFetchInProgress.has(url)) {
    console.log(`Screenshot fetch already in progress for ${url}, skipping duplicate request`);
    return;
  }
  
  screenshotFetchInProgress.add(url);
  console.log(`Starting background screenshot fetch for ${url}`);
  
  try {
    const screenshotUrl = `https://opengraph.io/api/1.1/screenshot/${encodeURIComponent(url)}?dimensions:lg?quality:80?accept_lang=en&use_proxy=true&app_id=${openGraphKey}`;
    const response = await fetch(screenshotUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (!data.screenshotUrl) {
      throw new Error('No screenshot URL in response');
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const cleanedContent = cleanDuplicateYamlKeys(fileContent);
    const { data: frontmatter, content } = matter(cleanedContent);
    
    frontmatter.og_screenshot_url = data.screenshotUrl;
    frontmatter.og_last_fetch = new Date().toISOString();
    
    fs.writeFileSync(filePath, matter.stringify(content, frontmatter));
    console.log(`✅ Updated ${path.basename(filePath)} with screenshot URL`);
  } catch (error) {
    console.error(`Error in background screenshot fetch for ${url}:`, error);
    markFileWithError(filePath, `Screenshot fetch error: ${error.message}`);
  } finally {
    screenshotFetchInProgress.delete(url);
  }
}

/**
 * Mark a file with an error
 * @param {string} filePath - Path to the markdown file
 * @param {string} errorMessage - Error message to record
 */
function markFileWithError(filePath, errorMessage) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const cleanedContent = cleanDuplicateYamlKeys(fileContent);
    const { data: frontmatter, content } = matter(cleanedContent);
    
    frontmatter.og_errors = true;
    frontmatter.og_last_error = new Date().toISOString();
    frontmatter.og_error_message = errorMessage;
    
    fs.writeFileSync(filePath, matter.stringify(content, frontmatter));
    console.log(`⚠️ Marked ${path.basename(filePath)} with error: ${errorMessage}`);
  } catch (error) {
    console.error(`Error marking file with error: ${error.message}`);
  }
}

/**
 * Fetch OpenGraph data for a URL
 * @param {string} url - URL to fetch OpenGraph data for
 * @param {string} filePath - Path to the markdown file
 * @returns {Promise<Object|null>} OpenGraph properties or null if error
 */
async function getFromOpenGraphIo(url, filePath) {
  if (!openGraphKey) {
    console.error('OpenGraph API key not found in environment variables');
    return null;
  }

  try {
    const proxyUrl = `https://opengraph.io/api/1.1/site/${encodeURIComponent(url)}?dimensions:lg?accept_lang=auto&use_proxy=true&app_id=${openGraphKey}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      markFileWithError(filePath, `HTTP error ${response.status}`);
      return null;
    }

    const data = await response.json();
    const ogProperties = {};
    
    if (data.hybridGraph) {
      const properties = ['image', 'site_name', 'title', 'url', 'favicon'];
      properties.forEach(prop => {
        if (data.hybridGraph[prop]) ogProperties[prop] = data.hybridGraph[prop];
      });
    }
    
    return ogProperties;
  } catch (error) {
    console.error('Error fetching OpenGraph properties for', url, ':', error);
    markFileWithError(filePath, `Fetch error: ${error.message}`);
    return null;
  }
}

// Export the functions needed by the orchestrator
module.exports = {
  getFromOpenGraphIo,
  fetchScreenshotUrlInBackground,
  cleanDuplicateYamlKeys,
  markFileWithError
};