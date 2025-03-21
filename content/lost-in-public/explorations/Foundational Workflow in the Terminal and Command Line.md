---
date_created: 2025-03-19
date_modified: 2025-03-21
---

  

![](https://i.imgur.com/7mQYPvA.png)



```bash
mps@sys76:~/Applications/Perplexica$ tree
.
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── app.dockerfile
├── backend.dockerfile
├── config.toml
├── data
├── docker-compose.yaml
├── docs
│   ├── API
│   │   └── SEARCH.md
│   ├── architecture
│   │   ├── README.md
│   │   └── WORKING.md
│   └── installation
│       ├── NETWORKING.md
│       └── UPDATING.md
├── drizzle.config.ts
├── package.json
├── searxng
│   ├── limiter.toml
│   ├── settings.yml
│   └── uwsgi.ini
├── src
│   ├── app.ts
│   ├── chains
│   │   ├── imageSearchAgent.ts
│   │   ├── suggestionGeneratorAgent.ts
│   │   └── videoSearchAgent.ts
│   ├── config.ts
│   ├── db
│   │   ├── index.ts
│   │   └── schema.ts
│   ├── lib
│   │   ├── huggingfaceTransformer.ts
│   │   ├── outputParsers
│   │   │   ├── lineOutputParser.ts
│   │   │   └── listLineOutputParser.ts
│   │   ├── providers
│   │   │   ├── anthropic.ts
│   │   │   ├── gemini.ts
│   │   │   ├── groq.ts
│   │   │   ├── index.ts
│   │   │   ├── ollama.ts
│   │   │   ├── openai.ts
│   │   │   └── transformers.ts
│   │   └── searxng.ts
│   ├── prompts
│   │   ├── academicSearch.ts
│   │   ├── index.ts
│   │   ├── redditSearch.ts
│   │   ├── webSearch.ts
│   │   ├── wolframAlpha.ts
│   │   ├── writingAssistant.ts
│   │   └── youtubeSearch.ts
│   ├── routes
│   │   ├── chats.ts
│   │   ├── config.ts
│   │   ├── discover.ts
│   │   ├── images.ts
│   │   ├── index.ts
│   │   ├── models.ts
│   │   ├── search.ts
│   │   ├── suggestions.ts
│   │   ├── uploads.ts
│   │   └── videos.ts
│   ├── search
│   │   └── metaSearchAgent.ts
│   ├── utils
│   │   ├── computeSimilarity.ts
│   │   ├── documents.ts
│   │   ├── files.ts
│   │   ├── formatHistory.ts
│   │   └── logger.ts
│   └── websocket
│       ├── connectionManager.ts
│       ├── index.ts
│       ├── messageHandler.ts
│       └── websocketServer.ts
├── tsconfig.json
├── ui
│   ├── app
│   │   ├── c
│   │   │   └── [chatId]
│   │   │       └── page.tsx
│   │   ├── discover
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── library
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── page.tsx
│   │   └── settings
│   │       └── page.tsx
│   ├── components
│   │   ├── Chat.tsx
│   │   ├── ChatWindow.tsx
│   │   ├── DeleteChat.tsx
│   │   ├── EmptyChat.tsx
│   │   ├── EmptyChatMessageInput.tsx
│   │   ├── Layout.tsx
│   │   ├── MessageActions
│   │   │   ├── Copy.tsx
│   │   │   └── Rewrite.tsx
│   │   ├── MessageBox.tsx
│   │   ├── MessageBoxLoading.tsx
│   │   ├── MessageInput.tsx
│   │   ├── MessageInputActions
│   │   │   ├── Attach.tsx
│   │   │   ├── AttachSmall.tsx
│   │   │   ├── Copilot.tsx
│   │   │   ├── Focus.tsx
│   │   │   └── Optimization.tsx
│   │   ├── MessageSources.tsx
│   │   ├── Navbar.tsx
│   │   ├── SearchImages.tsx
│   │   ├── SearchVideos.tsx
│   │   ├── Sidebar.tsx
│   │   ├── theme
│   │   │   ├── Provider.tsx
│   │   │   └── Switcher.tsx
│   │   └── ui
│   │       └── Select.tsx
│   ├── lib
│   │   ├── actions.ts
│   │   └── utils.ts
│   ├── next.config.mjs
│   ├── package.json
│   ├── postcss.config.js
│   ├── public
│   │   ├── next.svg
│   │   └── vercel.svg
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── yarn.lock
├── uploads
└── yarn.lock
```

## Checking for [[Port Clashes]]
```bash
ss -tuln | grep -E ':(3000|3001|4000)'
```

# Linux Specifics
Many of the apps and software that anyone will install on [[The Linux Foundation|Linux]] will use the command line. 

### Upgrading Software
Similar to the upgrade process in App Stores, we need to ping the servers from which we get our software to see if there is an upgrade available. 
```bash
sudo apt update
sudo apt list --upgradable
```

#### CA Certificates
```bash
sudo apt install ca-certificates curl gnupg
```

> [!LLM Response] [[Warp]] explains a CA Certificate
> What does sudo apt install ca-certificates curl gnupg do?  What is a ca-certificate? and gnupg?
> Let me break down each component of sudo apt install ca-certificates curl gnupg:
> 
> 1. ca-certificates:
> •  CA stands for "Certificate Authority"
> •  This package contains a bundle of trusted root certificates
> •  These certificates are used to verify the authenticity of SSL/TLS connections
> •  When you connect to secure websites (HTTPS) or download from secure repositories, these certificates help verify that you're connecting to legitimate sources
> •  Without them, you might get security warnings or be unable to connect to secure sources
> 2. curl:
> •  A command-line tool for transferring data using various protocols (HTTP, HTTPS, FTP, etc.)
> •  Used to download files, make API requests, and interact with web services
> •  In the Docker installation process, it's used to download the Docker GPG key
> 3. gnupg (GNU Privacy Guard):
> •  A complete implementation of the OpenPGP standard
> •  Used for:
> ◦  Digital signatures: Verifying that software packages come from trusted sources
> ◦  Encryption: Protecting sensitive data
> ◦  Key management: Managing cryptographic keys
> •  In the Docker installation, it's used to verify the Docker repository's GPG key, ensuring you're installing genuine Docker packages
> 
> These three packages are essential for secure software installation because they enable:
> 4. Secure connections to download sources (ca-certificates)
> 5. Ability to download files (curl)
> 6. Verification of package signatures (gnupg)
> 
> Together, they form a security chain that helps ensure you're downloading and installing legitimate software from authenticated sources.
> When I install a software package on the command line, it shows me it is installing dependencies, and then lists suggested packages. Is there an argument I can add that will install suggestions too?


>[!LLM Reponse] [[Tooling/AI-Toolkit/Generative AI/Code Generators/Warp|Warp]] explains installation arguments
>For apt (the package manager in Debian-based Linux distributions like Ubuntu), you can install suggested packages automatically by using the --install-suggests option with apt-get. Here are the relevant options:
>•  --install-suggests: Install all suggested packages
>•  --install-recommends: Install recommended packages (this is the default behavior)
>•  --no-install-recommends: Don't install recommended packages
>
>For example, to install a package with its suggested packages:
>Note that installing suggested packages can significantly increase the number of packages installed on your system, as these are usually optional extras that aren't strictly necessary for the main package to function. That's why they're not installed by default. Make sure you really want the suggested packages before using this option.
>
>If you just want to see what the suggested packages are without installing them, you can use:
>`apt-cache show package_name`

