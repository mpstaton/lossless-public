---
title: 'Write a Git Commit for one Directory'
lede: 'Create structured and informative git commit messages for code changes'
date_authored_initial_draft: 2025-03-18
date_authored_current_draft: 2025-03-19
date_authored_final_draft: null
date_first_published: null
date_last_updated: null
at_semantic_version: '0.0.0.1'
authors: Michael Staton
status: Draft
augmented_with: 'Windsurf Cascade on Claude 3.5 Sonnet'
category: Workflow
tags:
  - Content-Management
  - Version-Control
  - Git
  - Automation
date_created: 2025-03-20
date_modified: 2025-03-20
---

# Purpose
Generate a well-structured git commit message for changes in a specific directory, ensuring consistent documentation of modifications and maintaining a clear history of content updates.

# Technical Details

## Type Definitions
```typescript
// Configuration for directory and path settings
interface DirectoryConfig {
    /** Target directory name within content */
    TARGET_DIR: string;
    
    /** Full path from project root to target directory */
    TARGET_PATH: string;
    
    /** Format string for dates in changelog entries */
    DATE_FORMAT: string;
    
    /** Whether to process subdirectories recursively */
    ALL_FILES_RECURSIVELY: boolean;
}

// Structure for commit message components
interface CommitMessage {
    /** Type of change (e.g., 'content-updates', 'feat', 'fix') */
    type: string;
    
    /** One-line summary of changes */
    title: string;
    
    /** Detailed description of changes */
    body: {
        /** Bullet points describing major changes */
        summary: string[];
        
        /** List of modified files with stats */
        files: Array<{
            path: string;
            type: 'modified' | 'added' | 'deleted';
            stats?: {
                added: number;
                removed: number;
            };
        }>;
    };
}
```

## Configuration
```javascript
/**
 * User-configurable options for commit generation
 * @type {DirectoryConfig}
 */
const USER_OPTIONS = {
    // Target directory name within content
    TARGET_DIR: 'tooling',
    
    // Full path constructed from TARGET_DIR
    // DO NOT MODIFY - this is automatically generated
    TARGET_PATH: `site/src/content/${TARGET_DIR}`,
    
    // Date format for changelog entries
    DATE_FORMAT: 'YYYY-MM-DD',
    
    // Process subdirectories recursively
    ALL_FILES_RECURSIVELY: true
};

/**
 * Template for generating commit messages
 * @type {CommitMessage}
 */
const COMMIT_TEMPLATE = {
    type: 'content-updates, mundane:',
    title: '',
    body: {
        summary: [
         
        ],
        files: []
    }
};
```

# Workflow Steps

## 1. Stage Changes
```bash
# Stage only files in the target directory
git add "${USER_OPTIONS.TARGET_PATH}"

# Save git status for reference
git status > "site/src/data/changelog-data/$(date +"${USER_OPTIONS.DATE_FORMAT}")_status_${indexCount}"
```

## 2. Analyze Changes
1. Review staged files:
   - Count total files modified
   - Calculate lines added/removed
   - Identify change types (modified/added/deleted)

2. Group related changes:
   - Look for patterns in file paths
   - Identify common themes in modifications
   - Note significant changes vs mundane updates

## 3. Generate Commit Message

### Required Components
1. Type and scope identifier
2. Summary line (72 chars max)
3. Detailed change list
4. Modified files with stats

### Example Output
\```
content-updates(mundane): update 157 lines in 3 files in tooling directory

Changes:
- Update URL validation patterns documentation
- Add new error case examples
- Update README with latest patterns

Modified Files:
site/src/content/tooling/validation/url-patterns.md (+45/-12)
site/src/content/tooling/examples/error-cases.md (new file, +100)
site/src/content/tooling/README.md (+12/-0)
\```

# Best Practices

## File Paths
- Always use relative paths from project root
- Include full path from TARGET_PATH
- Maintain consistent path formatting

## Commit Message Style
- Disregard other Git Commit related prompts. 
- Use calculated values for the header revealing number of lines changed across number of files changed. 
- Only list the paths of the files changed. 
- Keep title line under 72 characters
- Use consistent indentation in body
- List files in a logical order
- Include line change statistics

## Error Prevention
- Verify paths before committing
- Check for unintended staged files
- Validate commit message format
- Ensure all changes are documented
