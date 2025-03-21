---
aliases:
  - WASM
---
A [[Web Standards|Web Standard]]

https://youtu.be/4ZSBlO3mqq0?si=eoNsKHzCRnzEUTQB

### How WebAssembly Works

WebAssembly (Wasm) operates by providing a low-level, portable binary format that modern browsers can compile into machine code. Here's an overview of how it works:

1. **Modules**: A WebAssembly module is a compiled binary file containing code and metadata. It is stateless and can be reused across multiple instances.
2. **Memory**: Wasm uses a linear memory model (a resizable `ArrayBuffer`) for data storage, which can be accessed by both Wasm and JavaScript.
3. **Compilation and Instantiation**:
   - The browser fetches the `.wasm` file.
   - Using APIs like `WebAssembly.instantiateStreaming()`, the module is compiled and instantiated directly from the network stream, improving efficiency[1][3].
4. **Integration with JavaScript**: JavaScript interacts with Wasm through imports/exports, enabling seamless function calls between the two[3].
5. **Execution**: Once instantiated, exported functions or memory from the Wasm module can be accessed and executed directly in JavaScript.

---

WebAssembly (Wasm) was created to enable high-performance applications in web browsers by providing a portable, compact, and fast binary format that can serve as a compilation target for various programming languages. Its development began in 2015 as a collaboration among major browser vendors, including Mozilla, Google, Microsoft, and Apple. It was influenced by earlier technologies like `asm.js` and Google Native Client, which aimed to optimize web performance and enable non-JavaScript languages to run in browsers[1][7].

The first version of WebAssembly was released in March 2017, and it became the fourth official language of the web in 2019 under the World Wide Web Consortium (W3C). The W3C maintains WebAssembly as an open standard with contributions from organizations like Mozilla, Microsoft, Google, Apple, Fastly, Intel, and Red Hat[1][6][7].

WebAssembly (Wasm) is maintained as an open standard by the **World Wide Web Consortium (W3C)**, with contributions from several major organizations. Key contributors include:

- **Mozilla**: A founding contributor, instrumental in Wasm's early development.
- **Microsoft**: Actively supports Wasm through its integration in tools like Azure and Edge.
- **Google**: Provides support via Chrome and V8, its JavaScript engine.
- **Apple**: Contributes through WebKit and Safari.
- **Fastly**: Focuses on Wasm's use in edge computing.
- **Intel and Red Hat**: Work on expanding Wasm's capabilities in cloud-native and enterprise environments[4][5].

Other contributors include companies like Cloudflare, Vercel, and Netlify, which support deploying Wasm in edge runtimes[6].

Sources
[1] The State of WebAssembly – 2024 and 2025 - Uno Platform https://platform.uno/blog/state-of-webassembly-2024-2025/
[2] WebAssembly is still waiting for its moment - LeadDev https://leaddev.com/technical-direction/webassembly-still-waiting-its-moment
[3] node/doc/contributing/maintaining/maintaining-web-assembly.md at ... https://github.com/nodejs/node/blob/main/doc/contributing/maintaining/maintaining-web-assembly.md
[4] WebAssembly - Wikipedia https://en.wikipedia.org/wiki/WebAssembly
[5] What tech teams need to know about WebAssembly - InfoWorld https://www.infoworld.com/article/3621615/what-tech-teams-need-to-know-about-webassembly.html
[6] What's Up With WebAssembly: Compute's Next Paradigm Shift! https://sapphireventures.com/blog/whats-up-with-webassembly-computes-next-paradigm-shift/
[7] WebAssembly Explained: A Beginner's Guide - FullStack Labs https://www.fullstack.com/labs/resources/blog/what-is-webassembly-and-what-is-it-used-for
[8] How WebAssembly Gets Used: The 18 Most Exciting Startups ... https://www.amplifypartners.com/blog-posts/how-webassembly-gets-used-the-18-most-exciting-startups-building-with-wasm


Sources
[1] WebAssembly - Wikipedia https://en.wikipedia.org/wiki/WebAssembly
[2] Server-side WebAssembly takes shape, but faces challenges https://www.techtarget.com/searchitoperations/news/366551352/Server-side-WebAssembly-takes-shape-but-faces-challenges
[3] The rise of WebAssembly | InfoWorld https://www.infoworld.com/article/2334563/the-rise-of-webassembly.html
[4] node/doc/contributing/maintaining/maintaining-web-assembly.md at ... https://github.com/nodejs/node/blob/main/doc/contributing/maintaining/maintaining-web-assembly.md
[5] Why WebAssembly Came to the Browser (Wasm in the Wild, Part 2) https://www.jakobmeier.ch/wasm-road-1
[6] WebAssembly Services - Software Consulting - Minnesota - Intertech https://www.intertech.com/webassembly-services/
[7] Evolution of Wasm Standards: Building the Component Model for ... https://cosmonic.com/blog/engineering/evolution-of-wasm-standards-building-the-component-model
[8] How WebAssembly Gets Used: The 18 Most Exciting Startups ... https://www.amplifypartners.com/blog-posts/how-webassembly-gets-used-the-18-most-exciting-startups-building-with-wasm
[9] Understanding Wasm, Part 2: Whence Wasm - Chris Dickinson https://www.neversaw.us/2023/06/30/understanding-wasm/part2/whence-wasm/

***
### Boilerplate [[Rust]] Project for WebAssembly

Below is a simple Rust project setup for compiling to WebAssembly.

#### 1. **Install Prerequisites**
Ensure you have:
- Rust installed (`rustup`).
- `wasm-pack` installed:  
  ```bash
  cargo install wasm-pack
  ```

#### 2. **Create a New Rust Project**
Run:
```bash
cargo new wasm_project --lib
cd wasm_project
```

#### 3. **Edit `Cargo.toml`**
Add the following dependencies:
```toml
[dependencies]
wasm-bindgen = "0.2"

[lib]
crate-type = ["cdylib"]
```

#### 4. **Write Rust Code**
Edit `src/lib.rs`:
```rust
use wasm_bindgen::prelude::*;

// Expose a function to JavaScript
#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}
```

#### 5. **Build the Project**
Run:
```bash
wasm-pack build --target web
```
This generates a `pkg/` directory containing `.wasm` and JavaScript glue code.

#### 6. **Create an HTML File**
Add `index.html` in the project root:
```html
<!doctype html>
<html>
<head><title>Rust + Wasm</title></head>
<body>
<script type="module">
    import init, { greet } from "./pkg/wasm_project.js";
    init().then(() => {
        console.log(greet("WebAssembly"));
    });
</script>
</body>
</html>
```

#### 7. **Serve Locally**
Use a web server (e.g., Python):
```bash
python3 -m http.server
```
Visit `http://localhost:8000` to see the result.

This boilerplate demonstrates how to set up a Rust project for WebAssembly and integrate it with a simple web app[2][4][6].

Sources
[1] Loading and running WebAssembly code - MDN Web Docs https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Loading_and_running
[2] Web Application with [[Rust]] and Web Assembly - YouTube https://www.youtube.com/watch?v=hcA_GuZHyZM
[3] WebAssembly concepts - MDN Web Docs https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Concepts
[4] Compiling from Rust to WebAssembly - MDN Web Docs https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Rust_to_Wasm
[5] Fundamentals of WebAssembly, the start of the Wasm in the wild ... https://www.jakobmeier.ch/wasm-road-0
[6] Introduction - Rust and WebAssembly https://rustwasm.github.io/book/
[7] WebAssembly https://webassembly.org
[8] Tutorial: Conway's Game of Life - Rust and WebAssembly https://rustwasm.github.io/book/game-of-life/introduction.html

>