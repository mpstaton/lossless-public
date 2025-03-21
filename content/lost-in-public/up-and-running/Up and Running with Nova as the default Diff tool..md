---
date_created: 2025-03-08
date_modified: 2025-03-20
tags:
  - Version-Control
  - Continuous-Integration
  - Desktop-App
  - Text-Editors
---

[[Tooling/Software Development/DevOps/Developer Experience/Nova|Nova]] is a beautiful [[Concepts/Explainers for Tooling/Text Editors or IDEs|Text Editor]] if you're on a [[Organizations/Apple|Apple]] machine, and you don't need all the functionality of a hardy, possibly bloated [[Concepts/Explainers for Tooling/Text Editors or IDEs|IDE]].

However, where it's really mindblowing is how it visualizes [[Git Diffs]].  It's hands down the easiest way to work through the merge or pull request process. And it's so beautiful and elegant and smooth and, frankly, stylish that it turns what was once a painful task to something to look forward to.  

## Set up [[Tooling/Software Development/DevOps/Developer Experience/Nova|Nova]] as your default [[Git Diffs]] tools using the command line:

```bash
ls -l "/Applications/Nova.app/Contents/SharedSupport/nova"
```

```bash
git config --global diff.tool nova
git config --global difftool.nova.cmd '"/Applications/Nova.app/Contents/SharedSupport/nova" "$LOCAL" "$REMOTE"'
git config --global difftool.prompt false

```

Instead of using  `git diff` to resolve conflicts, you use `git difftool`
```bash
git difftool  # Shows all changes
git difftool path/to/file  # Shows changes for specific file
```

•  Nova will automatically open when you use git difftool
•  The prompt asking to launch the diff tool is disabled
•  The configuration is global, so it works in all your Git repositories
