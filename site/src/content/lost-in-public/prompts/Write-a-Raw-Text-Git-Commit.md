---
title: 'Write a meaningful but concise git commit.'
lede: 'Make Git and GitHub work better for your team by leveraging LLM Code Assistants.'
date_authored_initial_draft: 2025-03-09
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
- Prompt-Engineering
- Code-Generators
- Code-Assistants
- Version-Control
- Context-Windows
- Transparent-Organizations
- State-of-The-Art-Practices
- Continuous-Integration
- Collaboration-Tooling
- Collaborative-Workflow
---

# Goals
Create a thorough yet succinct git commit message that will be used in a git commit. 

## Constraints:
- only write content for changes that are within the **'Changes to cover in this Git Commit'** based on the user selection.
- follow the template in the **'Template Syntax'**
- ALWAYS put the text content you generate within your text box interface that has a copy button. 
- ONLY cue up a command line command git commit if the user as selected **'Every change since the last commit'**, because otherwise the User needs to control the 'git add' to select the files to be committed. They will likely be using GitHub Desktop for an easier to understand visual interface. 
- Content files are always in the `site/src/content` directory per Astro conventions. 
- Unless another directory is specified, the directory with the most frequent content changes is `site/src/content/tooling`. 
- The `site/src/content/tooling` directory is really one collection. So, by default we will make one commit to summarize content changes in that directory. 
- OUTSIDE of the `tooling` subdirectory, when changes have been made in more than one directory please force the user to make multiple commits, one per directory. If the user has chosen **'Every change since the last commit'** then you will need to generate multiple text boxes for multiple commit messages, one per directory. 
- When mentioning a directory in a git commit message, use the folowing syntax: `site/src/<directory-name>/<directory-name>`

***

## The User will give direction through the **'Option Sets'** in the callout boxes below:
1. The user may choose one of the options in the 'Changes to cover in this Git Commit' section bellow. 
2. The user will have the coverage options that are NOT selected commented by default. 

### Option Sets
The Option Sets are demarcated in callouts before the next header. 

> Option Set for 'Content or Code Commit?'
> 1. List of Content Files
> 2. Directory of Content Files
> 3. Specific Content Files
> 4. List of Code Files
> 5. Directory of Code Files
> 6. Specific Code Files
> 7. List of Any Files. 

> Option Set for 'Changes to cover in this Git Commit':
> 1. Every change since the last commit.
> 2. Selected changes since the last commit. 
> 3. Selected changes since a specific reference commit.
> 4. Code Assistant may make suggestions and create an initial draft. 

> Option Set for 'List type for the <changed-files-map> section':
> 1. List the names of all changed files.
> 2. Only list the directory/directories that contain changed files.
> 3. List the files grouped and nested underneath their directory path. 

> Option Set for 'Paths for this commit':
> 1. <path/to/file>
> 2. <path/to/directory>

## FOCUS HERE! HERE ARE THE User Selections from Option Sets:

**_Content or Code Commit?_**
2. Directory of Content Files

**_Changes to cover in this Git Commit_**
2. Selected changes since the last commit. 

**_List type for the <changed-files-map> section_**
3. List the files grouped and nested underneath their directory path.

**_Paths for this commit_**:
site/src/content/lost-in-public/prompts

content, prompts, yaml: Standardize frontmatter across prompts directory

Comprehensive frontmatter standardization for all prompt files:
- Added complete frontmatter to 7 files that were missing it
- Converted tag arrays to YAML bullet list syntax in 4 files
- Updated field name from 'generated_with' to 'augmented_with' in 1 file
- Preserved all existing frontmatter values while ensuring consistent structure

Enhance documentation standards across prompts directory
- Comprehensive update to documentation standards and templates:
- Added memory state tracking to session log documentation
- Restored and enhanced changelog documentation templates
- Standardized YAML tag syntax and validation patterns
- Implemented aggressive inline commenting

===== New Files
site/src/content/lost-in-public/prompts
   Create-a-Basic-Changelog.md
   Maintain-a-Session-Log.md
   Write-a-Changelog-Entry.md

==== Updated Files
site/src/content/lost-in-public/prompts
   Ask-a-Model-API-to-perform-a-task-via-API.md
   Create-a-Canvas-UI-of-our-Content-and-Data-Models.md
   Create-a-Content-Generation-Engine.md
   Create-a-Content-Registry-Script.md
   Create-a-Price-Card.md
   Create-or-Update-Open-Graph-Data.md
   Fix-one-YAML-Issue-at-a-Time.md
   Manageable-User-Options.md
   Meticulous-Constraints-for-Every-Prompt.md
   Return-only-files-with-valid-Frontmatter..md
   Write-a-Raw-Text-Git-Commit.md
   Write-a-Technical-Specification.md
   Writing-Correction-Functions.md

***
# Example of User Options Settings & Strong Commit Response from AI Code Assistant

## The user has chosen among the option set
**_Content or Code Commit?_**
2. Directory of Content Files

**_Changes to cover in this Git Commit_**
2. Selected changes since the last commit. 

**_List type for the <changed-files-map> section_**
3. List the files grouped and nested underneath their directory path.

**_Paths for this commit_**:
site/src/content/lost-in-public/prompts

# The AI Code Assistant has written a strong git commit
content, docs, yaml: Standardize frontmatter across prompts directory

Comprehensive frontmatter standardization for all prompt files:
- Added complete frontmatter to 7 files that were missing it
- Converted tag arrays to YAML bullet list syntax in 4 files
- Updated field name from 'generated_with' to 'augmented_with' in 1 file
- Preserved all existing frontmatter values while ensuring consistent structure

site/src/content/lost-in-public/prompts
   Ask-a-Model-API-to-perform-a-task-via-API.md
   Create-a-Basic-Changelog.md
   Create-a-Canvas-UI-of-our-Content-and-Data-Models.md
   Create-a-Content-Generation-Engine.md
   Create-a-Content-Registry-Script.md
   Create-a-Price-Card.md
   Create-or-Update-Open-Graph-Data.md
   Fix-one-YAML-Issue-at-a-Time.md
   Maintain-a-Session-Log.md
   Manageable User Options.md
   Meticulous-Constraints-for-Every-Prompt.md
   Return-only-files-with-valid-Frontmatter..md
   Write-a-Changelog-Entry.md
   Write-a-Raw-Text-Git-Commit.md
   Write-a-Technical-Specification.md
   Writing-Correction-Functions.md

***

# Formatting and Template:
The commit message should be formatted in the following way:

## Definitions:
 - `<scope>` is a one to two word name that can retrostpectively be used as pseudo-tags for later filtering of git commits. 
 - `<scopes-map>` is a map of possible scopes in a scope array. So, the actual syntax of a `<scopes-map>` is `<scope1>, <scope2>, <scope3>`
 - `<body>` is the total text area for content. 
 - `<lede>` is the first line or lines of the body of one `<scope>`.
 - `<changed-files-map>` is a map of changed files in a changed files array. So, the actual syntax of a `<changed-files-map>` is `<file1>, <file2>, <file3>` or `<dir1> + "\n" + <dir2> + "\n" <dir3>
 - `<footer>` is the final section of the commit message.

## Template Syntax
```text
<scope-map> <line-summary>

<body>
<lede>
 - <bullet>
 - <bullet>
 - <bullet>

 <lede>
 - <bullet>
 - <bullet>
 - <bullet>

<changed-files-map>

</body>
<footer>
```

Case: 1. _List the names of all changed files._
```text
<file1>, <file2>, <file3>, etc.
```

Case: 2. _Only list the directory/directories that contain changed files._
Where path is a relative path from the project root, so 'site'
```text
<path/to/dir1>
<path/to/dir2>
<path/to/dir3>
```

Case: 3. _List the files grouped and nested underneath their directory path._
```text
<path/to/dir1>
   <file1>, <file2>, <file3>

<path/to/dir2>
   <file1>, <file2>, <file3>

<path/to/dir2>
   <file1>, <file2>, <file3>
```

## Common values for <scope>:

#### Workflow scopes for <scope>:
kickoff:
iterations:
stalled:
stash:
precheck:
prerun:
success:
failure:
milestone:
prod-ready:

refactor-new:
refactor-mid:
refactor-end:


#### Domain scopes for <scope>:
scripts:
frontend:
api:
backend:


styles-new:
styles-changes:
styles-updates:
styles-ready:
styles-moved:

components-new:
components-changes:
components-updates:
components-ready:
components-moved:

backend-new:
backend-changes:
backend-updates:
backend-ready:
backend-moved:

functions-new:
functions-changes:
functions-updates:
functions-ready:
functions-moved:

pages-new:
pages-changes:
pages-updates:
pages-ready:
pages-moved:

#### Content scopes for <scope>:

##### Directory specfic scopes for <scope>:
prompts-new:
prompts-changes:
prompts-updates:
prompts-ready:
prompts-moved:

specs-new:
specs-changes:
specs-updates:
specs-ready:
specs-moved:

tools-new:
tools-changes:
tools-updates:
tools-ready:
tools-moved:

##### All other directories have one scope:

tools-new:
tools-changes:
tools-updates:
tools-ready:
tools-moved:
