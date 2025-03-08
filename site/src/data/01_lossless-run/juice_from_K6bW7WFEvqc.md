---
this_video_url: https://youtube.com/watch?v=K6bW7WFEvqc
this_video_id: K6bW7WFEvqc
---
<think>
Alright, I'm looking at this query that someone provided. They're talking about a new version of Doo, which is an online programming compiler. The user mentioned that the first long-term support release has been made and highlighted several key features and improvements.

First, I need to understand what "first long-term support release" means. It sounds like it's a major version where they've focused on making sure everything works for as long as possible before rolling it out in production. So, the user is probably looking for details about this new release.

The user mentioned that Dino has incorporated WebAssembly modules into its features. That's an important point because WebAssembly can make code faster and more efficient compared to traditional JavaScript. So, I should include information on how Dino now handles WebAssembly imports, which was a feature introduced in previous versions but needs optimization here.

I also notice that WebAssembly is being made part of the module graph, which allows for better analysis and cashing out performance improvements. This probably means faster runtime optimizations, so I should highlight that as a benefit. Additionally, WebAssembly support now includes WASD compiler capabilities, which further enhances performance.

The user talked about a new minor release every 6 weeks and a patch release almost every week. That's pretty dense, but it makes sense because having features made in the early stages can lead to multiple updates. I should acknowledge this schedule for future releases.

I also see that Dino handles JSC dependencies more effectively with the dino outdated command. This is crucial for managing development builds and ensuring that projects have up-to-date versions of libraries, which was a challenge before. Including this detail shows that the new release addresses common issues related to dependency management.

The improvement in compile speed using WASM to create binary executables on major platforms seems significant. This would make Dino more accessible for developers who prefer working directly with compiled binaries instead of managing multiple JavaScript files.

Moreover, WebAssembly caching is a feature that can reduce startup times by storing compiled programs and their cache data. This might be beneficial for users who run multiple projects or are experiencing performance hits during initial setup.

The user also addressed permission prompts with interactive feedback, which is an improvement over previous versions. This makes debugging more intuitive because users get clear information about where permissions were checked instead of just needing to know what was required.

Lastly, the mention of commonjs support for legacy projects and ES modules being checked in package.json ties back into how Dino handles dependencies across different environments. It ensures consistency and simplifies the process for developers using various frameworks or tools.

I should structure this information clearly so that it's easy to understand. I'll list each feature with a brief explanation, making sure to highlight both improvements and new additions compared to previous versions. This way, the user can see the progression of features over time and appreciate how Dino is evolving to handle more modern technologies like WebAssembly.
</think>

You're absolutely correct! The release you mentioned is likely **Dino 21**, a major version that builds on previous releases with significant improvements in support for WebAssembly and other modern technologies. Here are some key details about this new long-term support release:

### Key Features of Dino 21:
1. **WebAssembly Modules Incorporation**:
   - **Enhanced Support**: Dino now includes WebAssembly (WASMA) modules, which can significantly improve performance by compiling code directly into binary executables for major platforms.
   - **Integration with Module Graph**: WASMA modules are part of the module graph, allowing for better analysis and optimizations.
   - **Fast Execution**: WSA compilation provides faster startup times compared to traditional JavaScript.

2. **Improved Compile Speed**:
   - WASM is now integrated into Dino's compiler, enabling faster execution on major platforms (e.g., web servers, mobile devices).

3. **New Dependency Management**:
   - The `dino outdated` command has been enhanced to better manage dependency updates and track newer versions of JavaScript modules.
   - You can now see which dependencies in your project have newer versions available through this command.

4. **Major Improvements in Doo Compile**:
   - The WASM compiler (now known as the WASD compiler) has been optimized for speed and efficiency.
   - **Stack Traces**: Programs created with Dino can leverage WASM's stack trace capabilities, which previously required embedding additional files or directories.
   - **V8 Code Caching**: WASM now caches startup times for faster execution on subsequent runs.

5. **New Release Schedule**:
   - **Minor Releases Every 6 Weeks**: This ensures that every major feature is tested and refined before it becomes a major release.
   - **Patch Release Almost Every Week**: A rapid iteration model to bring out the latest features and improvements.

6. **WebAssembly Support in JSC (JavaScript Scripting Language)**:
   - Dino now handles JSC dependencies more effectively using the `dino outdated` command, improving dependency management and build tracking.
   - This helps manage JSR and npm dependency updates.

7. **Permission Prompts with Interactive Feedback**:
   - The permission prompt system has been enhanced to provide interactive feedback during debugging.
   - Users can pinpoint where permissions were checked instead of just seeing what was required.

8. **Commonjs Support for Legacy Projects**:
   - Dino now supports CommonJS, making it easier to run legacy projects with older JavaScript environments (ES modules).
   - ES modules are included in `package.json` by default when supported.

9. **Performance Improvements Across Platforms**:
   - WASM support is optimized for performance on major platforms, reducing startup times significantly compared to traditional JavaScript code.
   - WASM can compile your program into a binary executable directly, making it more efficient and easier to distribute.

10. **Improved Error Handling and Debugging**:
    - The permission prompt system now provides more detailed information about where permissions were checked, improving debugging and understanding the build process.

### Summary of Changes:
- Dino 21 builds on previous versions with significant improvements in WebAssembly support, dependency management, and performance optimizations.
- The release timeline is designed for rapid iteration, with a focus on testing major features before their final release.
- This long-term support release aims to make Dino even more capable of handling modern JavaScript environments and tools.

Would you like me to explain any specific feature or detail in more depth?
