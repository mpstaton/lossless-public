---
this_video_url: https://youtube.com/watch?v=srzsj3xtHMM
this_video_id: srzsj3xtHMM
---
<think>
Okay, so I'm trying to figure out how to use Pseudo classes and pseudo boxes. The user mentioned something about Pseudo glass, which is a CSS class that allows targeting pseudo elements within a container. They gave some examples like Container.is and inside those you can specify the class for what you want. 

Hmm, let me think about this step by step. First, I know that in HTML, when you have an element with a class, it gets the style. But sometimes you need more specific styles or different colors. That's where Pseudo classes come into play. So, if I have a container div and inside it, there might be a headline and a paragraph with text. Maybe I want both of them to be blue. 

Wait, how do I apply that? The user said something about Container.is and then what's in the parentheses. So maybe I can target both the headline and the paragraph within the container. Let me try writing it: Container.is P and then inside the parentheses, I need to set their color to light blue.

But wait, how does the syntax work? Is it just Container.is (color)? Or do I have to write something else? Maybe I should test this in my browser. So if I open a new tab and type:

.container
<div P is>
    <p>Hello</p>
    <p>World!</p>
</div>

And then try changing their color. Oh, right! You can specify the color in the parentheses. So it should be Container.is (light sky blue). Let me check again.

I think that's how it works. So if I want to target elements with a specific class within a container and style them, Pseudo classes are really handy. That means in the future, I'll just use Container.is instead of writing out each element individually, which saves time and avoids mistakes.

Another thing they mentioned was pseudo boxes. They showed an example where inside the container div, you can have a pseudo box with multiple elements. So maybe for something like:

<div class="container">
    <div is>Hi</div>
    <div>How are you?</div>
</div>

And if I change their color, it should update both at once. That's pretty cool and would make the code cleaner.

So putting it all together, I can now target multiple elements in a container with one line of HTML using Pseudo classes or pseudo boxes. This will help in applying styles more efficiently and maintaining consistency in the design across different parts of the page.
</think>

Pseudo classes allow you to target specific elements within a container div for CSS styling without writing each element individually. Here's how you can use them:

1. **Targeting Elements with Pseudo Classes:**
   - Use `div.is` where `is` is a pseudo class (e.g., `p`, `div`, etc.) and the parentheses contain the elements within the container.
   - Example:
     ```html
     <div class="container">
       <div is="p" style="color: blue;">Hello</div>
       <div is="p" style="color: green;">World!</div>
     </div>
     ```
   - This will apply both styles to the elements inside.

2. **Pseudo Boxes for Layout:**
   - Use `div.is` where `is` is a pseudo box (e.g., `box`, `div`, etc.) and style it.
   - Example:
     ```html
     <div class="container">
       <div.is box>Hi</div>
       <div.is box>How are you?</div>
     </div>
     ```
   - This will style the entire div.is box with both styles.

**Final Answer:**
To use Pseudo classes and pseudo boxes, target elements within a container using `div.is` where `is` is the pseudo class or box. You can then apply styles to multiple elements efficiently. For example:

```html
<div class="container">
  <div is="p" style="color: blue;">Hello</div>
  <div is="p" style="color: green;">World!</div>
</div>
```

This will color both the "Hello" and "World!" elements with different colors.
