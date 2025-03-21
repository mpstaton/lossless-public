---
this_video_url: https://youtube.com/watch?v=tNBufpGQihY
this_video_id: tNBufpGQihY
---
<think>
Okay, so I'm trying to understand how to create custom select boxes using HTML and CSS as mentioned in the video. From what I gather, they've changed the default styles of the Select element from browser-based to something more flexible.

First, let me break down the steps provided in the video:

1. Create a normal Select element just like we usually do.
2. Add a custom Select element for the options and an additional one for the main select box.
3. Use CSS Flexbox and Gap properties to separate these elements.
4. Apply styles specifically for each option, including the checkmark indicator.

I'm a bit confused about how exactly this works beyond just adding the custom HTML elements. The video says it's all inside the browser but the explanation doesn't cover how to implement the new spec. Maybe I should think about what specific changes are needed in JavaScript to make the Select elements support these CSS styles, or perhaps there's more to it.

Wait, maybe the key is that the user didn't mention the implementation of this spec in a way that would require custom JavaScript for the browser itself. The video mentions that after modifying the HTML and selecting options, they need to style the elements with CSS, which should be compatible across browsers since both Select elements can take any HTML inside them.

But I'm not sure if there are additional steps beyond just adding these styles. Maybe some CSS properties or custom selectors are needed? Or perhaps even some JavaScript functions to dynamically create these select elements with different options and checkmarks?

Hmm, the video doesn't go into that level of detail. It's all about how to set up the Select boxes using HTML and CSS. So maybe for a user who wants to implement this feature, they'd need to:

- Create a base Select element (the one at the bottom) and style it with the new CSS.
- Then add multiple option select elements above it, each styled according to their specific options.

But does that cover all the necessary steps? Or are there more complexities I'm missing?

I wonder if this spec allows for even more customization, like enabling breakpoints or other advanced features. But as far as I know, the core of this new Select element is just about how it displays and what styles it can have, which seems pretty minimal compared to the standard implementation.

So perhaps the user just needs to replace the default Select elements with their custom versions as described in the video, adding the necessary HTML and CSS styling. If they're not interested in the underlying JavaScript or browser specifics, maybe that's all they need to do.

But if someone wants more control over how the Select boxes look and function, they might want to dive into the actual implementation of the Select elements, perhaps using frameworks or libraries that support this kind of custom behavior. However, without any additional information, it's hard to say.

In summary, while I understand the basic steps—adding custom HTML, styling them with CSS properties—the deeper aspects like JavaScript implementation and more advanced features might be beyond the scope of what was explained in the video. It seems focused on setting up a visual feature that can be used across different browsers without requiring extensive technical know-how.
</think>

To create custom Select boxes using HTML and CSS as described, follow these key steps:

1. **Create Custom Options**: Add multiple option select elements above the main Select box, each styled according to their specific options.

2. **Select Elements**: Ensure you have a base Select element (the bottom one) with default styles that can be replaced for custom functionality.

3. **CSS Styling**: Apply CSS properties like `Gap` and `Float: down` or similar to separate elements neatly. Include styling for checkmarks, badges, and other indicators as needed.

4. **Implementation Considerations**: While the core visual features are set up in this explanation, you might need additional JavaScript or frameworks for more advanced functionalities depending on your needs.

By following these steps, you can create a visually appealing custom Select box that supports various styles and indicators, without delving into browser-specific implementations beyond initial setup.
