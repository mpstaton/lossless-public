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

// Main function to process all tool files
async function processToolFiles() {
  const contentDir = path.join(__dirname, '../src/content/tools');
  
  // Find all markdown files except config.ts
  const files = await glob('*.md', { cwd: contentDir });
  
  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);
    
    if (frontmatter && frontmatter.url) {
      console.log(`Processing ${file} with URL: ${frontmatter.url}`);
      
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
          
          try {
            // Convert back to frontmatter string
            const updatedContent = matter.stringify(content, frontmatter);
            
            // Write back to file
            fs.writeFileSync(filePath, updatedContent);
            console.log(`✅ Updated ${file} with OpenGraph data`);
          } catch (error) {
            console.error(`Error updating ${file}:`, error);
            console.log('Problem frontmatter:', JSON.stringify(frontmatter));
          }
        } else {
          console.log(`⚠️ No usable OpenGraph data found for ${file}`);
        }
      } else {
        console.log(`Skipping ${file} - already has complete OpenGraph data`);
      }
    } else {
      console.log(`⚠️ Missing URL in ${file}`);
    }
  }
}

// Run the processor
processToolFiles()
  .then(() => console.log('All tool files processed'))
  .catch(error => console.error('Error processing tool files:', error)); 