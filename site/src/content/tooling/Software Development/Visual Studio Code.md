---
site_uuid: 032efa58-39ff-4ab8-b51f-a0a407921b2c
aliases:
- VS Code
parent_org: "[[Microsoft]]"
site_uuid: 3130edbb-0914-4f56-a5a2-f9fe924bfef4
site_uuid: 12d1db35-dec1-4638-a98e-f29eb7780d94
site_uuid: 843332e9-acc6-4b9a-8c93-7eb1ec6e647a
site_uuid: 1070f5e9-3afc-45eb-bbf1-ffceba1d16bc
site_uuid: 84d0e335-cb79-484f-97b2-a2924d4c9376
site_uuid: 42531981-781a-4e82-ae84-851689faf7e1
---
a [[Text Editors or IDEs|Text Editor]] created and maintained by [[Microsoft]].


### Tool Use
2025, Mar 05. [How To Create Custom VSCode Snippets](https://youtu.be/TGh2NpCIDlc?si=tTxT6kZHc5YbbKMe) [[WebDev Simplified]] on [[YouTube]].

#### Create your own [[Keybindings]]

The [[Keybindings]] are stored in a JSON file at the following path:
`Users/[your-username]/Library/Application Support/[App Name]/User/keybindings.json`

For me, the path is:
`Users/mpstaton/Library/Application Support/Windsurf/User/keybindings.json`

The [[Keybindings]] JSON file takes this as the data:
```json
// Place your key bindings in this file to override the defaults
[{
   "key": "ctrl+shift+c",
   "command": "editor.action.insertSnippet",
   "when": "editorIsOpen"
}
]
```



https://youtu.be/ifTF3ags0XI?si=eWB12fOiURyniG8U


https://youtu.be/lxRAj1Gijic?si=GLRWAxtOtD75c7KS

<iframe style="aspect-ratio:9/16;width:40%;height:auto" src="https://youtube.com/shorts/3O6BFlOiFRg?si=A8onX1t8spfsDqo0&amp;controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen </iframe> 



Written in [[TypeScript]]



# VS Code Extensions
[[Visual Studio Code|VS Code]] has a very robust [[Plug-ins,  Add-ons,  Extensions|Extension]] library.

The extensions take a primary role, and VS Code has many subtle designs to encourage every user to access the extensions that will help them the most.  
![[Screenshot 2025-01-20 at 11.51.48 AM_VS-Code.png]]
Similar to an [[App Stores|App Store]], the [[Plug-ins,  Add-ons,  Extensions|Extension]] feature within [[Visual Studio Code|VS Code]] manages extension updates, as well as helps users rid themselves of ones that are no longer supported.  
![[Screenshot 2025-01-20 at 11.55.15 AM_VS-Code.png]]
[[Visual Studio Code|VS Code]] also designs for [[Frictionless Commerce]], enabling [[Plug-ins,  Add-ons,  Extensions|Extension]] providers to enact their own licensing and paywall policies -- using [[Visual Studio Code|VS Code]]'s notification mechanisms:
![[Screenshot 2025-01-22 at 2.27.51 PM_VS-Code--Commerce.png]]

[[Visual Studio Code|VS Code]] also employs the [[Come one, come all]] approach, allowing anyone to try to build and publish an [[Plug-ins,  Add-ons,  Extensions|Extension]]. Notice the "Build your own" and "Publish extensions" options in the upper right corner.  
![[Screenshot 2025-01-20 at 12.40.13 PM_VS-Code.png]]
Because [[Visual Studio Code|VS Code]] has such a streamlined and open [[Extension Libraries|Extension Library]], most [[Influencer]] developers do their demonstrations on [[YouTube]] using [[Visual Studio Code|VS Code]]. 
![[Screenshot 2025-01-22 at 1.43.58 PM_watsonX--VSCode-Extension 1.png]] [^1]
https://youtu.be/lxRAj1Gijic?si=DqzXItZ8hEmW1q3D
# Footnotes
[^1]: 