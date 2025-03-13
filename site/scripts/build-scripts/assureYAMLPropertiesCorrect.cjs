const fs = require('fs');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');

const contentDir = path.join(process.cwd(), 'src/content/tooling');
const fixesDir = path.join(process.cwd(), 'scripts/fixes-needed');

// Ensure fixes directory exists
if (!fs.existsSync(fixesDir)) {
  fs.mkdirSync(fixesDir, { recursive: true });
}

// Find all markdown files recursively
const markdownFiles = glob.sync('**/*.md', {
  cwd: contentDir,
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
  
  // Replace hyphens in variable names (before colons) with underscores
  modifiedFrontmatter = modifiedFrontmatter.replace(/^([^:\r\n]+?):/gm, (match, varName) => {
    const newVarName = varName.trim().replace(/-/g, '_');
    if (newVarName !== varName.trim()) {
      replacementsInFile++;
      return `${newVarName}:`;
    }
    return match;
  });

  // Check for tags with spaces and lowercase starts
  if (parsedFile.data.tags) {
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

  // Check for missing URLs in non-Explainer directories
  if (!parsedFile.data.url && !filePath.includes('Explainers')) {
    missingUrls.add(path.relative(contentDir, filePath));
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

// Write lowercase tags to file
fs.writeFileSync(
  path.join(fixesDir, 'Lowercase-Tags.md'),
  lowercaseTags.size > 0 ? Array.from(lowercaseTags).join('\n') : '',
  'utf8'
);

// Write missing URLs to file
fs.writeFileSync(
  path.join(fixesDir, 'Missing-URLs.md'),
  missingUrls.size > 0 ? Array.from(missingUrls).join('\n') : '',
  'utf8'
);

console.log(`\nSummary:`);
console.log(`Files modified: ${filesModified}`);
console.log(`Total replacements: ${totalReplacements}`);
console.log(`Lowercase tags found: ${lowercaseTags.size}`);
console.log(`Files missing URLs: ${missingUrls.size}`);
