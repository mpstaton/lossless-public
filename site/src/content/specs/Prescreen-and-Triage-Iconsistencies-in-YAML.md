---
title: "Technical Specification: YAML Prescreening and Triaging System"
date: 2025-03-15
author: "Technical Team"
category: "Technical Specification"
tags: ["YAML", "Frontmatter", "Content Management", "Data Cleaning", "Automation", "Prescreening"]
---

# YAML Prescreening and Triaging System

## Executive Summary

Our content repository contains hundreds of markdown files with YAML frontmatter that drives critical site functionality. As we scale our content creation through both human authors and AI assistance, maintaining consistency in this frontmatter has become increasingly challenging.

The YAML Prescreening and Triaging System addresses this challenge by:

1. **Proactively identifying formatting inconsistencies** before they cause downstream build failures
2. **Automatically correcting common issues** without manual intervention
3. **Triaging content files** into categories based on their YAML health
4. **Generating detailed reports** of issues found and corrections made
5. **Preventing problematic files** from entering subsequent build processes

This system serves as a critical first line of defense in our content pipeline, significantly reducing build failures, improving reliability, and streamlining the content management process. For non-technical stakeholders, it can be understood as a "content quality firewall" that:

- **Reduces engineering time** spent troubleshooting build failures
- **Improves publication reliability** by identifying issues before they affect the live site
- **Provides visibility** into content quality through clear reporting
- **Accelerates content production** by allowing automatic fixes for common issues
- **Protects downstream systems** from corrupted or malformed data

In a repository with over 700 content files, our initial implementation successfully identified and corrected 584 formatting issues across the content library, with 623 files passing all validation checks. This represents a significant improvement in content quality and builds system reliability with minimal manual intervention required.

---

## Technical Specification

### 1. System Overview

The YAML Prescreening and Triaging System (`prescreenFilesWithFilesystemRegex.cjs`) is a Node.js utility designed to scan a content directory for markdown files, identify YAML frontmatter inconsistencies, and sort files into categories based on the severity of issues found. The script applies automated corrections where possible and generates comprehensive reports on the results.

This system operates as a prerequisite to the main build process, acting as a gatekeeper that:

1. Categorizes files as "clean", "minor inconsistencies", or "critical issues"
2. Attempts to fix common formatting problems automatically
3. Outputs detailed reports of its findings and actions
4. Provides a clear signal to downstream processes about which files are safe to process

### 2. Core Capabilities

#### 2.1 Issue Detection

The system detects various types of YAML formatting issues:

- **Missing YAML delimiters**: Detects files with opening but not closing delimiters
- **Block scalar formatting**: Identifies improper use of block scalar indicators (`>`, `|`)
- **Duplicate keys**: Finds repeated property keys in frontmatter
- **Quote formatting**: Detects improperly quoted values, especially in error messages
- **URL formatting**: Identifies URLs broken across multiple lines
- **Special property handling**: Provides special detection for properties containing colons
- **Balanced quotes**: Verifies that quoted values have proper closing quotes

#### 2.2 Automated Correction

For each type of detected issue, the system implements specialized correction functions:

- **Delimiter correction**: Attempts to add missing closing delimiters
- **Block scalar fixing**: Properly formats block scalar content
- **Duplicate key removal**: Eliminates redundant keys while preserving the first occurrence
- **Quote standardization**: Fixes quotes in error messages and special properties
- **URL reconstruction**: Rebuilds URLs broken across multiple lines
- **Quote balancing**: Adds missing closing quotes to property values

#### 2.3 File Categorization

Files are sorted into three categories:

1. **Totally clean files**: No issues detected, safe for all operations
2. **Files with minor inconsistencies**: Issues that might affect specific operations but don't prevent processing
3. **Files with critical issues**: Problems that make the file unsafe for any processing

#### 2.4 Report Generation

The system produces three detailed reports:

1. **Screened-In Files**: Details on files that passed validation or had minor, fixable issues
2. **Non-Blocking Observations**: Analysis of minor inconsistencies and their impact
3. **Screened-Out Files**: Details on files with critical issues that prevent processing

These reports provide visibility into content quality and specific actions needed to improve it.

### 3. Technical Architecture

#### 3.1 Configuration Parameters

The script uses configurable parameters:

```javascript
// Content directory to scan
const CONTENT_DIR = process.env.CONTENT_DIR || 'site/src/content/tooling';

// Output file paths for reports
const TARGET_SCREENED_OUT_FILES_FILE_PATH = '...';
const TARGET_SCREENED_IN_FILES_FILE_PATH = '...';
const TARGET_NON_BLOCKING_OBSERVATIONS_FILE_PATH = '...';

// Special property lists
const URL_PROPERTIES = [
  'url', 'image', 'favicon', 'og_screenshot_url', 'og_image'
];

const SPECIAL_PROPERTIES = [
  'title', 'description', 'jina_error', 'og_error_message', 'zinger'
];
```

#### 3.2 Pattern-Based Issue Detection

Issues are detected using a collection of regex patterns, each with metadata about impact:

```javascript
const CORRUPTION_PATTERNS = [
  { 
    pattern: /pattern/,
    messageToLog: 'Human-readable description',
    preventsOperations: ['operation1', 'operation2'],
    correctionFunction: 'functionName',
    isCritical: boolean
  },
  // Additional patterns...
];
```

Each pattern includes:
- A regex pattern for detection
- A message to log when the pattern is found
- A list of operations that would be affected
- A reference to the correction function to apply (if available)
- A flag indicating if the issue is critical

#### 3.3 File Processing Workflow

The system follows this processing sequence:

1. **Initialization**
   - Configure directories and output paths
   - Initialize tracking arrays and maps

2. **File Discovery**
   - Recursively search for markdown files in the content directory
   - Track total file count

3. **File Analysis and Correction**
   - For each file:
     - Read file content
     - Check for empty files
     - Check frontmatter structure
     - Apply each pattern to detect issues
     - Attempt corrections when possible
     - Track results of correction attempts
     - Categorize file based on results

4. **Report Generation**
   - Compile statistics on processing results
   - Format detailed reports for each category
   - Write reports to designated output files

#### 3.4 Correction Function Implementation

Correction functions follow a consistent pattern:

```javascript
attemptToFixIssue: (filePath, content) => {
  try {
    // 1. Extract frontmatter if needed
    // 2. Apply the specific correction logic
    // 3. Return an object with results:
    return {
      success: boolean,
      message: 'Description of action taken',
      updatedContent: content // If successful
    };
  } catch (error) {
    return {
      success: false,
      message: `Error: ${error.message}`
    };
  }
}
```

These functions provide a uniform interface while implementing specialized logic for each issue type.

### 4. Report Format and Content

#### 4.1 Screened-In Files Report

```markdown
---
updated_on: "{timestamp}"
included_file_count: {count}
totally_clean_files: {count}
files_with_minor_inconsistencies: {count}
total_file_count: {count}
successful_corrections: {count}
---

# Markdown Files Screened-In for Processing
Last updated: {timestamp}

## Summary
- Totally clean files: {count}
- Files with minor inconsistencies: {count}
- Total included files: {count} (out of {total} total)
- Successful auto-corrections: {count}

## Files with Minor Inconsistencies
These files have issues that prevent specific operations, but can still be processed by other operations:

- {filePath}
  - Prevented operations: {operationList}
...

## Auto-Correction Attempts
- {filePath}
  - {issue}: ✅ {message}
  - {issue}: ❌ {message}
...

## Totally Clean Files
These files have no issues and can be fully processed:

- {filePath}
...
```

#### 4.2 Non-Blocking Observations Report

```markdown
---
updated_on: "{timestamp}"
---

# Non-Blocking Observations
Last updated: {timestamp}

## Files with Minor Inconsistencies
These files have issues that might affect some operations but are not critical:

- {filePath}
  - Prevented operations: {operationList}
...

## Operation Impact Summary
The following operations are affected by minor inconsistencies:

- {operation}: {count} files affected
...
```

#### 4.3 Screened-Out Files Report

```markdown
---
updated_on: "{timestamp}"
included_file_count: {count}
total_file_count: {count}
---

# Markdown Files Screened-Out from Processing
Last updated: {timestamp}

These {count} files (out of {total} total) have been screened out due to critical YAML issues:

- {filePath}
  - Correction attempts:
    - {issue}: ✅ {message}
    - {issue}: ❌ {message}
...
```

### 5. Integration with Build Pipeline

The prescreening system is designed to be run as an early step in the build process:

1. **Execution timing**: Run before any content processing scripts
2. **Exit status**: Returns success/failure status for pipeline integration
3. **Report consumption**: Downstream build steps can read reports to determine which files to process
4. **Environmental integration**: Can be configured via environment variables

The system exposes several exported functions for integration:

```javascript
module.exports = {
  sortFilesIntoTwoArraysBasedOnFilesystemRegex,
  getScreenedInFiles: () => [...],
  getFileOperationMap: () => {...},
  getSuccessfulCorrections: () => count,
  canPerformOperation: (filePath, operation) => boolean
};
```

### 6. Performance and Scalability

The system is designed to handle large content repositories:

- **Progress tracking**: Reports progress every 100 files
- **Error isolation**: Errors in individual files don't stop the overall process
- **Memory efficient**: Processes files sequentially to minimize memory footprint

On a repository with 700+ files, processing typically completes in under 30 seconds.

### 7. Results and Impact

In our production deployment, the script successfully processed:

- **Files Evaluated**: 729 files
- **Totally Clean Files**: 623 files (85.5%)
- **Files with Minor Inconsistencies**: 69 files (9.5%)
- **Files with Critical Issues**: 37 files (5.1%)
- **Correction Attempts**: 584 instances

These corrections have:
- Eliminated many build errors related to YAML parsing
- Reduced manual content fixes needed
- Improved reliability of the build process
- Provided visibility into content quality issues

---

## Constraints for AI Code Assistants

When working with this system, AI Code Assistants MUST follow these strict guidelines:

### 1. Report Generation Imperatives

- **NEVER add validation** that prevents report files from being overwritten
- **ALWAYS ensure reports are generated** regardless of other errors or conditions
- **NEVER create dependencies** between report file generation and other processing steps
- **ALWAYS use direct file writing operations** rather than conditional checks before writing

### 2. Error Handling Directives

- **DO NOT prevent** report generation due to errors in processing
- **ISOLATE errors** to individual files rather than stopping the entire process
- **LOG errors** but continue processing remaining files
- **DO NOT add** additional validation logic without explicit permission

### 3. File Handling Requirements

- **ALWAYS create output directories recursively** if they don't exist
- **ALWAYS use `w` flag** when writing files to ensure overwriting
- **IGNORE errors** during directory creation
- **DO ensure** file handles are properly closed

### 4. Pattern Modification Guidelines

- **DO NOT modify** existing corruption patterns without explicit approval
- **CAREFULLY TEST** any new patterns to avoid false positives
- **MAINTAIN pattern metadata** including operations affected and criticality
- **DOCUMENT** the purpose and impact of new patterns

### 5. Integration Rules

- **PRESERVE** all exported functions and their signatures
- **MAINTAIN** backward compatibility with any code that uses this module
- **DO NOT change** the category definitions (clean, minor issues, critical issues)
- **RESPECT** the environment variable configuration options

### 6. URL Property Requirements

- **NEVER add quotes** around URL properties (url, image, favicon, og_screenshot_url, og_image, etc.)
- **ALWAYS ensure** that any correction function removes quotes from URL values
- **VERIFY** that pattern detection properly identifies quoted URLs as issues to be fixed
- **ENSURE** all URL-related correction logic preserves unquoted URL formatting

### 7. Code Modification Restrictions

When modifying the prescreening system, AI Assistants MUST:

1. Present a clear explanation of proposed changes
2. Show exact code modifications
3. Explain potential impacts on processing and reporting
4. Be especially conservative with any changes to:
   - File categorization logic
   - Critical issue definitions
   - Report writing functions
   - Exported interface functions
   - URL property handling

These constraints are designed to prevent regressions in a critical early-pipeline component that has direct impact on build reliability.

---

## Implementation Tips

### For Engineers

1. **Run in isolation**: Test the script against a subset of files first
2. **Compare reports**: Verify that reports are generated as expected
3. **Validate corrections**: Check a sample of corrected files to ensure changes are appropriate
4. **Monitor performance**: For large repositories, track processing time
5. **Set up automation**: Include the script in CI/CD pipelines as an early step

### For AI Assistants

1. **Reference patterns**: When diagnosing issues, reference the specific patterns that detected them
2. **Suggest focused corrections**: Recommend specific changes to fix issues
3. **Provide context**: Explain how an issue might affect downstream processing
4. **Be conservative**: When in doubt, preserve original content
5. **Explain trade-offs**: When suggesting changes, explain the pros and cons

---

This specification provides a comprehensive framework for understanding, implementing, and extending the YAML Prescreening and Triaging System. It balances the need for rigorous validation with practical considerations for automated content management at scale.
