const fs = require('fs');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');
const { v4: uuidv4 } = require('uuid');

// ============================================================================
// User Configuration Options
// ============================================================================

const USER_OPTIONS = {
  // Directory Configuration
  directories: {
    content: path.join(process.cwd(), 'src/content/tooling'),
    fixes: path.join(process.cwd(), 'scripts/fixes-needed'),
    excludeUrlCheck: ['Explainers'] // Directories to exclude from URL checks
  },

  // YAML Properties
  frontmatter: {
    required: {
      properties: ['site_uuid'],
      generateIfMissing: {
        site_uuid: () => uuidv4()
      }
    },
    propertyFormatting: {
      convertHyphensToUnderscores: true,
      ensureArrayForTags: true
    }
  },

  // File Generation
  reporting: {
    issueFiles: {
      lowercaseTags: 'Lowercase-Tags.md',
      missingUrls: 'Missing-URLs.md'
    }
  }
};

// Ensure fixes directory exists
if (!fs.existsSync(USER_OPTIONS.directories.fixes)) {
  fs.mkdirSync(USER_OPTIONS.directories.fixes, { recursive: true });
}

// Find all markdown files recursively
const markdownFiles = glob.sync('**/*.md', {
  cwd: USER_OPTIONS.directories.content,
  absolute: true
});

let filesModified = 0;
let totalReplacements = 0;
let lowercaseTags = new Set();
let missingUrls = new Set();

markdownFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const parsedFile = matter(content);
  
  // Get the raw frontmatter string
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return;
  
  const frontmatter = match[1];
  let modifiedFrontmatter = frontmatter;
  let replacementsInFile = 0;
  
  // Check and add required properties
  USER_OPTIONS.frontmatter.required.properties.forEach(prop => {
    if (!parsedFile.data[prop] && USER_OPTIONS.frontmatter.required.generateIfMissing[prop]) {
      const generatedValue = USER_OPTIONS.frontmatter.required.generateIfMissing[prop]();
      const newProperty = `${prop}: "${generatedValue}"`;
      modifiedFrontmatter = `${newProperty}\n${modifiedFrontmatter}`;
      replacementsInFile++;
    }
  });

  // Replace hyphens in variable names with underscores if enabled
  if (USER_OPTIONS.frontmatter.propertyFormatting.convertHyphensToUnderscores) {
    modifiedFrontmatter = modifiedFrontmatter.replace(/^([^:\r\n]+?):/gm, (match, varName) => {
      const newVarName = varName.trim().replace(/-/g, '_');
      if (newVarName !== varName.trim()) {
        replacementsInFile++;
        return `${newVarName}:`;
      }
      return match;
    });
  }

  // Handle tags formatting
  if (parsedFile.data.tags && USER_OPTIONS.frontmatter.propertyFormatting.ensureArrayForTags) {
    const tags = Array.isArray(parsedFile.data.tags) ? parsedFile.data.tags : [parsedFile.data.tags];
    const modifiedTags = tags.map(tag => tag.replace(/\s+/g, '-'));
    
    // Check for lowercase tags
    modifiedTags.forEach(tag => {
      if (tag[0] && tag[0].toLowerCase() === tag[0]) {
        lowercaseTags.add(tag);
      }
    });

    // Update frontmatter if tags were modified
    if (JSON.stringify(tags) !== JSON.stringify(modifiedTags)) {
      modifiedFrontmatter = modifiedFrontmatter.replace(
        /^tags:.*$/m,
        `tags: [${modifiedTags.map(t => `"${t}"`).join(', ')}]`
      );
      replacementsInFile++;
    }
  }

  // Check for missing URLs in non-excluded directories
  if (!parsedFile.data.url && 
      !USER_OPTIONS.directories.excludeUrlCheck.some(dir => filePath.includes(dir))) {
    missingUrls.add(path.relative(USER_OPTIONS.directories.content, filePath));
  }

  if (frontmatter !== modifiedFrontmatter) {
    // Replace the original frontmatter with modified version
    const newContent = content.replace(frontmatter, modifiedFrontmatter);
    fs.writeFileSync(filePath, newContent, 'utf8');
    filesModified++;
    totalReplacements += replacementsInFile;
    console.log(`Modified ${path.relative(process.cwd(), filePath)}: ${replacementsInFile} replacements`);
  }
});

// Write issue reports
Object.entries(USER_OPTIONS.reporting.issueFiles).forEach(([type, filename]) => {
  const data = type === 'lowercaseTags' ? lowercaseTags : missingUrls;
  fs.writeFileSync(
    path.join(USER_OPTIONS.directories.fixes, filename),
    data.size > 0 ? Array.from(data).join('\n') : '',
    'utf8'
  );
});

// Log summary
console.log(`\nSummary:`);
console.log(`Files modified: ${filesModified}`);
console.log(`Total replacements: ${totalReplacements}`);
console.log(`Lowercase tags found: ${lowercaseTags.size}`);
console.log(`Files missing URLs: ${missingUrls.size}`);
