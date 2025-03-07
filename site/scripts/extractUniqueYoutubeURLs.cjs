const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const matter = require('gray-matter');

const OUTPUT_FILE = 'src/content/data/youtube-urls.json';

// Extract YouTube video IDs from content using regex
function extractYoutubeIds(content) {
  if (!content) return [];
  
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/g;
  const matches = [...content.matchAll(regex)];
  return [...new Set(matches.map(match => match[1]))];
}

async function main() {
  try {
    // Find all markdown files in the tooling directory
    const files = await glob('src/content/tooling/**/*.md');
    console.log(`Found ${files.length} markdown files to process`);
    
    const results = [];
    
    for (const filePath of files) {
      try {
        // Read and parse the markdown file
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);
        
        // Extract YouTube IDs from content
        const youtubeIds = extractYoutubeIds(content);
        
        if (youtubeIds.length > 0) {
          results.push({
            filename: path.basename(filePath),
            url: data.url || '',
            youtube_urls: youtubeIds.map(id => `https://youtube.com/watch?v=${id}`)
          });
          
          console.log(`Found ${youtubeIds.length} YouTube URLs in ${path.basename(filePath)}`);
        }
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
      }
    }
    
    // Write results to file
    if (results.length > 0) {
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
      console.log(`\nWrote ${results.length} entries to ${OUTPUT_FILE}`);
    } else {
      console.log('\nNo YouTube URLs found in any files');
    }
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
