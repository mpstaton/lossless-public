const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const contentDirectory = path.join(process.cwd(), './src/content/tooling');
const reportFile = path.join(process.cwd(), 'scripts/data-or-content-generation/fixes-needed/Corrupted-Frontmatter-List.md');

// Common frontmatter corruption patterns
const corruptionPatterns = [
  // Missing opening or closing delimiters
  {
    name: 'Missing opening delimiter',
    test: (content) => !content.startsWith('---\n')
  },
  {
    name: 'Missing closing delimiter',
    test: (content) => content.startsWith('---\n') && !content.includes('\n---\n')
  },
  // Broken block scalar indicators
  {
    name: 'Broken URL with block scalar',
    test: (content) => /^(url|image|favicon|og_screenshot_url):\s*(>-|>|[|][-]?)\s*\n\s*https?:/m.test(content)
  },
  // Broken URLs spanning multiple lines
  {
    name: 'URL split across lines',
    test: (content) => /\n(https?):\/\//m.test(content) && content.includes('---\n')
  },
  // Lines with colons in values
  {
    name: 'Unquoted value with colon',
    test: (content) => /^[^:]+:\s*[^"\n]*:[^"\n]*$/m.test(content) && content.includes('---\n')
  },
  // Duplicate keys
  {
    name: 'Potential duplicate keys',
    test: (content) => {
      if (!content.includes('---\n')) return false;
      
      // Extract the frontmatter
      const match = content.match(/^---\n([\s\S]*?)\n---/);
      if (!match) return false;
      
      const frontmatter = match[1];
      const lines = frontmatter.split('\n');
      const keys = new Set();
      
      for (const line of lines) {
        const keyMatch = line.match(/^(\w+(?:[-_]\w+)*?):\s*/);
        if (keyMatch) {
          const key = keyMatch[1];
          if (keys.has(key)) return true;
          keys.add(key);
        }
      }
      
      return false;
    }
  }
];

/**
 * Check a file for corrupted frontmatter
 * @param {string} filePath - Path to the file
 * @returns {Object} Result with issues found
 */
function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    for (const pattern of corruptionPatterns) {
      if (pattern.test(content)) {
        issues.push(pattern.name);
      }
    }
    
    return {
      path: filePath,
      hasIssues: issues.length > 0,
      issues
    };
  } catch (error) {
    return {
      path: filePath,
      hasIssues: true,
      issues: [`Error reading file: ${error.message}`]
    };
  }
}

/**
 * Main function to scan for files with corrupted frontmatter
 */
function findCorruptedFiles() {
  console.log('Scanning for markdown files...');
  
  // Find all markdown files
  const files = glob.sync('**/*.md', {
    cwd: contentDirectory,
    absolute: true
  });
  
  console.log(`Found ${files.length} markdown files. Checking frontmatter...`);
  
  // Check each file for frontmatter issues
  const corruptedFiles = [];
  let count = 0;
  
  for (const file of files) {
    const result = checkFile(file);
    
    if (result.hasIssues) {
      corruptedFiles.push({
        path: file,
        issues: result.issues
      });
    }
    
    count++;
    if (count % 100 === 0) {
      console.log(`Checked ${count}/${files.length} files...`);
    }
  }
  
  console.log(`Found ${corruptedFiles.length} files with corrupted frontmatter.`);
  
  // Generate the report
  const reportContent = `# Corrupted Frontmatter Files
Last updated: ${new Date().toISOString()}

Found ${corruptedFiles.length} files with corrupted frontmatter out of ${files.length} total markdown files.

## Files with issues

${corruptedFiles.map(file => `- ${file.path} (Issues: ${file.issues.join(', ')})`).join('\n')}
`;
  
  fs.writeFileSync(reportFile, reportContent);
  console.log(`Report written to ${reportFile}`);
  
  return corruptedFiles;
}

// Run the scan
findCorruptedFiles(); 