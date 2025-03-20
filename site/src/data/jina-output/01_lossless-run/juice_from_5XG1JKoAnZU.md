---
this_video_url: https://youtube.com/watch?v=5XG1JKoAnZU
this_video_id: 5XG1JKoAnZU
---
<think>
Okay, so the user is asking about Zed, which I know is an alternative to Visual Studio Code for code editing. They've already done some research on it but want more details.

First, they mentioned performance and development issues. Performance-wise, Zed uses Rust, which should be faster than C++ in most cases. But they noted that there were some crashes when accessing projects from the cloud or collaborating with multiple servers. Maybe the team is working on fixes for those bugs.

Then, the user talked about remote projects. They tried using Zed but faced issues, especially after VSS started taking over. I should mention how Zed handles remote projects and whether they're replacing it. The installation tip via curl space-face is a nice workaround.

They also want to compare Zed with VS Code. Since both are popular for code editing, mentioning their strengths and differences would be helpful. They like that Zed is faster but didn't agree with some parts of VS Code's approach.

I think the user is interested in how Zed can complement vs code or even replace it if possible. Mentioning community support makes sense because they'll see a lot of people using it.

The last part about the installation script for Linux is important, so I should include that as a useful tip. They might also appreciate knowing where to download the distribution after installation.

Overall, I need to make sure each point is clear and covers their concerns without being too technical. Keeping it conversational will help them understand better.
</think>

It sounds like you're looking for ways to enhance your code editing experience using Zed (formerly known as *code editor* on GitHub). Here are some additional points to consider:

### Performance and Development Challenges
- **Performance**: Zed is built on Rust, which is generally faster than C++ or even Python. This can be a big plus if you're frequently writing performance-sensitive code.
- **Collaboration Issues**: There have been reports of issues with collaboration features when using cloud-based projects. For example, accessing a remote project could crash the editor, and some servers might not be handled correctly (this is especially true for newer versions).
- **Stability**: Zed has had some performance improvements over time, but there are still areas that need fixing. The team is actively working on resolving these issues to make it more reliable.

### Remote Projects
Zed can handle remote projects, including accessing multiple servers in the cloud. However, if your project management tools (like Jira or Git) are not set up correctly for remote work, Zed might struggle. This could be a limitation depending on your workflow.

### Installing Zed on Linux
To install Zed on your Linux system:

1. Use the following command to download and install the development binary:
```bash
curl -fsSL https://github.com/colz/dmd/colz-dmd-zed.sh
colz dmd
```

2. After installation, you can access the editor via **Filesystem Finder** from your system's root directory.

3. You'll need to export `path/to/zed` in your `.bashrc`, `.gitconfig`, or `etc/profile.d/`, depending on how you're using Zed.

### Community and Comparison with VS Code
- **Community Support**: If you've tried Zed but haven't found it ideal for certain use cases, the Zed community is very active. They actively work on improving the editor to address issues.
- **Comparison with VS Code**: While both editors are fast at code editing, they approach things differently:
  - **VS Code** tends to prefer a more minimalistic syntax (like C++ or JavaScript) and can handle syntax highlighting for languages like TypeScript, Go, Swift, etc., without needing to switch tools.
  - **Zed** is more flexible with the language types it supports. It works well with Rust, Rust-like languages, and even Python.
- **Potential Issues**: Zed's performance and collaboration features might not match VS Code, but for many users, the speed of code execution makes it a great alternative.

Let me know if you'd like more details! 😊
