---
tags:
  - Terminal-Assistants
date_created: 2025-03-20
date_modified: 2025-03-20
---

If you haven't already, download [[Tooling/AI-Toolkit/Generative AI/Code Generators/Warp|Warp]] from the [Warp website](https://docs.warp.dev/).


## Awesome themes

On [[Organizations/Apple|Apple]]
```bash
mkdir -p $HOME/.warp
cd $HOME/.warp/
git clone https://github.com/warpdotdev/themes.git
```

## Notebooks are a breakthrough in productivity
Make sure to study the documentation on [Notebooks](https://docs.warp.dev/features/warp-drive/notebooks) here.

## Warp really wants you to set environment variables...

> [!DIALOG]
> [!USER] Why does the environment variables option keep popping up on commands?  Why should I fill it out?  What do environment variables do in Warp?
> 
> [!WARP] Environment variables in Warp are a powerful feature that allow you to manage and securely handle configuration values and secrets in your terminal sessions. Here's why they're important and how they work:
> 
> 1. What Environment Variables Do in Warp:
> •  They work like .env files but with more powerful features
> •  They can be loaded into your terminal session with a single click
> •  They can be used in parameterized workflows
> •  They can dynamically reference secrets from external managers
> 2. Why You Should Use Them:
> •  Security: They provide a secure way to handle sensitive information, especially with dynamic variables that integrate with secret managers like 1Password or LastPass
> •  Convenience: You can quickly load sets of environment variables into your session without manually typing them
> •  Consistency: They help ensure your environment is configured correctly across different contexts (like staging vs production)
> •  Workflow Integration: They can be used as parameters in Warp workflows, making your commands more reusable across different environments
> 3. Two Types of Environment Variables in Warp:
> •  Static Variables: Similar to traditional .env files, good for non-sensitive configuration
> •  Dynamic Variables: For sensitive information, these pull from external secret managers at runtime
> 4. Ways to Use Environment Variables:
> •  Load them into your current session
> •  Load them into a subshell (isolated environment)
> •  Use them with workflows as parameters
> 
> The environment variables option appears frequently because it's a fundamental way to securely handle configuration and secrets in your terminal sessions. Rather than hardcoding sensitive values into your commands or scripts, you can use environment variables to manage them more securely and flexibly.

## What's the difference between Warp Notebooks and Warp Workflows?
Here are the key differences between Warp Workflows and Notebooks:

Workflows:
•  Are reusable command templates
•  Can be parameterized with variables
•  Support environment variable configuration
•  Are meant to be executed
•  Live in your ~/.warp/workflows directory
•  Are typically shorter, focused on a single command or task
•  Can be shared across your team

Notebooks:
•  Are like documentation/notes for your terminal
•  Store command history and context
•  Can include explanatory text and markdown
•  Are meant for reference and learning
•  Live in your ~/.warp/notebooks directory
•  Can be longer, containing multiple related commands and explanations
•  Are more personal, like a command journal

Think of Workflows as "command templates" you want to reuse, while Notebooks are more like "command documentation" you want to reference later. 

For your ripgrep (rg) command case, a Workflow would be more appropriate because you want to reuse the command without the environment variable prompts. A Notebook entry would be better if you wanted to document different variations of the command with explanations of how they work.