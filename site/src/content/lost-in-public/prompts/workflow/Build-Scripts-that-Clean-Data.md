---
title: 'Cleaning Build Scripts'
lede: 'Improve build scripts by following strict naming conventions and error handling patterns'
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
- Build-Scripts
- Code-Quality
- Error-Handling
- Variable-Naming
- Best-Practices
---

# Context
We are currently trying create a build script that prepares a directory of Markdown files for publishing using Astro, the JavaScript framework for Static Site Generation. Read the full specification at `site/src/content/specs/Build-Script-Spec.md`

## HARD RULES: 
Never name variables with unmeaningful names. Examples include: a, b, e, error, results, entries, files. 

For instance:
Here is a function with generic variable names:
```javascript
// This function is using generic variable names like results, entries, entry. 
/**
 * Recursive function to find all markdown files in a directory
 * @param {string} dir - Directory to search
 * @returns {string[]} - Array of file paths
 */
function findMarkdownFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      results = results.concat(findMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  
  return results;
}
```



```javascript
// This function now has variable names any user can follow. 
/**
 * Recursive function to find all markdown files in a directory
 * @param {string} dir - Directory to search
 * @returns {string[]} - Array of file paths
 */
function findMarkdownFiles(dir) {
    let markdownFilesArray = [];
    const markdownFilesDir = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const markdownFile of entries) {
      const fullPath = path.join(dir, markdownFile.name);
      
      if (markdownFile.isDirectory()) {
        markdownFilesArray = markdownFilesArray.concat(findMarkdownFiles(fullPath));
      } else if (markdownFile.isFile() && markdownFile.name.endsWith('.md')) {
        markdownFilesArray.push(fullPath);
      }
    }
    
    return markdownFilesArray;
  }
```


## Cause of Issues
Somewhere between the glob module and our own validation code, moving through the processes in sequence within the `masterBuildScriptOrchestrator.cjs` is failing. It fails almost immediately, so the build script is not processing the markdown files. When it is, it is not processing them correctly.  

Therefore, we will first run the all files through a script that only handles YAML Frontmatter as a raw string.  

After, we will eliminate the code in all the other scripts that try to validate or clean syntax within the YAML files.  

Here is an example of the corrupted YAML properties in a markdown file:
```yaml
---
site_uuid: "cef69788-9fe1-41d9-bb95-d9f1bd97e548"
url: ""'https://www.skool.com/'""
tags:
- Training
og_screenshot_url: ""https://og-screenshots-prod.s3.amazonaws.com/1366x768/80/false/5916148b9afbd26e770c8ff3838ad81a0d97176ab6cba9887cb83e17bc3b7d80.jpeg""
og_errors: true
og_last_error: '2025-03-07T10:19:44.201Z'
og_error_message: "HTTP error 401"
last_jina_request: '2025-03-09T06:45:03.552Z'
jina_error: "Error occurred"
og_last_fetch: 2025-03-07T06:11:14.101Z
---
```

# \# Issues at Hand

## Prescreen in Plain Text
In the file `prescreenFilesWithFilesystemRegex.cjs` we want to assure
1. The `masterBuildScriptOrchestrator.cjs` is properly importing all necessary `USER_OPTIONS` from `getUserOptionsForBuild.cjs`_ 2. The `masterBuildScriptOrchestrator.cjs` is forwarding those `USER_OPTIONS` to `prescreenFilesWithFilesystemRegex.cjs` , along with the raw markdown content as `content`, the `filePath` and the `filName`

Now, the `prescreenFilesWithFilesystemRegex.cjs` will iterate through all of the nested Markdown files in the configured `CONTENT_DIR` and perform the following on each individual file as it passes through the script:

## (CONSTRAINTS: 
1. Do not change code in other files, only raise issues you may see in other files.  
2. Try to keep meaningful functionality and syntax already in the file. 
3. Do not use any form of further validation or required properties that will throw an error. 
4. We want all of the Markdown files in the `CONTENT_DIR` to make it through this script. 
	1. Do not require anything, do not enforce validation rules, simply do your best to write any errors in the output files and move through the file set in the `CONTENT_DIR`
5. Use robust commenting. 
6. Try to use variable names that any person can understand and avoid simplified abstractions like ‘e’, 'a', 'results' or 'files’.)

	For each file in the iteration, STEPS:
7. Successfully establish parameters of `content`, `filePath`, `fileName`.  
	2. `filePath` should be the relative path going back to the `site` dir of the project. 
	3. `fileName` should be the name of the Markdown file with the `.md` extension popped off. 
8. Sets up an empty array of `filesWithValidFrontmatter`  that will be filled with the (`content`, `filePath`, `fileName`) parameters for files that have Frontmatter that can be processed as text. 
9. Runs a function that screens the Frontmatter as a string through the function `returnsOnlyFilesWithValidFrontmatter` while filtering out Markdown files with fundamental Frontmatter errors.  
	4. Files must go through a sequence of cases that compares the frontmatter to a series of regular expressions that can isolate likely errors. 
	5. If one of the errors conditions is met, it adds the file to the array `filesWithInvalidFrontmatter` along with the error object. 
		1. It writes as a formatted string to the file at constant `TARGET_INVALID_FRONTMATTER_FILE_PATH`.
	6. If none of the error conditions are met, it adds an object with the file parameters `content`, `filePath`, `fileName` to `filesWithValidParameters`
	7. It returns `filesWithValidParameters`:
```javascript

```

4. Now that we have only `filesWithValidParameters`, we will further process this array.  Iterating through each file, we will:
	1. Establish an array of objects called `CORRUPTION_PATTERNS`  Each corruption pattern object will have the following properties:
		1. `pattern:` Regex to match or meet, 
		2. `messageToReport` String
		3. `preventsOperations` Array of function names
		4. `correctionFunction` String of function name
		5.  `isCritical` Boolean
	2. Declare pattern objects for the following known issues using the following code:
````js


// Patterns that indicate YAML corruption with prevention and correction info
const CORRUPTION_PATTERNS = [


  // Any quote characters surrounding a URL
  // Remove any quotes found on on either side of a URL
  {
    pattern: 
    messageToLog: '',
    preventsOperations: ['assureYAMLPropertiesCorrect.cjs', 'fetchOpenGraphData.cjs', 'trackVideosInRegistry.cjs'],
    correctionFunction: 'removeAnyQuoteCharactersfromEitherOrBothSidesOfURL',
    isCritical: true
  },

  // Block scalar syntax found in property
  // Remove block scalar syntax, and assure one single string
  { 
    pattern: /^([^:\n]+):[ \t]*(>-|>|[|][-]?)[ \t]*(\S.*)$/gm, 
    messageToLog: 'Block scalar syntax found in property',
    preventsOperations: ['assureYAMLPropertiesCorrect.cjs'],
    correctionFunction: 'attemptToFixBlockScalar',
    isCritical: true
  },
   
  // Unquoted error message properties (critical)
  // Surround the error message property with double mark quotes
  {
    pattern: new RegExp(`^(${ERROR_MESSAGE_PROPERTIES.join('|')}):[ \\t]+([^\\n"'][^\\n]*:[^\\n]*)$`, 'm'),
    messageToLog: 'Contains unquoted error message property',
    preventsOperations: ['assureYAMLPropertiesCorrect.cjs'],
    correctionFunction: 'surroundErrorMessagePropertyWithQuotes',
    isCritical: true
  },
      // Unbalanced quotes (critical)
      {
        pattern: 
        messageToLog: 'Contains unbalanced quotes in value',
        preventsOperations: ['assureYAMLPropertiesCorrect.cjs', 'fetchOpenGraphData.cjs'],
        correctionFunction: 'attemptToFixUnbalancedQuotes',
        isCritical: true
      },
  
  // More than one instance of the same key
  // Delete all instances of the key, further scripting will add the key back in with the correct value
  { 
    pattern: 
    messageToLog: 'Duplicate keys in frontmatter',
    preventsOperations: ['assureYAMLPropertiesCorrect.cjs'],
    correctionFunction: 'deleteAllInstancesOfKey',
    isCritical: true
  },
  
  // Improper use of single mark quotes
  // Remove the single mark quotes and add double mark quotes
  { 
    pattern:  
    messageToLog: 'Error message with single mark quotes',
    preventsOperations: ['assureYAMLPropertiesCorrect.cjs'],
    correctionFunction: 'replaceSingleMarkQuotesWithDoubleMarkQuotes',
    isCritical: true
  },

  // Improper character set surrounding error message (like "\"'HTTP error!'\""
  // Remove the improper character set and add double mark quotes
  {
    pattern: 
    messageToLog: 'Error message with improperly formatted character set',
    preventsOperations: ['assureYAMLPropertiesCorrect.cjs'],
    correctionFunction: 'removeImproperCharacterSetThenAddDoubleMarkQuotes',
    isCritical: true
  },
    // URLs broken across multiple lines
  // Replace the broken url with the intended url as one continguous sting with no surrounding quotes
  { 
    pattern: /^([\w-]+):[ \t]*https?:[ \t]*$/m, 
    messageToLog: 'URL split across multiple lines',
    preventsOperations: ['fetchOpenGraphData.cjs'],
    correctionFunction: 'attemptToFixBrokenUrl',
    isCritical: true
  },
  
  // Missing URL property not found within a directory not found in the excludeUrlCheck array
  // No corection, just a message to log.
  {
    pattern: 
    messageToLog: 'Missing URL property needed for OpenGraph',
    preventsOperations: ['fetchOpenGraphData.cjs'],
    correctionFunction: addFileNameToMissingUrlList
    isCritical: false
  },
  
];
```
````
3. Create functions 





```
