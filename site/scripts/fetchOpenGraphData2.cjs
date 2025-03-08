const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const matter = require('gray-matter');
const dotenv = require('dotenv');
const { fetch } = require('undici');

// Load environment variables
dotenv.config();
const openGraphKey = process.env.PUBLIC_OPEN_GRAPH_API_KEY;

// Track in-progress screenshot fetches
const screenshotFetchInProgress = new Set();

// Clean duplicate YAML keys, preserving most recent og_last_fetch
function cleanFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return content;

  const frontmatter = match[1];
  const lines = frontmatter.split('\n');
  const seenKeys = new Set();
  const cleanedLines = [];
  let lastFetch = null;

  lines.forEach(line => {
    const keyMatch = line.match(/^(\w+(?:-\w+)*?):/);
    if (keyMatch) {
      const key = keyMatch[1];
      if (key === 'og_last_fetch') {
        const dateMatch = line.match(/: '?([\d-T:.Z]+)'?/);
        if (dateMatch && (!lastFetch || new Date(dateMatch[1]) > new Date(lastFetch))) {
          lastFetch = dateMatch[1];
        }
      } else if (!seenKeys.has(key)) {
        seenKeys.add(key);
        cleanedLines.push(line);
      }
    } else {
      cleanedLines.push(line);
    }
  });

  if (lastFetch) {
    cleanedLines.push(`og_last_fetch: ${lastFetch}`);
  }

  return `---\n${cleanedLines.join('\n')}\n---${content.slice(match[0].length)}`;
}

// Extract category tags from file path
function extractCategoryTags(filePath) {
  const match = filePath.match(/.*\/content\/.*?\/(.*)/);
  if (!match || !match[1]) return [];
  
  return path.dirname(match[1])
    .split('/')
    .filter(dir => dir.trim() !== '')
    .reverse()
    .map(dir => dir.replace(/ /g, '-'));
}

// Fetch OpenGraph data
async function fetchOpenGraphData(url, filePath) {
  try {
    const proxyUrl = `https://opengraph.io/api/1.1/site/${encodeURIComponent(url)}?dimensions:lg?accept_lang=auto&use_proxy=true&app_id=${openGraphKey}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    const ogData = {};
    
    if (data.hybridGraph) {
      const properties = ['image', 'site_name', 'title', 'url', 'favicon'];
      properties.forEach(prop => {
        if (data.hybridGraph[prop]) ogData[prop] = data.hybridGraph[prop];
      });
    }
    
    return ogData;
  } catch (error) {
    throw new Error(`OpenGraph fetch error: ${error.message}`);
  }
}

// Fetch screenshot in background
function fetchScreenshot(url, filePath) {
  if (screenshotFetchInProgress.has(url)) return;
  screenshotFetchInProgress.add(url);

  (async () => {
    try {
      const screenshotUrl = `https://opengraph.io/api/1.1/screenshot/${encodeURIComponent(url)}?dimensions:lg?quality:80?accept_lang=en&use_proxy=true&app_id=${openGraphKey}`;
      const response = await fetch(screenshotUrl);
      
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      
      const data = await response.json();
      if (!data.screenshotUrl) throw new Error('No screenshot URL in response');

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data: frontmatter, content } = matter(cleanFrontmatter(fileContent));
      
      frontmatter.og_screenshot_url = data.screenshotUrl;
      frontmatter.og_last_fetch = new Date().toISOString();
      
      fs.writeFileSync(filePath, matter.stringify(content, frontmatter));
      console.log(`✅ Added screenshot URL to ${path.basename(filePath)}`);
    } catch (error) {
      markFileWithError(filePath, `Screenshot error: ${error.message}`);
    } finally {
      screenshotFetchInProgress.delete(url);
    }
  })();
}

// Mark file with error
function markFileWithError(filePath, errorMessage) {
  try {
    const { data: frontmatter, content } = matter(fs.readFileSync(filePath, 'utf-8'));
    frontmatter.og_errors = true;
    frontmatter.og_last_error = new Date().toISOString();
    frontmatter.og_error_message = errorMessage;
    fs.writeFileSync(filePath, matter.stringify(content, frontmatter));
    console.log(`⚠️ Marked ${path.basename(filePath)} with error: ${errorMessage}`);
  } catch (error) {
    console.error(`Error marking file with error: ${error.message}`);
  }
}

// Process single file
async function processFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(cleanFrontmatter(fileContent));
    
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
      try {
        const ogData = await fetchOpenGraphData(frontmatter.url, filePath);
        Object.entries(ogData).forEach(([key, value]) => {
          if (value && !frontmatter[key]) frontmatter[key] = value;
        });
        frontmatter.og_last_fetch = new Date().toISOString();
      } catch (error) {
        markFileWithError(filePath, error.message);
        return;
      }
    }

    // Start screenshot fetch if needed
    if (!frontmatter.og_screenshot_url && !frontmatter.og_errors) {
      fetchScreenshot(frontmatter.url, filePath);
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
  
  if (args.length > 0) {
    let filePath = args.join(' ');
    if (!filePath.toLowerCase().endsWith('.md')) filePath += '.md';
    
    const possiblePaths = [
      filePath,
      path.join(process.cwd(), filePath),
      path.join(__dirname, '../src/content/tooling', filePath),
      path.join(__dirname, '../src/content/tools', filePath)
    ];

    const existingPath = possiblePaths.find(p => fs.existsSync(p));
    
    if (existingPath) {
      await processFile(existingPath);
    } else {
      const patterns = possiblePaths.map(p => `${path.dirname(p)}/**/${path.basename(p)}`);
      for (const pattern of patterns) {
        const matches = await glob(pattern);
        if (matches.length > 0) {
          await processFile(matches[0]);
          return;
        }
      }
      console.error(`Could not find file: ${filePath}`);
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

main().catch(console.error);
