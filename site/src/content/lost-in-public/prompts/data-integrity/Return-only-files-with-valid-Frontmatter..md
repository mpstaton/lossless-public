---
title: 'Return only files with valid Frontmatter'
lede: 'Filter and validate markdown files based on frontmatter content'
date_authored_initial_draft: 2025-03-18
date_authored_current_draft: 2025-03-18
date_authored_final_draft: null
date_first_published: null
date_last_updated: null
at_semantic_version: '0.0.0.1'
authors: Michael Staton
status: To-Do
augmented_with: 'Windsurf Cascade on Claude 3.5 Sonnet'
category: Prompts
tags:
- Frontmatter-Validation
- Error-Handling
- File-Processing
- Build-Scripts
---

## Objective: 
Filter out any markdown files that have frontmatter content that could cause errors in another operation. Diagnose each error, and create a report listing all diagnosed errors. Return only files that have valid frontmatter to other functions that will perform operations on markdown files.  

## Constraints
Using only the `fs` and `path` node libraries, 
Process ALL files in a target directory, however nested.  Any error should be non-blocking. 

## User Options
