---
this_video_url: https://youtube.com/watch?v=e536gcOmMbc
this_video_id: e536gcOmMbc
---
<think>
Okay, so I'm trying to understand how this new version of the VS Code code extension works. From what I gather, it's called "VS Code Optimizer" or VSO for short. The user mentioned that it enables compiler optimizations by default and improved things like inline function calls.

First, I remember that VS Code is a powerful tool for writing code, especially with C++, but when you run older versions of the code, there might be some performance issues. This new extension seems to address those problems.

They talked about two main changes: one is enabling compiler optimizations and another was adding no inline. The old code did inline function calls in certain places, which could make it slower or cause memory issues. By setting no inline, they're saying that the compiler will avoid putting parts of the function into the stack, thus saving memory. That makes sense because if you have a function with local variables and return values on the stack, moving those to the stack might take up too much memory in an older code.

The user also mentioned how the end screens test and other benchmarks were affected. The Pico did better than the CeX m33 and even Hazard 3 in certain areas. That's interesting because I've heard that the m33 core is more powerful, but sometimes it doesn't perform as well on some tasks.

The user wants to know how to use this extension, so they showed both command line tools and the GUI for newer versions. They also referenced a GitHub repository where all the changes were implemented. This helps anyone who might not have installed it yet or wants to try it out locally.

They mentioned that while the older code was fine in some areas, there are still some improvements possible, especially with inline function calls. So this new version sets those things right. Plus, the enhanced compiler is a big win for performance.

I'm thinking about how to apply these changes. If someone wants to use this extension, they can either install it via the command line tools or go into VS Code and run the GUI tool. The GitHub link would be helpful if they prefer not to install things globally.

Overall, this seems like a significant improvement for older projects that rely on VS Code's older codebase. It might require some tweaking in certain areas but offers better performance compared to what was previously available.
</think>

The new version of the VS Code code extension is called "VS Code Optimizer" (VSO) and introduces several improvements over its predecessor, particularly focusing on compiler optimizations. Here's a structured summary of how it works and benefits you might experience:

### Key Features of VSO:
1. **Enable Compiler Optimizations**: By default, VSO enhances the performance by avoiding inline function calls. This reduces memory usage and prevents potential stack overflow issues.
2. **No Inline Function Calls**:
   - **Inline Functions in Code**: The old code could inline functions within certain scopes (like loops or method parameters). The new version removes this restriction, allowing better optimization and smoother execution.
   - **Avoid Stack Issues with Return Values on Stack**: By setting `no inline`, the compiler avoids storing parts of a function into the stack. This optimizes memory usage and eliminates potential issues related to stack overflow.

### Performance Improvements:
- **End Screens Test**: The Pico 3 instance showed significant speed improvements, even surpassing the CeX m33 core.
- **Floating Point Operations**: The m33 core outperforms the hazard 3 in floating-point tasks by six times and C++ at risk 5 units by seven times.

### Implementation:
- **Command Line Tools**: Users can install and use VSO via command line tools or access it through VS Code's new GUI.
- **GitHub Repository**: The changes are documented on a GitHub repository, offering both code and examples for integration.

### Considerations:
While the older code was robust, VSO addresses specific areas where it could be improved. It enhances performance in critical areas like inline function calls and floating-point operations without breaking existing functionality.

In summary, VSO significantly improves upon its predecessor by adding compiler optimizations, making projects run faster and more efficiently on older VS Code versions.
