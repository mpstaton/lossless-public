---
title: Create a permanent memory for this project related to project YAML conventions. 
lede: Eliminate frustration by observing guidelines, working within hard rules and constraints, and learning to detect YAML irregularties that could cause bugs and failures. 
date_authored_initial_draft: 2025-03-18
date_authored_current_draft: null
date_authored_final_draft: null
date_first_published: null
date_last_updated: null
at_semantic_version: '0.0.0.1'
authors: Michael Staton
status: To-Prompt
augmented_with: 'Windsurf Cascade on Claude 3.5 Sonnet'
category: Prompts
tags:
- YAML
- YAML-Handling
- YAML-Conventions
- Bug-Prevention
---

# Context
We have been set back over a week as of the initial draft of this prompt. You don't remember this, but we worked 16 hour days together, seven days a week, in an endless loop of trying to fix the same errors in the same files. Let's prevent this by creating a permanent project memory and ruleset so we just never have a setback due to YAML frontmatter again.  

I have a team of people creating content, and they will mess things up by human error. We cannot create hard data type validations on either build scripts, manipulation scripts, or in rendering content collections. 

Instead, we must have accurate and vigilant filters that detect abnormalities, inconsistencies, or glitches BEFORE they are included in content collection modules and libraries like glob and grey matter. 

# Known Errors and Fixes
We have already created so much code to diagnose errors and create fixes in our scripts, that at this point I cannot even understand it. The errors we have now are probably because the AI Code Assistant did not correctly apply memories, did not hold the assigned files in context long enough, and got overzealous writing massively long code files that probably create competing or conflicting code.   

However, I think the way that we set up the Case: , Fix: pattern is the right one. So,
For your reference: the MOST IMPORTANT FILE TO STUDY IS 
`site/scripts/build-scripts/getKnownErrorsAndFixes.cjs`

# Solve problems by filtering potentially corrupted files OUT of data objects / arrays that process valid YAML. 
We do not care if only 500 of 700 markdown files are rendered. We care when we have A SITEWIDE ERROR OR BUILD FAILURE BECAUSE 200 FILES HAVE A CHARACTER WHERE IT SHOULDN'T BE!


# Easy Memories or Rules. 
ANYTIME WE ARE HAVING AN ERROR WITH CONTENT or a module that deals with content, FIRST CHECK IF IT'S A YAML IRREGULARITY IN THE CONTENT BY READING THE FILE ABOVE and scanning the files that threw errors.  

IF THERE IS A SINGLE ERROR that throws the YAML modules there are probably TONS of those errors. So, we have to go back to our script and run a diagnositic, attempted fix, and report and EVERY SINGLE CONTENT FILE within the directory that is throwing the error. 

**NEVER WRITE A REGULAR EXPRESSION TO DETECT AN ERROR OUTSIDE OF THAT FILE.** IF WE NEED TO MOVE THE FILE OR REFACTOR IT, THAT'S FINE.  BUT DON'T CREATE A BUNCH OF REGULAR EXPRESSIONS, VALIDATIONS, OR FIXES ALL OVER THE PLACE.  WE NEED ONE SINGLE SOURCE OF TRUTH.

## Valid syntax is more complicated because of our stack.

You will need to throw some of your existing knowledge about YAML, and create knew memories that will have cascading positive impact if you can help write code that correctly prevents failures in scripting, failures in production, or glitches in rendering for users in production. 

DO NOT ASSUME THE STANDARD YAML SYNTAX RULES APPLY. For instance, in our stack Block Scalar syntax for multi-line strings is valid in conventional YAML.  But it is not valid in our stack.  This is just one of the irrgularities we have uncovered. 

# THE ERROR IS PROBABLY COMING FROM CONVENTIONAL VALIDATION TECHNIQUES IN JAVASCRIPT AND ESPECIALLY TYPESCRIPT. 

# THIS CAN ALL BE SOLVED WITH BETTER PREPROCESSING PIPELINES THAT ONLY SEND MARKDOWN FILES THAT WILL SUCCESSFULLY MOVE THROUGH THE NEXT ACTION

# Must Comply with Two Services that are independent of each other:

1. [Obsidian](https://obsidian.md/).  
   Obsidian is a notebook app that uses YAML frontmatter to store metadata about notes.  It hase been gaining in popularity, especially amongst geeks and developers, for it's radically improved user experience that enables notebooks to contain thousands or even tens of thousands of Markdown files. 

   This user, Michael Staton, and other developers on this project, use the symlink feature of the operating system to sync our content sourcefiles in this project directory to a "vault" that opens in Obsidian.  

2. [Astro](https://astro.build/).
   Astro is a beloved web framework that uses YAML frontmatter to store metadata about content.  It has been gaining in popularity, especially for multi-modal balance between Static Site Generation and Server Side Rendering feature sets through their clever Islands Architecture. 


### Therefore, the followning docs are relevant:

1. Obsidian
Obsidian only has developer documentation for developers building plugins for Obsidian plugin marketplace, which doesn't really deal with Frontmatter. 

##### Possibly more relevant Linter plugin, an independent developer. 
The best resource I have found is a plugin linter. I will install it now. 
https://platers.github.io/obsidian-linter/

The code is also open source, so we might be able to steal code from it:
https://github.com/platers/obsidian-linter

##### Probably less relevant Plugin developer docs from Obsidian:
Just in case the Developer documentation is somehow meaningful for you, here are some possibly relevant areas:
https://docs.obsidian.md/Reference/TypeScript+API/FrontMatterInfo
https://docs.obsidian.md/Reference/TypeScript+API/FrontmatterLinkCache
https://docs.obsidian.md/Reference/TypeScript+API/getFrontMatterInfo

2. Astro
https://docs.astro.build/en/guides/markdown-content/
https://docs.astro.build/en/guides/content-collections/
https://docs.astro.build/en/reference/content-loader-reference/#built-in-loaders
https://docs.astro.build/en/guides/on-demand-rendering/
https://docs.astro.build/en/guides/actions/

## Turn on HYPERAWARENESS OF YAML concerns and prevent syntax inconsistencies from sending us down rabbit holes.  

While scripting we must be vigilant in pre-processing YAML using only the `filesystem` and `path` built in modules. 

First, because we want any manipulation scripts to impact as many files as possible.  Second, because we want to prevent any errors that might occur from using other modules on content collections that have syntax irregularities in even ONE of the files.  For instance, the content collection modules might import 1000 Markdown documents and try to create a list.  If there is a syntax inconsistency in JUST ONE PROPERTY in ONE FILE it can throw the rendering process. 

So, we must have very very accurate regular expressions that can detect as many irregularities as possible, and all irregularities that we are aware of.  

# No Action in this prompt except:
Help me create memories and rules that will help you to 
1. prevent yourself from writing code that will cause errors or make irregularities work. 
2. coach me in writing code that is step by step, tested small and verifying each step. 
3. take writing regular expressions and "graceful handling" specifications and prompts very very seriously.  

We can no longer have creative, negligent scripting that makes one problem worse while trying to fix the original problem. 

## YAML Syntax Easy Rules

## YAML Syntax IN EXAMPLE:

```yaml
---
#Proper Names and Nouns should be bare strings with no quotes 
#Group strings with less than 64 characters togetherat the top. 
site_name: ArangoDB
title: The original multi-modal database. 
# Titles must be bare strings with no unsafe characters. They cannot have any kind of quotes around them. 
lede: Eliminate frustration by observing guidelines, working within hard rules and cons

# Ledes must be bare strings with no unsafe characters. They cannot have any kind of quotes around them. 
# Multi-line strings must always be single line strings. We will render the string in a way that fits it into its appropriate dimensions. Block Scalar syntax is unsafe in our stack. 
# Group strings with more than 64 characters together in the frontmatter
title: Create a permanent memory for this project related to project YAML conventions. traints, and learning to detect YAML irregularties that could cause bugs and failures. 

 # Dates must be bare strings with no unsafe characters. They cannot have any kind of quotes around them. 
 # Group date values together. 
date_authored_initial_draft: 2025-03-18
date_authored_current_draft: null
date_authored_final_draft: null
date_first_published: null
date_last_updated: null
# any property with index in it will have an integer generated by a count. We use the integers to sort. Keep them BARE! We need to do math on them!  

# In files with an index value, the file name of the file in focus should end with `$file-name_${indexValue} where the file-name may or may not be Train-Case or kebab-case depending on the circumstance.  
date_file_index: 2 

# URLs should be bare with no quotes of any kind on either side. Our biggest error has been multiple quote characters around urls.  Url's are save because any unsafe character is within a continguous set of characters. Unsafe characters cannot be separated by a space character or dangle at the end or be in the first character position.  Therefore, URLs are safe.  However, we have a lot of code that uses URLs and they all need to expect the same value syntax coming in. So, bare single string is best.  

# Obsidian is easy to work with and users can only click links if they are bare with no quotes of any kind.
# We are at the whim of API return objects sometimes and have not had the opportunity to apply our clever conventions across.  For instance, I would want these to be url_favicon and url_image respectively. But if we made that change now it would take forever and probably break things.  
favicon: https://arangodb.com/wp-content/uploads/2023/08/cropped-favicon-192x192.png
image: https://arangodb.com/wp-content/uploads/2024/02/Image-5-2.gif

 # Numerical values with decimals, colons, or dashes or other unsafe characters must have one set of single quotes around them. 
 # Semantic Version values are only relevant in living documents that will be public-facing in a rendered through a content collection. Our team has chosen to add a fourth counter to the front to stand for Epoch (when a new release is fundamentally different than the previous lineage of releases, not just incompatible.)
at_semantic_version: '0.0.0.1'

# Any kind of property that may have an array rather than a single bare string, we should pre-emtpively make it an array with only one value in the array.  All values must be bare strings with no unsafe characters. 
authors: 
- Michael Staton 
status: To-Prompt
augmented_with: 'Windsurf Cascade on Claude 3.5 Sonnet' #

#The colon with a space after it is an unsafe character, so we must surround all error messages with a single mark quote. 
# IF WE ARE WRITING API CALLS, PREVENT THE UNSAFE SYNTAX BEFORE PUTTING THE RESPONSE PROPERTY VALUE AS OUR PROPERTY VALUE. ALTER INCOMING UNSAFE SYNTAX.

# Group error messages together.  
error_jina_most_recent: 'Error: 404 Not Found' 
category: Prompts #Single bare string with no unsafe characters.

#Arrays must be in one value per line, dash space value bare string.  No unsafe characters. Using a " " space characteras a word separator causes known issues, so all spaces must be replaced with dashes. YAML-Handling not YAML Handling
tags:
- YAML
- YAML-Handling
- YAML-Conventions
- Bug-Prevention
---
```


