---
title: 'Fix one YAML Issue at a Time'
authors: Michael Staton
date_authored_initial_draft: 2025-03-15
date_authored_current_draft: null
tags:
- YAML-Validation
- Error-Handling
- Build-Scripts
---

## Context
We were developing a build script to be run at the `pnpm build` command, taking our code through the Astro Build Process.  Examine but do not act on that file:
`site/scripts/tidy-up/attemptToFixKnownErrorsInYAML.cjs`

That file draws on `getKnownErrorsAndFixes.cjs` where we've worked so hard to cover every case and fix:
`site/scripts/build-scripts/getKnownErrorsAndFixes.cjs`

Yet, the last few times we tried to run every fix at once, we created more problems. 

So, this is a prompt to write a single purpose script, using only filesystem and path modules. 

For now, we will focus on fixing urls that have any number of quote characters, double or single, in any order, BEFORE a url property.  

As a first pass, we will target the entire tooling directory `site/src/content/tooling`, but we will only try to detect the observation this irregularity.  There should be 700+ markdown files in that directory.  Given this operation is non-descrutive because we are only detecting, there is no reason to do a dry run on a small number of files.  

## Refactor Case and Fix, separate by property value types.
This will be part of a step by step refactor in which we will continue to have a 'Single Source of Truth' and enforce DRY principles.

### Refactor Step by Step.

I have already moved a copy of our current file into the archive so we cannot erase progress.
`site/scripts/build-scripts/archive/getKnownErrorsAndFixes.cjs` 
DO NOT TOUCH THIS FILE. It is for reference only. 

We are on Step 1:

1. Preliminary, let's make sure you understand the template for the desired report file:
`site/scripts/tidy-up/tidy-one-property/assure-clean-url-properties/reportQuoteCharactersOfAnyType.cjs`
The template is in a codeblock of markdown with the constant named `reportTemplateForUncleanURLs`

Here it is for clarity:
```javascript
const reportTemplateForUncleanURLs = ```markdown
---
report_title: "${report_title}"
date_generated: "${report_date}"
tags:
- YAML-Validation
- Error-Handling
- Build-Scripts
---

## Summary
Total filePaths loaded for script request: ${report.content.summary.total_files}

## Details


### Files with quote characters found before start of url property:
${report.content.details.quote_characters_at_start_of_value.map(file => `[[${path.basename(file, '.md')}]]`).join('\n')}
   { for each file.url_property_with_detected_quotes_in_front_of_url}   
   ${file.property_key} + ": " + ${file.property_value} + "\n"
   { + "\n\n" }
{ end for each file.url_property_with_detected_quotes_in_front_of_url}

```


You will be writing the report in the newly created:
`site/src/content/changelog--content/reports/2025-03-19_unclean-url-report_01.md`

2. Review the code in the non-archived version of this file. 
`site/scripts/build-scripts/getKnownErrorsAndFixes.cjs`

3. After thorough review, copy the case related to URLs and put it in the newly created 
`site/scripts/tidy-up/tidy-one-property/assure-clean-url-properties/detectUncleanURLs.cjs`

>CONSTRAINT: COPY ALL COMMENT BLOCKS AND IF NEEDED, AUGMENT THE COMMENT BLOCKS USING THE NEW TEMPLATE SYNTAX >IN YOUR `.windsurfrules` file.

>CONSTRAINT: BECAUSE WE HAVE MESSED THIS UP SEVERAL TIMES, AND BECAUSE THERE COULD BE URL PROPERTIES WITH 
>UNEXPECTED KEY NAMES, YOU WILL NEED TO WRITE AMAZING REGEX TO DETECT URLS. I assume the logic would be finding http and then evaluating any characters that come before the "h" -- anything but one space characther " " is an irregularity. 

4. Next, copy the fix function related to URLs and put it in the newly created 
`site/scripts/tidy-up/tidy-one-property/assure-clean-url-properties/fixUncleanURLs.cjs`
CONSTRAINT: COPY ALL COMMENT BLOCKS AND IF NEEDED, AUGMENT THE COMMENT BLOCKS USING THE NEW TEMPLATE SYNTAX IN YOUR `.windsurfrules` file.

5. Next, review the helper functions necessary to execute our functions and copy the necessary functions into the new tidy one at a time utility file:
`site/scripts/tidy-up/tidy-one-property/tidyOneAtaTimeUtils.cjs`
CONSTRAINT: COPY ALL COMMENT BLOCKS AND IF NEEDED, AUGMENT THE COMMENT BLOCKS USING THE NEW TEMPLATE SYNTAX IN YOUR `.windsurfrules` file.

6. Adapt the helper functions, if needed, to focus on one file at a time and one issue at a time. 
CONSTRAINT: REVEAL YOUR REASONING IN CHAT AND IN THE SESSION LOG AND IN THE COMMENT BLOCKS. 

7. Next, walk through the logic of the new file and see what parameters need to be passed in.:
`site/scripts/tidy-up/tidy-one-property/assure-clean-url-properties/detectUncleanURLs.cjs` 

8. Try to be DRY and Single Source of Truth, so import what is needed from:
`site/scripts/build-scripts/getUserOptions.cjs`
Constraint: DO NOT WRITE REDUNDANT CODE to pull in necessary inputs. IF SOMETHING IS MISSING, instead raise the issue in chat.  

9. Next, adapt the code, if necessary, to crawl through each file and **scan one file at a time** rather than trying to import all files at once, I don't care if the process takes way longer. Use a path array if that makes sesne. Do not pseudo-glob. Do not proceed to the next file unless the current file is completed and the evaluation is already passed to the report (or the in-memory operations to create the report.)

10. Review the completed report and share your analysis:
`site/src/content/changelog--content/reports/2025-03-19_unclean-url-report_01.md`




We will work together on the remaining operations below. I don't know anything about testing and validation.  

====== EVERYTHING BELOW THIS LINE IS FOR LATER===================
We will try to fix:
- Scan for and attempt to remove quote characters of any kind in any sequence from the start and the finish of a url property. 
- Check the document after fixing by scanning it again.  All URLs in any document should be bare strings with no quotations around them and NO BLOCK SCALAR SYNTAX.  (We already removed most of that with anotherscript, but the way we ended up with it was when we wrote a script to remove the quote characters, the AI code assistant inserted block scalar syntax for multiple lines.  That is incorrect, it needs to be one continguous string with no interruptions.)
====== for later





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