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
function fetchScreenshotUrlInBackground(url, filePath, frontmatter) {
  // Skip if we're already fetching this URL
  if (screenshotFetchInProgress.has(url)) {
    console.log(`Screenshot fetch already in progress for ${url}, skipping duplicate request`);
    return null;
  }
  
  // Add to tracking set
  screenshotFetchInProgress.add(url);
  
  console.log(`Starting background screenshot fetch for ${url}`);
  
  // Don't await this promise - let it run in the background
  (async () => {
    try {
      const screenshotProxyUrl = `https://opengraph.io/api/1.1/screenshot/${encodeURIComponent(url)}?dimensions:lg?quality:80?accept_lang=en&use_proxy=true&app_id=${openGraphKey}`;
      const response = await fetch(screenshotProxyUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.screenshotUrl) {
        console.log(`✅ Received screenshot URL for ${url} in background process`);
        
        // Read the current file content again (it might have changed)
        const currentFileContent = fs.readFileSync(filePath, 'utf-8');
        const cleanedContent = cleanDuplicateYamlKeys(currentFileContent);
        const { data: currentFrontmatter, content: currentContent } = matter(cleanedContent);
        
        // Update the frontmatter with the screenshot URL
        currentFrontmatter.og_screenshot_url = data.screenshotUrl;
        currentFrontmatter.og_last_fetch = new Date().toISOString();
        
        // Write the updated content back to the file
        const updatedContent = matter.stringify(currentContent, currentFrontmatter);
        fs.writeFileSync(filePath, updatedContent);
        
        console.log(`✅ Updated ${path.basename(filePath)} with screenshot URL from background process`);
      } else {
        console.log(`⚠️ No screenshot URL found for ${url} in background process`);
        markFileWithError(filePath, 'No screenshot URL in response');
      }
    } catch (error) {
      console.error(`Error in background screenshot fetch for ${url}:`, error);
      markFileWithError(filePath, `Screenshot fetch error: ${error.message}`);
    } finally {
      // Remove from tracking set when done
      screenshotFetchInProgress.delete(url);
    }
  })();
  
  // Return immediately, allowing the script to continue
  return null;
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
    
    const updatedContent = matter.stringify(content, frontmatter);
    fs.writeFileSync(filePath, updatedContent);
    
    console.log(`⚠️ Marked ${path.basename(filePath)} with error: ${errorMessage}`);
  } catch (error) {
    console.error(`Error marking file ${filePath} with error:`, error);
  }
}

// Function to fetch OpenGraph data
async function getFromOpenGraphIo(url, filePath) {
  try {
    const proxyUrl = `https://opengraph.io/api/1.1/site/${encodeURIComponent(url)}?dimensions:lg?accept_lang=auto&use_proxy=true&app_id=${openGraphKey}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      // Handle HTTP errors by marking the file
      markFileWithError(filePath, `HTTP error ${response.status}`);
      console.log(`⚠️ HTTP error ${response.status} for ${url}. Marked file with og_errors.`);
      return null;
    }
    const data = await response.json();
    
    const ogProperties = {};
    
    if (data.hybridGraph) {
      // Only add properties that are defined
      if (data.hybridGraph.image) ogProperties.image = data.hybridGraph.image;
      if (data.hybridGraph.site_name) ogProperties.site_name = data.hybridGraph.site_name;
      if (data.hybridGraph.title) ogProperties.title = data.hybridGraph.title;
      if (data.hybridGraph.url) ogProperties.url = data.hybridGraph.url;
      if (data.hybridGraph.favicon) ogProperties.favicon = data.hybridGraph.favicon;
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
  // Get the path relative to the tooling directory
  const toolingDirPattern = /.*\/content\/tooling\/(.*)/;
  const match = filePath.match(toolingDirPattern);
  
  if (!match || !match[1]) {
    return [];
  }
  
  // Get the directory path without the filename
  const dirPath = path.dirname(match[1]);
  
  // Split the path into directories
  const directories = dirPath.split('/').filter(dir => dir.trim() !== '');
  
  // Reverse the array to put the directory closest to the file first
  const reversedDirectories = [...directories].reverse();
  
  // Transform directory names by replacing spaces with hyphens
  const categoryTags = reversedDirectories.map(dir => dir.replace(/ /g, '-'));
  
  return categoryTags;
}

// Function to clean and update og_last_fetch property
function cleanAndUpdateOgLastFetch(frontmatter) {
  // Find all og_last_fetch related properties
  const ogFetchProps = Object.keys(frontmatter).filter(key => 
    key === 'og_last_fetch' || key === 'og-last-fetch'
  );

  // If multiple properties exist, find the most recent timestamp
  if (ogFetchProps.length > 0) {
    let mostRecentDate = new Date(0);
    let mostRecentProp = null;

    ogFetchProps.forEach(prop => {
      const date = new Date(frontmatter[prop]);
      if (!isNaN(date) && date > mostRecentDate) {
        mostRecentDate = date;
        mostRecentProp = prop;
      }
    });

    // Remove all og_last_fetch properties
    ogFetchProps.forEach(prop => {
      delete frontmatter[prop];
    });
  }

  // Set the current timestamp
  frontmatter.og_last_fetch = new Date().toISOString();
}

// Process a single file
async function processFile(filePath) {
  console.log(`Processing file: ${filePath}`);
  
  try {
    // First, read and clean the file content
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const cleanedContent = cleanDuplicateYamlKeys(fileContent);
    const { data: frontmatter, content } = matter(cleanedContent);
    
    if (frontmatter && frontmatter.url) {
      console.log(`Processing ${path.basename(filePath)} with URL: ${frontmatter.url}`);
      
      // Extract category tags from the file path
      const categoryTags = extractCategoryTags(filePath);
      console.log(`Extracted category tags: ${categoryTags.join(', ')}`);
      
      // Initialize tags array if it doesn't exist
      if (!frontmatter.tags) {
        frontmatter.tags = [];
      } else if (typeof frontmatter.tags === 'string') {
        // Convert string tags to array
        frontmatter.tags = [frontmatter.tags];
      }
      
      // Add category tags to the beginning of the tags array, avoiding duplicates
      categoryTags.forEach(tag => {
        if (!frontmatter.tags.includes(tag)) {
          frontmatter.tags.unshift(tag);
        }
      });
      
      let shouldUpdateFile = true;
      
      // Check if we need to fetch OpenGraph data
      if ((!frontmatter.image || !frontmatter.og_last_fetch || !frontmatter.title || !frontmatter.site_name ) && !frontmatter.og_errors) {
        console.log(`Fetching OpenGraph data for ${frontmatter.url}...`);
        
        // Fetch OpenGraph data
        const ogData = await getFromOpenGraphIo(frontmatter.url, filePath);
        
        if (ogData && Object.keys(ogData).length > 0) {
          // Update the frontmatter with the fetched data
          Object.keys(ogData).forEach(key => {
            // Only update if the property doesn't exist in frontmatter
            if (ogData[key] !== undefined && ogData[key] !== null && !frontmatter[key]) {
              frontmatter[key] = ogData[key];
            }
          });
          
          // Update the timestamp with current date
          cleanAndUpdateOgLastFetch(frontmatter);
        } else {
          console.log(`⚠️ No usable OpenGraph data found for ${path.basename(filePath)}`);
        }
      } else if (frontmatter.og_error_message) {
        console.log(`Skipping OpenGraph fetch for ${path.basename(filePath)} - previous error: ${frontmatter.og_error_message}`);
      } else {
        console.log(`Skipping OpenGraph fetch for ${path.basename(filePath)} - already has complete OpenGraph data`);
      }
      
      // Start the screenshot fetch in the background if needed
      if (!frontmatter.og_screenshot_url && !frontmatter.og_errors) {
        fetchScreenshotUrlInBackground(frontmatter.url, filePath, frontmatter);
      }
      
      if (shouldUpdateFile) {
        try {
          // Convert back to frontmatter string
          const updatedContent = matter.stringify(content, frontmatter);
          
          // Write back to file
          fs.writeFileSync(filePath, updatedContent);
          console.log(`✅ Updated ${path.basename(filePath)} with category tags and OpenGraph data`);
        } catch (error) {
          console.error(`Error updating ${path.basename(filePath)}:`, error);
          console.log('Problem frontmatter:', JSON.stringify(frontmatter));
        }
      }
    } else {
      console.log(`⚠️ Missing URL in ${path.basename(filePath)}`);
      // Do not update og-last-fetch when URL is missing
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    // Do not update og-last-fetch when there's an error
  }
}

// Main function to process all tool files
async function processToolFiles() {
  // Get command line arguments
  const args = process.argv.slice(2);
  console.log('Raw command line arguments:', args);
  
  // If specific files are provided, process them
  if (args.length > 0) {
    // Join all arguments as they might be parts of a filename with spaces
    let combinedPath = args.join(' ');
    console.log(`Combined path: ${combinedPath}`);
    
    // Add .md extension if not present
    if (!combinedPath.toLowerCase().endsWith('.md')) {
      console.log(`Adding .md extension to ${combinedPath}`);
      combinedPath = `${combinedPath}.md`;
    }
    
    // Handle paths relative to the content directory
    let filePath = combinedPath;
    let fileFound = false;
    
    // Check if the path is absolute or relative to the current directory
    if (path.isAbsolute(filePath) || filePath.startsWith('./') || filePath.startsWith('../')) {
      if (fs.existsSync(filePath)) {
        fileFound = true;
      }
    }
    
    // Try different path variations if not found
    if (!fileFound) {
      const possiblePaths = [
        filePath,
        path.join(__dirname, '../src/content/tooling', filePath),
        path.join(__dirname, '../src/content/tools', filePath),
        path.join(__dirname, '../src/content', filePath)
      ];
      
      for (const testPath of possiblePaths) {
        if (fs.existsSync(testPath)) {
          console.log(`Found file at: ${testPath}`);
          filePath = testPath;
          fileFound = true;
          break;
        }
      }
      
      // If still not found, try using glob
      if (!fileFound) {
        console.log(`Could not find file directly, trying glob pattern...`);
        
        // Create glob patterns for different possible locations
        const globPatterns = [
          path.join(__dirname, '../src/content/tooling', `**/${path.basename(filePath)}`),
          path.join(__dirname, '../src/content/tools', `**/${path.basename(filePath)}`),
        ];
        
        for (const pattern of globPatterns) {
          const matches = await glob(pattern);
          if (matches.length > 0) {
            console.log(`Found file using glob: ${matches[0]}`);
            filePath = matches[0];
            fileFound = true;
            break;
          }
        }
      }
    }
    
    if (fileFound) {
      await processFile(filePath);
    } else {
      console.error(`Could not find file: ${filePath}`);
    }
  } else {
    // Process all files in the tooling directory, including all subdirectories
    const contentDir = path.join(__dirname, '../src/content/tooling');
    
    // Find all markdown files in any subdirectory, handling spaces in directory names
    const files = await glob('**/*.md', { 
      cwd: contentDir,
      nodir: true,
      windowsPathsNoEscape: true // Helps with handling special characters in paths
    });
    
    console.log(`Found ${files.length} markdown files in tooling directory and subdirectories`);
    
    for (const file of files) {
      const filePath = path.join(contentDir, file);
      await processFile(filePath);
    }
  }
}

// Run the processor
processToolFiles()
  .then(() => console.log('All tool files processed'))
  .catch(error => console.error('Error processing tool files:', error));