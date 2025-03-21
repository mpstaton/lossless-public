---
title: 'Meticulous Constraints for Every Prompt'
lede: 'Essential guidelines and constraints for prompt engineering and code generation'
date: 2025-03-16
date_authored_initial_draft: 2025-03-16
date_authored_current_draft: 2025-03-16
date_authored_final_draft: null
date_first_published: null
date_last_updated: null
at_semantic_version: '0.0.0.1'
authors: Michael Staton
status: To-Do
augmented_with: 'Windsurf Cascade on Claude 3.5 Sonnet'
category: Prompts
tags:
- Prompt-Engineering
- Code-Standards
- Best-Practices
- Error-Handling
---
## Before starting:

Do not begin until you have fully read this file, and all other files that are mentioned in this file. 

The objective and instructions for the task are prompted / written in the comments in the file I will assign in the chat box. 

I will add other files to the context window, but I am specifying their paths below. 

### Always handle errors gracefully, observe them, add them to a report.  
No need for validations, just add to a report and let it slide. 

### ALWAYS try to use DRY (Don't Repeat Yourself) practices
The user (me) will point you to other code either in this constraints file, or in the prompt file, or in the chat.  If there is exported functionality, use it. Reason enough to figure out how to import the functionality. Creating all kinds of spaghetti code all over the place is bad practice. And, we are already doing it a lot because we are learning how to work together and you are really fast and generating tons of code.  

### ALWAYS have a SINGLE SOURCE OF TRUTH
Similar to above, the reason to import functionality is that we can have a single source of truth.  We will be using the same functionality in multiple places, and we may need to change the functionality in the future.  Sometimes, for critical reasons. 

My team should only have to track down true functionality in one place, change it, and problem solved. When you replicate functionality in mutliple places, it means when we think the problem is fixed we will still have a problem. 

So, onto your pre-reading.

## Pre-Reading

Read the code VERY CAREFULLY in the following files:

- `site/scripts/build-scripts/getKnownErrorsAndFixes.cjs`
- `site/scripts/build-scripts/getReportingFormatForBuild.cjs`
- `site/scripts/build-scripts/getUserOptions.cjs`

Use functions from the files above by importing them with the CommonJS `require` syntax.
EVERYWHERE possible, to the MAXIMUM EXTENT POSSIBLE, use the functions from the files above. 

### Anticipate versatility in application
The functions may be called from other scripts. So, they could be called on one file, a defined set of files, or all files. Assume it's an array that must be iterated through, but can receive an array of one.  

### Anticipate Robust Reporting
Keep track of `fileName` as well as `filePath` .  We will be managing reporting templates in the file `site/scripts/build-scripts/getReportingFormatForBuild.cjs`

### Use the following comment syntax to denote sections:
// =============================================================
// Section Name
// Comments or instructions set by user. 
// ===============================

The bottom line should be half the width of the top line. This is to make it easier to skim.  

If we put comments below a section about the section above it, we reverse the pattern. 

// =============================
// Section Name
// =============================================================


You should set up the section separator syntax using the style above.  

NEVER CHANGE ANY COMMENTS THAT A USER SETS. 

## Constraints

1. KEEP USER COMMENTS
2. NEVER DELETE USER COMMENTS
3. DO NOT DELETE USER OPTIONS SET BY THE USER
4. NEVER DELETE USER OPTIONS SET BY THE USER
5. TAKE YOUR TIME AND FOLLOW INSTRUCTIONS COMPLETELY
6. GO STEP BY STEP RATHER THAN WRITE ALL THE CODE AT ONCE. 
7. We can only use the `path` and `fs` built in node modules, we cannot use any modules or libraries that process YAML or Markdown.  Our files have syntax errors that prevent using those. 
8. We MUST practice a "Single Source of Truth" methodology, which necessitates DRY (Don't Repeat Yourself) practices.  
	1. In this instance, 
		1. do not write code to pull the frontmatter in each function. Instead, write a helper function that pulls the frontmatter. 
		2. do not write regular expressions to catch an error. Instead, use the knownErrorCases object and call their detectError property value, which already contains the proper regex. For instance. `knownErrorCases.unquotedErrorMessageProperty.detectError`.
9. Do not use generic variables names like `result` or `content` or `entry`. The code becomes impossible to follow.  Instead use variable names like `markdownFilesDir` `markdownFile` `isolatedFrontmatterString` `markdownFilesArray` `successMessage` `isolatedPropertyWithError` `valueWithError`
10. Heavily comment your own code with that fancy separator syntax you use. 
11. Make suggestions to refactor by suggesting changes we can make in other files that will help keep us DRY and maintain a SINGLE SOURCE OF TRUTH.