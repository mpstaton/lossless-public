---
site_uuid: 9c6dba50-6d21-4799-b46b-9ad198aa5d6b
url: https://git-scm.com
tags:
- Products
- Developer-Experience
- Workflow-Management
docs_url: 'https://git-scm.com/doc'
og_errors: 'true'
og_last_error: '2025-03-08T20:39:42.148Z'
og_error_message: 'HTTP error 401'
jina_last_request: '2025-03-09T06:45:03.928Z'
jina_error: 'Unexpected token'
image: https://git-scm.com/images/logo@2x.png
site_name: Git
title: Git
favicon: https://git-scm.com/favicon.ico
og_fetched_url: https://git-scm.com
og_last_fetch: '2025-03-14T04:41:46.355Z'
date_created: 2025-02-19
date_modified: 2025-03-20
---

https://youtu.be/0Hk2XjGSzbA?si=idNrPLL_nQg2oDpR

https://youtu.be/rH3zE7VlIMs?si=cmf5DCQPv0kkT3DJ

https://youtu.be/leYrUhWSBUk?si=JraVnHylZg21xnQt

https://git-scm.com/book/en/v2
## Git Hooks

>Git hooks are scripts that run automatically every time a particular event occurs in a Git repository. They let you customize Git’s internal behavior and trigger customizable actions at key points in the development life cycle. Atlassian[ on Git Hooks](https://www.atlassian.com/git/tutorials/git-hooks#:~:text=Git%20hooks%20are%20scripts%20that,in%20the%20development%20life%20cycle.). 



## Git Branch

### Branch Naming Strategies

Branch names can be anything you’d like. However, your organization or project may have standards outlined for branch naming. For example, naming the branch based on the person responsible for working on the branch and a description or work item:

- username/description
- username/workitem

You can name a branch to indicate the branch’s function, like a feature, bug fix, or hotfix:

- bugfix/description
- feature/feature-name
- hotfix/description

Another branching strategy is having branches dedicated to the different development cycles, like feature or hotfix. As work items come up, you create a branch for that item from its respective branch. Yes, you can create branches from branches! Check out Option 4 below for an example. [^1]


### Git Merge

1.When you switch to main, your files will temporarily show the old state, but don't worry - all your changes are safely stored in your development-temp branch. They're not lost.

The recommended process is:
	1. Switch to main (yes, you'll briefly see the old code)
	2. Immediately merge development-temp into main (which will bring all your new changes into main)
	3. After the merge, main will have all your latest work

This is the standard and safest way to merge branches. Your development-temp branch will still exist afterward, so you can't lose anything. If something goes wrong (which is unlikely), you can always switch back to development-temp where all your work is safe.

```bash
git checkout main
git diff site/src/content/tooling/Software\ Development/Databases/Postgres.md
git merge development-temp --strategy-option theirs
git add site/src/content/tooling/Software\ Development/Databases/Postgres.md
git commit -m "Merge development-temp branch, keeping development-temp version of Postgres.md"
git status
git log --oneline -n 3
git log -n 1
git merge development-temp
```

`git diff site/src/content/tooling/Software\ Development/Databases/Postgres.md`


[^1]: [Git Branching and Merging: A Step-By-Step Guide](https://www.varonis.com/blog/git-branching)
