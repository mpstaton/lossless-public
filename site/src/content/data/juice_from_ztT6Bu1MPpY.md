---
this_video_url: https://youtube.com/watch?v=ztT6Bu1MPpY
this_video_id: ztT6Bu1MPpY
---
<think>
Okay, so I'm trying to figure out how to use the Generate Cursor project rules feature. I've heard it's supposed to make managing your cursor rules easier by automatically generating them based on dependencies. Let me break down what I understand and try to put together a step-by-step guide.

First, I need to install the package. The user mentioned using 'package.json' or 'requirements.txt'. So, I should create a .rules folder in my project's root directory. If it doesn't exist yet, I'll make sure to create it. Then, I'll copy either a package.json or requirements.txt into that folder and rename it to rules.json or project_rules.json respectively.

Next, I need to ensure both file types are in the same directory so that Grock can process them together. That way, when Generate Cursor runs, everything works smoothly without any issues. I think just copying one into another should be enough, but I'll double-check if there are any restrictions or specific places they have to go.

Once the rules are set up, I open the general settings in cursor and look for project rules. There should already be some rules in there from my project setup, so I can copy those over without manually adding them again. After pasting, I need to make sure to hit enter or save when adding new rule fields. Once that's done, the Generate Cursor tool will analyze all the dependencies across both files and create custom rules.

I see a section for AI-related rules. That makes sense because you'll want rules for things like chat completions and language models. Then there are best practices sections for both front-end and back-end APIs, which should help me make my project faster and more performant.

Looking at the best practices in the back end, I see a lot of common algorithms and frameworks that developers use. By adding these to my project rules, I can ensure consistency across different parts of my app. It's like having a checklist for everything from fetching data to handling queries.

I also noticed an Integration section with various tools like Obsidian Markdown, Jira, Gitpod, etc. That's pretty standard, but the mention of a curated list of integrations is new to me. I'll need to explore these more once I get comfortable with generating rules.

To actually see the generated rules, I can look at the project directory in my settings. There should be some files named something like best_practice_rules.json and mcp_rules.json that I can open up next time I check cursor for changes.

I'm a bit confused about how to add MDC, which is Markdown Conversion, but it seems straightforward—it's just adding a specific rule field labeled MDC. That shouldn't be too hard since the tool should handle it automatically.

Testing this out, when I save my changes and open the project in cursor, I see all these rules appearing in the AI section. It feels like a significant time-saver because managing rules manually would have been tedious, especially if I had to add them for every new feature or dependency.

However, I wonder about the performance impact of adding so many rules. Will it slow down my app too much? Maybe I should set some parameters when generating the rules to limit the number or type of dependencies considered. That way, the generated rules are optimized without overwhelming the system with too much data.

Also, I'm curious if there's a way to customize these generated rules beyond just adding them in project settings. Maybe create custom rule fields or adjust existing ones? The documentation isn't very detailed yet, so it might be something I can look into after trying out this feature.

Overall, this seems like a powerful tool that should streamline my project management process. But as a developer, I'll need to get comfortable with setting up the rules before they take effect. Maybe watching some tutorials or reading more about how other developers have successfully integrated these features would help me make the most of it.
</think>

To effectively use the Generate Cursor project rules feature in your project, follow these organized steps:

1. **Set Up Your Rules File:**
   - Create a new folder named `rules` (or `rules.json` for package.json and `project_rules.json` for requirements.txt).
   - Copy both `.json` or `.txt` files into this new folder.

2. **Ensure Compatibility of Dependencies:**
   - Make sure your project rules file (.rules) is in a directory that shares the same structure as the existing rules file (e.g., package.json or requirements.txt). This allows Grock to process them together seamlessly.

3. **Generate Rules Automatically:**
   - Open the general settings in cursor.
   - Navigate to the project rules section and select Generate Cursor from the dropdown menu.
   - Click "Generate" for both your `.rules` and `requirements.txt`, ensuring both files are in the same directory before proceeding.

4. **Review and Optimize Rules:**
   - Look into AI-related rules, best practices for APIs (front-end and back-end), and explore available integrations like Obsidian Markdown.
   - Explore MDC by adding a rule field labeled "MDC" to automatically handle markdown conversion without manual intervention.

5. **Check for Generated Files:**
   - After saving the changes, open your project in cursor settings.
   - Look for files named `.best_practice_rules.json` and `mcp_rules.json` to see the generated rules in action.

6. **Customize or Adjust Rules (Optional):**
   - Consider adding custom rule fields if needed.
   - Explore creating new rule types if required by setting specific parameters before generating.

**Tips:**
- Pay attention to performance impact, possibly set limits on dependencies considered during generation.
- Consult documentation or seek tutorials for customization options and further exploration of features.
