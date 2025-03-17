---
title: Write a Technical Specification with a Standard but Evolving Style
date: 2025-03-16
working_with: Windsurf IDE with Claude 3.5
tags: 
- Scripts
- Specifications
- Data-Integrity
- Content-Fixes
---

# Write a Technical Specification with a Standard but Evolving Style

READ THIS ENTIRE FILE AND ALL FILES MENTIONED IN THIS FILE BEFORE BEGINNING. 

The code we will write the specification for is in the following paths:

`site/scripts/tidy-up/tidy-one-property/convertMultiLineStringsToSingleLineStrings.cjs`
`site/scripts/tidy-up/tidy-one-property/convertKeyNamesInYAML.cjs`

Look to previous examples.  

`site/src/content/specs/Get-Known-Errors-and-Fixes.md`

***

## Goal:

### One part readable by executives and product managers 
Front load a section for executives and product managers. In a way non-technical but interested colleagues can follow, describe the "What" and "Why," the problems solved, the business rationale for the efforts, and the impact on the organization going forward. 

### The rest with such detail that another engineer or AI Coding Assistant with the same functionality and a low probability of errors, omissions, or time wasted.
After the first section, switch to a Techincal Specification style. 

Please reflect on the kind of instruction set you, Claude 3.5, would need to be successful ON THE FIRST TRY.  

#### 1. List libraries used, imports, and dependencies. 

#### 2. Be visual. 
Use tables, code blocks, and mermaid diagrams. 

#### 3. List major functions and variables, their purpose, and how they interact. 

Make sure to explain the logic of how this code interacts with other code in the system. 

#### 4. If possible, recall in your context window any back and forth, misunderstandings, or errors. 

Being longwinded and thorough, so long as the layout is easy to follow, is better than being overly concise. 

# Now, write the specification in the pre-created Markdown file:

`site/src/content/specs/Clean-Specific-Issues-in-YAML-One-at-a-Time.md`
