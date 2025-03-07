
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const matter = require('gray-matter');

// Configuration
const DEFAULT_SEARCH_PATH = 'src/content/**/*.md';
const DEFAULT_OUTPUT_PATH = 'src/content/data/output-youtube-urls.json';


function extractYoutubeUrls(content) {
  if (!content) return [];
  
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
  const matches = content.match(youtubeRegex) || [];
  return [...new Set(matches.map(url => url.split('&')[0]))];
}

function processMarkdownFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    const frontmatterUrl = data.url || '';
    const youtubeUrls = extractYoutubeUrls(content);
    
    if (youtubeUrls.length > 0) {
      return {
        filename: path.basename(filePath),
        path: filePath,
        frontmatterUrl,
        youtubeUrls
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
    return null;
  }
}

async function processFiles(searchPath = DEFAULT_SEARCH_PATH, outputPath = DEFAULT_OUTPUT_PATH) {
  try {
    console.log('Starting YouTube URL extraction from Markdown files...');
    console.log(`Searching in: ${searchPath}`);
    
    const markdownFiles = await glob(searchPath);
    console.log(`Found ${markdownFiles.length} Markdown files to process`);
    
    const results = [];
    for (const filePath of markdownFiles) {
      const fileResult = processMarkdownFile(filePath);
      if (fileResult) {
        results.push(fileResult);
        console.log(`Extracted ${fileResult.youtubeUrls.length} YouTube URLs from ${filePath}`);
      }
    }
    
    fs.writeFileSync(
      outputPath,
      JSON.stringify(results, null, 2),
      'utf8'
    );
    
    console.log(`Successfully processed ${markdownFiles.length} files`);
    console.log(`Found YouTube URLs in ${results.length} files`);
    console.log(`Results saved to ${outputPath}`);

  } catch (error) {
    console.error('Error processing Markdown files:', error);
    throw error;
  }
}

async function main() {
  try {
    await processFiles(
      process.argv[2] || DEFAULT_SEARCH_PATH,
      process.argv[3] || DEFAULT_OUTPUT_PATH
    );
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
