const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Processing modes
const PROCESS_MODE = {
  SET_HEIGHT_ASTRO_FILES: 'SET_HEIGHT_ASTRO_FILES',
  SET_HEIGHT_SVG: 'SET_HEIGHT_SVG'
};

// Configuration
const CONFIG = {
  PROCESS_MODE: PROCESS_MODE.SET_HEIGHT_ASTRO_FILES,
  ASTRO_DIR: 'src/assets/visuals-as-components/trademarks-fixed-height',
  SVG_DIR: 'src/assets/Visuals/Standardized-Tooling-Trademarks',
  TARGET_HEIGHT: 80
};

// Calculate Greatest Common Divisor using Euclidean algorithm
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

// Get simplified ratio
function getSimplifiedRatio(width, height) {
  const divisor = gcd(width, height);
  return {
    width: width / divisor,
    height: height / divisor,
    originalWidth: width,
    originalHeight: height,
    gcd: divisor
  };
}

// Function to process SVG files with viewBox
async function processSVGViewBox(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract viewBox values
    const viewBoxMatch = content.match(/viewBox="(\d+)\s+(\d+)\s+(\d+)\s+(\d+)"/);
    if (!viewBoxMatch) {
      console.log(`⚠️ No viewBox found in ${path.basename(filePath)}`);
      return;
    }

    const [, , , originalWidth, originalHeight] = viewBoxMatch.map(Number);
    const ratio = getSimplifiedRatio(originalWidth, originalHeight);
    
    // Calculate new dimensions maintaining aspect ratio
    const targetHeight = 160;
    const scaleFactor = targetHeight / originalHeight;
    const newWidth = Math.round(originalWidth * scaleFactor);
    
    console.log(`Processing ${path.basename(filePath)}:`, {
      originalDimensions: `${originalWidth}x${originalHeight}`,
      simplifiedRatio: `${ratio.width}:${ratio.height}`,
      gcd: ratio.gcd,
      newDimensions: `${newWidth}x${targetHeight}`,
      scaleFactor
    });

    // Prepare modifications
    let modifiedContent = content;

    // Update viewBox to use new dimensions
    modifiedContent = modifiedContent.replace(
      /viewBox="\d+\s+\d+\s+\d+\s+\d+"/,
      `viewBox="0 0 ${newWidth} ${targetHeight}"`
    );

    // Handle preserveAspectRatio
    if (!modifiedContent.includes('preserveAspectRatio')) {
      modifiedContent = modifiedContent.replace(
        /<svg/,
        '<svg preserveAspectRatio="xMidYMid"'
      );
    } else {
      modifiedContent = modifiedContent.replace(
        /preserveAspectRatio="[^"]*"/,
        'preserveAspectRatio="xMidYMid"'
      );
    }

    // Update height and width attributes if they exist
    modifiedContent = modifiedContent
      .replace(/height="[^"]*"/, `height="${targetHeight}"`)
      .replace(/width="[^"]*"/, `width="${newWidth}"`);

    // Only write back if changes were made
    if (content !== modifiedContent) {
      fs.writeFileSync(filePath, modifiedContent);
      console.log(`✅ Updated SVG attributes in ${path.basename(filePath)}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing SVG file ${filePath}:`, error.message);
    return false;
  }
}

// Function to process ASTRO files (existing functionality)
async function processAstroFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const modifiedContent = content.replace(/height="100%"/g, 'height="80px"');
    
    if (content !== modifiedContent) {
      fs.writeFileSync(filePath, modifiedContent);
      console.log(`✅ Updated height in ${path.basename(filePath)}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ASTRO file ${filePath}:`, error.message);
    return false;
  }
}

async function main() {
  try {
    let searchPath, processFunction;
    
    // Determine which mode to run in
    switch (CONFIG.PROCESS_MODE) {
      case PROCESS_MODE.SET_HEIGHT_SVG:
        searchPath = `${CONFIG.SVG_DIR}/**/*.svg`;
        processFunction = processSVGViewBox;
        break;
      case PROCESS_MODE.SET_HEIGHT_ASTRO_FILES:
        searchPath = `${CONFIG.ASTRO_DIR}/**/*.astro`;
        processFunction = processAstroFile;
        break;
      default:
        throw new Error(`Invalid process mode: ${CONFIG.PROCESS_MODE}`);
    }

    // Find all matching files
    const files = await glob(searchPath);
    console.log(`Found ${files.length} files to process in ${CONFIG.PROCESS_MODE} mode`);
    
    let modifiedCount = 0;
    
    // Process each file
    for (const filePath of files) {
      const wasModified = await processFunction(filePath);
      if (wasModified) modifiedCount++;
    }
    
    if (modifiedCount > 0) {
      console.log(`\nSuccessfully updated ${modifiedCount} files`);
    } else {
      console.log('\nNo files needed updating');
    }
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
