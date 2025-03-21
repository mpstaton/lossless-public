---
title: "Comprehensive Rules to tame Code Generator LLMs"
date_authored_initial_draft: 2025-03-17
date_authored_final_draft: 2025-03-17
date_first_published: 2025-03-17
at_semantic_version: "0.0.0.1"
authors: 
- Michael Staton
with_writing_assistant: "Windsurf on Claude 3.7 Sonnet"
category: "Code-Generators"
tags: 
- Workspace-Configuration
- Workflow-Management 
- Client-Updates
- Platform-Mechanisms
---
# Stack, Libraries, Dependencies

#### Preliminaries
- For particular version of a library, use the version specified in package.json. 
- Do not write code that creates a new dependency, instead suggest it in the chat. 

#### Project Setup
- This project is in the Astro framework. 
- Default to TypeScript. 
- We are using Node.js
- We are using pnpm for package management.
- pnpm also runs the build, preview, dev, and other astro commands. 



***
# Important Directories for Context

`site` is the default directory of all our work, the files in the root directory are for containers and ephemeral enviroments. `site` is a self-contained Astro project. 

`src/content/lost-in-public/prompts` is the directory containing any prompts I am creating for our work.  The file `src/content/lost-in-public/prompts/Meticulous-Constraints-for-Every-Prompt.md` is a context file that should always be accompanied with any Markdown file prompt given. 

`src/content/specs` is the desintation for any Technical Specifications. I will be asking you to write them retrospectively as a way to memorialize parts of our work. 

`src/content/changelog--code` is the destination for any Changelog entries.

`src/content/tooling` is the default directory when working with "content" Markdown files. The Markdown files in this directory have important metadata in the frontmatter. Do not write any code that will alter frontmatter without explicit permission of the user. 

`src/content/data` is the directory for any data files that are relevant to our work with content. The default data type is JSON. We have not moved to any database or data store other than this directory and frontmatter in markdown files. 

`site/scripts` is the default directory when working with scripts. It is purposefully outside of the src directory. 

***

# Code Style
## ABSOLUTE CONSTRAINTS

### Aggressive, Comprehensive, Continuous Commenting in Clear Syntax Patterns

We will use an evolving, adaptive, but consistent comment style and syntax clarified in the 

- **Continuously comment** code and explain clearly and in detail 
   1. what is in the section or block of code, 
   2. what actions any functions perform, the parameters and arguments it takes, and 
   3. what it returns. 

- Simultaneously **maintain redundant, parallel, mirroring sets of comments for functions**: 
   1. where a function is defined (if it is in another file, say so.  If it is imported at the top of the file, repeat the logic in lay terms in comments directly above the function),
   2. the list of ALL places the function is called, accompanied by the parameters and arguments passed to the function from the place it is called. 

- **Continuously update** the comment blocks, and **simultaneously update the comment blocks in two places**: 
	1. where the function is defined ,and 
	2. where the function is called. 
	If the function is called in more than one places, that's good -- reveal the whole list of them in the comment blocks. Large comment blocks are expected and helpful. 

- Strict adherence to **DRY (Don't Repeat Yourself) principles** and a strict **"Single Source of Truth"**.

   - Continuously refactor your own code to remove duplication. Create helper functions and utility functions in the appropriate directory. 
      - Always remember to comment the new helper functions and utility functions.
      - Always remember to comment the refactored code with logic and the directory and file locations of helper and utility functions. 

   - Do not name files or functions mundane, meaningless, abstract, or generic names. 
      - We do not want naming collisions. 
      - We want our code to be readable by a human that has never seen this code before. 
      - We want our code, as it becomes more complex, to be easy to navigate and to develop strong context for AI code assistants.

   - The file or function name must say what the file or function does. It is often best to also include what kind of data the file or function handles, or what kind of action it performs. 
   > ![Examples] Examples of long but clear naming: 
   > 1. `generateMarkdownFile` is better than `generateFile`.
   > 2. `isolateFrontmatterAsStringReturnFilteredProperty` is better than `processFrontmatter`.
   > 3. `writeOutputToTargetDirUsingReportTemplate` is better than `writeOutput`.

   - Really long single files are discouraged. Long files should be temporary and then refactored. 
      - If you, the Code Assitant, believe we should move code across files to a single file to make the context more manageable for your working memory: 
      1. Ask to create a temp file and consolidate the code or functionality of the code into the temp file. 
      2. If the user allows, begin a Temp file with the '--temp' suffix. You may create this file on your own initative, but if there is confusion on where to put the temp file ask the user to create the temp file. If you create a temp file, share the relative path of the temp file in chat.  
      - As you pull in functionality or code blocks from other files:
         - DO NOT CHANGE THE SOURCE FILE OF THE FUNCTIONALITY. 
         - **As you identify** code, functionality, or logic to be pulled in to the '--temp' file,
            1. FIRST, parallel comment in both locations, the source and the destination, specifically AT LEAST the relative path, file name, code section or block names, and function names. If it's from a long file, you may even want to include the line range (start and end line numbers).
            2. THEN, pull in the code or functionality. 



- Strict default: **keep any assigned directories and files in context in the context window** until explicitly told to forget. 
   - I will ask "What is in your current context?" to check what you are using in your current context. Respond listing all directories and files in immediate context.
   - If you are struggling to work through logic because you lack relavant context, reaveal your current context in chat and ask the user "Is this all the relevant context?"
   - I will say something like "Let's start on a new issue." to tell you to forget the current context. 
   - If you think we have moved on to a new issue, and your current context memory is no longer needed and is causing confusing, go ahead and reveal your current context and ask if you may forget it. 


### For Markdown Content: Minimal Validation, Preprocessing to Report or Fix Errors, Graceful Error Handling, Script through All Target Files, Render or Process as much as Possible. No critical failures. 

**Minimum Validation** as we will have thousands of Markdown files in our content directories. Many of them will have missing properties, null values, corrupted syntax, inconsistent value formats, etc. 

   > NEVER INTRODUCE HARD VALIDATION FOR FRONTMATTER. 

Instead, we will both maintain and iterate on our current scripts in `site/scripts`  
   - Build scripts to run prior to or during the `pnpm build` process. `site/scripts/build-scripts` 
   - Tidy up scripts to run as needed on specific issues. `site/scripts/tidy-up`
   - Pre-function call utility/helper functions that are in production that prevent problematic fontmatter handling during the user experience. `site/src/utils/` `preventFrontmatterIrregularitiesFromCausingErrors.ts`

Why do all this?  Because it will be impossible to have prodigeous content generation and also have a working, error free user experience with hard data validation, type validation, or frontmatter validation. We have a team that is creating content with AI. They are creaties that lack attention to detail. Frontmatter will be inconsistent, we have to deal with it. 

When we write scripts, we must never use glob or grey-matter or libraries that process frontmatter in Markdown files.  It causes too many errors. We must handle frontmatter using .cjs Common JS and use only the built in filesystem and path modules in Node.  

So build scripts, tidy scripts, graceful error handling, and helper/utility functions will follow the PREVENT critical errors and app failures by introducing the following pipeline:

1. Pre-process markdown Frontmatter to _detect any abnormalities that may prevent proper processing or rendering_ based on the operation about to initiate. 

2. Use async, non-blocking actions to create two arrays: `filteredInMarkdownFiles` and `filteredOutMarkdownFiles.` and then:
   1. Run a single array of `markdownFilesToBeFiltered`
   2. Process `markdownFilesToBeFiltered` through the `targetFilterPipeline`
   3. Return `filteredInMarkdownFiles` to the anticipating function or operation, and
   4. Pass the `filteredOutMarkdownFiles` to a handler designed to 
      1. Diagnose any frontmatter abnormalities, 
      2. Use async, non-blocking actions to create two arrays: `fixedMarkdownFiles` and `unfixedMarkdownFiles`
      3. Attempt to fix them, and 
         1. If fixed, add the files with success messages into `fixedMarkdownFiles`
         2. If not fixed or receiving errors, add the files with error messages into the `unfixedMarkdownFiles` array. 
         3. Return the `fixedMarkdownFiles` to the original function or operation, if relevant. 
   5. Generate a report with the naming convention `${YYYY-DD-MM_report-[issueIndex].md` that details that summarizes the results of the whole pipeline:
      1. ## Filtered In: `filteredInMarkdownFiles.length + "/" + markdownFilesToBeFiltered.length+ "\n"` 
      2. ### Files Filtered In: `"\n" + filteredInMarkdownFiles.map(f => ("[[" + f.pageName + "]], ") + "\n\n\n"`

      3. ## Filtered Out: `filteredOutMarkdownFiles.length + "/" + markdownFilesToBeFiltered.length+ "\n"` 
      4. ### Files Filtered Out: `"\n" + filteredOutMarkdownFiles.map(f => ("[[" + f.pageName + "]], ") + "\n\n\n"`

      5. ## Fixed: `fixedMarkdownFiles.length + "/" + markdownFilesToBeFiltered.length+ "\n"` 
      6. ### Files Fixed: `"\n" + fixedMarkdownFiles.map(f => ("[[" + f.pageName + "]], ") + "\n\n\n"`

      7. ## Unfixed: `unfixedMarkdownFiles.length + "/" + markdownFilesToBeFiltered.length+ "\n"` 
      8. ### Files Unfixed: `"\n" + unfixedMarkdownFiles.map(f => ("[[" + f.pageName + "]], ") + "\n\n\n"` 
   6. Add report to the specified directory, or default to `site/src/content/changelog--content/reports` 


## ABSOLUTE BEHAVIOR ETIQUETTE
- Do not perform "overzealous", rapid output, radical change initiatives without discussing them first. 

- All code shared in reasoning should be shared in the chat in a code box with the fileName and line range. 

- When you are diagnosing an issue of figuring out the logic of our code, please put code blocks in the chat and explain your logic and reasoning.  Coach me. 

- When running scripts, load the command to run the script in our chat dialog by do not run it yourself. You are able to read the terminal output in full and quickly.  If I run it, I have to highlight and copy/send the output and it's inconvenient. 

- Continuously write a log of our dialog data into the `site/src/content/lost-in-public/sessions` directory. Use the current date and time in the filename with 'YYYY-MM-DD_{issueIndex}.md' format where {issueIndex} is the count of the current coherent task at hand. I will tell you when we are starting a new coherent task by saying "Let's start on a new issue." 

# Behavior Etiquette
- Take things step by step. Break things down into smaller tasks, inspired by "dynamic programming" techniques. Explain your steps to me, I have much to learn from you.  

- If I have asked you to perform a specific task, you do not need to ask multiple times if you can proceed with that specific task.  

### Coding Guidelines

- Declare types inline. Aggregate a list of the types information in the comment sections

## Comment Syntax and style. 

1. This is a **section opener**. 
```javascript
/* section open ==============================================================
|
| ??-- About: Section Name
| ??-- Type: User Options
|
| ??-- Includes: 
| //---- List  
| //---- of   
| //--

====================================== */
```
2. This is a **section closer**. 

```javascript
/* ========================================
??-- Affects: 
//----   list of 
//----   code blocks 
//----   that this section affects
// 
// Close: Section Name
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
```

3. This is **function opener** template.
```javascript
/* function: -------------------------------------------------->

??-- Purpose
   //-- Lines describing desired functionality
   --- continued from previous line.
-->

??-- Logic
   //-- Explain how this function would be called
   ---- with arguments and arguments
   ---- 1. with steps and steps
-->
----------------------------------------*/
```

An example:
```javascript
/* export function: -------------------------------------------------->

??-- Purpose:
   //-- Turn all backlink syntax into relative path hrefs 
   ---- in the Markdown file or Markdown files passed through parameters.
-->

??-- Logic:
   //-- Called form page rendering from rendered Astro components. 
   ---- 1. Receives an array of paths to Markdown files or one Markdown file. 
   ---- 2. Creates an empty array `backlinksFoundInMarkdownContent`.
   ---- 3. Adds to array when regex matches backlink syntax '[[${Page Name]]' 
   ---- 4. Scans an index of pageName keys to match the string inside the square brackets. 
   ---- 5. Replaces the backlink syntax with the relative path href. 
-->
----------------------------------------*/
```

4. This is **function closer**.
/* returns: ----------------------------->
      - object or value explanation
      - object or value explanation
   to:
      list of places where this function is called. 
      - functionName, fileName.ts
end function --------------------------------------------------*/

## Frontmatter Preprocessing
We have a team that is creating content with AI.  Frontmatter gets corrupted. 

When we write scripts, we must never use glob or grey-matter or libraries that process frontmatter in Markdown files.  It causes too many errors. 

In scripting, we are attempting to fix issues in frontmatter using .cjs Common JS and only the filesystem and path modules in Node.  

# Requests and their appropriate Response Conventions:

The following table has patterns of user requests in chat and expected patterns of responses. 
