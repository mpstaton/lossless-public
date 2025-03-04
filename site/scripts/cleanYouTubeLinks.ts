const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const matter = require('gray-matter');
const dotenv = require('dotenv');
const { fetch } = require('undici');

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
  
  export const isGoogleBooksUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('books.google.com');
    } catch {
      return false;
    }
  };

// Load from process.env instead
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

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

interface YouTubeData {
  etag: string;
  title: string;
  publishedAt: string;
  channelTitle: string;
  description: string;
  uniqueEmbedId: string;
}

export const fetchYouTubeData = async (url: string): Promise<YouTubeData> => {
  try {
    const { videoId, uniqueEmbedId } = extractVideoIdAndEmbed(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL - Could not extract video ID');
    }

    console.log('Attempting API call with video ID:', videoId);
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (!response.ok) {
      console.error('YouTube API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        errorResponse: data
      });
      
      // Check for API key/authentication issues specifically
      if (data.error?.status === 'INVALID_ARGUMENT' || 
          data.error?.code === 400 ||
          data.error?.errors?.some((e: { reason?: string; message?: string }) => 
            e.reason === 'badRequest' || e.message?.includes('API key'))) {
        throw new Error('YouTube API authentication failed. Please check your API key configuration.');
      } 
      // Check for quota exceeded
      else if (data.error?.code === 403 || data.error?.errors?.some((e: { reason?: string; message?: string }) => 
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

interface VideoIdResult {
  videoId: string;
  uniqueEmbedId: string;
}

const extractVideoIdAndEmbed = (url: string): VideoIdResult => {
  try {
    const urlObj = new URL(url);
    
    // Handle youtu.be share URLs
    if (urlObj.hostname.includes('youtu.be')) {
      const uniqueEmbedId = urlObj.pathname.slice(1) + urlObj.search;
      console.log('Extracted ID with params:', uniqueEmbedId);
      return {
        videoId: urlObj.pathname.slice(1),
        uniqueEmbedId: uniqueEmbedId
      };
    }
    
    // Handle regular youtube.com URLs
    const paramId = urlObj.searchParams.get('v');
    if (paramId) {
      return {
        videoId: paramId,
        uniqueEmbedId: 'Not a share link'
      };
    }

    // Handle youtube.com/shorts URLs
    if (urlObj.pathname.includes('/shorts/')) {
      const shortId = urlObj.pathname.split('/shorts/')[1];
      return {
        videoId: shortId,
        uniqueEmbedId: 'Not a share link'
      };
    }

    // Fallback to regex method
    const regexMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    if (regexMatch) {
      return {
        videoId: regexMatch,
        uniqueEmbedId: 'Not a share link'
      };
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

    for (const filePath of files) {
      console.log(`Processing file: ${filePath}`);
      
      // Read the file content
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Parse frontmatter and content
      const { content } = matter(fileContent);
      
      // Regular expression to find youtu.be links
      // This regex looks for youtu.be links that are not already inside an iframe tag
      const youtubeLinkRegex = /(?<!\<iframe[^>]*>)(?<!\]\()https?:\/\/youtu\.be\/[a-zA-Z0-9_-]+(?:\?[^)\s]*)?(?!\)|\<\/iframe\>)/g;
      
      let modifiedContent = content;
      let fileModified = false;
      let matches: string[] = [];
      let match: RegExpExecArray | null;
      
      // Find all matches first to avoid regex state issues with async operations
      while ((match = youtubeLinkRegex.exec(content)) !== null) {
        matches.push(match[0]);
      }
      
      if (matches.length > 0) {
        console.log(`Found ${matches.length} YouTube links in ${filePath}`);
        
        // Process each match
        for (const youtubeUrl of matches) {
          try {
            // Fetch YouTube data for the link
            const youtubeData = await fetchYouTubeData(youtubeUrl);
            
            // Generate the iframe code
            const iframeCode = `<iframe 
style="aspect-ratio:16/9;width:100%;height:auto" 
src="https://www.youtube.com/embed/${youtubeData.uniqueEmbedId}" 
title="YouTube video player" 
frameborder="0" 
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
referrerpolicy="strict-origin-when-cross-origin" 
allowfullscreen
></iframe>`;
            
            // Replace the URL with the iframe code
            modifiedContent = modifiedContent.replace(youtubeUrl, iframeCode);
            fileModified = true;
            totalLinksProcessed++;
            
            console.log(`Processed YouTube link: ${youtubeUrl}`);
          } catch (error) {
            console.error(`Error processing YouTube link ${youtubeUrl}:`, error);
          }
        }
        
        // Write the modified content back to the file if changes were made
        if (fileModified) {
          // Preserve frontmatter by using gray-matter to stringify
          const fileData = matter(fileContent);
          const updatedFileContent = matter.stringify(modifiedContent, fileData.data);
          
          fs.writeFileSync(filePath, updatedFileContent, 'utf8');
          console.log(`Updated file: ${filePath}`);
          totalFilesModified++;
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
 * Main function to run the script
 */
export const main = async (): Promise<void> => {
  try {
    // Load environment variables
    dotenv.config();
    
    // Process markdown files in the content directory
    await processMarkdownFiles('site/src/content/**/*.md');
    
    console.log('YouTube link processing completed successfully');
  } catch (error) {
    console.error('Error running script:', error);
    process.exit(1);
  }
};

// Run the script if this file is executed directly
if (require.main === module) {
  main();
}