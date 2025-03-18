## Objective: 
Filter out any markdown files that have frontmatter content that could cause errors in another operation. Diagnose each error, and create a report listing all diagnosed errors. Return only files that have valid frontmatter to other functions that will perform operations on markdown files.  

## Constraints
Using only the `fs` and `path` node libraries, 
Process ALL files in a target directory, however nested.  Any error should be non-blocking. 

## User Options
