---
title: "Technical Specification: YAML Frontmatter Corruption Correction"
date: 2025-03-14
author: "Technical Team"
category: "Technical Specification"
tags: ["YAML", "Frontmatter", "Content Management", "Data Cleaning", "Automation"]
---

# YAML Frontmatter Corruption Correction Tool

## Executive Summary

Our content library contains over 700 markdown files with YAML frontmatter that drives site information. Developing and maintaining an increasingly robust content library is painful and prone to mistakes that can affect data and content sitewide. 

Yet, ramping up the use of AI and various data and content tooling is necessary... well... for everything. For example, meaningful Innovation Cookbook content, client communications, and even just keeping track of everything. To boot, we want to provide a great resource for the rapidly evolving ecosystem of technology acceleration. 

Inconsistent formatting and corruption -- created by AI Code Assistants with dementia and prone to hallucination leads to reckless file changes that can reverse significant progress, (looking at you Claude, Cursor). Git Blame Cursor & Claude --  in trying to orchestrate lots of content augmentation through a series of build scripts, frontmatter corruption through faulty assumptions that blockScalar syntax could be processed by node's YAML processor led to site wide frontmatter rendering failures, missing metadata, and nonsensical terminal errors. 

We've developed an automated tool that:

1. **Identifies corrupted frontmatter** across the entire content library
2. **Repairs common formatting issues** without altering content or meaning
3. **Standardizes property formatting** for improved reliability
4. **Produces comprehensive reports** on corrections made
5. **Summarizes breadth of successful syntax corrections** for easy digestion of big wins. 

In our initial run, this tool successfully corrected 869 property instances across 525 files, eliminating frontmatter-related build errors and ensuring consistent rendering. This represents a significant improvement in content quality and user experience with zero manual editing required.

---

## Technical Specification

### 1. System Overview

The `isolateAndCleanYAMLFormattingOnly.cjs` script is a Node.js utility designed to identify and correct common YAML frontmatter formatting issues in markdown files. The script focuses on preserving content while standardizing the format of YAML properties to ensure they can be correctly parsed and utilized by the site's build system.

The solution consists of two complementary scripts:
1. `listFilesWithCorruptedFrontmatter.cjs` - Scans content and generates a report of files with corrupted frontmatter
2. `isolateAndCleanYAMLFormattingOnly.cjs` - Processes the identified files to correct specific types of formatting issues

### 2. Key Capabilities

The script is capable of detecting and correcting several types of common YAML corruption:

1. **Unquoted values containing colons** - Values with colons must be quoted to avoid being interpreted as YAML mappings
2. **Block scalar misformatting** - URLs and descriptions that use block scalar indicators (`>`, `|`) incorrectly
3. **Inconsistent spacing** - Too many spaces between property keys and values
4. **Split URLs** - URLs incorrectly broken across multiple lines
5. **Double-quoted values** - Properties with unnecessary double sets of quotes (e.g., `""value""`)

### 3. Technical Architecture

#### 3.1 Configuration Parameters

The script uses a configurable approach with several key parameters:

```javascript
// Processing mode: 'sample', 'specific', or 'all'
const PROCESSING_MODE = 'all';

// Maximum files to process in 'sample' mode
const MAX_SAMPLE_SIZE = 5;

// Files to target in 'specific' mode
const SPECIFIC_FILES_TO_PROCESS = [
    // Array of specific file paths
];

// Properties to check and correction methods to apply
const PROPERTIES_TO_FIX = [
    { key: 'property_name', method: 'correction_method' },
    // Additional property/method pairs
];
```

#### 3.2 Correction Methods

The system implements three distinct correction methods that address different types of YAML formatting issues:

1. **`assureQuotesOrReplaceLineAndSurroundValueWithQuotes`**
   - Targets properties that may contain colons in their values
   - Ensures values are properly quoted to prevent parsing errors
   - Handles cases of double-quoted values, converting to single quotes
   - Example: `jina_error: Value: with: colons` → `jina_error: "Value: with: colons"`

2. **`replaceWithSimpleStringNoQuotes`**
   - Converts block scalar notation to simple strings
   - Processes multiline values into single lines with spaces
   - Maintains proper spacing between sentences
   - Example:
     ```yaml
     description: >-
       Line one
       Line two
     ```
     → `description: Line one Line two`

3. **`cleanExtraSpacesInProperty`**
   - Normalizes spacing between property keys and values
   - Ensures exactly one space after the colon
   - Fixes newlines in values that should be simple strings
   - Example: `url:    https://example.com` → `url: https://example.com`

#### 3.3 Processing Workflow

The script follows this processing sequence:

1. **Initialization**
   - Load configuration parameters
   - Set up tracking for evaluated and fixed files

2. **Report Reading**
   - Read the corrupted files report
   - Extract file paths and reported issues
   - Verify file existence

3. **File Selection**
   - Determine which files to process based on mode
   - Create a processing list

4. **Property Processing**
   - For each property configuration:
     - Process each file in the processing list
     - Apply the specified correction method
     - Track fixes made

5. **Report Generation**
   - Compile statistics on files processed and fixed
   - Generate detailed report of changes
   - Write report to output location

#### 3.4 File Handling Implementation

The core file processing function handles each file and property combination:

```javascript
function cleanFrontmatterGlitch(filePath, glitchKey, correctionType) {
    // 1. Read the file
    // 2. Extract YAML frontmatter 
    // 3. Check if the property exists
    // 4. Apply the appropriate correction method
    // 5. Compare original and corrected content
    // 6. Write changes if needed
    // 7. Track the correction
}
```

### 4. Technical Implementation Details

#### 4.1 Property Detection

Properties are detected using regex patterns that account for varying formatting:

```javascript
const keyPattern = new RegExp(`^\\s*${glitchKey}\\s*:`, 'm');
```

This pattern allows for variations in spacing and ensures the property is found even with inconsistent formatting.

#### 4.2 Correction Method Implementations

##### Quote Assurance Function

```javascript
function assureQuotesOrReplaceLineAndSurroundValueWithQuotes(line, key) {
    // Extract the key and value
    const keyPattern = new RegExp(`^(${key}:\\s*)(.*)$`, 'm');
    const match = line.match(keyPattern);
    
    if (!match) return line;
    
    const [fullLine, keyPart, value] = match;
    const trimmedValue = value.trim();
    
    // Case 1: Check for double quotes
    if (/^".*"$/.test(trimmedValue)) {
        // Handle double-double quotes
        if (/^"".*""$/.test(trimmedValue)) {
            const innerContent = trimmedValue.slice(2, -2);
            return `${keyPart}"${innerContent}"`;
        }
        return line;
    }
    
    // Case 2: Handle single quotes
    if (/^'.*'$/.test(trimmedValue)) {
        const innerContent = trimmedValue.slice(1, -1);
        const escapedContent = innerContent.replace(/"/g, '\\"');
        return `${keyPart}"${escapedContent}"`;
    }
    
    // Case 3: Add quotes for values with colons
    if (trimmedValue.includes(':')) {
        return `${keyPart}"${trimmedValue.replace(/"/g, '\\"')}"`;
    }
    
    return line;
}
```

##### Block Scalar Conversion Function

```javascript
function replaceWithSimpleStringNoQuotes(content, key) {
    // Find block scalar patterns
    const blockScalarPatterns = [
        new RegExp(`^(${key}:)\\s*(>-|>|\\|[-]?)\\s*$(\\n[ \\t]+.*)*`, 'm'),
        new RegExp(`^(${key}:)\\s*$(\\n[ \\t]+.*)+`, 'm')
    ];
    
    let match = null;
    for (const pattern of blockScalarPatterns) {
        match = content.match(pattern);
        if (match) break;
    }
    
    if (!match) return content;
    
    // Process multiline content into single line
    const lines = match[0].split('\n');
    const keyPart = match[1];
    let valueLines = lines.slice(1);
    
    let combinedValue = valueLines
        .map(line => line.trim())
        .map(line => line.replace(/\\n/g, ' '))
        .join(' ')
        .replace(/\s{2,}/g, ' ')
        .trim();
        
    combinedValue = combinedValue
        .replace(/\\t/g, ' ')
        .replace(/ ([,.!?:;])(\s|$)/g, '$1$2');
    
    return content.replace(match[0], `${keyPart} ${combinedValue}`);
}
```

##### Space Normalization Function

```javascript
function cleanExtraSpacesInProperty(line, key) {
    const keyPattern = new RegExp(`^(${key}:)(\\s*)(.*?)$`, 'm');
    const match = line.match(keyPattern);
    
    if (!match) return line;
    
    const [fullLine, keyPart, spaces, value] = match;
    const trimmedValue = value.trim();
    
    // Fix excessive spaces
    if (spaces.length > 1) {
        return `${keyPart} ${trimmedValue}`;
    }
    
    // Fix newlines in unquoted values
    if (trimmedValue.includes('\n') && !(/^["'].*["']$/.test(trimmedValue))) {
        return `${keyPart} ${trimmedValue.replace(/\n/g, ' ')}`;
    }
    
    return line;
}
```

#### 4.3 Reporting Format

The reporting mechanism generates a detailed markdown report with sections for:

1. Configuration information (mode, file selection)
2. Properties checked
3. Files evaluated
4. Summary statistics (files fixed, properties fixed)
5. Breakdown of fixes by property type
6. List of modified files with specific properties fixed

### 5. Performance and Scale Considerations

The script is designed to handle large numbers of files efficiently:

- **Progressive Logging**: Reports progress every 20 files to provide feedback during long-running operations
- **File Verification**: Checks each file's existence before attempting processing
- **Error Handling**: Gracefully handles errors in individual files without failing the entire process
- **Flexible Processing Modes**: Supports processing subsets for testing or targeted fixes

### 6. Results and Impact

In our production deployment, the script successfully processed:

- **Files Evaluated**: 735 files with frontmatter issues
- **Files Fixed**: 525 files (71.4% of corrupted files)
- **Properties Fixed**: 869 property instances

Property-specific fixes:
- `og_screenshot_url`: 482 instances
- `image`: 184 instances
- `favicon`: 134 instances
- `jina_error`: 64 instances
- `og_error_message`: 3 instances
- `url`: 2 instances

These corrections have eliminated build errors related to YAML parsing and ensured consistent metadata display throughout the site.

### 7. Future Enhancements

Potential improvements for future versions:

1. **Parallelized Processing**: Implement worker threads for faster processing of large file sets
2. **Additional Correction Methods**: Add specialized handlers for other common corruption patterns
3. **Integration with Build Process**: Automatically run as part of the build pipeline
4. **Differential Reporting**: Compare results between runs to track improvements
5. **Interactive Mode**: Allow selective application of fixes with user confirmation

---

## Conclusion

The YAML frontmatter correction tool has proven highly effective at automatically identifying and fixing formatting issues across our content library. This automation eliminates the need for manual correction while ensuring consistent formatting that meets the requirements of our build and rendering systems.

By addressing these issues systematically, we've improved content quality, eliminated build errors, and enhanced the overall user experience with minimal manual intervention.
