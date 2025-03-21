---
site_uuid: f50a5de3-6906-4051-b826-5ea3c2dc6224
url: https://typicode.github.io/husky/#/
description: Husky is a lightweight Git Hook scripting markup format.
image: https://typicode.github.io/husky/assets/sponsors.B1XtYgDj.svg
site_name: Husky
title: Husky
favicon: data:image/svg+xml,<svg xmlns=\http://www.w3.org/2000/svg\ viewBox=\0 0 100 100\><text y=\.9em\ font-size=\85\>\U0001F436</text></svg>
tags:
  - Products
og_screenshot_url: https://og-screenshots-prod.s3.amazonaws.com/1366x768/80/false/1edeb1e7477056407f9dc5d308ba40d49adf6cf51a2ac367dff119ea3a342563.jpeg
jina_last_request: 2025-03-09T06:44:58.332Z
jina_error: Error occurred
og_last_fetch: 2025-03-07T05:19:01.811Z
date_created: 2025-03-09
date_modified: 2025-03-20
docs_url: https://typicode.github.io/husky/get-started.html
---
[[Husky]] is a [[Vocabulary/Packages and Libraries|Library]] that helps developers use [[Tooling/Products/Git#Git Hooks|Git Hooks]] to manage complex, [[Concepts/Continuous Integration and Continuous Deployment|Continuous Integration and Continuous Deployment]] workflows. 


A good overview [here.](https://syntackle.com/blog/creating-git-hooks-using-husky-y6LKpN/#:~:text=You%20will%20see%20a%20.,git%20hooks%20will%20be%20executed.)

Husky creates the following files, which represent different scripts that can be called through the [[Vocabulary/Command-Line Interface|Command-Line Interface]]:
```bash
.husky
|-- _
|   |-- .gitignore
|   |-- applypatch-msg
|   |-- commit-msg
|   |-- h
|   |-- husky.sh
|   |-- post-applypatch
|   |-- post-checkout
|   |-- post-commit
|   |-- post-merge
|   |-- post-rewrite
|   |-- pre-applypatch
|   |-- pre-auto-gc
|   |-- pre-commit
|   |-- pre-merge-commit
|   |-- pre-push
|   |-- pre-rebase
|   `-- prepare-commit-msg
`-- pre-commit

2 directories, 18 files
```
