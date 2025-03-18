const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { fetch } = require('undici');

// Load environment variables
const envPath = path.join(process.cwd(), 'site', '.env');
console.log(`Loading .env from: ${envPath}`);
dotenv.config({ path: envPath });

const openGraphKey = process.env.PUBLIC_OPEN_GRAPH_API_KEY;
console.log(`OpenGraph API key ${openGraphKey ? 'found' : 'not found'} in environment`);

if (!openGraphKey && process.env.VERBOSE) {
  console.log('Warning: PUBLIC_OPEN_GRAPH_API_KEY not found in environment');
}

// Track URLs that we've already started fetching screenshots for
const screenshotFetchInProgress = new Set();

/**
 * Strip quotes from a value for YAML
 * @param {any} value - The value to process
 * @returns {any} Processed value
 */
function stripQuotes(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/^["'](.*)["']$/, '$1');
}

/**
 * Process object values to strip quotes for YAML
 * @param {Object} obj - Object to process
 * @returns {Object} Processed object
 */
function processObjectForYAML(obj) {
  const processed = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      processed[key] = processObjectForYAML(value);
    } else {
      processed[key] = stripQuotes(value);
    }
  }
  return processed;
}

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
    const frontmatter = getFrontmatter(cleanedContent);
    
    frontmatter.og_screenshot_url = stripQuotes(data.screenshotUrl);
    frontmatter.og_last_fetch = new Date().toISOString();
    
    updateFrontmatterInFile(filePath, frontmatter);
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
    const frontmatter = getFrontmatter(cleanedContent);
    
    frontmatter.og_errors = true;
    frontmatter.og_last_error = new Date().toISOString();
    frontmatter.og_error_message = stripQuotes(errorMessage);
    
    updateFrontmatterInFile(filePath, frontmatter);
    console.log(`⚠️ Marked ${path.basename(filePath)} with error: ${errorMessage}`);
  } catch (error) {
    console.error(`Error marking file with error: ${error.message}`);
  }
}

/**
 * Update frontmatter in a file
 * @param {string} filePath - Path to the markdown file
 * @param {Object} updates - Frontmatter updates
 */
function updateFrontmatterInFile(filePath, updates) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Find frontmatter section
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    throw new Error('No frontmatter found');
  }

  // Split content into parts
  const beforeFrontmatter = '---\n';
  const afterFrontmatter = content.slice(match[0].length);
  
  // Update frontmatter lines
  const lines = match[1].split('\n');
  const updatedLines = [];
  const seenKeys = new Set();
  
  // Keep existing lines that aren't being updated
  for (const line of lines) {
    const keyMatch = line.match(/^(\w+(?:-\w+)*?):/);
    if (keyMatch) {
      const key = keyMatch[1];
      seenKeys.add(key);
      if (!updates.hasOwnProperty(key)) {
        updatedLines.push(line);
      }
    } else {
      updatedLines.push(line);
    }
  }
  
  // Add new/updated properties
  for (const [key, value] of Object.entries(updates)) {
    if (!seenKeys.has(key)) {
      updatedLines.push(`${key}: ${value}`);
    }
  }
  
  // Reconstruct the file content
  const newContent = beforeFrontmatter + updatedLines.join('\n') + '\n---' + afterFrontmatter;
  fs.writeFileSync(filePath, newContent);
}

/**
 * Get frontmatter from a file
 * @param {string} content - File content
 * @returns {Object} Frontmatter
 */
function getFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return {};
  }

  const lines = match[1].split('\n');
  const frontmatter = {};

  for (const line of lines) {
    const keyMatch = line.match(/^(\w+(?:-\w+)*?):/);
    if (keyMatch) {
      const key = keyMatch[1];
      const valueMatch = line.match(/: (.*)$/);
      if (valueMatch) {
        frontmatter[key] = stripQuotes(valueMatch[1]);
      }
    }
  }

  return frontmatter;
}

/**
 * Update content registry
 * @param {string} filePath - Path to the markdown file
 * @param {Object} frontmatter - The file's frontmatter
 * @param {Object} event - Event data
 */
function updateContentRegistry(filePath, frontmatter, event) {
  const registryPath = 'site/src/content/data/markdown-content-registry.json';
  let registry = {};

  // Load existing registry
  if (fs.existsSync(registryPath)) {
    registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  }

  const fileUuid = frontmatter.site_uuid;
  if (!fileUuid) {
    throw new Error('No site_uuid found in frontmatter');
  }

  // Initialize document entry if it doesn't exist
  if (!registry.documents) registry.documents = {};
  if (!registry.documents[fileUuid]) {
    registry.documents[fileUuid] = {
      content: {},
      relationships: {},
      history: [],
      metadata: {}
    };
  }

  // Add history entry
  const historyEntry = {
    timestamp: new Date().toISOString(),
    type: 'metadata_update',
    action: 'update_open_graph',
    details: {
      event_type: event.type,
      success: event.success,
      url: event.url,
      screenshot_url: event.screenshotUrl,
      error: event.error
    }
  };

  registry.documents[fileUuid].history.push(historyEntry);
  
  // Update metadata
  registry.documents[fileUuid].metadata = {
    ...registry.documents[fileUuid].metadata,
    last_og_fetch: event.timestamp,
    last_og_status: event.success ? 'success' : 'error'
  };

  // Update indices
  if (!registry.indices) registry.indices = { by_filename: {}, by_path: {} };
  registry.indices.by_filename[path.basename(filePath)] = fileUuid;
  registry.indices.by_path[filePath] = fileUuid;

  // Write back to registry
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
}

/**
 * Fetch OpenGraph data and update content registry
 * @param {string} filePath - Path to the markdown file
 * @param {Object} frontmatter - The file's frontmatter
 * @returns {Promise<Object>} Event data
 */
async function getFromOpenGraphIo(filePath, frontmatter) {
  if (!openGraphKey) {
    return {
      success: false,
      error: 'OpenGraph API key not found in environment variables'
    };
  }

  if (!frontmatter.url) {
    return {
      success: false,
      error: 'No URL found in frontmatter'
    };
  }

  try {
    const url = frontmatter.url;
    const screenshotUrl = `https://opengraph.io/api/1.1/screenshot/${encodeURIComponent(url)}?dimensions:lg?quality:80?accept_lang=en&use_proxy=true&app_id=${openGraphKey}`;
    const response = await fetch(screenshotUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (!data.screenshotUrl) {
      throw new Error('No screenshot URL in response');
    }

    // Update the frontmatter
    const updates = {
      og_screenshot_url: data.screenshotUrl,
      og_last_fetch: new Date().toISOString(),
      og_fetched_url: url
    };

    updateFrontmatterInFile(filePath, updates);

    const event = {
      type: 'success',
      success: true,
      url: url,
      screenshotUrl: data.screenshotUrl,
      timestamp: updates.og_last_fetch
    };

    // Update content registry
    updateContentRegistry(filePath, frontmatter, event);

    return event;

  } catch (error) {
    const errorUpdate = {
      og_errors: 'true',
      og_last_error: new Date().toISOString(),
      og_error_message: error.message
    };

    updateFrontmatterInFile(filePath, errorUpdate);

    const event = {
      type: 'error',
      success: false,
      error: error.message,
      url: frontmatter.url,
      timestamp: errorUpdate.og_last_error
    };

    // Update content registry
    updateContentRegistry(filePath, frontmatter, event);

    return event;
  }
}

module.exports = {
  getFromOpenGraphIo,
  fetchScreenshotUrlInBackground,
  cleanDuplicateYamlKeys,
  markFileWithError,
  updateFrontmatterInFile,
  getFrontmatter
};