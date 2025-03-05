const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const matter = require('gray-matter');
const dotenv = require('dotenv');
const { fetch } = require('undici');

// Load environment variables
dotenv.config();

const openGraphKey = process.env.PUBLIC_OPEN_GRAPH_API_KEY;

// Function to fetch OpenGraph data
async function getFromOpenGraphIo(url) {
  try {
    const proxyUrl = `https://opengraph.io/api/1.1/site/${encodeURIComponent(url)}?accept_lang=auto&use_proxy=true&app_id=${openGraphKey}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
    return null;
  }
}

// Process a single file
async function processFile(filePath) {
  console.log(`Processing file: ${filePath}`);
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);
    
    if (frontmatter && frontmatter.url) {
      console.log(`Processing ${path.basename(filePath)} with URL: ${frontmatter.url}`);
      
      // Check if we need to fetch OpenGraph data
      if (!frontmatter.title || !frontmatter.image || !frontmatter.site_name) {
        console.log(`Fetching OpenGraph data for ${frontmatter.url}...`);
        
        // Fetch OpenGraph data
        const ogData = await getFromOpenGraphIo(frontmatter.url);
        
        if (ogData && Object.keys(ogData).length > 0) {
          // Update the frontmatter with the fetched data
          Object.keys(ogData).forEach(key => {
            if (ogData[key] !== undefined && ogData[key] !== null) {
              frontmatter[key] = ogData[key];
            }
          });
          
          // Add or update the og-last-fetch property with current date
          // Only add timestamp when fetch was successful
          frontmatter['og-last-fetch'] = new Date().toISOString();
          
          try {
            // Convert back to frontmatter string
            const updatedContent = matter.stringify(content, frontmatter);
            
            // Write back to file
            fs.writeFileSync(filePath, updatedContent);
            console.log(`✅ Updated ${path.basename(filePath)} with OpenGraph data and timestamp`);
          } catch (error) {
            console.error(`Error updating ${path.basename(filePath)}:`, error);
            console.log('Problem frontmatter:', JSON.stringify(frontmatter));
          }
        } else {
          console.log(`⚠️ No usable OpenGraph data found for ${path.basename(filePath)}`);
          // Do not update og-last-fetch when no data was found
        }
      } else {
        console.log(`Skipping ${path.basename(filePath)} - already has complete OpenGraph data`);
        // Do not update og-last-fetch when skipping fetch
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
    
    // Handle different path formats
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
          path.join(__dirname, '../src/content', `**/${path.basename(filePath)}`)
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