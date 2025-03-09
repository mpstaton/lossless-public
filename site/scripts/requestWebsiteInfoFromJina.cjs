const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');
const matter = require('gray-matter');
const dotenv = require('dotenv');
const { fetch } = require('undici');

// Load environment variables
dotenv.config();

const ERROR_LOG_PATH = './scripts/fixes-needed/JinaErrors.md';

// Processing modes
const PROCESS_MODE = {
  NEW_ONLY: 'NEW_ONLY',         // Only process files without last_jina_request
  NEW_AND_TIMEOUTS: 'NEW_AND_TIMEOUTS', // Process new files and those with TIMEOUT errors
  ALL: 'ALL'                    // Process all files
};

// Set your desired mode here
const CURRENT_MODE = PROCESS_MODE.NEW_AND_TIMEOUTS;

async function appendToErrorLog(filePath, error) {
  const errorMessage = `${new Date().toISOString()} - ${filePath}: ${error}\n`;
  try {
    await fs.appendFile(ERROR_LOG_PATH, errorMessage);
  } catch (err) {
    console.error('Failed to write to error log:', err);
  }
}

async function makeJinaRequest(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 50000);

  try {
    const response = await fetch(`https://r.jina.ai/${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.JINA_API_KEY}`,
        'X-Return-Format': 'markdown',
        'X-With-Links-Summary': 'true',
        'X-With-Shadow-Dom': 'true'
      },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
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
      // Save Jina response to JSON file
      const fileName = path.basename(filePath, '.md') + '.json';
      const jsonPath = path.join('src/data/01_jina-run', fileName);
      await fs.mkdir(path.dirname(jsonPath), { recursive: true });
      await fs.writeFile(jsonPath, JSON.stringify(result.data, null, 2));
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
      if (await shouldProcessFile(file, CURRENT_MODE)) {
        filesToProcess.push(file);
      }
    }

    console.log(`Processing ${filesToProcess.length} files in ${CURRENT_MODE} mode`);
    await Promise.all(filesToProcess.map(processFile));
    console.log('Processing complete!');
  } catch (error) {
    console.error('Error in main process:', error);
  }
}

main();
