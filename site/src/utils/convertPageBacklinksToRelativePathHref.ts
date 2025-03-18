// ================================================================================
// Open: Functions that allow Obsidian Backlinks to work in Astro components. 
// Type: Utility Functions
// Includes: 
//   list of functions with arguments
//   
//   ;
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/* =====================================================================>
   Functions that allow Obsidian Backlinks to work in Astro Components
/* =====================================================================>

??-- Type: User Options
??-- Includes: 
   //---- Function to convert all Backlink syntax on a page to relative paths for hrefs.  
   //---- Function to convert a single Backlink syntax to a relative path for hrefs. 

?-- Affects:
   //---- Markdown files, Article Components
/* <======================================< */



export async function convertPageBacklinksToRelativePathHref(relativePath: string, targetRootDir?: string) { 
/* export async function: -------------------------------------------------->

??-- Purpose:
   //-- Turn all backlink syntax into relative path hrefs 
   ---- in the Markdown file or Markdown files passed through parameters.
   ---- 
-->

??-- Logic:
   //-- Called form page rendering from rendered Astro components. 
   ---- 1. Receives an array of paths to Markdown files or one Markdown file. 
   -------- Optionally, a target root directory may be specified. 
   ---- 2. Creates an empty array `backlinksFoundInMarkdownContent`.
   ---- 3. Adds to array when regex matches backlink syntax '[[${Page Name]]' 
   ---- 4. Scans an index of pageName keys to match the string inside the square brackets. 
   ---- 5. Replaces the backlink syntax with the relative path href. 
-->
----------------------------------------*/
};

export async function returnRelativePathToRenderedComponentForOneBacklink(pageName: string, targetRootDir) {
/* function: -------------------------------------------------->

??-- Purpose
   //-- Enables a rendered component to render Extended Markdown Backlink syntax
   ---- into relative path hrefs, so as to make Backlinks useful on web pages. 
-->

??-- Logic
   //-- Called from a component while rendering, returns a Promise, executes async 
   ---- 1. Receives a context-less page name (eg: '[[Open AI]]'), 
   -------- and may receive a target root directory. 
   ---- 2. Performs a global search within a directory for a Markdown file with an exact match of the page name.
   ---- 3. Upon finding a match, returns the relative path to the Markdown file. 
   ---- 4. If no match is found, returns null with message: 'noExactMatch'  
-->
----------------------------------------*/
}
