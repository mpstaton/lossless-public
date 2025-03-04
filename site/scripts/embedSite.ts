import { fetch } from 'undici';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const openGraphKey = process.env.PUBLIC_OPEN_GRAPH_API_KEY;

/**
 * Interface for the OpenGraph.io oEmbed API response
 */
interface OEmbedResponse {
  type: string;
  version: string;
  title?: string;
  provider_name?: string;
  provider_url?: string;
  author_name?: string;
  author_url?: string;
  html?: string;
  width?: number;
  height?: number;
  thumbnail_url?: string;
  thumbnail_width?: number;
  thumbnail_height?: number;
}

/**
 * Get an iframe embed for a URL using OpenGraph.io's oEmbed API
 * @param url The URL to get an embed for
 * @param maxWidth Optional maximum width for the embed
 * @param maxHeight Optional maximum height for the embed
 * @returns The oEmbed response with iframe HTML or null if there was an error
 */
export async function getEmbedFromOpenGraphIo(url: string, maxWidth?: number, maxHeight?: number): Promise<OEmbedResponse | null> {
  try {
    // Validate URL
    if (!url || !url.trim() || !url.startsWith('http')) {
      console.error('Invalid URL provided:', url);
      return null;
    }

    // Build the API URL with optional parameters
    let proxyUrl = `https://opengraph.io/api/1.1/oembed?url=${encodeURIComponent(url)}&use_proxy=true&app_id=${openGraphKey}`;
    
    // Add optional parameters if provided
    if (maxWidth) proxyUrl += `&maxwidth=${maxWidth}`;
    if (maxHeight) proxyUrl += `&maxheight=${maxHeight}`;
    
    console.log(`Fetching embed for: ${url}`);
    
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const embedData = await response.json() as OEmbedResponse;
    
    // Validate the response
    if (!embedData || !embedData.html) {
      console.warn(`No embed HTML returned for ${url}`);
      return null;
    }
    
    console.log(`Successfully retrieved embed for: ${url}`);
    return embedData;
  } catch (error) {
    console.error('Error embedding site with OpenGraph.io:', url, error);
    return null;
  }
}

/**
 * Process a markdown file to add embeds for URLs
 * @param filePath Path to the markdown file
 */
export async function processFileForEmbeds(filePath: string): Promise<void> {
  try {
    console.log(`Processing file for embeds: ${filePath}`);
    
    // Read the file
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);
    
    // Check if the file has a URL to embed
    if (frontmatter && frontmatter.url) {
      console.log(`Found URL to embed: ${frontmatter.url}`);
      
      // Get the embed
      const embedData = await getEmbedFromOpenGraphIo(frontmatter.url);
      
      if (embedData && embedData.html) {
        // Add the embed HTML to the frontmatter
        frontmatter.embed_html = embedData.html;
        frontmatter.embed_width = embedData.width;
        frontmatter.embed_height = embedData.height;
        frontmatter.embed_provider = embedData.provider_name;
        
        // Write the updated content back to the file
        const updatedContent = matter.stringify(content, frontmatter);
        fs.writeFileSync(filePath, updatedContent);
        
        console.log(`✅ Added embed to ${path.basename(filePath)}`);
      } else {
        console.log(`⚠️ No embed data found for ${frontmatter.url}`);
      }
    } else {
      console.log(`⚠️ No URL found in ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`Error processing file for embeds: ${filePath}`, error);
  }
}

/**
 * Main function to process files for embeds
 */
export async function processFilesForEmbeds(): Promise<void> {
  try {
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
        await processFileForEmbeds(filePath);
      } else {
        console.error(`Could not find file: ${filePath}`);
      }
    } else {
      // Process all files in the tooling directory
      const contentDir = path.join(__dirname, '../src/content/tooling');
      
      // Find all markdown files
      const files = await glob('*.md', { cwd: contentDir });
      
      for (const file of files) {
        const filePath = path.join(contentDir, file);
        await processFileForEmbeds(filePath);
      }
    }
    
    console.log('All files processed for embeds');
  } catch (error) {
    console.error('Error processing files for embeds:', error);
  }
}

// Run the processor if this file is executed directly
if (require.main === module) {
  processFilesForEmbeds()
    .then(() => console.log('Embed processing complete'))
    .catch(error => console.error('Error in embed processing:', error));
}