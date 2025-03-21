---
date_created: 2025-03-20
date_modified: 2025-03-20
---
# Continuous Integration Workflow
This workflow was recommended by [[Tooling/AI-Toolkit/Generative AI/Code Generators/Warp|Warp]] an [[Tooling/AI-Toolkit/Explainers/AI Terminal Assistant]]

## Managing large Monorepos and tons of Content with [[Tooling/Products/Git|Git]]
There are two main approaches to consider: Git Submodules and Git Monorepo with Sparse Checkout. Let me explain both and recommend the best approach for your situation.

### 1. Git Sparse Checkout (Recommended for your case):
This is a newer and often more manageable approach that allows you to work with only specific parts of your monorepo. It's particularly useful for your situation because:
•  It keeps everything in one repository (easier for coordination)
•  Allows you to "check out" only the parts you're working on
•  Better handles large numbers of files like your Markdown content
•  Easier to maintain than submodules

#### Setting up Sparse Checkout
```bash
# Enable sparse checkout
git sparse-checkout set

# Specify which directories you want to work with
git sparse-checkout set app/ marketing/

# You can later modify to focus on specific areas
git sparse-checkout set app/  # Just the app
git sparse-checkout set marketing/content/  # Just the content
```

### 2. Git Submodules:
This approach splits your codebase into separate repositories that are linked together. While powerful, it can be more complex to manage. Here's why:
•  Each submodule is a separate repository with its own history
•  Requires more careful version management
•  Can be tricky for team members to maintain
•  More complex CI/CD setup

```bash
# In your main repository
git submodule add https://github.com/your-org/content-repo content
git commit -m "Add content submodule"
```


```bash
# Method 1: Clone with submodules in one command
git clone --recurse-submodules https://github.com/your-org/main-repo

# Method 2: Clone and then initialize submodules
git clone https://github.com/your-org/main-repo
cd main-repo
git submodule init
git submodule update
```

***
# Up and running with Git Sparse Checkout 

#### 1. Use Sparse Checkout with a directory structure like:
```bash tree
monorepo/
├── app/
│   ├── src/
│   ├── tests/
│   └── ...
├── marketing/
│   ├── content/
│   │   └── ... (hundreds of Markdown files)
│   └── src/
├── shared/
│   └── ... (shared components, utilities)
└── tools/
    └── ... (build scripts, utilities)
```

#### 2. Create different sparse checkout profiles


```bash
git sparse-checkout set app/ shared/
git sparse-checkout set marketing/content/
git sparse-checkout set marketing/ shared/
```

> [!BENEFITS]
> Benefits of this approach:
> 1. Single source of truth
> 2. Easier coordination between parts
> 3. Simplified CI/CD
> 4. Ability to focus on specific parts
> 5. Better handling of dependencies between parts
> 6. Easier to manage than submodules
> 

### Common Workflows with Git Sparse Checkout and Submodules
1. Switching contexts:
```bash
# When working on the app
git sparse-checkout set app/ shared/

# When editing content
git sparse-checkout set marketing/content/

# When you need everything
git sparse-checkout disable
```

2. Creating focused feature branches:
```bash
git checkout -b feature/new-login
git sparse-checkout set app/ shared/
```

3. Managing changes
```bash
# You can still use normal git commands
git add .
git commit -m "feat: add login component"
git push origin feature/new-login
```

> [!TIPS]
> Additional Tips:
> 1. Use `.gitattributes` to handle large files appropriately
> 2. Consider using Git LFS for binary assets
> 3. Create scripts to switch between common sparse-checkout configurations
> 4. Document the structure clearly for team members

***
# Up and running with Git Submodules

1. Inital setup
```bash
# In your main repository
git submodule add https://github.com/your-org/content-repo content
git commit -m "Add content submodule"
```

2. Cloning a Repository with Submodules
```bash
# Method 1: Clone with submodules in one command
git clone --recurse-submodules https://github.com/your-org/main-repo

# Method 2: Clone and then initialize submodules
git clone https://github.com/your-org/main-repo
cd main-repo
git submodule init
git submodule update
```

3. Updating Submodules
```bash
# Pull latest changes in submodule
cd content
git pull origin main

# Update submodule reference in main repo
cd ..
git add content
git commit -m "Update content submodule"
```

4. For Marketing Team Members:
```bash
# They can work directly with just the content repository
git clone https://github.com/your-org/content-repo
cd content-repo
# Make changes, commit, push as normal
```

> [!BENEFITS]
> Benefits for Your Use Case:
> 
> 1. Marketing Team Benefits:
> •  Only need to clone the content repository
> •  Simpler Git workflow
> •  Don't need to deal with application code
> •  Can have their own CI/CD pipeline for content
> 2. Developer Benefits:
> •  Can choose to fetch content or not
> •  Clear separation of concerns
> •  Can update content reference when needed
> •  Can have different access controls
> 3. Overall Benefits:
> •  Separate version histories
> •  Independent workflow
> •  Lighter checkouts
> •  Different access permissions possible

## Important Considerations

1. Submodule States:
```bash
# Check submodule status
git submodule status

# Update all submodules to their latest commits
git submodule update --remote
```
1. Branch Management
	1. Each Submodule can track its own branch.
	2. Main repo tracks specific commits of submodules
2. Common Gotchas
	1. ***Always publish submodule changes before main repo changes***
3. Configuration
```bash
# Configure submodule to track a specific branch
git config -f .gitmodules submodule.content.branch main
```

## Setting up a team with Submodules

1. Create the Content Repository
```bash
mkdir content-repo
cd content-repo
git init
# Add your content
git add .
git commit -m "Initial content commit"
# Create GitHub repository and push
```

2. Add to the Main Repository
```bash
cd main-repo
git submodule add https://github.com/your-org/content-repo content
git commit -m "Add content submodule"
```

3. Documentation for Team:
```bash
# For Developers

# Clone full repository:
git clone --recurse-submodules [main-repo-url]

# Update content:
git submodule update --remote content
```

```bash
# For Content Team

Clone content repository:
git clone [content-repo-url]
```

# Using `.gitattribute` for large codebases
#### Example `.gitattributes` file:

```text
# Default behavior: normalize line endings to LF on checkin
* text=auto

# Explicitly declare text files to normalize
*.md text diff=markdown
*.txt text
*.js text
*.ts text
*.jsx text
*.tsx text
*.json text
*.yml text
*.yaml text
*.css text
*.scss text
*.html text

# Declare files that will always have CRLF line endings
*.bat text eol=crlf

# Denote all files that are truly binary and should not be modified
*.png binary
*.jpg binary
*.gif binary
*.ico binary
*.pdf binary
*.zip binary
*.ttf binary
*.woff binary
*.woff2 binary

# Better diff handling for specific file types
*.md diff=markdown
*.png diff=exif
package-lock.json -diff
yarn.lock -diff
pnpm-lock.yaml -diff

# Handle large files
*.png filter=lfs diff=lfs merge=lfs -text
*.jpg filter=lfs diff=lfs merge=lfs -text
*.pdf filter=lfs diff=lfs merge=lfs -text
```

Let's break down what each section does:

1. * text=auto
•  Automatically detects if a file is text or binary
•  Normalizes line endings to LF (Linux/Mac style) in the repository
•  Converts to appropriate line endings on checkout based on OS

2. Text File Declarations:
```text
   *.md text diff=markdown
   *.js text
```

•  Explicitly marks these files as text
•  Ensures proper line ending handling
•  diff=markdown enables better diff viewing for Markdown files



3. Binary File Declarations:
```text
   *.png binary
   *.jpg binary
```

•  Tells Git these are binary files
•  Prevents line ending conversion
•  Improves diff handling

4. Lock File Handling:
```bash
   package-lock.json -diff
```

•  Prevents showing diffs for lock files
•  Reduces noise in pull requests

5. Git LFS Configuration:
```bash
   *.png filter=lfs diff=lfs merge=lfs -text
```
•  Configures files to use Git Large File Storage
•  Good for managing large binary files

Special Features:

1. Markdown-specific handling:
```text
   *.md diff=markdown
```

•  Improves how Git shows changes in Markdown files
•  Better handles headings and lists in diffs

2. Language-specific diffs:
```text
   *.java diff=java
   *.cpp diff=cpp
```
•  Enables language-aware diff handling
•  Better shows structural changes

> [!TIPS]
> Benefits of using .gitattributes:
> 1. Consistent line endings across team members
> 2. Better handling of binary files
> 3. Improved diff output
> 4. Proper encoding handling
> 5. Consistent experience across different operating systems

## Git Workflow

### 1. Start a new feature:
```bash
git checkout develop
git checkout -b feature/name-of-feature
```

•  Work on this branch with as many small commits as needed
•  Commit often with detailed messages

### 2. Completing a new feature:
```bash
git checkout develop
git merge --no-ff feature/name-of-feature
git branch -d feature/name-of-feature
```

•  The --no-ff flag creates a merge commit even for fast-forward merges
•  This preserves the feature branch history in develop

### 3. Prepare a release:
```bash
git checkout develop
git checkout -b release/v1.2.0
```

•  Make any release-specific adjustments
•  Update version numbers, changelog, etc.

### 4. Completing a Release (the key to your clean production history):

```bash
# First, merge to main with squash
git checkout main
git merge --squash release/v1.2.0
git commit -m "Release v1.2.0

Key Features:
- Feature A: Description
- Feature B: Description
- Bug fixes for X, Y, Z

For detailed changelog, see CHANGELOG.md"

# Then merge back to develop (with all history)
git checkout develop
git merge --no-ff release/v1.2.0
git branch -d release/v1.2.0
```


### Commands used most often:

#### Creating branches:
```bash
git checkout -b feature/name
git checkout -b release/v1.2.0
```

#### Updating your feature branch:
```bash
git checkout feature/name
git rebase develop  # Keep feature branch up-to-date
```

#### Reviewing Changes
```bash
git log --oneline  # Quick overview
git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s' # Visual branch history
```

#### Merging with preserved history:
```bash
git merge --no-ff feature/name
```

#### Clean merges to production:
```bash
git merge --squash release/v1.2.0
```

> [!TIP]
> Tips for Success:
> 1. Always create feature branches from develop
> 2. Use descriptive branch names (feature/add-user-authentication)
> 3. Write detailed commit messages in feature branches
> 4. When merging to main, write comprehensive squash commit messages
> 5. Keep your changelog updated alongside code changes
> 6. Use tags for releases: git tag -a v1.2.0 -m "Version 1.2.0"

This strategy gives you:
•  Clean, meaningful production history in main
•  Complete development history in develop
•  Detailed feature development histories in feature branches
•  Clear release points with comprehensive messages
•  Easy rollback capabilities
•  Preserved detailed history for debugging


# Stylistic Guidelines
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
