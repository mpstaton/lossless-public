---
date_created: 2025-03-20
date_modified: 2025-03-20
---

### Using Imperative Verb Form

Another best practice to help you write good Git commit messages is to use imperative verb form. Using imperative verb form ensures that potential verbs used in your commit messages, like “fixed” or “updated” are written in the correct tense to “fix” and “updated”. 

This has become a defacto standard on many Git projects. One way to ensure your messages comply with the standard is to apply the formula: “If applied, my commit will…” You can apply this to the example:

“If applied, my commit will (INSERT COMMIT MESSAGE TEXT)”

Summary:

`Add new Kief-the-kraken Keanu-Kief to keif gallery`  

Description:

`Modify menu.yml and keif-gallery.md related to ticket #12345` [^1]

### ### Conventional Commits

The conventional commit message style is another way you can level up your commit messages. The conventional commits structure involves starting your commit message with a specified commit type. Commit types include:

`Feat`– feature

`Fix`– bug fixes

`Docs`– changes to the documentation like README

`Style`– style or formatting change 

`Perf` – improves code performance

`Test`– test a feature

Using the conventional commit method makes it easy for project contributors to filter and search for specific commits, as shown in the example below: 

`git commit -m <Summary>`, or the more detailed `git commit -m <Summary> -m <Description>`.

Summary:

`Docs: Fixes typo on in-from-the-depths.md`  

Description:

`Closes ticket #54321` [^2]

### Amend a Git Commit message:
To Git change a commit message in the command line, you can use:

 `git commit --amend -m “new commit message”`

# Footnotes
***
[^1]: [Using Imperative Verb Form](https://www.gitkraken.com/learn/git/best-practices/git-commit-message#using-imperative-verb-form) [[Tooling/Software Development/DevOps/GitKraken|GitKraken]]
[^2]: [Conventional Commits](https://www.gitkraken.com/learn/git/best-practices/git-commit-message#conventional-commits) [[Tooling/Software Development/DevOps/GitKraken|GitKraken]]
