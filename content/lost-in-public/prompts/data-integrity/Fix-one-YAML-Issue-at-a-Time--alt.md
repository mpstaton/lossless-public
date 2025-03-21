---
title: 'Fix one YAML Issue at a Time'
lede: 'Systematic approach to cleaning URL properties in YAML frontmatter'
date_authored_initial_draft: 2025-03-19
date_authored_current_draft: 2025-03-19
authors: Michael Staton
status: Draft
category: Build-Scripts
tags:
- YAML-Validation
- Error-Handling
- Build-Scripts
- URL-Processing
---

# Executive Summary

## Purpose
Create a focused, single-purpose script to detect and clean URL properties in YAML frontmatter, addressing one specific issue: quote characters before URLs.

## Scope
- Target Directory: `site/src/content/tooling` (~700 markdown files)
- Operation: Detection only (non-destructive)
- Focus: URL properties with quote characters before the "h" character in "http"

# Technical Details

## URL Property Definition
A URL property is any YAML frontmatter property that:
1. Contains 'http://' or 'https://'
2. The url SHOULD be a bare string (no quotes, no block scalar syntax), but we are looking for looking for quote character abnormalities in this pass, and only quotes BEFORE the "h"
3. Must be a single contiguous string without interruptions

## Detection Pattern
```javascript
// Detect any non-space character before http(s)
/^([^:\n]+):\s*([^\s].*?)(https?:\/\/.*?)$/
```

## Report Structure
```javascript
const report_data = {
    content: {
        summary: {
            total_files: 0,
            files_with_issues: 0
        },
        details: {
            yaml_lines_with_urls_that_have_quote_characters_at_start_of_value: []
        }
    }
}
```

# Implementation Steps

1. Report Template Setup
   - Location: `site/scripts/tidy-up/tidy-one-property/assure-clean-url-properties/reportQuoteCharactersOfAnyType.cjs`
   - Output: `site/src/content/changelog--content/reports/2025-03-19_unclean-url-report_01.md`
   - Format: As specified in reportTemplateForUncleanURLs, though the user may have typos or non-working javascript -- though it should convey the logic. 

2. URL Detection Implementation
   - File: `site/scripts/tidy-up/tidy-one-property/assure-clean-url-properties/detectUncleanURLs.cjs`
   - Source: Extract from `getKnownErrorsAndFixes.cjs`
   - Key Focus: Comprehensive URL pattern detection

3. Helper Function Setup
   - File: `site/scripts/tidy-up/tidy-one-property/tidyOneAtaTimeUtils.cjs`
   - Process: One file at a time
   - Memory: Report data accumulation per file

4. Configuration Integration
   - Source: `site/scripts/build-scripts/getUserOptions.cjs`
   - Principle: DRY and Single Source of Truth
   - Note: No redundant code creation

# Processing Requirements

1. File Processing
   - Process one file at a time
   - Complete evaluation before moving to next file
   - Immediate report data accumulation
   - No glob patterns or bulk processing

2. URL Property Handling
   - Check for any non-space characters before 'http'
   - Identify all quote variations (single, double, nested)
   - Flag block scalar syntax if present

3. Report Generation
   - Accumulate data during processing
   - Generate final report in markdown
   - Include file paths and specific issues
   - Provide summary statistics

# Future Considerations

1. Validation Phase (To Be Developed)
   - Verification of cleaned URLs
   - Format compliance checking
   - Link validity testing

2. Extended Functionality (Future)
   - Block scalar syntax removal
   - Quote character cleanup
   - URL validation

# Notes
- This is a detection-only phase
- No file modifications in this pass
- Focus on accurate detection and reporting
