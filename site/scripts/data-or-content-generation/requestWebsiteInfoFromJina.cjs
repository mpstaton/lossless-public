const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');
const matter = require('gray-matter');
const dotenv = require('dotenv');
const { fetch } = require('undici');

// Load environment variables
dotenv.config();

// Processing modes
const PROCESS_MODE = {
  NEW_ONLY: 'NEW_ONLY',
  NEW_AND_TIMEOUTS: 'NEW_AND_TIMEOUTS',
  NEW_AND_429: 'NEW_AND_429',
  ALL: 'ALL'
};

// Output modes
const OUTPUT_MODE = {
  JSON: 'json',
  MARKDOWN: 'markdown'
};

// Configuration
const CONFIG = {
  PROCESS_MODE: PROCESS_MODE.ALL,
  OUTPUT_MODE: OUTPUT_MODE.MARKDOWN,
  ERROR_LOG_PATH: './scripts/fixes-needed/JinaErrors.md',
  OUTPUT_DIR: {
    [OUTPUT_MODE.JSON]: 'src/data/01_jina-run',
    [OUTPUT_MODE.MARKDOWN]: 'src/data/02_jina-markdown'
  }
};

async function appendToErrorLog(filePath, error) {
  const errorMessage = `${new Date().toISOString()} - ${filePath}: ${error}\n`;
  try {
    await fs.appendFile(CONFIG.ERROR_LOG_PATH, errorMessage);
  } catch (err) {
    console.error('Failed to write to error log:', err);
  }
}

async function makeJinaRequest(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 100000);

  try {
    const response = await fetch(`https://r.jina.ai/${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.JINA_API_KEY}`,
        'X-Return-Format': CONFIG.OUTPUT_MODE,
        'X-With-Links-Summary': 'true',
        'X-With-Shadow-Dom': 'true'
      },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle response based on output mode
    if (CONFIG.OUTPUT_MODE === OUTPUT_MODE.JSON) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const text = await response.text();
      return { success: true, data: text };
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      return { success: false, error: 'TIMEOUT' };
    }
    return { success: false, error: error.message };
  } finally {
    clearTimeout(timeout);
  }
}

async function processFile(filePath) {
  try {
    // Read and parse the file
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data: frontMatter, content } = matter(fileContent);

    if (!frontMatter.url) {
      console.log(`Skipped ${filePath} (no URL)`);
      return;
    }

    // Make the Jina request
    const result = await makeJinaRequest(frontMatter.url);
    const timestamp = new Date().toISOString();

    // Update frontmatter
    frontMatter.last_jina_request = timestamp;

    if (!result.success) {
      frontMatter.jina_error = result.error;
      await appendToErrorLog(filePath, result.error);
      console.log(`Error processing ${filePath}: ${result.error}`);
    } else {
      // Get output directory based on mode
      const outputDir = CONFIG.OUTPUT_DIR[CONFIG.OUTPUT_MODE];
      const extension = CONFIG.OUTPUT_MODE === OUTPUT_MODE.JSON ? '.json' : '.md';
      const fileName = path.basename(filePath, '.md') + extension;
      const outputPath = path.join(outputDir, fileName);
      
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      
      // Write the content based on mode
      const content = CONFIG.OUTPUT_MODE === OUTPUT_MODE.JSON 
        ? JSON.stringify(result.data, null, 2)
        : result.data;
        
      await fs.writeFile(outputPath, content);
      console.log(`Successfully processed ${filePath}`);
    }

    // Write updated frontmatter back to file
    const updatedFileContent = matter.stringify(content, frontMatter);
    await fs.writeFile(filePath, updatedFileContent);

  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    await appendToErrorLog(filePath, error.message);
  }
}

async function shouldProcessFile(filePath, mode) {
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const { data: frontMatter } = matter(fileContent);

  switch (mode) {
    case PROCESS_MODE.NEW_ONLY:
      return !frontMatter.last_jina_request;
    case PROCESS_MODE.NEW_AND_TIMEOUTS:
      return !frontMatter.last_jina_request || frontMatter.jina_error === 'TIMEOUT';
    case PROCESS_MODE.NEW_AND_429:
      return !frontMatter.last_jina_request || frontMatter.jina_error === 'HTTP error! status: 429';
    case PROCESS_MODE.ALL:
      return true;
    default:
      return false;
  }
}

async function main() {
  try {
    const files = await glob('src/content/tooling/**/*.md');
    
    // Filter files based on processing mode
    const filesToProcess = [];
    for (const file of files) {
      if (await shouldProcessFile(file, CONFIG.PROCESS_MODE)) {
        filesToProcess.push(file);
      }
    }

    console.log(`Processing ${filesToProcess.length} files in ${CONFIG.PROCESS_MODE} mode`);
    await Promise.all(filesToProcess.map(processFile));
    console.log('Processing complete!');
  } catch (error) {
    console.error('Error in main process:', error);
  }
}

main();
