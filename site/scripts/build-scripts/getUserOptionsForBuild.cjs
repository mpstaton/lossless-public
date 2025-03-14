const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// ============================================================================
// Build Script Configuration
// ============================================================================

const USER_OPTIONS = {
  // output file for quality assurance
  evaluationOutputPathAndFile: {
    baseFile: path.join(process.cwd(), 'src/content/changelog--content/evaluation-output.md'),
    pattern: {
      dateFormat: 'YYYY-MM-DD',
      iterationFormat: '00', // 01, 02, etc.
      separator: '_',
      extension: '.md'
    }
  },

  // Directory Configuration
  directories: {
    content: path.join(process.cwd(), 'src/content/tooling'),
    fixes: path.join(process.cwd(), 'scripts/fixes-needed'),
    data: path.join(process.cwd(), 'src/content/data'),
    evaluationOutput: path.join(process.cwd(), 'src/content/changelog--content'),
    video_registry: path.join(process.cwd(), 'src/data/video-registry.json'),
    excludeUrlCheck: ['Explainers'] // Directories to exclude from URL checks
  },

  // YAML Properties and Formatting Rules
  frontmatter: {
    // Define all possible YAML properties and their formatting rules
    properties: {
      // Core properties
      site_uuid: {
        required: true,
        generate: () => uuidv4(),
        format: value => value ? value.toString() : value,
        validate: value => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
      },
      url: {
        required: true,
        format: value => value ? value.replace(/^["'](.*)["']$/, '$1') : value, // Remove quotes
        validate: value => /^https?:\/\/.+/i.test(value)
      },
      tags: {
        required: true,
        isArray: true,
        format: tag => tag ? tag.replace(/\s+/g, '-') : tag,
        arrayFormat: 'dash-list', // - item format
        validate: tag => typeof tag === 'string' && tag.length > 0
      },
      
      // OpenGraph properties
      image: {
        format: value => value ? value.replace(/^["'](.*)["']$/, '$1') : value,
        validate: value => /^https?:\/\/.+/i.test(value)
      },
      site_name: {
        format: value => value ? value.replace(/^["'](.*)["']$/, '$1') : value
      },
      title: {
        format: value => value ? value.replace(/^["'](.*)["']$/, '$1') : value
      },
      favicon: {
        format: value => value ? value.replace(/^["'](.*)["']$/, '$1') : value,
        validate: value => /^https?:\/\/.+/i.test(value)
      },
      og_screenshot_url: {
        format: value => value ? value.replace(/^["'](.*)["']$/, '$1') : value,
        validate: value => /^https?:\/\/.+/i.test(value)
      },
      
      // Timestamps and status properties
      last_jina_request: {
        format: value => value ? value.replace(/^["'](.*)["']$/, '$1') : value,
        validate: value => !value || !isNaN(Date.parse(value))
      },
      jina_error: {
        format: value => value ? value.replace(/^["'](.*)["']$/, '$1') : value
      },
      og_last_fetch: {
        format: value => value ? value.replace(/^["'](.*)["']$/, '$1') : value,
        validate: value => !value || !isNaN(Date.parse(value))
      },
      og_errors: {
        format: value => value ? value.toString() : value
      },
      og_last_error: {
        format: value => value ? value.replace(/^["'](.*)["']$/, '$1') : value,
        validate: value => !value || !isNaN(Date.parse(value))
      },
      og_error_message: {
        format: value => value ? value.replace(/^["'](.*)["']$/, '$1') : value
      }
    },

    // YAML formatting rules
    formatting: {
      // How to format different value types
      string: value => value ? value.replace(/^["'](.*)["']$/, '$1') : value,
      url: value => value ? value.replace(/^["'](.*)["']$/, '$1') : value,
      date: value => value ? value.replace(/^["'](.*)["']$/, '$1') : value,
      boolean: value => value !== null && value !== undefined ? value.toString() : value,
      array: {
        prefix: '\n',
        itemPrefix: '  - ',
        itemSuffix: '',
        suffix: '\n'
      },
      
      // Special formatting cases
      blockString: {
        indicator: '|-',
        indent: '  '
      }
    },

    // Pre-processing rules
    preprocessing: {
      // List of URL properties that should always be single-line values (not block scalars)
      urlProperties: [
        'url', 'image', 'favicon', 'og_screenshot_url', 'og_image'
      ],
      
      // Properties that frequently contain colons and need special handling
      specialProperties: [
        'title', 'description', 'jina_error', 'og_error_message', 'zinger'
      ],
      
      // Clean content before YAML parsing
      cleanContent: content => {
        if (!content) return '';
        
        // Remove BOM if present
        content = content.replace(/^\uFEFF/, '');
        
        // Normalize line endings
        content = content.replace(/\r\n/g, '\n');
        
        // Extract the frontmatter section for focused processing
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) return content;
        
        const originalFrontmatter = frontmatterMatch[0];
        let frontmatter = frontmatterMatch[1];
        
        // STEP 1: Aggressively remove all block scalar indicators
        frontmatter = frontmatter.replace(/^([^:\n]+):[ \t]*(>-|>|[|][-]?)[ \t]*\n/gm, '$1: ');
        
        // STEP 2: Fix broken URLs (lines starting with https:)
        const lines = frontmatter.split('\n');
        const processedLines = [];
        let lastKey = null;
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) {
            processedLines.push('');
            continue;
          }
          
          // Check if this is a key-value pair
          const keyMatch = line.match(/^(\w+(?:[-_]\w+)*?):\s*(.*)/);
          
          if (keyMatch) {
            const [, key, value] = keyMatch;
            lastKey = key;
            
            // If this is a special property that might contain colons, quote it
            if (USER_OPTIONS.frontmatter.preprocessing.specialProperties.includes(key) && 
                value.includes(':') && 
                !/^["'].*["']$/.test(value.trim())) {
              processedLines.push(`${key}: "${value.replace(/"/g, '\\"')}"`);
            } 
            // If this is an error message with status code, quote it
            else if ((key === 'jina_error' || key === 'og_error_message') && 
                     value.includes('status:')) {
              processedLines.push(`${key}: "${value.replace(/"/g, '\\"')}"`);
            }
            // Otherwise keep as is
            else {
              processedLines.push(line);
            }
          } 
          // Check if this is a broken URL (starts with https:)
          else if (line.match(/^https?:\/\//)) {
            // Find the last URL property and append this to it
            for (let j = processedLines.length - 1; j >= 0; j--) {
              const prevLine = processedLines[j];
              const prevKeyMatch = prevLine.match(/^(\w+(?:[-_]\w+)*?):\s*(.*)/);
              
              if (prevKeyMatch && USER_OPTIONS.frontmatter.preprocessing.urlProperties.includes(prevKeyMatch[1])) {
                // Replace with the complete URL
                processedLines[j] = `${prevKeyMatch[1]}: ${line}`;
                break;
              }
            }
          }
          // Not a key-value pair or URL - keep as is
          else {
            processedLines.push(line);
          }
        }
        
        // Reconstruct the frontmatter
        const processedFrontmatter = processedLines.join('\n');
        
        // Replace the original frontmatter in the content
        return content.replace(originalFrontmatter, `---\n${processedFrontmatter}\n---`);
      }
    },

    // Validation rules
    validation: {
      // Pre-validation checks
      preCheck: content => {
        const errors = [];
        if (!content) errors.push('Empty content');
        else {
          if (!/^---\n/.test(content)) errors.push('Missing YAML front matter delimiter');
          if (!/\n---\n/.test(content)) errors.push('Missing YAML front matter closing delimiter');
        }
        return errors;
      },
      
      // Post-validation checks
      postCheck: (data) => {
        const errors = [];
        if (!data) errors.push('Invalid YAML data');
        else {
          // Check required properties
          for (const [key, def] of Object.entries(USER_OPTIONS.frontmatter.properties)) {
            if (def.required && data[key] === undefined) {
              errors.push(`Missing required property: ${key}`);
            }
          }
          
          // Validate tags format
          const tagsDef = USER_OPTIONS.frontmatter.properties.tags;
          if (data.tags && tagsDef.required) {
            if (!Array.isArray(data.tags)) {
              errors.push('Tags should be an array');
            } else if (data.tags.length === 0) {
              errors.push('Tags array should not be empty');
            }
          }
        }
        return errors;
      }
    }
  },

  // File Generation
  reporting: {
    issueFiles: {
      lowercaseTags: 'Lowercase-Tags.md',
      missingUrls: 'Missing-URLs.md'
    },
    outputFiles: {
      youtubeUrls: 'youtube-urls.json'
    }
  },

  // OpenGraph Configuration
  openGraph: {
    api: {
      key: process.env.PUBLIC_OPEN_GRAPH_API_KEY,
      baseUrl: 'https://opengraph.io/api/1.1',
      options: {
        dimensions: 'lg',
        quality: 80,
        acceptLang: 'auto',
        useProxy: true
      }
    },
    properties: ['image', 'site_name', 'title', 'url', 'favicon'],
    requiredProperties: ['image', 'og_last_fetch', 'title', 'site_name']
  },

  // Path Resolution
  pathResolution: {
    contentDirs: ['tooling', 'tools'],
    fileExtensions: ['.md'],
    globOptions: {
      nodir: true,
      windowsPathsNoEscape: true
    }
  },

  // Regular Expressions
  regex: {
    youtubeUrl: /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/g,
    frontmatter: /^---\r?\n([\s\S]*?)\r?\n---/,
    yamlKey: /^(\w+(?:-\w+)*?):/
  },

  // YouTube Formatting Configuration
  youtube: {
    // Footnotes configuration
    footnotes: {
      header: '# Footnotes',
      sectionLine: '***',
      
      // Check and add footnotes section if needed
      addSectionIfNeeded: (content) => {
        if (!content.includes('# Footnotes')) {
          return content + '\n\n\n# Footnotes\n***\n';
        }
        return content;
      },

      addOrUpdateRegistry: (content) => {
        if (!content.includes('video_registry')) {
          return content + '\n\n\n# Video Registry\n***\n';
        }
        return content;
      }
    },

    // Video resources section configuration
    videoResourcesSection: {
      header: '#### Video Resources',
      getVideoItemHeader: (data, url) => 
        `###### Video:[${data.title}](${url}) by [[${data.channelTitle}]]`,
      videoItemSeparator: '---'
    },

    // Date formatting for citations
    formatDate: (date) => {
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

    // Citation format templates
    citations: {
      getCitationFormats: (randHex, youtubeUrl, youtubeData, formattedDate, content) => {
        const formats = {};
        
        // Only generate formats that don't exist
        const hasFootnoteRef = content.includes(`[^${randHex}]`);
        const hasFootnoteDef = content.includes(`[^${randHex}]:`);
        
        if (!hasFootnoteRef) {
          formats.citeMarkdown = `[^${randHex}]`;
          formats.fullLineCite = `${formattedDate.year}, ${formattedDate.month} ${formattedDate.day}. "[${youtubeData.title}](${youtubeUrl})," [[${youtubeData.channelTitle}]]. [^${randHex}]`;
        }
        
        if (!hasFootnoteDef) {
          formats.fullLineFootnote = `[^${randHex}]: ${formattedDate.year}, ${formattedDate.month} ${formattedDate.day}. "[${youtubeData.title}](${youtubeUrl})," [[${youtubeData.channelTitle}]]`;
        }
        
        return formats;
      }
    },

    // Iframe configuration
    iframe: {
      getCode: (aspectRatio, embedUrl, youtubeData, citeMarkdown, content) => {
        const videoId = new URL(embedUrl).pathname.split('/').pop()?.split('?')[0];
        if (!videoId || content.includes(`src="${embedUrl}"`)) {
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
      }
    },

    // Video page configuration
    videoPage: {
      directory: 'src/content/videos',
      stripTitleOfUnsafeCharacters: (title) => {
        return title
          .replace(/[^a-zA-Z0-9-_\s]/g, '')
          .replace(/\s+/g, '-')
          .toLowerCase();
      },
      
      getFileName: (publishedDate, channelTitle, videoTitle) => {
        const date = new Date(publishedDate);
        const formattedDate = USER_OPTIONS.youtube.formatDate(date);
        const safeChannelTitle = USER_OPTIONS.youtube.videoPage.stripTitleOfUnsafeCharacters(channelTitle);
        const safeVideoTitle = USER_OPTIONS.youtube.videoPage.stripTitleOfUnsafeCharacters(videoTitle);
        return `YouTube-Video_${formattedDate.year}-${formattedDate.month}-${formattedDate.day}_${safeChannelTitle}--${safeVideoTitle}.md`;
      }
    },

    // JSON format configuration
    jsonForYoutubeEntryIntoRegistry: {
      getFormat: (randHex, youtubeUrl, youtubeData, formattedDate) => {
        return {
          randHexId: randHex,
          youtubeUrl: youtubeUrl,
          youtubeId: youtubeData.uniqueEmbedId,
          youtubePublishedDate: `${formattedDate.year}-${formattedDate.month}-${formattedDate.day}`,
          youtubeTitle: youtubeData.title,
          youtubeChannelTitle: youtubeData.channelTitle,
          citeMarkdown: `[^${randHex}]`,
          fullLineCite: `[^${randHex}] ${formattedDate.year}, ${formattedDate.month} ${formattedDate.day}. "[${youtubeData.title}](${youtubeUrl})," [[${youtubeData.channelTitle}]]`,
          fullLineFootnote: `[^${randHex}]: ${formattedDate.year}, ${formattedDate.month} ${formattedDate.day}. "[${youtubeData.title}](${youtubeUrl})," [[${youtubeData.channelTitle}]]`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          connectedFiles: [],
          appearsInFiles: []
        };
      }
    },

    // Markdown page configuration
    markdown: {
      getYAMLFormat: (randHex, youtubeUrl, youtubeData, formattedDate, content, appearsInMdFiles) => {
        return `---
rand_hex_id: ${randHex}
rand_hex_id_tag: [^${randHex}]
appears_in_md_files: ${appearsInMdFiles}
formatted_date_published: ${formattedDate.year}, ${formattedDate.month} ${formattedDate.day}.
raw_title: "${youtubeData.title},"
formatted_title_md_link: "[${youtubeData.title}](${youtubeUrl}),"
raw_channel_title: "${youtubeData.channelTitle},"
formatted_obsidian_title: "[[${youtubeData.channelTitle}]],"
formatted_citation_line: "${formattedDate.year}, ${formattedDate.month} ${formattedDate.day}. "[${youtubeData.title}](${youtubeUrl})," [[${youtubeData.channelTitle}]]. [^${randHex}]"
formatted_footnote_line: "[^${randHex}]: ${formattedDate.year}, ${formattedDate.month} ${formattedDate.day}. "[${youtubeData.title}](${youtubeUrl})," [[${youtubeData.channelTitle}]]"
---`;
      },

      setPageContent: (iframeCode, content) => {
        return `${iframeCode}\n\n${content}`;
      }
    }
  }
};

module.exports = USER_OPTIONS;
