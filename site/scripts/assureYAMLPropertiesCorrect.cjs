const fs = require('fs');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');

const contentDir = path.join(process.cwd(), 'src/content/tooling');

// Find all markdown files recursively
const markdownFiles = glob.sync('**/*.md', {
  cwd: contentDir,
  absolute: true
});

let filesModified = 0;
let totalReplacements = 0;

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
  
  if (frontmatter !== modifiedFrontmatter) {
    // Replace the original frontmatter with modified version
    const newContent = content.replace(frontmatter, modifiedFrontmatter);
    fs.writeFileSync(filePath, newContent, 'utf8');
    filesModified++;
    totalReplacements += replacementsInFile;
    console.log(`Modified ${path.relative(process.cwd(), filePath)}: ${replacementsInFile} replacements`);
  }
});

console.log(`\nSummary:`);
console.log(`Files modified: ${filesModified}`);
console.log(`Total replacements: ${totalReplacements}`);
