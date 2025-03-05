const fs = require('fs');
const path = require('path');

// Directory containing the trademark components
const componentsDir = path.join(
  process.cwd(),
  'src/assets/visuals-as-components/tooling-trademarks/'
);

// Process all .astro files in the directory
async function processFiles() {
  try {
    // Read all files in the directory
    const files = fs.readdirSync(componentsDir);
    const astroFiles = files.filter(file => file.endsWith('.astro'));
    
    console.log(`Found ${astroFiles.length} Astro files to process`);
    
    // Process each file
    for (const file of astroFiles) {
      const filePath = path.join(componentsDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      // More robust check for existing wrapper
      // Check for both the opening and closing div tags
      if (content.includes('class="trademark-svg-wrap"') || 
          (content.includes('<div') && content.trim().endsWith('</div>'))) {
        console.log(`${file} already appears to have a wrapper, skipping`);
        continue;
      }
      
      // Split the content into frontmatter and template parts
      const parts = content.split('---');
      if (parts.length < 3) {
        console.log(`${file} doesn't have the expected Astro structure, skipping`);
        continue;
      }
      
      // The first part is empty (before first ---), second is frontmatter, third is template
      const frontmatter = parts[1];
      let template = parts.slice(2).join('---').trim();
      
      // Add the wrapper div
      template = `<div class="trademark-svg-wrap">\n${template}\n</div>`;
      
      // Reconstruct the file
      const newContent = `---${frontmatter}---\n\n${template}`;
      
      // Write the modified content back to the file
      fs.writeFileSync(filePath, newContent);
      console.log(`Added wrapper to ${file}`);
    }
    
    console.log('All files processed successfully');
  } catch (error) {
    console.error('Error processing files:', error);
  }
}

// Run the script
processFiles();
