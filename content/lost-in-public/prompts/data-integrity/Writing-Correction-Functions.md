---
title: 'Writing Correction Functions'
lede: 'Create functions to fix known YAML errors in content files'
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
- Error-Correction
- YAML-Validation
- Function-Development
- Build-Scripts
---

## Objective:

Read the objects in the `knownErrorCases` object in this file. Each of these is a known error, the regex on how to find it, 

Use DRY and Single Source of Truth practices by calling properties from within the `knownErrorCases` object. 

Write functions in the `correctionFunctions` object that correspond with the `knownErrorCases` from which they are associated. Make sure the function achieves the goals set forth in the comments already above the function name.  Do not remove those user comments.  

Refactor your own functions by using Chain of Draft, and pull out code that could be accomplished through helper functions.  

### Anticipate versatility in application
The functions may be called from other scripts. So, they could be called on one file, a defined set of files, or all files. Assume it's an array that must be iterated through, but can receive an array of one.  
### Anticipate Robust Reporting
Keep track of `fileName` as well as `filePath` .  We will be managing reporting templates in the file `site/scripts/build-scripts/getReportingFormatForBuild.cjs`

## Constraints
KEEP USER COMMENTS
1. We can only use the `path` and `fs` built in node modules, we cannot use any modules or libraries that process YAML or Markdown.  Our files have syntax errors that prevent using those. 
2. We MUST practice a "Single Source of Truth" methodology, which necessitates DRY (Don't Repeat Yourself) practices.  
	1. In this instance, 
		1. do not write code to pull the frontmatter in each function. Instead, write a helper function that pulls the frontmatter. 
		2. do not write regular expressions to catch an error. Instead, use the knownErrorCases object and call their detectError property value, which already contains the proper regex. For instance. `knownErrorCases.unquotedErrorMessageProperty.detectError`.
3. Do not use generic variables names like `result` or `content` or `entry`. The code becomes impossible to follow.  Instead use variable names like `markdownFilesDir`markdownFile` `isolatedFrontmatterString` `markdownFilesArray` `successMessage` `isolatedPropertyWithError` `valueWithError`
4. Heavily comment your own code with that fancy separator syntax you use.  
