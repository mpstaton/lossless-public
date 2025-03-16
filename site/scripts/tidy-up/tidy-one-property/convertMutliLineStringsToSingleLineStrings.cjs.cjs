function fixObsidianYamlDescription(yamlContent) {
   const lines = yamlContent.split('\n');
   let startIdx = null;
   let endIdx = null;
   const descriptionLines = [];

   // Find the description block
   for (let i = 0; i < lines.length; i++) {
       if (lines[i].startsWith('description:')) {
           startIdx = i;
           descriptionLines.push(lines[i].replace('description:', '').trim());
       } else if (startIdx !== null && endIdx === null) {
           // Keep collecting lines until we hit the next field (which starts without whitespace)
           if (lines[i].trim() && !lines[i].startsWith(' ')) {
               endIdx = i;
               break;
           }
           if (lines[i].trim()) { // Only add non-empty lines
               descriptionLines.push(lines[i].trim());
           }
       }
   }

   if (endIdx === null) {
       endIdx = lines.length;
   }

   // Create a single continuous string for the description value
   const fixedDescription = descriptionLines.join(' ').replace(/\s+/g, ' ').trim();

   // Replace the original multi-line description with the single-line version
   return [
       ...lines.slice(0, startIdx),
       `description: ${fixedDescription}`,
       ...lines.slice(endIdx)
   ].join('\n');
}