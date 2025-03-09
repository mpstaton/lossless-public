const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const TRADEMARKS_DIR = 'src/assets/visuals-as-components/trademarks-fixed-height';

async function main() {
  try {
    // Find all .astro files in the trademarks directory
    const files = await glob(`${TRADEMARKS_DIR}/**/*.astro`);
    console.log(`Found ${files.length} trademark files to process`);
    
    let modifiedCount = 0;
    
    for (const filePath of files) {
      try {
        // Read the file content
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Replace height="100%" with height="80px"
        const modifiedContent = content.replace(/height="100%"/g, 'height="80px"');
        
        // Only write back if changes were made
        if (content !== modifiedContent) {
          fs.writeFileSync(filePath, modifiedContent);
          console.log(`✅ Updated height in ${path.basename(filePath)}`);
          modifiedCount++;
        }
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
      }
    }
    
    if (modifiedCount > 0) {
      console.log(`\nSuccessfully updated height in ${modifiedCount} files`);
    } else {
      console.log('\nNo files needed updating');
    }
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
