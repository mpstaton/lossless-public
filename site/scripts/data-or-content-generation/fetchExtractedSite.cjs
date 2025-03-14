const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const matter = require('gray-matter');
const dotenv = require('dotenv');
const { fetch } = require('undici');

// Load environment variables
dotenv.config();

const openGraphKey = process.env.PUBLIC_OPEN_GRAPH_API_KEY;

// Function to check if file should be skipped
function shouldSkipFile(frontmatter, filename) {
  // Skip if og_errors is true
  if (frontmatter.og_errors === true) {
    console.log(`${filename} has previous OpenGraph errors. Skipping.`);
    return true;
  }

  // Skip if og_screenshot_url is already filled
  if (frontmatter.og_screenshot_url) {
    console.log(`${filename} already filled with Open Graph data. Skipping.`);
    return true;
  }

  return false;
}

// Function to fetch OpenGraph data
async function fetchOpenGraphData(url, filePath) {
  try {
    const proxyUrl = `https://opengraph.io/api/1.1/site/${encodeURIComponent(url)}?dimensions:lg?accept_lang=auto&use_proxy=true&app_id=${openGraphKey}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      // Handle HTTP errors by marking the file
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data: frontmatter, content } = matter(fileContent);
      
      frontmatter.og_errors = true;
      frontmatter.og_last_error = new Date().toISOString();
      frontmatter.og_error_status = response.status;
      
      const updatedContent = matter.stringify(content, frontmatter);
      fs.writeFileSync(filePath, updatedContent);
      
      console.log(`⚠️ HTTP error ${response.status} for ${url}. Marked file with og_errors.`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching OpenGraph data:', error);
    return null;
  }
}

// Process a single file
async function processFile(filePath) {
  const filename = path.basename(filePath);
  console.log(`Processing ${filename}...`);

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);

    // Check if we should skip this file
    if (shouldSkipFile(frontmatter, filename)) {
      return;
    }

    if (!frontmatter.url) {
      console.log(`⚠️ No URL found in ${filename}`);
      return;
    }

    console.log(`Fetching OpenGraph data for ${frontmatter.url}...`);
    const ogData = await fetchOpenGraphData(frontmatter.url, filePath);

    if (ogData && ogData.hybridGraph) {
      // Update frontmatter with OpenGraph data
      frontmatter.og_screenshot_url = ogData.hybridGraph.image;
      frontmatter.og_last_fetch = new Date().toISOString();
      
      // Write updated content back to file
      const updatedContent = matter.stringify(content, frontmatter);
      fs.writeFileSync(filePath, updatedContent);
      
      console.log(`✅ Successfully updated ${filename} with OpenGraph data`);
    }
  } catch (error) {
    console.error(`Error processing ${filename}:`, error);
  }
}

// Main function to process all files
async function processAllFiles() {
  try {
    const contentDir = path.join(process.cwd(), 'src/content/tooling');
    const files = await glob('**/*.md', {
      cwd: contentDir,
      absolute: true
    });

    console.log(`Found ${files.length} markdown files to process`);

    for (const file of files) {
      await processFile(file);
    }

    console.log('Finished processing all files');
  } catch (error) {
    console.error('Error processing files:', error);
  }
}

// Run the script
processAllFiles();
