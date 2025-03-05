const fs = require('fs');
const path = require('path');

// Directory containing the trademark components
const componentsDir = path.join(
  process.cwd(),
  'src/assets/visuals-as-components/tooling-trademarks/'
);

// Function to determine if a color is dark or light
function isColorDark(color) {
  // Remove any leading # and handle rgb/rgba format
  if (!color) return false;
  
  let r, g, b;
  
  // Handle hex colors
  if (color.startsWith('#')) {
    color = color.substring(1);
    
    // Convert shorthand hex (#RGB) to full form (#RRGGBB)
    if (color.length === 3) {
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }
    
    r = parseInt(color.substring(0, 2), 16);
    g = parseInt(color.substring(2, 4), 16);
    b = parseInt(color.substring(4, 6), 16);
  } 
  // Handle rgb/rgba colors
  else if (color.startsWith('rgb')) {
    const rgbValues = color.match(/\d+/g);
    if (rgbValues && rgbValues.length >= 3) {
      r = parseInt(rgbValues[0]);
      g = parseInt(rgbValues[1]);
      b = parseInt(rgbValues[2]);
    } else {
      return false; // Can't determine
    }
  }
  // Handle named colors (simplified - just checking for common dark colors)
  else {
    const darkColors = ['black', 'darkblue', 'darkgreen', 'darkred', 'navy', 'purple'];
    const lightColors = ['white', 'lightgray', 'lightyellow', 'lightblue', 'lightgreen'];
    
    if (darkColors.includes(color.toLowerCase())) return true;
    if (lightColors.includes(color.toLowerCase())) return false;
    
    // For other named colors, default to considering them light
    return false;
  }
  
  // Calculate perceived brightness using the formula:
  // (0.299*R + 0.587*G + 0.114*B)
  // This gives more weight to green as human eyes are more sensitive to it
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
  
  // If brightness is less than 128 (out of 255), consider it dark
  return brightness < 128;
}

// Function to analyze an SVG and determine if it's predominantly dark or light
function analyzeAndClassifySVG(content) {
  // Extract all color-related attributes from the SVG
  const colorAttributes = [
    'fill', 'stroke', 'stop-color', 'flood-color', 'lighting-color'
  ];
  
  let darkCount = 0;
  let lightCount = 0;
  
  // Check for color attributes
  for (const attr of colorAttributes) {
    const regex = new RegExp(`${attr}\\s*=\\s*["']([^"']+)["']`, 'gi');
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      const color = match[1];
      if (color && color.toLowerCase() !== 'none' && color.toLowerCase() !== 'transparent') {
        if (isColorDark(color)) {
          darkCount++;
        } else {
          lightCount++;
        }
      }
    }
  }
  
  // Check for inline styles with colors
  const styleRegex = /style\s*=\s*["']([^"']+)["']/gi;
  let styleMatch;
  
  while ((styleMatch = styleRegex.exec(content)) !== null) {
    const styleContent = styleMatch[1];
    
    for (const attr of colorAttributes) {
      const inlineColorRegex = new RegExp(`${attr}\\s*:\\s*([^;]+)`, 'gi');
      let inlineMatch;
      
      while ((inlineMatch = inlineColorRegex.exec(styleContent)) !== null) {
        const color = inlineMatch[1];
        if (color && color.toLowerCase() !== 'none' && color.toLowerCase() !== 'transparent') {
          if (isColorDark(color)) {
            darkCount++;
          } else {
            lightCount++;
          }
        }
      }
    }
  }
  
  // Check for CSS style blocks
  const cssRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let cssMatch;
  
  while ((cssMatch = cssRegex.exec(content)) !== null) {
    const cssContent = cssMatch[1];
    
    for (const attr of colorAttributes) {
      const cssColorRegex = new RegExp(`${attr}\\s*:\\s*([^;]+)`, 'gi');
      let cssColorMatch;
      
      while ((cssColorMatch = cssColorRegex.exec(cssContent)) !== null) {
        const color = cssColorMatch[1];
        if (color && color.toLowerCase() !== 'none' && color.toLowerCase() !== 'transparent') {
          if (isColorDark(color)) {
            darkCount++;
          } else {
            lightCount++;
          }
        }
      }
    }
  }
  
  // If no colors found, check if the SVG has a background color
  if (darkCount === 0 && lightCount === 0) {
    // Default to considering it light if we can't determine
    return 'light';
  }
  
  // Determine if the SVG is predominantly dark or light
  return darkCount > lightCount ? 'dark' : 'light';
}

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
    
    // Arrays to store dark and light SVGs
    const darkSVGs = [];
    const lightSVGs = [];
    
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
              
              // First, remove all existing width, height, and viewBox attributes
              let newTag = match
                .replace(/width\s*=\s*["'][^"']*["']/g, '')
                .replace(/height\s*=\s*["'][^"']*["']/g, '')
                .replace(/viewBox\s*=\s*["'][^"']*["']/g, '');
              
              // Clean up any potential double spaces from removed attributes
              newTag = newTag.replace(/\s{2,}/g, ' ');
              
              // Now add exactly one set of width and height attributes
              newTag = newTag.trim() + ' width="auto" height="100%"';
              
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
        
        // Analyze the SVG to determine if it's dark or light
        if (content.includes('<svg')) {
          const classification = analyzeAndClassifySVG(content);
          console.log(`Classified ${file} as: ${classification}`);
          
          // Store the file in the appropriate array
          if (classification === 'dark') {
            darkSVGs.push(file);
          } else {
            lightSVGs.push(file);
          }
        }
      } catch (fileError) {
        console.error(`Error processing file ${file}:`, fileError);
      }
    }
    
    console.log('All files processed successfully');
    
    // Output the classification results
    console.log('\n--- SVG Classification Results ---');
    console.log(`Total SVGs analyzed: ${darkSVGs.length + lightSVGs.length}`);
    console.log(`Dark SVGs (${darkSVGs.length}): ${darkSVGs.join(', ')}`);
    console.log(`Light SVGs (${lightSVGs.length}): ${lightSVGs.join(', ')}`);
    
    // Create a JSON file with the classification results
    const classificationData = {
      dark: darkSVGs.map(file => file.replace('.astro', '').replace('trademark__', '')),
      light: lightSVGs.map(file => file.replace('.astro', '').replace('trademark__', ''))
    };
    
    fs.writeFileSync(
      path.join(process.cwd(), 'src/assets/svg-classification.json'),
      JSON.stringify(classificationData, null, 2)
    );
    
    console.log('Classification data saved to src/assets/svg-classification.json');
  } catch (error) {
    console.error('Error processing files:', error);
    console.error('Error stack:', error.stack);
  }
}

// Run the script
processFiles();
