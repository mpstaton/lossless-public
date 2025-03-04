# YouTube Link Formatter

This script finds YouTube links in markdown files and formats them with proper iframe embedding.

## Features

- Scans markdown files for YouTube links with the `youtu.be` pattern
- Checks if links are already properly formatted
- Formats unformatted links with responsive iframe embedding
- Preserves frontmatter in markdown files
- Handles YouTube API integration for video metadata
- Supports processing individual files or entire directories

## Prerequisites

- Node.js 14+
- YouTube API key (set as environment variable)

## Setup

1. Make sure you have a YouTube API key. You can get one from the [Google Cloud Console](https://console.cloud.google.com/).

2. Create a `.env` file in the root directory with your YouTube API key:
   ```
   YOUTUBE_API_KEY=your_api_key_here
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Process All Markdown Files

Run the script with npm to process all markdown files in the content directory:

```bash
npm run format-youtube
```

### Process Specific Files

You can process one or more specific files by providing their paths as arguments:

```bash
npm run format-youtube -- path/to/file1.md path/to/file2.md
```

For example:

```bash
npm run format-youtube -- site/src/content/tools/example.md
```

### Process Files Matching a Pattern

You can also use a glob pattern to process multiple files:

```bash
npm run format-youtube -- "site/src/content/tools/*.md"
```

Note: When using glob patterns, make sure to wrap the pattern in quotes to prevent shell expansion.

## How It Works

The script:

1. Finds all markdown files matching the specified pattern or processes the specific files provided
2. Scans each file for YouTube links with the `youtu.be` pattern
3. For each link found, it:
   - Extracts the video ID
   - Fetches video metadata from the YouTube API
   - Generates an iframe embed code
   - Replaces the link with the iframe code
4. Preserves frontmatter and writes the updated content back to the file

## Example

Before:
```markdown
Check out this video: https://youtu.be/dQw4w9WgXcQ
```

After:
```markdown
Check out this video: <iframe 
style="aspect-ratio:16/9;width:100%;height:auto" 
src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
title="YouTube video player" 
frameborder="0" 
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
referrerpolicy="strict-origin-when-cross-origin" 
allowfullscreen
></iframe>
``` 