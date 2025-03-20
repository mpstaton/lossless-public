const path = require('path');

const USER_OPTIONS = {
    // Directory Configuration
    directories: {
      toolingContentDir: path.join(process.cwd(), 'src/content/tooling'),
      lostInPublicContentDir: path.join(process.cwd(), 'src/content/lost-in-public'),
      specificationsContentDir: path.join(process.cwd(), 'src/content/specs'),
      keepingUpContentDir: path.join(process.cwd(), 'src/content/keeping-up'),
      dataDir: path.join(process.cwd(), 'src/content/data'),
      evaluationOutputDir: path.join(process.cwd(), 'src/content/changelog--content'),
      fixesNeededDir: path.join(process.cwd(), 'scripts/fixes-needed'),
      videoRegistryFile: path.join(process.cwd(), 'src/data/video-registry.json'),
      excludeUrlCheck: ['Explainers'] // Directories to exclude from URL checks
    },

    reporting: {
        // output file for quality assurance
        preprocessingOutputPathAndFile: {
          baseFile: path.join(process.cwd(), 'src/content/changelog--content/preprocessing-output.md'),
          pattern: {
                dateFormat: 'YYYY-MM-DD',
                iterationFormat: '00', // 01, 02, etc.
                separator: '_',
                extension: '.md'
            }
        },

        // output file for quality assurance
        evaluationOutputPathAndFile: {
            baseFile: path.join(process.cwd(), 'src/content/changelog--content/evaluation-output.md'),
                    pattern: {
                    dateFormat: 'YYYY-MM-DD',
                    iterationFormat: '00', // 01, 02, etc.
                    separator: '_',
                    extension: '.md'
                },
        },
        // Report by specific issue files
        reportBySpecificIssueFiles: {
          // Lists files that have lowercaseTags: {
            lowercaseTags: {
              baseFile: path.join(process.cwd(), 'site/scripts/data-or-content-generation/fixes-needed/Lowercase-Tags.md'),
                pattern: {
                dateFormat: 'YYYY-MM-DD',
                iterationFormat: '00', // 01, 02, etc.
                separator: '_',
                extension: '.md'
              }
            },
          // Lists files that have missingUrls: {
            missingUrls: {
              baseFile: path.join(process.cwd(), 'site/scripts/data-or-content-generation/fixes-needed/Missing-URLs.md'),
              pattern: {
                dateFormat: 'YYYY-MM-DD',
                iterationFormat: '00', // 01, 02, etc.
                separator: '_',
                extension: '.md'
              }
            }
        }
    },

    // Frontmatter Property Sets
    frontmatterPropertySets: {
        urlProperties: ['url', 'image', 'favicon', 'og_screenshot_url', 'og_image', 'github_url', 'github_profile_url', 'youtube_url', 'og_fetched_url'],
        errorMessageProperties: ['jina_error', 'og_errors', 'og_error_message'],
        plainTextProperties: ['description', 'og_description', 'zinger', 'site_description_cp', 'description_site_cp', 'title', 'site_name'],
        timestampProperties: ['og_last_error', 'og_error_message', 'last_jina_request', 'og_last_fetch', 'last_jina_error']
    },
  
    // Regular Expression Utilities
    regexUtils: {
      detectUrlProperties: /((?:https?:)?\/\/[^\s'"]+)(?:'|")?$/gm,
      detectYoutubeUrls: /https?:\/\/(?:(?:www\.)?youtube\.com\/|youtu\.be\/)([a-zA-Z0-9_-]+)/g,
      extractYoutubeIds: /([a-zA-Z0-9_-]+)/g,
      extractFrontmatterWithDelimiters: /^---\r?\n[\s\S]*?\r?\n---/,
      extractFrontmatterWithoutDelimiters: /^---\r?\n([\s\S]*?)\r?\n---/,
      yamlKey: /^(\w+(?:-\w+)*?):/
    },


  // File Generation
    dataFiles: {
      videoRegistry: 'site/src/content/data/video-registry.json',
      markdownFileRegistry: 'site/src/content/data/markdown-file-registry.json'
    },

  }

module.exports = USER_OPTIONS;