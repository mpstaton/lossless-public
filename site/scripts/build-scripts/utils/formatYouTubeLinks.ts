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
// ============================================================================
// User Configuration Options
// ============================================================================

/**
 * Helper functions to check for existing elements
 */
const ContentChecks = {
  hasIframe: (content: string, videoId: string): boolean => {
    const iframeRegex = new RegExp(`<iframe[^>]*src=["'][^"']*${videoId}[^"']*["'][^>]*>`, 'i');
    return iframeRegex.test(content);
  },

  hasFootnoteReference: (content: string, randHex: string): boolean => {
    const footnoteRegex = new RegExp(`\\[\\^${randHex}\\]`, 'i');
    return footnoteRegex.test(content);
  },

  hasFootnoteDefinition: (content: string, randHex: string): boolean => {
    const footnoteDefRegex = new RegExp(`\\[\\^${randHex}\\]:.*`, 'i');
    return footnoteDefRegex.test(content);
  },

  hasFootnotesSection: (content: string, header: string, sectionLine: string): boolean => {
    const escapedHeader = header.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedLine = sectionLine.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const footnotesPattern = new RegExp(`${escapedHeader}\\s*${escapedLine}`, 's');
    return footnotesPattern.test(content);
  }
};

/**
 * Formatting options for citations and footnotes
 */
const USER_OPTIONS = {
  // Footnotes configuration
  footnotes: {
    header: '# Footnotes',
    sectionLine: '***',
    
    // Check and add footnotes section if needed
    addSectionIfNeeded: (content: string): string => {
      if (!ContentChecks.hasFootnotesSection(content, USER_OPTIONS.footnotes.header, USER_OPTIONS.footnotes.sectionLine)) {
        return content + '\n\n\n' + USER_OPTIONS.footnotes.header + '\n' + USER_OPTIONS.footnotes.sectionLine + '\n';
      }
      return content;
    }
  },

  // Video resources section configuration
  videoResourcesSection: {
    header: '#### Video Resources',
    getVideoItemHeader: (data: YouTubeData, url: string) => 
      `###### Video:[${data.title}](${url}) by [[${data.channelTitle}]]`,
    videoItemSeparator: '---',
  },

  // Date formatting function for citations
  formatDate: (date: Date): { year: string; month: string; day: string } => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    return {
      year: date.getFullYear().toString(),
      month: months[date.getMonth()],
      day: date.getDate().toString().padStart(2, '0')
    };
  },

  // Citation format templates with existence checks
  getCitationFormats: (randHex: string, youtubeUrl: string, youtubeData: any, formattedDate: any, content: string) => {
    const formats: { [key: string]: string | null } = {};
    
    // Only generate formats that don't exist
    formats.citeMarkdown = !ContentChecks.hasFootnoteReference(content, randHex) 
      ? `[^${randHex}]` 
      : null;
    
    formats.fullLineCite = !ContentChecks.hasFootnoteReference(content, randHex)
      ? `${formattedDate.year}, ${formattedDate.month} ${formattedDate.day}. "[${youtubeData.title}](${youtubeUrl})," [[${youtubeData.channelTitle}]]. [^${randHex}]`
      : null;
    
    formats.fullLineFootnote = !ContentChecks.hasFootnoteDefinition(content, randHex)
      ? `[^${randHex}]: ${formattedDate.year}, ${formattedDate.month} ${formattedDate.day}. "[${youtubeData.title}](${youtubeUrl})," [[${youtubeData.channelTitle}]]`
      : null;
    
    return formats;
  },

  // YouTube iframe template with existence check
  getIframeCode: (aspectRatio: string, embedUrl: string, youtubeData: any, citeMarkdown: string | null, content: string): string | null => {
    const videoId = new URL(embedUrl).pathname.split('/').pop()?.split('?')[0];
    if (!videoId || ContentChecks.hasIframe(content, videoId)) {
      return null;
    }
    
    return `<div class="youtube-container"><iframe 
style="aspect-ratio:${aspectRatio};width:100%;height:auto" 
src="${embedUrl}" 
title="YouTube video player" 
frameborder="0" 
allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
referrerpolicy="strict-origin-when-cross-origin" 
allowfullscreen
></iframe></div>\n${citeMarkdown ? ` (${youtubeData.channelTitle} ${citeMarkdown})` : ''}`;
  },

  getJSONFormat: (randHex: string, youtubeUrl: string, youtubeData: YouTubeData, formattedDate: { year: string; month: string; day: string }): YouTubeVideoJSON => {
    return {
      randHexId: randHex,
      youtubeUrl: youtubeUrl,
      youtubeId: youtubeData.uniqueEmbedId,
      youtubePublishedDate: `${formattedDate.year}-${formattedDate.month}-${formattedDate.day}`,
      youtubeTitle: youtubeData.title,
      youtubeChannelTitle: youtubeData.channelTitle,
      citeMarkdown: `[^${randHex}]`,
      fullLineCite: `[^${randHex}] ${formattedDate.year}, ${formattedDate.month} ${formattedDate.day}. "[${youtubeData.title}](${youtubeUrl})," [[${youtubeData.channelTitle}]]`,
      fullLineFootnote: `[^${randHex}]: ${formattedDate.year}, ${formattedDate.month} ${formattedDate.day}. "[${youtubeData.title}](${youtubeUrl})," [[${youtubeData.channelTitle}]]`
    };
  },

  getMarkdownPageYAMLFormat: (randHex: string, youtubeUrl: string, youtubeData: any, formattedDate: any, content: string, appearsInMdFiles: string[]) => {
    return `---\n
    rand_hex_id: ${randHex}\n 
    rand_hex_id_tag: [^${randHex}]\n
    appears_in_md_files: ${appearsInMdFiles}\n
    formatted_date_published: ${formattedDate.year}, ${formattedDate.month} ${formattedDate.day}.\n 
    raw_title: "${youtubeData.title},"\n 
    formatted_title_md_link: "[${youtubeData.title}](${youtubeUrl}),"\n
    raw_channel_title: "${youtubeData.channelTitle},"\n
    formatted_obsidian_title: "[[${youtubeData.channelTitle}]],"\n
    formatted_citation_line: "${formattedDate.year}, ${formattedDate.month} ${formattedDate.day}. "[${youtubeData.title}](${youtubeUrl})," [[${youtubeData.channelTitle}]]. [^${randHex}]\n";
    formatted_footnote_line: "[^${randHex}]: ${formattedDate.year}, ${formattedDate.month} ${formattedDate.day}. "[${youtubeData.title}](${youtubeUrl})," [[${youtubeData.channelTitle}]]\n";
    ---`;
  },

  setMarkdownPageContentForOneYoutubeVideo: (iframeCode: string | null, content: string) => {
    return `${iframeCode}\n\n${content}`;
  },
  
  setOrderedList: (listItems: string[]) => {
    return listItems.map((item, index) => `${index + 1}. ${item}`).join('\n');
  },

  // Video page settings
  videoPage: {
    directory: 'src/content/videos',
    stripTitleOfUnsafeCharacters: (title: string): string => {
      return title
        .replace(/[^a-zA-Z0-9-_\s]/g, '') // Remove special chars except hyphen and underscore
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .toLowerCase(); // Convert to lowercase
    },
    
    getFileName: (publishedDate: string, channelTitle: string, videoTitle: string): string => {
      const date = new Date(publishedDate);
      const formattedDate = USER_OPTIONS.formatDate(date);
      const safeChannelTitle = USER_OPTIONS.videoPage.stripTitleOfUnsafeCharacters(channelTitle);
      const safeVideoTitle = USER_OPTIONS.videoPage.stripTitleOfUnsafeCharacters(videoTitle);
      return `YouTube-Video_${formattedDate.year}-${formattedDate.month}-${formattedDate.day}_${safeChannelTitle}--${safeVideoTitle}.md`;
    },

    getAnyContentForOneVideoMarkdownPage: async (youtubeData: YouTubeData): Promise<string> => {
      // This can be extended to fetch content from other parts of the codebase
      return `## Description\n\n${youtubeData.description}\n`;
    }
  },
};

// Add interface for YouTube Video JSON structure
interface YouTubeVideoJSON {
  randHexId: string;
  youtubeUrl: string;
  youtubeId: string;
  youtubePublishedDate: string;
  youtubeTitle: string;
  youtubeChannelTitle: string;
  citeMarkdown: string;
  fullLineCite: string;
  fullLineFootnote: string;
}

/**
 * Handle JSON file operations for YouTube videos
 */
const handleYouTubeVideoJSON = async (
  youtubeData: YouTubeData,
  youtubeUrl: string,
  randHex: string,
  formattedDate: { year: string; month: string; day: string }
): Promise<void> => {
  const jsonDir = 'src/data/objects/videos';
  const filename = `video_youtube--${youtubeData.uniqueEmbedId}.json`;
  const filePath = path.join(jsonDir, filename);

  // Create directory if it doesn't exist
  if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir, { recursive: true });
  }

  // Get current JSON format
  const currentFormat = USER_OPTIONS.getJSONFormat(randHex, youtubeUrl, youtubeData, formattedDate);

  let stats = {
    created: 0,
    modified: 0,
    skipped: 0
  };

  try {
    if (fs.existsSync(filePath)) {
      // File exists, check for inconsistencies
      const existingContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      let needsUpdate = false;
      let updatedContent = { ...existingContent };

      // Check each field for inconsistencies
      Object.entries(currentFormat).forEach(([key, value]) => {
        if (existingContent[key] !== value) {
          needsUpdate = true;
          updatedContent[key] = value;
          console.log(`Updating ${key} in ${filename}`);
        }
      });

      if (needsUpdate) {
        fs.writeFileSync(filePath, JSON.stringify(updatedContent, null, 2));
        stats.modified++;
        console.log(`Updated JSON file: ${filename}`);
      } else {
        stats.skipped++;
        console.log(`Skipped JSON file (no changes needed): ${filename}`);
      }
    } else {
      // Create new file
      fs.writeFileSync(filePath, JSON.stringify(currentFormat, null, 2));
      stats.created++;
      console.log(`Created new JSON file: ${filename}`);
    }
  } catch (error) {
    console.error(`Error handling JSON file ${filename}:`, error);
  }

  console.log('JSON Processing Stats:', {
    'Files Created': stats.created,
    'Files Modified': stats.modified,
    'Files Skipped': stats.skipped
  });
};

/**
 * Handle markdown file operations for YouTube videos
 */
const handleYouTubeVideoMarkdown = async (
  youtubeData: YouTubeData,
  youtubeUrl: string,
  randHex: string,
  formattedDate: { year: string; month: string; day: string },
  appearsInMdFiles: string[]
): Promise<void> => {
  const stats = {
    created: 0,
    modified: 0,
    skipped: 0
  };

  try {
    // Create directory if it doesn't exist
    const videoDir = USER_OPTIONS.videoPage.directory;
    if (!fs.existsSync(videoDir)) {
      fs.mkdirSync(videoDir, { recursive: true });
    }

    // Generate filename
    const filename = USER_OPTIONS.videoPage.getFileName(
      youtubeData.publishedAt,
      youtubeData.channelTitle,
      youtubeData.title
    );
    const filePath = path.join(videoDir, filename);

    // Check if file exists
    if (fs.existsSync(filePath)) {
      // Read existing content
      const existingContent = fs.readFileSync(filePath, 'utf8');
      
      // Generate new content
      const newContent = await getFullMarkdownPageForOneYoutubeVideo(
        randHex,
        youtubeUrl,
        youtubeData,
        formattedDate,
        existingContent,
        appearsInMdFiles
      );

      // Compare and update if different
      if (existingContent !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        stats.modified++;
        console.log(`Updated markdown file: ${filename}`);
      } else {
        stats.skipped++;
        console.log(`Skipped markdown file (no changes needed): ${filename}`);
      }
    } else {
      // Create new file
      const newContent = await getFullMarkdownPageForOneYoutubeVideo(
        randHex,
        youtubeUrl,
        youtubeData,
        formattedDate,
        '', // Empty content for new files
        appearsInMdFiles
      );
      fs.writeFileSync(filePath, newContent, 'utf8');
      stats.created++;
      console.log(`Created new markdown file: ${filename}`);
    }
  } catch (error) {
    console.error('Error handling markdown file:', error);
  }

  console.log('Markdown Processing Stats:', {
    'Files Created': stats.created,
    'Files Modified': stats.modified,
    'Files Skipped': stats.skipped
  });
};

// Function to get full markdown page - to be used within the processing logic
const getFullMarkdownPageForOneYoutubeVideo = async (
  randHex: string,
  youtubeUrl: string,
  youtubeData: YouTubeData,
  formattedDate: { year: string; month: string; day: string },
  content: string,
  appearsInMdFiles: string[]
): Promise<string> => {
  // Get the YAML frontmatter
  const yamlFrontmatter = USER_OPTIONS.getMarkdownPageYAMLFormat(
    randHex,
    youtubeUrl,
    youtubeData,
    formattedDate,
    content,
    appearsInMdFiles
  );

  // Get the iframe code
  const aspectRatio = youtubeUrl.includes('/shorts/') ? "9/16" : "16/9";
  const embedUrl = `https://www.youtube.com/embed/${youtubeData.uniqueEmbedId}?controls=0`;
  const iframeCode = USER_OPTIONS.getIframeCode(
    aspectRatio,
    embedUrl,
    youtubeData,
    `[^${randHex}]`,
    content
  );

  // Get any additional content
  const additionalContent = await USER_OPTIONS.videoPage.getAnyContentForOneVideoMarkdownPage(youtubeData);

  // Combine all parts
  return USER_OPTIONS.setMarkdownPageContentForOneYoutubeVideo(
    iframeCode,
    `${yamlFrontmatter}\n\n# Video: ${youtubeData.title}\n\n${additionalContent}\n\n${content}`
  );
};

const createJSONObjectForOneYoutubeVideo = (
  randHex: string,
  youtubeUrl: string,
  youtubeData: YouTubeData,
  formattedDate: any,
  content: string
) => {};

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
    const footnotesHeader = USER_OPTIONS.footnotes.header;
    const footnotesSectionLine = USER_OPTIONS.footnotes.sectionLine;

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
      const uniqueUrls = new Set<string>();
      let match: RegExpExecArray | null;
      
      // Find all unique matches first to avoid regex state issues with async operations
      while ((match = youtubeLinkRegex.exec(content)) !== null) {
        uniqueUrls.add(match[0]);
      }
      
      const matches = Array.from(uniqueUrls);
      console.log(`Found ${matches.length} unique YouTube links in content`);
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
            const formattedDate = USER_OPTIONS.formatDate(new Date());

            // Handle JSON file for this video
            await handleYouTubeVideoJSON(youtubeData, youtubeUrl, randHex, formattedDate);

            // Handle markdown file for this video
            await handleYouTubeVideoMarkdown(youtubeData, youtubeUrl, randHex, formattedDate, [filePath]);

            const { citeMarkdown, fullLineCite, fullLineFootnote } = USER_OPTIONS.getCitationFormats(randHex, youtubeUrl, youtubeData, formattedDate, content);
            
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
            
            const iframeCode = USER_OPTIONS.getIframeCode(aspectRatio, embedUrl, youtubeData, citeMarkdown, content);

            // Add footnotes section if it doesn't exist
            modifiedContent = USER_OPTIONS.footnotes.addSectionIfNeeded(modifiedContent);
            
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
            const markdownLinkRegex = new RegExp(`\\[([^\\]]+)\\]\\(${youtubeUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g');
            const plainUrlRegex = new RegExp(`(^|\\s|"|'|\\()${youtubeUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\)|\\s|"|'|$)`, 'g');
            
            let replacementMade = false;
            
            // Only proceed with replacements if we have valid iframe code
            if (iframeCode) {
              // Check if the URL is in a markdown link in the main content
              if (markdownLinkRegex.test(mainContent)) {
                console.log(`URL is in a markdown link, replacing`);
                // Reset regex lastIndex
                markdownLinkRegex.lastIndex = 0;
                // Replace the markdown link with the iframe code
                mainContent = mainContent.replace(markdownLinkRegex, () => {
                  console.log(`Replacing markdown link with iframe`);
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
                  console.log(`Replacing plain URL with iframe`);
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
            }

            // Only add footnote if we have one and made a replacement
            if (fullLineFootnote && replacementMade) {
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
                    '\n\n' + fullLineFootnote + 
                    modifiedContent.substring(insertPos);
                }
              }
            }

            // Recombine the content if it was split
            if (mainFootnotesPos !== -1) {
              modifiedContent = mainContent + (footnotesContent || '');
            } else {
              modifiedContent = mainContent;
            }
            
            console.log(`After replacement, content contains iframe: ${modifiedContent.includes(iframeCode || '')}`);
            
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
 * Process a single markdown file and return its name without extension and relative path
 * @param filePath Path to the markdown file
 * @returns Object containing the filename without .md extension and the relative path from src/
 */
async function processSingleFile(filePath: string): Promise<{ filename: string; relativePath: string }> {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return { filename: '', relativePath: '' };
    }
    
    // Check if file is a markdown file
    if (!filePath.toLowerCase().endsWith('.md')) {
      console.error(`Not a markdown file: ${filePath}`);
      return { filename: '', relativePath: '' };
    }
    
    console.log(`Processing single file: ${filePath}`);
    
    // Get the filename without extension while preserving case
    const filename = path.basename(filePath, '.md');
    
    // Get the relative path starting with src/
    let relativePath = filePath;
    const srcIndex = filePath.indexOf('src/');
    if (srcIndex !== -1) {
      relativePath = filePath.substring(srcIndex);
    } else if (!filePath.startsWith('src/')) {
      relativePath = `src/content/${filePath}`;
    }
    
    // Use the same function but with a pattern that matches only this file
    // We need to escape special characters in the file path for the glob pattern
    const escapedPath = filePath.replace(/[*?[\](){}!+@|]/g, '\\$&');
    await processMarkdownFiles(escapedPath);
    
    console.log(`Completed processing file: ${filePath}`);
    return { filename, relativePath };
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return { filename: '', relativePath: '' };
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