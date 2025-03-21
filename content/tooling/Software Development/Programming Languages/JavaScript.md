---
site_uuid: 8128ddd8-c583-4c79-9451-7a9ef2377f91
url: https://ecma-international.org/publications-and-standards/standards/ecma-262/
tags:
- Software-Development
- Programming-Languages
site_name: Ecma International
title: ECMA-262 - Ecma International
og_screenshot_url: https://og-screenshots-prod.s3.amazonaws.com/1366x768/80/false/ea6d742078d0a298ddac4afe56a53c161c4b9c2d09fb6c57621578095194f890.jpeg
og_errors: 'true'
og_last_error: '2025-03-07T10:19:44.820Z'
og_error_message: 'HTTP error 401'
jina_last_request: '2025-03-09T06:45:19.160Z'
jina_error: 'Error occurred'
og_last_fetch: '2025-03-07T06:11:14.691Z'
---
https://youtu.be/k4xuEl6TmT4?si=0hxbL-1xVxjeTqSD


[[Web Frameworks]] include [[NEXT.js]], [[React]], [[Vue.js]], [[Solid.js]], [[Nextra]], [[Astro]].

>"In the past two years I have gone Webpack -> Parcel -> Webpack -> Vite -> Rollup"
>
>"I call this the "JavaScript treadmill", where everything that's more than two years old is garbage written by nincompoops, but _now_ we all got it right and _now_ everything is fantastic, and the only people who criticize it are grumpy crusty old backend boomers too lazy to learn anything new." [^1]

[^1]: 2025, Oct 2025. [Rsbuild – A Better Vite?](https://news.ycombinator.com/item?id=41941414) [[HackerNews]]


<iframe style="aspect-ratio:16/9;width:100%;height:auto" src="https://www.youtube.com/embed/d_oVysaqG_0?si=xworDx9cpky4dnHD&amp;controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

> [!NOTE] AI Explains the JavaScript tooling universe
> The JavaScript tooling ecosystem is vast and can be intimidating because it contains tools for every stage of the software development lifecycle—ranging from runtime environments to package managers, task runners, bundlers, and frameworks. Here's a contextual breakdown of these tools, grouped by their purpose, with explanations of what they are and why we need them.
> 
> ---
> 
> ## **1. JavaScript Runtime Environments**
> 
> These allow developers to execute JavaScript outside the browser.
> 
> ### **[[Node.js]]**
> 
> - **What it is:** A cross-platform runtime for executing JavaScript on the server-side.
> - **Why we need it:** Node.js enables developers to use JavaScript for building server-side applications, command-line tools, REST APIs, and more.
> - **Key features:**
>     - Built on the V8 engine (used in Google Chrome).
>     - Provides server-side APIs for tasks like file I/O, networking, and process management.
>     - Forms the backbone of many JavaScript tools.
> 
> ### **[[Deno]]**
> 
> - **What it is:** A modern runtime created by the original developer of Node.js.
> - **Why we need it:** Deno improves upon Node.js by addressing security concerns, providing built-in TypeScript support, and allowing module imports directly from URLs.
> - **Key features:**
>     - Secure by default (sandboxed execution).
>     - Simplified module management (no `node_modules`).
>     - Supports TypeScript out of the box.
> 
> ### **[[Bun]]**
> 
> - **What it is:** A fast JavaScript runtime and toolkit, similar to Node.js and Deno.
> - **Why we need it:** Bun focuses on speed and ease of use, combining runtime execution, a package manager, and a bundler into one tool.
> - **Key features:**
>     - Extremely fast (built in Zig for performance).
>     - Provides integrated tooling for testing, transpiling, and bundling.
>     - Compatible with most Node.js APIs.
> 
> ---
> 
> ## **2. Package Managers**
> 
> These tools manage dependencies, install libraries, and handle versioning for JavaScript projects.
> 
> ### **[[npm]] (Node [[Packages and Libraries|Package]] Manager)**
> 
> - **What it is:** The default package manager for Node.js.
> - **Why we need it:** npm allows developers to install third-party libraries, manage dependencies, and publish packages to the npm registry.
> - **Key features:**
>     - Comes bundled with Node.js.
>     - Supports millions of libraries in the npm ecosystem.
> 
> ### **pnpm**
> 
> - **What it is:** A fast and efficient alternative to npm.
> - **Why we need it:** pnpm saves disk space by using symlinks to share dependencies across projects, making it faster and more efficient than npm.
> - **Key features:**
>     - Strict dependency resolution.
>     - Reduced disk usage (shared `node_modules` structure).
> 
> ### **yarn**
> 
> - **What it is:** Another package manager, created as an alternative to npm.
> - **Why we need it:** Yarn improves dependency resolution speed and reliability.
> - **Key features:**
>     - Deterministic dependency resolution (ensures the same dependencies are installed every time).
>     - Supports monorepos (managing multiple projects in a single codebase).
> 
> ---
> 
> ## **3. Build Tools and Bundlers**
> 
> These tools prepare your code for production by bundling, transforming, and optimizing it.
> 
> ### **[[Vite]]**
> 
> - **What it is:** A modern build tool and development server.
> - **Why we need it:** Vite offers near-instant startup and fast Hot Module Replacement (HMR) during development by leveraging native ES modules.
> - **Key features:**
>     - Designed for modern JavaScript frameworks like React, Vue, and Svelte.
>     - Uses Rollup for production builds.
>     - Extremely fast development server.
> 
> ### **[[Parcel]]**
> 
> - **What it is:** A zero-configuration bundler.
> - **Why we need it:** Parcel simplifies the build process by requiring no configuration for most projects, making it ideal for small to medium-sized applications.
> - **Key features:**
>     - Automatic code splitting.
>     - Built-in support for modern JavaScript features (e.g., TypeScript, JSX).
> 
> ### **[[Turbopack]]**
> 
> - **What it is:** A next-generation bundler, created by the team behind Webpack.
> - **Why we need it:** Turbopack is designed to be much faster than existing tools, with a focus on incremental builds and reducing developer wait times.
> - **Key features:**
>     - Extremely fast dev server and bundling.
>     - Ideal for large-scale applications.
> 
> ---
> 
> ## **4. Build Orchestration and Monorepo Tools**
> 
> These are used to manage and coordinate builds, especially in projects with multiple applications.
> 
> ### **[[Nx]]**
> 
> - **What it is:** A development platform for managing monorepos.
> - **Why we need it:** Nx helps developers manage multiple projects in a single repository, providing tools for dependency management, task orchestration, and optimized builds.
> - **Key features:**
>     - Focused on developer productivity.
>     - Built-in support for modern frameworks like React, Angular, and Node.js apps.
> 
> ---
> 
> ## **5. Web Frameworks**
> 
> These simplify the process of building server-side or full-stack applications.
> 
> ### **[[Express]]**
> 
> - **What it is:** A minimalist web framework for Node.js.
> - **Why we need it:** Express provides a simple, unopinionated way to build server-side applications and APIs.
> - **Key features:**
>     - Flexible routing system.
>     - Middleware support for handling requests and responses.
> 
> ### **[[Fastify]]**
> 
> - **What it is:** A fast and lightweight web framework for Node.js.
> - **Why we need it:** Fastify is designed to be faster than Express, with built-in schema validation and optimized performance.
> - **Key features:**
>     - High performance (low overhead).
>     - JSON schema validation.
>     - Plugin-based architecture.
> 
> ---
> 
> ## **6. Environment and System Tools**
> 
> These tools help manage the development environment and dependencies on your system.
> 
> ### **[[Homebrew]]**
> 
> - **What it is:** A [[Packages and Libraries|Package]] manager for macOS and Linux.
> - **Why we need it:** Homebrew allows developers to install system-level dependencies, such as Node.js, Deno, and other tools, in a simple and consistent way.
> - **Key features:**
>     - Simplifies installing and updating software.
>     - Handles system dependencies for development.
> 
> ---
> 
> ## **Why Do We Need These Tools?**
> 
> Modern JavaScript development is complex because:
> 
> 1. **Dependencies:** Projects rely on many third-party libraries, which need to be installed, managed, and versioned (handled by tools like npm, pnpm, yarn).
> 2. **Performance:** Development workflows need fast builds, hot-reloading, and efficient production optimizations (handled by Vite, Parcel, Turbopack).
> 3. **Scalability:** Large applications require tools to manage multiple projects or codebases (handled by Nx, monorepo setups).
> 4. **Server Needs:** Server-side applications require frameworks like Express or Fastify to handle routing, middleware, and APIs.
> 5. **Environment Setup:** Developers need tools like Homebrew to install and configure runtimes and dependencies efficiently.
> 
> ---
> 
> ## **How These Tools Work Together**
> 
> Here’s how you might combine these tools in a real-world project:
> 
> 1. **Install Environment:** Use Homebrew to install Node.js or Deno.
> 2. **Package Management:** Use npm, pnpm, or yarn to install dependencies.
> 3. **Development:** Use Vite for instant startup and hot-reloading during development.
> 4. **Build:** Use Turbopack (or another bundler) to prepare the app for production.
> 5. **Server-Side Framework:** Use Express or Fastify to set up a backend.
> 6. **[[Monorepo]] Management:** Use Nx to manage multiple frontend and backend projects in a single repository.
> 
> ---
> 
> ## **Conclusion**
> 
> Each tool in the JavaScript ecosystem has a specific purpose, and the key is to choose the right tools for your project’s needs. By understanding the role of runtime environments, package managers, bundlers, frameworks, and other tools, you can navigate this ecosystem effectively and build modern, performant applications.
