Create a Node.js script called fetchOpenGraphData.cjs that processes Markdown files containing website metadata. The script should:

1. Core Functionality:
   - Process Markdown files in a list of directories set by the user.
   - Extract and validate YAML frontmatter from these files
   - Fetch OpenGraph metadata from opengraph.io API for URLs in the frontmatter
   - Fetch screenshots using opengraph.io's screenshot API
   - Update the files with the fetched data
   - Handle both single file processing (via command line args) and batch processing

2. Key Requirements:
   - Use gray-matter for YAML frontmatter processing
   - Use undici for fetching
   - Use glob for file discovery
   - Use dotenv for API key management
   - Support both Windows and Unix paths

3. Frontmatter Processing Rules:
   - Only fetch OpenGraph data if image, og_last_fetch, title, or site_name are missing
   - Skip fetching if og_errors or og_error_message exists
   - Extract category tags from file paths and add them to frontmatter.tags
   - Clean duplicate YAML keys, preserving most recent og_last_fetch
   - Never overwrite existing frontmatter values with API data

4. Error Handling:
   - Mark files with og_errors, og_last_error, and og_error_message on failures
   - Log all operations clearly with emoji indicators (✅, ⚠️)
   - Handle missing files, invalid paths, and API errors gracefully

5. Screenshot Processing:
   - Fetch screenshots asynchronously in the background
   - Track in-progress screenshot fetches to prevent duplicates
   - Update files with screenshot URLs when available

6. File Path Handling:
   - Support absolute and relative paths
   - Auto-append .md extension if missing
   - Try multiple path variations when looking for files
   - Support spaces in filenames and paths

The script should be production-ready, well-commented, and include proper error handling throughout.