---
title: "Accessing Figma through a Windsurf MCP Server"  
lede: 'Interact with Figma Designs while building an application, straight from the IDE'  
date_authored_initial_draft: 2025-03-19
date_authored_current_draft: null 
date_authored_final_draft: null
date_first_published: null
date_last_updated: null
at_semantic_version: "0.0.0.1"
authors: Michael Staton
status: To-Do
augmented_with: null  # Current AI system
tags:
  - Explorations
  - Model-Context-Protocols
authors: 
- Michael Staton
date_created: 2025-03-20
date_modified: 2025-03-20
---
session-open::'2025-03-19T04:51:05.362Z'

1. Found what seems to be the standard MCP server, even though it doesn't look like it: [figma-mcp](https://github.com/MatthewDailey/figma-mcp?tab=readme-ov-file)
2. Per instructions, downloaded Claude to native MacOS Desktop. 
3. Per instructions, created a Figma API Key.
4. Per instructions, ran the bash command below:

```bash
echo '{
  "mcpServers": {
    "figma-mcp": {
      "command": "npx",
      "args": ["figma-mcp"],
      "env": {
        "FIGMA_API_KEY": "<YOUR_API_KEY>"
      }
    }
  }
}' > ~/Library/Application\ Support/Claude/claude_desktop_config.json
```
5. Of my own initiative, created a `.windsurf` dir in root, added a `.env.mcp` file with both Figma and Anthropic API Keys.  

SCRATCH THAT
1. Went to Windsurf Settings in the top menu bar.
2. Clicked on Windsurf Settings option next in. 
3. Clicked to create an MCP Server.
4. Clicked create Figma MCP Server.
5. Added Figma API Key. 

Now, I have the following API endpoints:
Available functions:
`add_figma_file`: Add a Figma file to your context
`view_node`: Get a thumbnail for a specific node in a Figma file
`read_comments`: Get all comments on a Figma file
`post_comment`: Post a comment on a node in a Figma file
`reply_to_comment`: Reply to an existing comment in a Figma file

Of these, for this Lossless content site, I think `view_node` will be quite useful!

session-close::'2025-03-19T04:51:05.362Z'

https://youtu.be/6G9yb-LrEqg?si=7bk-GatMg64Ow1FI

https://youtu.be/X-aX1TuGP0s?si=wJiAgV4x5nyKgvYL