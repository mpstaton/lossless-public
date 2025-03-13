---
this_video_url: https://youtube.com/watch?v=1AxTVGxbkPs
this_video_id: 1AxTVGxbkPs
---
<think>
Alright, let me try to unpack what the user is asking. They provided a detailed breakdown of how superbase introduced new cursor rules with an example prompt that includes both description and glob. They're looking to understand exactly how they integrated these into their AI IDE using the cursor settings.

Hmm, I notice they mentioned adding the right file name for naming purposes. It's important to follow conventions so the AI can recognize and apply them better. The user also showed steps on how to paste the new rules into the cursor settings, specifically mentioning the example prompt in superbase repository which is a key part of their process.

Wait, I wonder if they're using something like "superbase_example_prompt.md" or similar files. That makes sense because those are likely the official prompts for this feature. Maybe I should mention that as well, but the user didn't ask about it, so perhaps they already have these set up.

They also wanted an example of how to use the rules with a specific glob. The example prompt they provided is a good guide, and I think adding their own rule after that would be helpful. It shows customization, which is a nice touch for users who might want more control over different contexts like TypeScript vs JSX files.

I should make sure the user knows exactly where to paste this into their cursor settings, right after the file name they've set up. They provided specific details about inserting the description and glob correctly. I think that covers everything in their query.

Overall, the response is pretty clear on the steps, but maybe adding a brief explanation of why these changes are beneficial would help them understand the importance of using this feature. It might also be useful to invite them to ask more questions if they have any, showing that it's easy for them to get further assistance.
</think>

Great question! Let me break this down step by step:

1. **Adding Rules in Cursor Settings:**
   - Go back to the `cursor settings` (click on "Cursor" at the top of your AI IDE).
   - Click on the "+" button next to the project rules folder where you want to add these new cursor rules.
   - A new file will appear with a name like `superbase_example_prompt.md`.
   - Paste exactly what you see below:
     ```
     This is an example prompt for using superbase's new cursor rules.  
     Description: Optimize AI use of superbase by adding these rules to your project.

     Glob: *file*.gs (for specific files) or *gcs* (for any file, but likely focuses on TypeScript or JS)

     Example: Copy and paste this into the file:
     ```text
     This is an example prompt for using superbase's new cursor rules.  
     Description: Optimize AI use of superbase by adding these rules to your project.
     ```
   - Save the changes.

2. **Pasting Rules in Cursor Settings:**
   - Open `cursor settings` as described.
   - In the "Global" folder, click on the "+" button next to your file name (e.g., `superbase_example_prompt.md`).
   - Paste and save exactly what you see below:
     ```text
     This is an example prompt for using superbase's new cursor rules.  
     Description: Optimize AI use of superbase by adding these rules to your project.

     Glob: *file*.gs (for specific files) or *gcs* (for any file, but likely focuses on TypeScript or JS)
     ```

3. **Why This Change is beneficial:**
   - The new cursor rules provide a more efficient way for AI to understand how you'll use superbase.
   - They ensure that your AI system doesn't duplicate files or rmissions unnecessarily by automatically checking for duplicates and only creating unique entries when necessary.

This change allows your AI to optimize the use of superbase's file system, reducing duplication and improving overall efficiency.
