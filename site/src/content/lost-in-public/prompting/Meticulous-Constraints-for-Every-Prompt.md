## Before starting:

Do not begin until you have fully read this file, and all other files that are mentioned in this file. 

The objective and instructions for the task are prompted / written in the comments in the file I will assign in the chat box. 

I will add other files to the context window, but I am specifying their paths below. 

We will use a similar pattern to a file that is working correctly:
`site/scripts/tidy-up/tidy-one-property/convertMultiLineStringsToSingleLineStrings.cjs`

Read the code VERY CAREFULLY in the following files:

- `site/scripts/build-scripts/getKnownErrorsAndFixes.cjs`
- `site/scripts/build-scripts/getReportingFormatForBuild.cjs`

Use functions from the files above by importing them with the CommonJS `require` syntax.
EVERYWHERE possible, to the MAXIMUM EXTENT POSSIBLE, use the functions from the files above. 

### Anticipate versatility in application
The functions may be called from other scripts. So, they could be called on one file, a defined set of files, or all files. Assume it's an array that must be iterated through, but can receive an array of one.  

### Anticipate Robust Reporting
Keep track of `fileName` as well as `filePath` .  We will be managing reporting templates in the file `site/scripts/build-scripts/getReportingFormatForBuild.cjs`

## Constraints

1. KEEP USER COMMENTS
2. We can only use the `path` and `fs` built in node modules, we cannot use any modules or libraries that process YAML or Markdown.  Our files have syntax errors that prevent using those. 
2. We MUST practice a "Single Source of Truth" methodology, which necessitates DRY (Don't Repeat Yourself) practices.  
	1. In this instance, 
		1. do not write code to pull the frontmatter in each function. Instead, write a helper function that pulls the frontmatter. 
		2. do not write regular expressions to catch an error. Instead, use the knownErrorCases object and call their detectError property value, which already contains the proper regex. For instance. `knownErrorCases.unquotedErrorMessageProperty.detectError`.
3. Do not use generic variables names like `result` or `content` or `entry`. The code becomes impossible to follow.  Instead use variable names like `markdownFilesDir`markdownFile` `isolatedFrontmatterString` `markdownFilesArray` `successMessage` `isolatedPropertyWithError` `valueWithError`
4. Heavily comment your own code with that fancy separator syntax you use. 