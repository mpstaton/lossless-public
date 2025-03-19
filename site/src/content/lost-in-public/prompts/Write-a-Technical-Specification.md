---
title: 'Write a Technical Specification with a Standard but Evolving Style'
lede: 'Create comprehensive technical specifications for completed tasks and features'
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
working_with: Windsurf IDE with Claude 3.5
category: Prompts
tags:
- Scripts
- Specifications
- Data-Integrity
- Content-Fixes
---

# Write a Technical Specification with a Standard but Evolving Style

READ THIS ENTIRE FILE AND ALL FILES MENTIONED IN THIS FILE BEFORE BEGINNING. 

**_After_** we have completed a coherent task or a related cluster of tasks, the user will ask the Code assistant to write a "Technical Specification" to codify and memorialize a completed task or cluster of tasks. 

If you are reading this **_after_** the user has requested a Technical Specification, you may commence with the task.  

***
# Context for the Specification being requested:
>![Configuration-Start] Configuration Section:
> Between this callout and the next callout are configuration variables the user will change to prompt each specification task.

#### New or Update Existing?
Update an existing specifcation with the recent work. 
`site/src/content/specs/Cases-and-Corrections-for-YAML-Content-Wide.md`
DO NOT DELETE OR EDIT PRIOR WORK BEFORE READING AND USING PRIOR WORK AS IMPORTANT CONTEXT.

#### The code we will write the specification for is in the following paths:

`site/scripts/build-scripts/getKnownErrorsAndFixes.cjs`


#### Mention supporting work such as:
`site/src/content/changelog--code/2025-03-18_01.md`



#### Look to previous examples.  

`site/src/content/specs/Get-Known-Errors-and-Fixes.md`
`site/src/content/specs/Clean-Specific-Issues-in-YAML-One-at-a-Time.md`

## Constraint: use the following standardized frontmatter template:
```yaml
---
title: 'Technical Specification: YAML Frontmatter Error Detection and Correction System.'
lede: 'Let content teams develop content. Handle frontmatter inconsistencies gracefully for a seamless user experience.'
date_authored: 2025-03-18
at_semantic_version: "0.0.1.2"
authors: "Michael Staton"
generated_with: "Windsurf Cascade on Claude 3.5 Sonnet"
category: Technical-Specification
tags: 
- YAML
- Data-Wrangling
- Frontmatter 
- Error-Detection
- Error-Handling 
- Workflow-Automation 
- Content-Management 
- Markdown
---
```

>![Configuration-End] End of Configuration.
> Below this callout resumes the prompt for writing the requested technical specification.

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

I HAVE ALREADY CREATED THE FILE, JUST WRITE TO IT.
`site/src/content/specs/Create-a-Content-Registry-for-Markdown-Files.md`

# Now, reflecting on the specifcation, write the frontmatter using the template in the configuration section above.

Pretend to be a creative marketing copywriter. Write an impactful title and lede -- functionally, a compelling subtitle -- that will draw in business leaders and technologists.

Use tags liberally and with the correct syntax for YAML arrays. Be sure to use a "-" dash character as the separator between words for tags that are more than one word. 

If you are familiar with SEO, reason on possible edits to the frontmatter that will improve rankings in search engines. Then make those edits.
