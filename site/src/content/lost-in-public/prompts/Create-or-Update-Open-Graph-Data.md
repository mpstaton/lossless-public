---
title: 'Create or Update Open Graph Data'
authors: Michael Staton
tags:
- Open-Graph
- Data-Management
- Build-Scripts
---

# Goal:

To start a build orchestrator from scrach as simple as possible, with no overly zealous validations, error corrections, or even error handlig.  

# Before we proceed, read the Constraints instructions. 
`site/src/content/lost-in-public/prompting/Meticulous-Constraints-for-Every-Prompt.md`

Now, we are working from the `site/scripts/build-scripts/simpleBuildOrchestrator.cjs` file.  

The goal is to successfully process files that meet a certain condition set by the user with the `site/scripts/build-scripts/fetchOpenGraphData.cjs` file. 

We will also need to write a utility function that should be abstracted and versatile and handle exceptions and errors gracefully. We will write that in the `site/scripts/build-scripts/utils/processFilesForTargetScript.cjs` file.

The `simpleBuildOrchestrator.cjs` file should be the centerpiece. We stay DRY (Don't Repeat Yourself) and use the functions from the files above. We keep a single source of truth.  

1. From the `simpleBuildOrchestrator.cjs` file, Create a USER_OPTIONS object with 
   a `TARGET_DIR` property set to the directory containing the markdown files.
   a `REPORT_FILE` property set to the file where the report will be written.
   a `DAYS_SINCE_LAST_API_CALL` property set to the number of days since the last API call.
2. From the `utils/processFilesForTargetScript.cjs` file, Create a dead simple but versatile `loadFiles` function that will gather all the markdown files recursively  in the `TARGET_DIR` into an array of paths.  
   We cannot use glob or grayMatter or any other libraries that process YAML or Markdown. We must use plain text or strings. 
   1. The `loadFiles` function must be able to receive the `TARGET_DIR` property from the `USER_OPTIONS` object.
3. This `targetMarkdownFilesArray` will then move to a `filterFilesArrayByCondition` function that will filter the files based on the `DAYS_SINCE_LAST_API_CALL` property from the `USER_OPTIONS` object, which must be passed as a parameter from the `USER_OPTIONS` object in the `simpleBuildOrchestrator.cjs` file.
4. The conditions for running the `fetchOpenGraphData` function are: If no og_last_fetch is present in frontmatter, or if the og_last_fetch property has no value, or if it has been longer than 30 days since the last API call, then run the imported `fetchOpenGraphData` function. These should be set in the `RUN_CONDITIONS` property of the `USER_OPTIONS` object in the `simpleBuildOrchestrator.cjs` file.
5. You may review the `fetchOpenGraphData` function in the `utils/fetchOpenGraphData.cjs` file and make suggestions for dramatic refactoring.  The last attempts at running `pnpm build` ended up corrupting a whole bunch of files.  
6. The `processFilesForTargetScript` will need to send the proper parameters to the `fetchOpenGraphData` function.  Diagnose what those may be.  
7. The `fetchOpenGraphData` function should return a promise that resolves to an object that is already defined in the `fetchOpenGraphData.cjs` file.  
8. Already in the `fetchOpenGraphData.cjs` file should be how to handle API call errors, or error response objects.  
9. The missing piece in `fetchOpenGraphData.cjs` should be 
   1. How to do reporting consistent with our `getReportingFormatForBuild.cjs` file and use the `singleOperationReportTemplate` template.  
   2. How to create a record in the JSON document related to the success or error from the API Call into the `site/src/content/data/markdown-content-registry.json` file in.  It should add to the metadata section of the json object connected to the file by the `site_uuid` proeprty. 
