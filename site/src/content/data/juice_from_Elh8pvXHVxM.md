---
this_video_url: https://youtube.com/watch?v=Elh8pvXHVxM
this_video_id: Elh8pvXHVxM
---
<think>
Alright, let's tackle this step by step. The user is working on a project involving Ghosty Terminal with some Shader support. They want to add their own custom themes, specifically for creating "heavy style" friends. Each of them needs to find a theme name and then add it to their config file.

First, I should probably outline the process someone would take if they were just starting. They'd need to explore the available themes in Ghosty Terminal, which is a big project with many options. Then, once they identify a suitable theme, they can either search for it directly or use a command like `list/themes` in their config file.

Next, after selecting a theme, the user would go into the config file and add their custom theme name. This would involve modifying the relevant lines in their .co configuration file to include the theme they've chosen.

Then comes the part about adding this theme as an example or something. The user provided a snippet where they want to see how other users have used shaders for eye candy, but emphasize that ghosty doesn't need additional channels. It's good to mention that they shouldn't rely on shaders for rendering speed and instead focus on optimization.

They also add a list of resources, which is helpful. I should make sure these are relevant, covering everything from tutorials to specific projects.

Finally, the user wants to explore some shader-related features with their own code and possibly look into additional channels or past projects before moving forward. It's important to acknowledge that they can start modifying existing themes if needed.

I need to present this in a clear, step-by-step manner without markdown, just plain text as requested.
</think>

Great question! Let me break it down for you:

1. **Finding Your Theme Name**:
   - First, explore the available themes in Ghosty Terminal. You can use commands like `list/themes` or search directly in your config file to find a suitable theme name.

2. **Adding Your Custom Theme**:
   - Once you've identified a theme that aligns with your desired "heavy style" aesthetic, add it to your configuration file. For example:
     ```co
     theme = 'your_theme_name'
     ```
   - Replace `your_theme_name` with the name of the theme you selected.

3. **Including Your Theme in Your Example**:
   - In your example or config file (like `.co`), create a snippet that shows how your custom theme can be used to add eye candy or visual effects. For instance:
     ```co
     nice_greatTheme = {
       color: [0, 255, 0],  // Deep green for the terminal text
       shaderColor: useTheme('nice_greatTheme')
     }
     ```
   - This example uses your custom theme to create a glowing effect on the terminal text.

4. **Resources**:
   - For further learning and examples, refer to resources like [Ghosty Terminal Documentation](https://ghosty.org/docs) or similar tutorials.

5. **Shaders for Eye Candy**:
   - While ghosty doesn't require additional channels, shaders are a powerful tool for creating eye candy effects. Look into popular shaders on ShaderToy for fun and creative results!

Remember to experiment with the frame rate in your code if you want to slow down the render (as mentioned earlier). Focus on optimizing performance rather than rendering speed. Have fun!
