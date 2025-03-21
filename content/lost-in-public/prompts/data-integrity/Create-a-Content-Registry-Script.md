---
title: 'Create a Content Registry Script'
lede: 'Build a registry system for tracking and managing Markdown files'
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
- Content-Registry
- File-Management
- Data-Tracking
- UUID-Management
---

# Create a Content Registry for Markdown Files

## Constraints:
All data in the registry must be unique. Any functions or methods must be non-destructive, unless very specifically set by the user.  This means it all functions need to check the registry JSON first to see what is there, and compare it to the data that would be created by the new operation.  If the data is already there, do not write it again.  If the data is not there, write it.  

I have written my standard constraints in the following file.  Read them first. 
`site/src/content/lost-in-public/prompting/Meticulous-Constraints-for-Every-Prompt.md`

FILES may or may not have frontmatter, may or may not have the property we are looking for.  Do not have the script stop, do not have it throw errors.  We simply add the observation to the report created at the end of the script.  

## Goal
Before committing to a database, while our content is still relatively small in scope and the data model will likely evolve quickly, I want to use a simple JSON file to store metadata about each markdown file in our content directory.

### The Data Model
The desired data model is in the following file:
`site/src/content/data/markdown-content-registry-model.json`

Notice it relies on a uuid as the primary key.  This uuid is stored in the frontmatter of each markdown file in the `site_uuid` property. Yet, some files probably still do not have a `site_uuid` property or it's empty.  

### A clear history with timestamps for future functionality.
The key aspect to this is that we need to track the history of each markdown file in the registry.  This will enable all kinds of functionality too long to outline here. 

### First Step, Next Step

The first step is to write the script to perform an initial run, which has some nuances because we need to co-opt some timestamp properties from the frontmatter to make it part of history. 

The second step will be to integrate it into the build process, which will be run any time changes of substance are made to the site. We are using pnpm, so the script will be triggered by the `build` script in the `package.json` file.  

The vision of the build process can be analyzed in the following file that unfortunately is not ready yet, as the processes that it triggers is in a few other scripts that at this point cause corruptions in YAML across the content or when starting the server. 
`site/scripts/build-scripts/masterBuildScriptOrchestrator.cjs`

I want you to reason about the next steps because even though our first step is to solve the immediate problem, please consider that this will be a functionality that will be called as part of an integrated, step by step build process.

### Test Cases First

We will need to run the script on a subdirectory before we run it on the whole content directory. So, put the TARGET_DIR = `site/src/content/tooling` in the user options up top.  The user can change this, enver change it yourself.  

### User Options Up Top
Put any and all user options at the top of the file.  

### Report

At the end of the script, we will need to create a report of any issues that were found.  This will be a JSON file that will be written to the following path: `site/scripts/data-or-content-generation/fixes-needed/errors-processing`

Look at example reports:
- `site/scripts/data-or-content-generation/fixes-needed/errors-processing/2023-03-16_Removed-Spaces-Newline-Expressions-from-Strings_01.md`
- `site/scripts/data-or-content-generation/fixes-needed/errors-processing/2025-03-16_Removed-Quotes-from-URL-Properties__01.md`

USE THE REPORT TEMPLATES AND HELPER UTILITY FUNCTIONS IN THE REPORTS SCRIPT.  
`site/scripts/build-scripts/getReportingFormatForBuild.cjs`
We have already done much of this work. Be DRY.  
If you can't use them, model it after their patterns.  We will have to refactor and then put them in there eventually. 

# Functionality Pipeline

1. Import the 'fs' and 'path' modules. We cannot use glob or greyMatter. 
2. Import function `createUUIDinFrontmatterIfNone` from `site/scripts/build-scripts/getKnownErrorsAndFixes.cjs` and any other helper functions needed from that file. 
3. Create a User Options setting specific to this file with the TARGET_DIR path, and TARGET_OUTPUT_FILE path which is now `site/src/content/data/markdown-content-registry.json`
4. Add an array of propertyNames to look for in the frontmatter, and the let the user define the JSON property names for the properties in the frontmatter. You may start with what is available in the data model at `site/src/content/data/markdown-content-registry-model.json`
5. Try to use the `processMarkdownFiles` function from `site/scripts/build-scripts/getKnownErrorsAndFixes.cjs` helperFunctions object. If you can't, use it as an example. 
6. First calls the `createUUIDinFrontmatterIfNone` function for each file being processed. 
7. Then, crawl through the frontmatter looking for the frontmatter properties set by the user in the user options, and follow the logic set in those user options. 
8. For now, we need to take the timestamp properties from the frontmatter and add them to the history array in the registry, but change the label that goes with it.  So, instead of `og_last_fetch` it will be `og_fetch_01` and instead of `jina_first_request` it will be `jina_request_01`
9. Of course, we will need to take the newly created `site_uuid` and make it the primary key. 
10. Take the current relative path of the file and add it to the `effectivePaths` array in the registry. 
11. For most other urls that are present, we simply take it from snake_case to camelCase. In instances where the "Url" is not present, just add it.  There may be a few other instances I can't think of now, but that's what the user options section is for. Any instance of just 'url:' should become `siteUrl`


Okay, enough of that. Just set up the data model information you need in the User Options.  





# Desintation of the Script

Now that this document and all mentioned documents have been read, write the script in the file at the following path:
`site/scripts/build-scripts/trackMarkdownFilesInRegistry.cjs`
