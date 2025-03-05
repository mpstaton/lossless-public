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
    console.log(`Looking for files in: ${componentsDir}`);
    console.log(`Current working directory: ${process.cwd()}`);
    
    // Check if directory exists
    if (!fs.existsSync(componentsDir)) {
      console.error(`Directory does not exist: ${componentsDir}`);
      return;
    }
    
    // Read all files in the directory
    const files = fs.readdirSync(componentsDir);
    const astroFiles = files.filter(file => file.endsWith('.astro'));
    
    console.log(`Found ${astroFiles.length} Astro files to process`);
    
    // Process each file
    for (const file of astroFiles) {
      try {
        const filePath = path.join(componentsDir, file);
        console.log(`Processing file: ${filePath}`);
        
        // Check if file exists and is readable
        if (!fs.existsSync(filePath)) {
          console.error(`File does not exist: ${filePath}`);
          continue;
        }
        
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Check for existing wrapper
        const hasWrapper = content.includes('class="trademark-svg-wrap"') || 
            (content.includes('<div') && content.trim().endsWith('</div>'));
        
        if (!hasWrapper) {
          console.log(`Adding wrapper div to ${file}`);
          // Split the content into frontmatter and template parts
          const parts = content.split('---');
          if (parts.length < 3) {
            console.log(`${file} doesn't have the expected Astro structure, skipping wrapper`);
          } else {
            // The first part is empty (before first ---), second is frontmatter, third is template
            const frontmatter = parts[1];
            let template = parts.slice(2).join('---').trim();
            
            // Add the wrapper div
            template = `<div class="trademark-svg-wrap">\n${template}\n</div>`;
            
            // Reconstruct the file
            content = `---${frontmatter}---\n\n${template}`;
            modified = true;
          }
        } else {
          console.log(`${file} already has a wrapper, skipping wrapper addition`);
        }
        
        // Modify SVG attributes
        if (content.includes('<svg')) {
          console.log(`Modifying SVG attributes in ${file}`);
          
          try {
            // Remove viewBox attribute and set width to auto and height to 100%
            content = content.replace(/<svg[^>]*?/g, (match) => {
              console.log(`Original SVG tag: ${match.substring(0, 50)}...`);
              
              // Remove viewBox attribute
              let newTag = match.replace(/viewBox\s*=\s*["'][^"']*["']/g, '');
              
              // Replace width and height attributes
              newTag = newTag.replace(/width\s*=\s*["'][^"']*["']/g, 'width="auto"');
              newTag = newTag.replace(/height\s*=\s*["'][^"']*["']/g, 'height="100%"');
              
              // If width or height attributes don't exist, add them
              if (!newTag.includes('width=')) {
                newTag += ' width="auto"';
              }
              if (!newTag.includes('height=')) {
                newTag += ' height="100%"';
              }
              
              console.log(`Modified SVG tag: ${newTag.substring(0, 50)}...`);
              return newTag;
            });
            
            modified = true;
          } catch (regexError) {
            console.error(`Error modifying SVG in ${file}:`, regexError);
          }
        }
        
        // Write the modified content back to the file if changes were made
        if (modified) {
          try {
            fs.writeFileSync(filePath, content);
            console.log(`Updated ${file}`);
          } catch (writeError) {
            console.error(`Error writing to file ${file}:`, writeError);
          }
        } else {
          console.log(`No changes needed for ${file}`);
        }
      } catch (fileError) {
        console.error(`Error processing file ${file}:`, fileError);
      }
    }
    
    console.log('All files processed successfully');
  } catch (error) {
    console.error('Error processing files:', error);
    console.error('Error stack:', error.stack);
  }
}

// Run the script
processFiles();
