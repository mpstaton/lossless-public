---
this_video_url: https://youtube.com/watch?v=NhLHbGZPlWk
this_video_id: NhLHbGZPlWk
---
<think>
Okay, let me try to figure out how to approach this problem. The user has provided a detailed explanation of unpo, focusing on the key attributes like up Target, up duration, and up on loaded. They also included an example with news article links changing text when clicked.

First, I need to break down what each attribute does. The up Target is used for updating content in animations or transitions between fragments. Up duration refers to a sliding scale animation that smoothly changes the fragment's content from one state to another over time. Up on loaded is for handling responses where the client-side JavaScript updates an attribute based on server success.

The user then wants me to create a similar toy application with news article links, using these attributes. They provided examples of how up Target can be used, so I should make sure my explanation ties back to those points.

I notice that in the example, they use up Target to load the description and then set up JavaScript to swap certain text attributes when the link is clicked. That's a good approach because it shows how these attributes work together with client-side scripting.

I also see that I need to include links for up duration and up on loaded, which aren't in the example but are standard in unpo. So my explanation should mention these as additional features.

The user then provides an example of JavaScript where they target all anchor tags and call a function to swap text attributes when the link is clicked. This shows how dynamic script can be used with up on loaded for more complex interactions.

I should make sure to explain each attribute step by step, using the example provided. It's important to highlight that the up Target allows for animations, up duration gives smooth transitions, and up on loaded handles server responses with client-side updates.

Finally, I need to structure my answer clearly, perhaps in bullet points or numbered lists, so it's easy to follow. I'll start by summarizing each attribute, then explain how they're used together in the example, and wrap up with additional features unpo offers.

I also want to emphasize that this is a simplified version using vanilla JS without Alpine GS, but it illustrates the main points about stateful interactions. It's a good starting point for those looking to understand unpo's capabilities.

Now, I'll put all of this together in a clear, organized explanation, making sure each part flows logically from one to the next.
</think>

Great question! Let me break down how **unpo** (Unplugged PHP Object) handles stateful interactions and client-side scripting with animations, transitions, and dynamic content swapping. I'll focus on your example of news article links where text is swapped when clicked.

---

### 1. Up Target
The `up target` attribute in unpo allows you to **update a fragment's content** after the server returns a response. This is perfect for animations or transitions between fragments that depend on server-side rendering (SSR) results.

In your example:
- The link's content is loaded from a background `Ajax request`.
- The `up target` attribute loads the description of the article.
- When clicked, the JavaScript function swaps specific text attributes (`inner text`) based on the fragment name.

This creates smooth transitions and animations without page reloads.

---

### 2. Up Duration
The `up duration` attribute allows you to create a **sliding scale animation** between two fragments. This is useful for animations that take longer than one click.

In your example:
- The text on the article is initially hidden.
- When clicked, it takes about 3 seconds to change text from "Read Article" to "Detailed Content".
- You can use this attribute with `up target` and `up duration` together.

This creates a smooth transition effect that depends on server-side rendering.

---

### 3. Up On Loaded
The `up on loaded` attribute allows you to handle **server-side response processing** by updating an attribute based on the client's success of the server's request. This is useful for:
- Adding custom JavaScript logic after the fragment loads.
- Updating attributes, such as text or CSS classes, in a way that depends on the server's output.

In your example:
- The `up target` attribute loads the article description.
- When clicked, it swaps specific text attributes (`inner text`) based on the fragment name using the `up on loaded` attribute.

This allows you to perform dynamic JavaScript logic after the article loads without page reloads.

---

### Example Code
Here's a simplified example of how you might implement this:

```php
document.write(function load Article($url) {
    $content = read Article($url);
    
    // Swap text on other anchor tags
    foreach ($this-> anchors as $anchor) {
        if (str_starts_with($anchor, 'Link.')) {
            $this->scripts('article.diasql').onTarget(
                $anchor,
                function($text) {
                    return str_replace(['inner text'], ['read more', '$text'], $content);
                }
            );
        } else {
            // Keep the original content
            return $content;
        }
    }
});
```

In this example:
- The `load Article` function is defined to read the article content.
- When a link is clicked, it swaps specific text attributes using client-side JavaScript.

---

### Additional Features of Unpo
Unpo offers several additional features for stateful interactions and scriptable fragments:

1. **Up Target**
   - Updates a fragment's content after the server returns data.
   - Example: Loading links.

2. **Up Duration**
   - Creates a sliding scale animation between two fragments.
   - Example: Loading links (3 seconds).

3. **Up On Loaded**
   - Updates an attribute based on server success.
   - Example: Loading links.

4. **Up Target Animation**
   - You can use `up target` in combination with CSS animations.
   - Example:
     ```php
     $content = read Article();
     .hidden::up target::start(
         .class="text-muted",
         ::all,
         text::read more
     );
     ```
     This animates the text after a loading URL.

5. **Up Target Custom Scripts**
   - Use `up on loaded` with JavaScript to perform custom updates.
   - Example:
     ```php
     $content = read Article();
     .hidden::up target::start(
         ::all,
         function($text) {
             return '$text' . ' (3 seconds)';
         }
     );
     ```
     This adds a 3-second delay to the text.

---

### Summary
In your example, you can combine `up target`, `up duration`, and `up on loaded` attributes to create smooth animations and transitions between fragments. The JavaScript script dynamically swaps specific text attributes when links are clicked, adding stateful interaction without page reloads. This is a great way to handle server-side rendering results with client-side scripting!
