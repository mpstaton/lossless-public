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
        format: value => value.toString(),
        validate: value => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
      },
      url: {
        required: true,
        format: value => value.replace(/^["'](.*)["']$/, '$1'), // Remove quotes
        validate: value => /^https?:\/\/.+/i.test(value)
      },
      tags: {
        required: true,
        isArray: true,
        format: tag => tag.replace(/\s+/g, '-'),
        arrayFormat: 'dash-list', // - item format
        validate: tag => typeof tag === 'string' && tag.length > 0
      },
      
      // OpenGraph properties
      image: {
        format: value => value.replace(/^["'](.*)["']$/, '$1'),
        validate: value => /^https?:\/\/.+/i.test(value)
      },
      site_name: {
        format: value => value.replace(/^["'](.*)["']$/, '$1')
      },
      title: {
        format: value => value.replace(/^["'](.*)["']$/, '$1')
      },
      favicon: {
        format: value => value.replace(/^["'](.*)["']$/, '$1'),
        validate: value => /^https?:\/\/.+/i.test(value)
      },
      og_screenshot_url: {
        format: value => value.replace(/^["'](.*)["']$/, '$1'),
        validate: value => /^https?:\/\/.+/i.test(value)
      },
      
      // Timestamps and status properties
      last_jina_request: {
        format: value => value.replace(/^["'](.*)["']$/, '$1'),
        validate: value => !isNaN(Date.parse(value))
      },
      jina_error: {
        format: value => value.replace(/^["'](.*)["']$/, '$1')
      },
      og_last_fetch: {
        format: value => value.replace(/^["'](.*)["']$/, '$1'),
        validate: value => !isNaN(Date.parse(value))
      },
      og_errors: {
        format: value => value.toString()
      },
      og_last_error: {
        format: value => value.replace(/^["'](.*)["']$/, '$1'),
        validate: value => !isNaN(Date.parse(value))
      },
      og_error_message: {
        format: value => value.replace(/^["'](.*)["']$/, '$1')
      }
    },

    // YAML formatting rules
    formatting: {
      // How to format different value types
      string: value => value.replace(/^["'](.*)["']$/, '$1'),
      url: value => value.replace(/^["'](.*)["']$/, '$1'),
      date: value => value.replace(/^["'](.*)["']$/, '$1'),
      boolean: value => value.toString(),
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
      // Clean content before YAML parsing
      cleanContent: content => {
        if (!content) return '';
        
        // Remove BOM if present
        content = content.replace(/^\uFEFF/, '');
        
        // Normalize line endings
        content = content.replace(/\r\n/g, '\n');
        
        // Fix common YAML formatting issues
        return content
          // Fix block scalar URL issues
          .replace(/^([\w_-]+):\s*>[^\n]*\n\s*http/gm, '$1: http')
          // Remove unnecessary quotes
          .replace(/^([\w_-]+):\s+['"]([^'"]*)['"]\s*$/gm, '$1: $2')
          // Fix URL formatting
          .replace(/^\s*(https?:\/\/[^\s]+)\s*$/gm, '$1')
          // Fix duplicate mapping keys
          .replace(/(\n---\n[\s\S]*?\n---)/m, match => {
            const seenKeys = new Set();
            const lines = match.split('\n');
            return lines.filter(line => {
              const keyMatch = line.match(/^(\w+(?:[-_]\w+)*?):/);
              if (!keyMatch) return true;
              
              const key = keyMatch[1];
              if (seenKeys.has(key)) return false;
              
              seenKeys.add(key);
              return true;
            }).join('\n');
          });
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
