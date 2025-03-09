const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');
const matter = require('gray-matter');
const dotenv = require('dotenv');
const { fetch } = require('undici');

// Load environment variables
dotenv.config();

const ERROR_LOG_PATH = './scripts/fixes-needed/JinaErrors.md';

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
  const timeout = setTimeout(() => controller.abort(), 10000);

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

async function main() {
  try {
    // Get all markdown files in the tooling directory
    const files = await glob('src/content/tooling/**/*.md');

    // Process all files concurrently
    await Promise.all(files.map(processFile));

    console.log('Processing complete!');
  } catch (error) {
    console.error('Error in main process:', error);
  }
}

main();
