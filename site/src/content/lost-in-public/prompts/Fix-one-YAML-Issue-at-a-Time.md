---
title: 'Fix one YAML Issue at a Time'
authors: Michael Staton
tags:
- YAML-Validation
- Error-Handling
- Build-Scripts
---

We are developing a script at:
site/scripts/tidy-up/attemptToFixKnownErrorsInYAML.cjs
## Objective:
Run a `correctionFunction` chosen by the user from the imported `correctionFunctions` object that diagnoses YAML errors based on regex expressions already defined in the imported `knownErrorCases` object. Run it on the `TARGET_FILES`

Use DRY and Single Source of Truth practices by calling properties or functions that are being imported.  Read everything being imported before you implement. 

Refactor your own functions by using Chain of Draft, and pull out code that could be accomplished through helper functions. 
### Anticipate versatility in application
The user may want to choose one file, or a set of target files by path, or a directory.  
### Anticipate Robust Reporting
Keep track of `fileName` as well as `filePath` .  The user has already identified a `REPORT_FILE`

We will be managing reporting templates in the file `site/scripts/build-scripts/getReportingFormatForBuild.cjs`  Right now the desired report is in the `reportTemplate` constant at the bottom for simplicity, but that won't always be the case.  You've also already written good functionality in the `getReportingFormatForBuild.cjs` file and I am attaching it for contact.  Recreate only what is necessary in this file.  

## Constraints
KEEP USER COMMENTS
1. We can only use the `path` and `fs` built in node modules, we cannot use any modules like glob or grayMatter, or libraries that process YAML or Markdown.  Our files have syntax errors that prevent using those. 
2. Read the User Comments written in the script we are writing.  I tried to write code but I'm not that good yet.  The comments spell out what needs to happen in the code.  
3. We MUST practice a "Single Source of Truth" methodology, which necessitates DRY (Don't Repeat Yourself) practices.  
	1. In this instance, 
		1. do not write code to achieve what has already been solved for in the imported objects `knownErrorCases`, `helperFunctions`, and `correctionFunctions`
4. Do not use generic variables names like `result` or `content` or `entry`. The code becomes impossible to follow.  Instead use variable names like `markdownFilesDir`markdownFile` `isolatedFrontmatterString` `markdownFilesArray` `successMessage` `isolatedPropertyWithError` `valueWithError`
5. Heavily comment your own code with that fancy separator syntax you use. 
6. Load your own command to run the file, and I will press it so you can see any errors. 