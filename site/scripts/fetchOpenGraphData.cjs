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

// Function to clean duplicate YAML keys from raw content
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

  // Add the most recent og_last_fetch if we found any
  if (mostRecentOgLastFetch) {
    cleanedLines.push(`og_last_fetch: ${mostRecentOgLastFetch}`);
  }

  return `---\n${cleanedLines.join('\n')}\n---${content.slice(frontmatterMatch[0].length)}`;
}

// Function to fetch screenshot URL from OpenGraph.io and save it to the file later
function fetchScreenshotUrlInBackground(url, filePath) {
  if (screenshotFetchInProgress.has(url)) {
    console.log(`Screenshot fetch already in progress for ${url}, skipping duplicate request`);
    return;
  }
  
  screenshotFetchInProgress.add(url);
  console.log(`Starting background screenshot fetch for ${url}`);
  
  (async () => {
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
  })();
}

// Function to mark a file with an error
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

// Function to fetch OpenGraph data
async function getFromOpenGraphIo(url, filePath) {
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

// Function to extract category tags from file path
function extractCategoryTags(filePath) {
  const match = filePath.match(/.*\/content\/.*?\/(.*)/);
  if (!match || !match[1]) return [];
  
  return path.dirname(match[1])
    .split('/')
    .filter(dir => dir.trim() !== '')
    .reverse()
    .map(dir => dir.replace(/ /g, '-'));
}

// Process a single file
async function processFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const cleanedContent = cleanDuplicateYamlKeys(fileContent);
    const { data: frontmatter, content } = matter(cleanedContent);
    
    if (!frontmatter.url) {
      console.log(`⚠️ Missing URL in ${path.basename(filePath)}`);
      return;
    }

    // Handle tags
    const categoryTags = extractCategoryTags(filePath);
    frontmatter.tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : 
                      frontmatter.tags ? [frontmatter.tags] : [];
    categoryTags.forEach(tag => {
      if (!frontmatter.tags.includes(tag)) frontmatter.tags.unshift(tag);
    });

    // Check if OpenGraph fetch is needed
    const needsOpenGraph = (!frontmatter.image || !frontmatter.og_last_fetch || 
                          !frontmatter.title || !frontmatter.site_name) && 
                          !frontmatter.og_errors;

    if (needsOpenGraph) {
      const ogData = await getFromOpenGraphIo(frontmatter.url, filePath);
      if (ogData) {
        Object.entries(ogData).forEach(([key, value]) => {
          if (value && !frontmatter[key]) frontmatter[key] = value;
        });
        frontmatter.og_last_fetch = new Date().toISOString();
      }
    } else if (frontmatter.og_error_message) {
      console.log(`Skipping OpenGraph fetch - previous error: ${frontmatter.og_error_message}`);
    } else {
      console.log(`Skipping OpenGraph fetch - already has complete data`);
    }

    // Start screenshot fetch if needed
    if (!frontmatter.og_screenshot_url && !frontmatter.og_errors) {
      fetchScreenshotUrlInBackground(frontmatter.url, filePath);
    }

    // Save updates
    fs.writeFileSync(filePath, matter.stringify(content, frontmatter));
    console.log(`✅ Updated ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`Error processing ${path.basename(filePath)}: ${error.message}`);
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  console.log('Raw command line arguments:', args);
  
  if (args.length > 0) {
    let filePath = args.join(' ');
    if (!filePath.toLowerCase().endsWith('.md')) filePath += '.md';
    
    const possiblePaths = [
      filePath,
      path.join(process.cwd(), filePath),
      path.join(__dirname, '../src/content/tooling', filePath),
      path.join(__dirname, '../src/content/tools', filePath)
    ];

    let fileFound = false;
    
    // Try direct paths first
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        await processFile(testPath);
        fileFound = true;
        break;
      }
    }

    // If not found, try glob patterns
    if (!fileFound) {
      const patterns = possiblePaths.map(p => `${path.dirname(p)}/**/${path.basename(p)}`);
      for (const pattern of patterns) {
        const matches = await glob(pattern);
        if (matches.length > 0) {
          await processFile(matches[0]);
          fileFound = true;
          break;
        }
      }
      
      if (!fileFound) {
        console.error(`Could not find file: ${filePath}`);
      }
    }
  } else {
    const contentDir = path.join(__dirname, '../src/content/tooling');
    const files = await glob('**/*.md', { 
      cwd: contentDir,
      nodir: true,
      windowsPathsNoEscape: true
    });
    
    console.log(`Found ${files.length} markdown files`);
    for (const file of files) {
      await processFile(path.join(contentDir, file));
    }
  }
}

// Run the processor
main().catch(error => console.error('Error processing files:', error));