const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');

// Convert exec to return a Promise
const execPromise = util.promisify(exec);

// Configuration
const outputDirectory = 'src/content/data/sources'; // Directory to save output files
const concurrentLimit = 1; // Process one video at a time to avoid overload
const delayBetweenRequests = 50000; // 50 delay between requests

function getYoutubeUrls() {
  try {
    // Read and parse the JSON file
    const jsonData = JSON.parse(fs.readFileSync('src/content/data/youtube-urls.json', 'utf8'));
    
    // Collect all YouTube URLs into a single array and remove duplicates
    const allUrls = jsonData
      .reduce((urls, item) => [...urls, ...(item.youtube_urls || [])], [])
      .filter((url, index, self) => self.indexOf(url) === index); // Remove duplicates
    
    return allUrls;
  } catch (error) {
    console.error('Error reading or parsing youtube-urls.json:', error);
    return [];
  }
}

// List of YouTube URLs to process
const youtubeUrls = getYoutubeUrls();

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory, { recursive: true });
}

/**
 * Process a single YouTube URL
 * @param {string} url - The YouTube URL to process
 * @returns {Promise<string>} - The output file path
 */
async function processYoutubeUrl(url) {
  console.log(`Processing URL: ${url}`);
  const thisYoutubeUrl = url;
  const frontMatterMark = `---`

  
  try {
    // Extract video ID for filename
    const videoId = extractVideoId(url);
    if (!videoId) {
      throw new Error(`Could not extract video ID from URL: ${url}`);
    }
    
    const frontMatterOutput = 
      `${frontMatterMark}\nthis_video_url: ${thisYoutubeUrl}\nthis_video_id: ${videoId}\n${frontMatterMark}`;

    const outputFile = path.join(outputDirectory, `juice_from_${videoId}.md`);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const logFile = path.join(outputDirectory, `${videoId}_log_${timestamp}.md`);
    0
    // Construct command
    const command = `fabric -y ${url} --stream --pattern extract_wisdom`;
    
    // Execute command and capture output
    console.log(`Executing: ${command}`);
    console.log(`Saving output to: ${outputFile}`);
    
    const { stdout, stderr } = await execPromise(command);
    
    fullFileOutput = `${frontMatterOutput}\n${stdout}`;
    // Save output to file
    fs.writeFileSync(outputFile, fullFileOutput);
    
    // Save logs if there's any stderr
    if (stderr) {
      fs.writeFileSync(logFile, stderr);
      console.log(`Saved error logs to: ${logFile}`);
    }
    
    console.log(`Finished processing: ${url}`);
    return outputFile;
  } catch (error) {
    console.error(`Error processing URL ${url}:`, error.message);
    // Write error to log file
    const errorLogFile = path.join(
      outputDirectory, 
      `error_${new Date().toISOString().replace(/[:.]/g, '-')}.log`
    );
    fs.writeFileSync(errorLogFile, `URL: ${url}\nError: ${error.message}\n${error.stack}`);
    console.error(`Error details written to: ${errorLogFile}`);
    return null;
  }
}

/**
 * Extract video ID from a YouTube URL
 * @param {string} url - The YouTube URL
 * @returns {string|null} - The extracted video ID or null if not found
 */
function extractVideoId(url) {
  try {
    const urlObj = new URL(url);
    
    // Handle youtu.be format
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.substring(1).split('?')[0];
    }
    
    // Handle youtube.com format
    if (urlObj.hostname.includes('youtube.com')) {
      const searchParams = new URLSearchParams(urlObj.search);
      return searchParams.get('v');
    }
    
    return null;
  } catch (error) {
    console.error(`Error extracting video ID from ${url}:`, error.message);
    return null;
  }
}

/**
 * Process all YouTube URLs in the list
 */
async function processAllUrls() {
  console.log(`Starting to process ${youtubeUrls.length} YouTube URLs...`);
  console.log(`Output will be saved to: ${path.resolve(outputDirectory)}`);
  
  const results = [];
  
  // Process URLs sequentially to avoid overloading the system
  for (let i = 0; i < youtubeUrls.length; i++) {
    const url = youtubeUrls[i];
    console.log(`\n[${i + 1}/${youtubeUrls.length}] Processing URL...`);
    
    const outputFile = await processYoutubeUrl(url);
    results.push({
      url,
      outputFile,
      success: !!outputFile
    });
    
    // Add delay between requests if not the last URL
    if (i < youtubeUrls.length - 1) {
      console.log(`Waiting ${delayBetweenRequests/1000} seconds before processing next URL...`);
      await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
    }
  }
  
  // Print summary
  console.log('\n--- Processing Summary ---');
  console.log(`Total URLs: ${youtubeUrls.length}`);
  console.log(`Successfully processed: ${results.filter(r => r.success).length}`);
  console.log(`Failed: ${results.filter(r => !r.success).length}`);
  
  // List successful outputs
  if (results.filter(r => r.success).length > 0) {
    console.log('\nSuccessfully processed files:');
    results.filter(r => r.success).forEach(result => {
      console.log(`- ${result.url} → ${result.outputFile}`);
    });
  }
  
  // List failures
  if (results.filter(r => !r.success).length > 0) {
    console.log('\nFailed URLs:');
    results.filter(r => !r.success).forEach(result => {
      console.log(`- ${result.url}`);
    });
    console.log('Check error logs in the output directory for details.');
  }
}

// Start processing
processAllUrls().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

