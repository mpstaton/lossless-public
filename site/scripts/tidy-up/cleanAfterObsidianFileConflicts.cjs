const fs = require('fs');
const path = require('path');
const glob = require('glob');

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
  const newContent = content.replaceAll(' 1]]', ']]');
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    const replacementsInFile = content.split(' 1]]').length - 1;
    filesModified++;
    totalReplacements += replacementsInFile;
    console.log(`Modified ${path.relative(process.cwd(), filePath)}: ${replacementsInFile} replacements`);
  }
});

console.log(`\nSummary:`);
console.log(`Files modified: ${filesModified}`);
console.log(`Total replacements: ${totalReplacements}`);
