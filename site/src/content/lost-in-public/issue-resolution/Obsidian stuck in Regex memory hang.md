---
date_created: 2025-03-21
date_modified: 2025-03-21
---

![](https://i.imgur.com/3HfecxN.gif)



1. Step: Upon reopening Obsidian, it now no longer has the System information.  

After removing the system files related to Obsidian, the app no longer knew who I was or where my vaults were.

![](https://i.imgur.com/p5XVKb5.gif)
Yet, the regular expression was STILL in the Search Bar!  And, it was still in a total freeze. How could that be?!?

1. Step: Check the vault root directory for hidden files.  
   
This ended up being a lot of back and forth with [[Tooling/AI-Toolkit/Generative AI/Code Generators/Warp|Warp]] to get the right command that would:
>Output a nice tree structure of the contents of only hidden directories in the working directory. 

```bash
warp-runnable-command
tree -a -d -I '[!.]*' #prints out all directories except hidden
tree -d -a --prune #did not return a hidden directory
tree -d -a -P ".*" #includes hidden directory, but prints out all directories
tree -a -d | grep "^[[:space:]]*[|]\{0,1\}--[[:space:]]*\." # prints out only hidden directories but not their contents
find . -name ".*" -type d -exec tree -a {} \; #prints out all directories and their contents. 

find . -type d -name ".*" -not -name "." | xargs tree -a #prints out all nested content of hidden directories. 

find . -maxdepth 1 -type d -name ".*" -not -name "." | xargs tree -a #meets criteria, but only prints one level deep. -- looks much nicer
```

So, here is the ouput
   
```bash
.obsidian/
|-- .DS_Store
|-- app.json
|-- appearance.json
|-- backlink.json
|-- bookmarks.json
|-- community-plugins.json
|-- core-plugins-migration.json
|-- core-plugins.json
|-- daily-notes.json
|-- graph.json
|-- hotkeys.json
|-- plugins
|   |-- .DS_Store
|   |-- calendar
|   |   |-- data.json
|   |   |-- main.js
|   |   `-- manifest.json
|   |-- chronology
|   |   |-- main.js
|   |   |-- manifest.json
|   |   `-- styles.css
|   |-- customjs
|   |   |-- data.json
|   |   |-- main.js
|   |   |-- manifest.json
|   |   `-- styles.css
|   |-- dataview
|   |   |-- data.json
|   |   |-- main.js
|   |   |-- manifest.json
|   |   `-- styles.css
|   |-- dataview-publisher
|   |   |-- main.js
|   |   `-- manifest.json
|   |-- dbfolder
|   |   |-- main.js
|   |   |-- manifest.json
|   |   `-- styles.css
|   |-- image-captions
|   |   |-- main.js
|   |   |-- manifest.json
|   |   `-- styles.css
|   |-- image-upload-toolkit
|   |   |-- data.json
|   |   |-- main.js
|   |   `-- manifest.json
|   |-- js-engine
|   |   |-- main.js
|   |   |-- manifest.json
|   |   `-- styles.css
|   |-- litegallery
|   |   |-- data.json
|   |   |-- main.js
|   |   |-- manifest.json
|   |   `-- styles.css
|   |-- live-variables
|   |   |-- main.js
|   |   |-- manifest.json
|   |   `-- styles.css
|   |-- mesh-ai
|   |   |-- main.js
|   |   |-- manifest.json
|   |   `-- styles.css
|   |-- obsidian-advanced-slides
|   |   |-- css
|   |   |-- data.json
|   |   |-- dist
|   |   |-- distVersion.json
|   |   |-- main.js
|   |   |-- manifest.json
|   |   |-- plugin
|   |   |-- styles.css
|   |   `-- template
|   |-- obsidian-excalidraw-plugin
|   |   |-- data.json
|   |   |-- main.js
|   |   |-- manifest.json
|   |   `-- styles.css
|   |-- obsidian-footnotes
|   |   |-- main.js
|   |   `-- manifest.json
|   |-- obsidian-imgur-plugin
|   |   |-- data.json
|   |   |-- main.js
|   |   `-- manifest.json
|   |-- obsidian-linter
|   |   |-- data.json
|   |   |-- main.js
|   |   |-- manifest.json
|   |   `-- styles.css
|   |-- obsidian-local-rest-api
|   |   |-- data.json
|   |   |-- main.js
|   |   |-- manifest.json
|   |   `-- styles.css
|   |-- obsidian-minimal-settings
|   |   |-- data.json
|   |   |-- main.js
|   |   `-- manifest.json
|   |-- obsidian42-brat
|   |   |-- main.js
|   |   |-- manifest.json
|   |   `-- styles.css
|   |-- runjs
|   |   |-- data.json
|   |   |-- manifest.json
|   |   |-- RunJS-codes.json
|   |   `-- styles.css
|   `-- templater-obsidian
|       |-- data.json
|       |-- main.js
|       |-- manifest.json
|       `-- styles.css
|-- publish.css
|-- publish.json
|-- scripts
|   |-- macro-guide.js
|   |-- open-graph.js
|   `-- orchestrator.js
|-- snippets
|   |-- .DS_Store
|   |-- callout-handler.css
|   |-- image-grids.css
|   |-- image-handler.css
|   |-- lossless-theme.css
|   |-- nifty-links.css
|   `-- tabbed-callouts.css
|-- templates.json
|-- types.json
`-- workspace.json
```

