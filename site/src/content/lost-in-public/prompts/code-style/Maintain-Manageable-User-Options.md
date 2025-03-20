---
title: 'Manageable User Options'
lede: 'Configure and manage user options for build scripts and content processing'
date_authored_initial_draft: 2025-03-18
date_authored_current_draft: 2025-03-18
date_authored_final_draft: null
date_first_published: null
date_last_updated: null
at_semantic_version: '0.0.0.1'
authors: Michael Staton
status: To-Do
augmented_with: 'Windsurf Cascade on Claude 3.5 Sonnet'
category: Prompts
tags:
- Configuration
- Build-Scripts
- User-Options
- Directory-Management
---

```javascript
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
        urlProperties: ['url', 'image', 'favicon', 'og_screenshot_url', 'og_image'],
        errorMessageProperties: ['jina_error', 'og_errors'],
        plainTextProperties: ['description', 'og_description', 'zinger', 'site_description_cp']
    },
  
    // Regular Expressions
    regex: {
      detectUrlProperties: /(?:url|image|favicon|og_screenshot_url|og_image)/g,
      detectYoutubeUrls: /()/g,
      extractYoutubeIds: /()/g,
      frontmatter: /^---\r?\n([\s\S]*?)\r?\n---/,
      yamlKey: /^(\w+(?:-\w+)*?):/
    },


  // File Generation
    dataFiles: {
      youtubeUrls: 'site/src/content/data/video-registry.json'
    },

  }


export { USER_OPTIONS };