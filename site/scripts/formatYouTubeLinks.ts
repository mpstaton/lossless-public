#!/usr/bin/env node

/**
 * Script to find and format YouTube links in markdown files
 * 
 * This script scans markdown files for youtu.be links that are not already
 * properly formatted, and surrounds them with the appropriate iframe code.
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';
import dotenv from 'dotenv';
import { fetch } from 'undici';

// Load environment variables
dotenv.config();

// YouTube API key from environment variables - check both possible names
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || process.env.VITE_YOUTUBE_API_KEY;

// Simple check - will only log length to avoid exposing key
console.log('API key loaded:', YOUTUBE_API_KEY ? '✓' : '✗');

console.log('Environment:', {
  hasKey: !!YOUTUBE_API_KEY,
  keyLength: YOUTUBE_API_KEY?.length || 0,
  keyStart: YOUTUBE_API_KEY ? `${YOUTUBE_API_KEY.substring(0, 3)}...` : 'none'
});

if (!YOUTUBE_API_KEY) {
  throw new Error('YouTube API key is not configured');
}

console.log('API Key length:', YOUTUBE_API_KEY.length);

/**
 * Check if a URL is a YouTube URL
 */
export const isYouTubeUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const result = urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be');
    console.log(`isYouTubeUrl check for "${url}": ${result}`);
    return result;
  } catch {
    return false;
  }
};

/**
 * Check if a URL is a Google Books URL
 */
export const isGoogleBooksUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('books.google.com');
  } catch {
    return false;
  }
};

/**
 * YouTube data interface
 */
interface YouTubeData {
  etag: string;
  title: string;
  publishedAt: string;
  channelTitle: string;
  description: string;
  uniqueEmbedId: string;
}

/**
 * YouTube API response interface
 */
interface YouTubeApiResponse {
  etag: string;
  items?: {
    snippet: {
      title: string;
      publishedAt: string;
      channelTitle: string;
      description: string;
    }
  }[];
  error?: {
    code?: number;
    status?: string;
    message?: string;
    errors?: {
      reason?: string;
      message?: string;
    }[];
  };
}

/**
 * Video ID extraction result interface
 */
interface VideoIdResult {
  videoId: string;
  uniqueEmbedId: string;
}

/**
 * Extract video ID and embed ID from a YouTube URL
 */
const extractVideoIdAndEmbed = (url: string): VideoIdResult => {
  try {
    const urlObj = new URL(url);
    let videoId = '';
    let uniqueEmbedId = '';
    
    // Handle youtu.be share URLs
    if (urlObj.hostname.includes('youtu.be')) {
      videoId = urlObj.pathname.slice(1);
      // Preserve query parameters for embedding
      uniqueEmbedId = videoId;
      if (urlObj.search) {
        // Remove the ?si parameter but keep others like ?t for timestamp
        const params = new URLSearchParams(urlObj.search);
        params.delete('si'); // Remove tracking parameter
        const cleanParams = params.toString();
        if (cleanParams) {
          uniqueEmbedId = `${videoId}?${cleanParams}`;
        }
      }
      console.log('Extracted ID from youtu.be:', videoId, 'Embed ID:', uniqueEmbedId);
      return { videoId, uniqueEmbedId };
    }
    
    // Handle regular youtube.com URLs
    if (urlObj.hostname.includes('youtube.com')) {
      // Handle watch URLs
      const paramId = urlObj.searchParams.get('v');
      if (paramId) {
        videoId = paramId;
        uniqueEmbedId = videoId;
        
        // Preserve timestamp parameter if present
        if (urlObj.searchParams.has('t')) {
          const timestamp = urlObj.searchParams.get('t');
          uniqueEmbedId = `${videoId}?start=${timestamp}`;
        }
        
        console.log('Extracted ID from youtube.com/watch:', videoId, 'Embed ID:', uniqueEmbedId);
        return { videoId, uniqueEmbedId };
      }
      
      // Handle youtube.com/shorts URLs
      if (urlObj.pathname.includes('/shorts/')) {
        videoId = urlObj.pathname.split('/shorts/')[1];
        uniqueEmbedId = videoId;
        console.log('Extracted ID from youtube.com/shorts:', videoId);
        return { videoId, uniqueEmbedId };
      }
      
      // Handle youtube.com/embed URLs
      if (urlObj.pathname.includes('/embed/')) {
        videoId = urlObj.pathname.split('/embed/')[1];
        uniqueEmbedId = videoId;
        console.log('Extracted ID from youtube.com/embed:', videoId);
        return { videoId, uniqueEmbedId };
      }
    }

    // Fallback to regex method
    const regexMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    if (regexMatch) {
      videoId = regexMatch;
      uniqueEmbedId = regexMatch;
      console.log('Extracted ID using regex fallback:', videoId);
      return { videoId, uniqueEmbedId };
    }

    return {
      videoId: '',
      uniqueEmbedId: 'Not a share link'
    };
  } catch (error) {
    console.error('Error extracting video ID:', error);
    return {
      videoId: '',
      uniqueEmbedId: 'Not a share link'
    };
  }
};

/**
 * Fetch YouTube data for a video URL
 */
export const fetchYouTubeData = async (url: string): Promise<YouTubeData> => {
  try {
    const { videoId, uniqueEmbedId } = extractVideoIdAndEmbed(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL - Could not extract video ID');
    }

    console.log('Attempting API call with video ID:', videoId);
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json() as YouTubeApiResponse;
    
    if (!response.ok) {
      console.error('YouTube API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        errorResponse: data
      });
      
      // Check for API key/authentication issues specifically
      if (data.error?.status === 'INVALID_ARGUMENT' || 
          data.error?.code === 400 ||
          data.error?.errors?.some((e) => 
            e.reason === 'badRequest' || e.message?.includes('API key'))) {
        throw new Error('YouTube API authentication failed. Please check your API key configuration.');
      } 
      // Check for quota exceeded
      else if (data.error?.code === 403 || data.error?.errors?.some((e) => 
        e.reason === 'quotaExceeded')) {
        throw new Error('YouTube API quota exceeded. Please try again later.');
      }
      // Generic error fallback
      else {
        throw new Error(`YouTube API error: ${response.status} - ${data.error?.message || response.statusText}`);
      }
    }

    console.log('YouTube API Response:', data);

    if (!data.items || data.items.length === 0) {
      throw new Error('Video not found');
    }

    const videoInfo = data.items[0].snippet;
    return {
      etag: data.etag,
      title: videoInfo.title,
      publishedAt: videoInfo.publishedAt,
      channelTitle: videoInfo.channelTitle,
      description: videoInfo.description,
      uniqueEmbedId: uniqueEmbedId
    };
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    if (error instanceof Error) {
      throw new Error(`YouTube API Error: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Format a date object into a structured format for citations
 * Uses the preferred format "2025, Mar 03."
 */
function formatDate(date: Date): { year: string; month: string; day: string } {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  return {
    year: date.getFullYear().toString(),
    month: months[date.getMonth()],
    day: date.getDate().toString().padStart(2, '0')
  };
}

/**
 * Add a footnotes section to the content if it doesn't already exist
 * @param content The content to check and potentially modify
 * @param footnotesHeader The header text for the footnotes section
 * @param footnotesSectionLine The separator line for the footnotes section
 * @returns The modified content with footnotes section if needed
 */
function addFootnoteSectionIfNone(content: string, footnotesHeader: string, footnotesSectionLine: string): string {
  // Check if the footnotes section already exists
  // Escape special regex characters in the input strings
  const escapedHeader = footnotesHeader.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedLine = footnotesSectionLine.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Create the regex pattern with escaped strings
  const footnotesPattern = new RegExp(`${escapedHeader}\\s*${escapedLine}`, 's');
  
  if (!footnotesPattern.test(content)) {
    console.log('Footnotes section not found, adding it');
    
    // Add three blank lines and then the footnotes section
    return content + '\n\n\n' + footnotesHeader + '\n' + footnotesSectionLine + '\n';
  }
  
  console.log('Footnotes section already exists');
  return content;
}

/**
 * Process markdown files to find and format YouTube links
 * @param globPattern - The glob pattern to match markdown files
 */
export const processMarkdownFiles = async (globPattern: string): Promise<void> => {
  try {
    // Find all markdown files matching the pattern
    const files = await glob(globPattern);
    console.log(`Found ${files.length} markdown files to process`);

    let totalLinksProcessed = 0;
    let totalFilesModified = 0;
    
    // Define constants for footnotes section
    const footnotesHeader = `# Footnotes`;
    const footnotesSectionLine = `***`;

    for (const filePath of files) {
      console.log(`Processing file: ${filePath}`);
      
      // Read the file content
      const fileContent = fs.readFileSync(filePath, 'utf8');
      console.log(`File content length: ${fileContent.length} characters`);
      
      // Parse frontmatter and content
      const parsedFile = matter(fileContent);
      const content = parsedFile.content;
      console.log(`Content after frontmatter: ${content.length} characters`);
      
      // Regular expression to find youtu.be links
      // This regex looks for youtu.be links that are not already inside an iframe tag
      // Updated to better match the format in the file
      const youtubeLinkRegex = /https?:\/\/(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([a-zA-Z0-9_-]+)(?:\?[^)\s]*)?/g;
      
      let modifiedContent = content;
      let fileModified = false;
      let matches: string[] = [];
      let match: RegExpExecArray | null;
      
      // Find all matches first to avoid regex state issues with async operations
      while ((match = youtubeLinkRegex.exec(content)) !== null) {
        matches.push(match[0]);
      }
      
      console.log(`Found ${matches.length} YouTube links in content`);
      if (matches.length > 0) {
        console.log(`YouTube links found: ${JSON.stringify(matches)}`);
        
        // Process each match
        for (const youtubeUrl of matches) {
          try {
            console.log(`Processing YouTube link: ${youtubeUrl}`);
            
            // Check if the URL is already in an iframe
            const iframeRegex = new RegExp(`<iframe[^>]*src=["'][^"']*${youtubeUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^"']*["'][^>]*>`, 'i');
            if (iframeRegex.test(content)) {
              console.log(`URL ${youtubeUrl} is already in an iframe, skipping`);
              continue;
            }
            
            // Check if the URL is in the Footnotes section
            const footnotesPos = content.indexOf(footnotesHeader);
            if (footnotesPos !== -1 && content.indexOf(youtubeUrl, footnotesPos) !== -1) {
              console.log(`URL ${youtubeUrl} is already in the Footnotes section, skipping`);
              continue;
            }
            
            // Fetch YouTube data for the link
            const youtubeData = await fetchYouTubeData(youtubeUrl);
            console.log(`Fetched data for video: ${youtubeData.title}`);
            
            // Generate a random hex string for the footnote reference that includes at least 2 lowercase letters
            const generateRandomHex = (): string => {
              // Create a pool of characters (0-9, a-f)
              const numbers = '0123456789';
              const letters = 'abcdef';
              let result = '';
              
              // Ensure at least 2 letters
              for (let i = 0; i < 2; i++) {
                result += letters.charAt(Math.floor(Math.random() * letters.length));
              }
              
              // Fill the rest with random hex characters (could be numbers or letters)
              while (result.length < 6) {
                const useLetters = Math.random() > 0.5;
                const pool = useLetters ? letters : numbers;
                result += pool.charAt(Math.floor(Math.random() * pool.length));
              }
              
              // Shuffle the string to randomize positions of the letters
              return result.split('').sort(() => Math.random() - 0.5).join('');
            };
            
            const randHex = generateRandomHex();
            
            // Format the current date for the citation
            const formattedDate = formatDate(new Date());

            const citeMarkdownWithHex = `[^${randHex}]`;
            const fullLineCiteMarkdownWithHex = `[^${randHex}] ${formattedDate.year}, ${formattedDate.month} ${formattedDate.day}. "[${youtubeData.title}](${youtubeUrl})," [[${youtubeData.channelTitle}]]`;
            const fullLineFootnoteMarkdownWithHex = `[^${randHex}]: ${formattedDate.year}, ${formattedDate.month} ${formattedDate.day}. "[${youtubeData.title}](${youtubeUrl})," [[${youtubeData.channelTitle}]]`;
            
            // Generate the iframe code
            // Determine if this is a shorts video by checking the URL
            const isShorts = youtubeUrl.includes('/shorts/');
            const aspectRatio = isShorts ? "9/16" : "16/9";
            
            // Prepare the embed URL with proper query parameter formatting
            let embedUrl = `https://www.youtube.com/embed/${youtubeData.uniqueEmbedId}`;
            
            // Add controls=0 as a query parameter
            if (embedUrl.includes('?')) {
              // If there are already query parameters, append with &
              embedUrl += '&controls=0';
            } else {
              // If no query parameters yet, start with ?
              embedUrl += '?controls=0';
            }
            
            const iframeCode = `<div class="youtube-container"><iframe 
style="aspect-ratio:${aspectRatio};width:100%;height:auto" 
src="${embedUrl}" 
title="YouTube video player" 
frameborder="0" 
allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
referrerpolicy="strict-origin-when-cross-origin" 
allowfullscreen
></iframe></div>\n (${youtubeData.channelTitle} ${citeMarkdownWithHex})`;

            // Add footnotes section if it doesn't exist
            modifiedContent = addFootnoteSectionIfNone(modifiedContent, footnotesHeader, footnotesSectionLine);
            
            // Add the footnote to the footnotes section
            const footnotesHeaderPos = modifiedContent.indexOf(footnotesHeader);
            if (footnotesHeaderPos !== -1) {
              // Find the position after the footnotes section line
              const footnotesSectionLinePos = modifiedContent.indexOf(footnotesSectionLine, footnotesHeaderPos);
              if (footnotesSectionLinePos !== -1) {
                // Insert the footnote after the section line
                const insertPos = footnotesSectionLinePos + footnotesSectionLine.length;
                modifiedContent = 
                  modifiedContent.substring(0, insertPos) + 
                  '\n\n' + fullLineFootnoteMarkdownWithHex + 
                  modifiedContent.substring(insertPos);
              }
            }

            console.log(`Generated iframe code with ID: ${youtubeData.uniqueEmbedId}`);
            console.log(`Before replacement, content contains URL: ${modifiedContent.includes(youtubeUrl)}`);
            
            // Replace the URL with the iframe code
            // Use a more specific replacement to avoid replacing URLs that might be part of other text
            const escapedUrl = youtubeUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            // Split content into main content and footnotes to avoid replacing URLs in footnotes
            let mainContent = modifiedContent;
            let footnotesContent = '';
            
            const mainFootnotesPos = modifiedContent.indexOf(footnotesHeader);
            if (mainFootnotesPos !== -1) {
              mainContent = modifiedContent.substring(0, mainFootnotesPos);
              footnotesContent = modifiedContent.substring(mainFootnotesPos);
              console.log(`Split content into main (${mainContent.length} chars) and footnotes (${footnotesContent.length} chars)`);
            }
            
            // Different regex patterns for different contexts
            const markdownLinkRegex = new RegExp(`\\[([^\\]]+)\\]\\(${escapedUrl}\\)`, 'g');
            const plainUrlRegex = new RegExp(`(^|\\s|"|'|\\()${escapedUrl}(\\)|\\s|"|'|$)`, 'g');
            
            let replacementMade = false;
            
            // Check if the URL is in a markdown link in the main content
            if (markdownLinkRegex.test(mainContent)) {
              console.log(`URL is in a markdown link, replacing`);
              // Reset regex lastIndex
              markdownLinkRegex.lastIndex = 0;
              // Replace the markdown link with the iframe code
              mainContent = mainContent.replace(markdownLinkRegex, (match, linkText) => {
                console.log(`Replacing markdown link: ${match}`);
                replacementMade = true;
                return iframeCode;
              });
            } 
            // Check if the URL is a plain URL in the main content
            else if (plainUrlRegex.test(mainContent)) {
              console.log(`URL is a plain URL, replacing`);
              // Reset regex lastIndex
              plainUrlRegex.lastIndex = 0;
              // Replace the plain URL with the iframe code, preserving surrounding context
              mainContent = mainContent.replace(plainUrlRegex, (match, before, after) => {
                console.log(`Replacing plain URL: ${match}`);
                replacementMade = true;
                return `${before}${iframeCode}${after}`;
              });
            }
            // If neither pattern matched, try a direct replacement in the main content
            else if (mainContent.includes(youtubeUrl)) {
              console.log(`Direct replacement fallback for URL: ${youtubeUrl}`);
              mainContent = mainContent.replace(youtubeUrl, iframeCode);
              replacementMade = true;
            }
            else {
              console.log(`Could not find URL in main content, skipping replacement`);
              continue;
            }
            
            // Recombine the content if it was split
            if (mainFootnotesPos !== -1) {
              modifiedContent = mainContent + footnotesContent;
            } else {
              modifiedContent = mainContent;
            }
            
            console.log(`After replacement, content contains iframe: ${modifiedContent.includes(iframeCode)}`);
            
            if (replacementMade) {
              fileModified = true;
              totalLinksProcessed++;
            }
            
            console.log(`Processed YouTube link: ${youtubeUrl}`);
          } catch (error) {
            console.error(`Error processing YouTube link ${youtubeUrl}:`, error);
          }
        }
        
        // Write the modified content back to the file if changes were made
        if (fileModified) {
          console.log(`File was modified, writing changes back to ${filePath}`);
          
          // Preserve frontmatter by using gray-matter to stringify
          const updatedFileContent = matter.stringify(modifiedContent, parsedFile.data);
          
          fs.writeFileSync(filePath, updatedFileContent, 'utf8');
          console.log(`Updated file: ${filePath}`);
          totalFilesModified++;
        } else {
          console.log(`No changes were made to ${filePath}`);
        }
      } else {
        console.log(`No YouTube links found in ${filePath}`);
      }
    }
    
    console.log(`Processing complete. Modified ${totalFilesModified} files and processed ${totalLinksProcessed} YouTube links.`);
  } catch (error) {
    console.error('Error processing markdown files:', error);
  }
};

/**
 * Process a single markdown file
 * @param filePath Path to the markdown file
 */
async function processSingleFile(filePath: string): Promise<void> {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return;
    }
    
    // Check if file is a markdown file
    if (!filePath.toLowerCase().endsWith('.md')) {
      console.error(`Not a markdown file: ${filePath}`);
      return;
    }
    
    console.log(`Processing single file: ${filePath}`);
    
    // Use the same function but with a pattern that matches only this file
    // We need to escape special characters in the file path for the glob pattern
    const escapedPath = filePath.replace(/[*?[\](){}!+@|]/g, '\\$&');
    await processMarkdownFiles(escapedPath);
    
    console.log(`Completed processing file: ${filePath}`);
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

/**
 * Main function to run the script
 */
async function main() {
  try {
    console.log('Starting YouTube link formatting process...');
    
    // Get command line arguments (skip the first two which are node and script path)
    const args = process.argv.slice(2);
    console.log('Raw command line arguments:', args);
    
    // Process arguments to handle cases where -- might be attached to the file path
    // and handle spaces in filenames
    const processedArgs = args.flatMap(arg => {
      // If arg starts with --, split it
      if (arg.startsWith('--') && arg.length > 2) {
        console.log(`Splitting argument: ${arg}`);
        return [arg.substring(2)];
      }
      return [arg];
    }).filter(arg => arg.trim() !== '' && arg !== '--');
    
    console.log('Processed arguments:', processedArgs);
    
    // If specific files are provided, process them individually
    if (processedArgs.length > 0) {
      console.log(`Processing ${processedArgs.length} specific file(s)`);
      
      // Join all arguments as they might be parts of a filename with spaces
      let combinedPath = processedArgs.join(' ');
      console.log(`Combined path: ${combinedPath}`);
      
      // Check if the combined path is a valid file
      let filePath = combinedPath;
      
      // Add .md extension if not present
      if (!filePath.toLowerCase().endsWith('.md')) {
        console.log(`Adding .md extension to ${filePath}`);
        filePath = `${filePath}.md`;
      }
      
      // Handle paths relative to the content directory
      let fileFound = false;
      
      if (filePath.startsWith('src/content/')) {
        console.log(`Path starts with src/content/: ${filePath}`);
        // Keep as is, this is a correct relative path from site directory
        fileFound = fs.existsSync(filePath);
      } 
      
      // If the path doesn't exist, try different variations
      if (!fileFound) {
        const possiblePaths = [
          filePath,
          `src/content/${filePath}`,
          `src/content/tooling/${filePath}`,
          `src/content/tools/${filePath}`
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
            filePath,
            `src/content/**/${path.basename(filePath)}`,
            `src/content/tooling/**/${path.basename(filePath)}`,
            `src/content/tools/**/${path.basename(filePath)}`
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
        console.log(`Processing file: ${filePath}`);
        await processSingleFile(filePath);
      } else {
        console.error(`Could not find file: ${filePath}`);
        console.error(`Tried various paths and glob patterns but could not locate the file.`);
      }
    } else {
      // Default pattern for markdown files if no specific files are provided
      const defaultPattern = 'src/content/**/*.md';
      console.log(`No files specified. Using glob pattern: ${defaultPattern}`);
      
      // Process all markdown files matching the pattern
      await processMarkdownFiles(defaultPattern);
    }
    
    console.log('YouTube link formatting completed successfully');
  } catch (error) {
    console.error('Error running script:', error);
    process.exit(1);
  }
}

// Run the script
main(); 