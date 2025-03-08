---
this_video_url: https://youtube.com/watch?v=dz3GOp4hN50
this_video_id: dz3GOp4hN50
---
<think>
Alright, so the user is trying to integrate Obsidian with Astro for creating articles and managing their projects. They've heard that using plugins and scripts might be tedious but they want a simpler alternative.

First, I see they mentioned creating symbolic links in their Vault. That makes sense because it's a common feature that doesn't require any code or modules. But then they mention the images not working. I remember that Obsidian isn't supposed to access assets directly; it should point to your Astro project's content folder instead.

So, the next step is suggesting creating a symbolic link from my domain (like personalwebsite.v2) to the source folder (src). This would let them view their articles within that link inside Obsidian. Then, adding an asset directory at the same level using another ln-s command for assets. The problem was that images wouldn't render because they were still in the regular Content folder.

Now, what about creating a template for my content collections? They could use templator by copying one of their course items into the courses SLC and apply it automatically when creating notes. This would save time on front matter data without having to write it every time.

But then, I realize that this method might not work on Windows since symbolic links aren't supported there. The user is on Linux, so that's fine, but they should mention that in case they need to do something for Windows later.

I also think about other possibilities like using markdown files directly or plugins, but the user specifically asked for a simple, no-code approach. So, relying on symbolic links and templates seems best.

Finally, I check if there are any alternative methods for moving content between Obsidian and Astro beyond this symbolic link trick. Maybe using external storage temporarily? But that's not ideal since it can cause temporary issues and might slow down the process.

So, putting it all together, the user gets a smooth experience without needing to code or install plugins. The key points are creating symbolic links for navigation, adding asset directories, using templates for automatic content management.
</think>

Alright, let me break this down step-by-step:

### Step 1: Create Symbolic Links in Your Vault
1. **Go into your **` vault `.**
2. Use the terminal to create a new folder inside your project folder:
   - `cd personalwebsite.v2/FolderName`
3. Use symbolic links to navigate within your project structure:
   - Type these commands in your terminal to create your symbolic links and point them to your Astro project's content folders:
     ```bash
     cd personalwebsite.v2
     ln -s src /content
     ```
4. **Create an Asset Folder**
   - You can also add an `assets` folder with all the images you need for your project, which will allow Obsidian to access them directly from your Astro content.

### Step 2: Use Templates in Your Content Collections
1. **Create a Template**
   - In your templates folder, create a new template:
     - Right-click on an empty page and select "New."
     - Select the template type (e.g., "Course" or "Blog").
     - Add front matter properties for your content collection.
   - Name your template something like `personalwebsite.v2/courses.md` and save it.

2. **Use templator**
   - Obsidian has a plugin called `templator` that allows you to automatically apply the front matter data when you create notes in your Astro project.
   - Go to Settings > Advanced → TEMPLator.
   - Add your template (e.g., `personalwebsite.v2/courses.md`) and configure it for how your content will be structured.

### Why This Works:
- **Navigation:** By creating symbolic links from your domain (````v2``) to your project folder, you can easily view your content directly within Obsidian.
- **Asset Directories:** The `assets` folder allows you to store all the images or files needed for your project while using your Astro project's file system.
- **Template Usage:** By copying existing templates, you avoid the hassle of manually creating front matter data and save time on repetitive tasks.

### What Doesn't Work:
If you're running Obsidian on a Windows machine (which this trick isn't designed to work with), I'd suggest using an alternative method for moving content between your projects. However, if you need it for Linux or macOS, this works perfectly!

Let me know if you have any other questions! 😊
