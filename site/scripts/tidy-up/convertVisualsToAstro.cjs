#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define source and destination directories
const sourceDir = path.join(process.cwd(), 'src/assets/Visuals/Standardized-Tooling-Trademarks');
const destDir = path.join(process.cwd(), 'src/assets/visuals-as-components/trademarks-viewbox-fixed-height');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log(`Created directory: ${destDir}`);
}

// Get all SVG files from source directory
const svgFiles = fs.readdirSync(sourceDir).filter(file => file.endsWith('.svg'));

// Process each SVG file
svgFiles.forEach(svgFile => {
  const sourcePath = path.join(sourceDir, svgFile);
  const fileName = path.basename(svgFile, '.svg');
  const destPath = path.join(destDir, `${fileName}.astro`);
  
  try {
    // Read SVG content
    const svgContent = fs.readFileSync(sourcePath, 'utf8');
    
    // Create Astro component content
    const astroContent = `---
// Converted from ${svgFile}
---

${svgContent}
`;
    
    // Write to destination
    fs.writeFileSync(destPath, astroContent);
    console.log(`Converted: ${svgFile} -> ${path.basename(destPath)}`);
  } catch (error) {
    console.error(`Error processing ${svgFile}:`, error);
  }
});

console.log(`Conversion complete. ${svgFiles.length} files processed.`);
