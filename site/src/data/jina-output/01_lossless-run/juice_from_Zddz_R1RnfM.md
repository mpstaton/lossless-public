---
this_video_url: https://youtube.com/watch?v=Zddz_R1RnfM
this_video_id: Zddz_R1RnfM
---
<think>
Okay, so I'm trying to figure out how to implement subgrid in my CSS. From what I understand, subgrid is supposed to allow elements to nest within other containers based on parent grid columns or rows. But when I look at the code examples provided, it seems like when I use container type inline size, things don't work as expected. Instead of getting the nested grids, they just look the same.

Hmm, maybe the issue has something to do with how container queries are handled in browsers. The example uses a div with container type 'inline' and then applies subgrid. But the div doesn't have any parent grid defined, so it's not even starting from scratch. That might be why all the elements just show up as un-nested.

Wait, maybe I need to set a parent container that has a grid layout. For instance, wrapping the div in an unordered list or even a simple grid. That way, the parent container will have its own grid, and subgrid can work within that structure. Let me try that approach with a few test cases. 

If I take each featured card and put it inside its own div, then wrap those divs in another div that has a grid layout defined by unordered list items or even a simple grid, maybe the subgrid will now look like what's expected. It might be that without a parent container with grid support, the subgrid isn't being applied correctly.

Another thought: perhaps I'm missing some parameters in the container type inline size. Maybe changing it to 'display:flex' instead of just 'inline'? That way, the div knows how to handle its children based on flexbox properties. Or maybe using a different container type that supports more flexibility, like 'html-container' or something else.

I should also consider testing with both standard and iOS-specific browsers. Since iOS devices often don't support certain browser features, it's possible that subgrid isn't working there. But the user mentioned this only affects older phones, so maybe I can add a fallback to use another method for those cases.

Oh, right! There are some CSS features like custom stylesheets and media queries that might help in applying subgrid across different browsers. Using Webpack or a custom stylesheet could provide more flexibility. Also, using container types like 'html-container' might offer better compatibility since they can handle both grid and flexbox by default.

Let me outline the steps I think are necessary:

1. Wrap each featured card in its own div.
2. Use another div as the parent with a defined grid layout (unordered list or simple grid).
3. Apply container type inline size to the parent div, maybe 'display:flex' or 'grid'.
4. Use container queries like .card-content to target elements within this structure.

Testing these steps across different browsers and devices should reveal if subgrid works as intended. If it doesn't, I might need to look into CSS specs, browser support details, or adding a fallback method for less common devices.
</think>

To implement subgrid in your CSS effectively, follow these organized steps:

1. **Wrap Featured Cards in Subdivided Divs:**
   - Create div elements inside which will serve as the parent containers for your featured cards. This allows each card to have its own container.

2. **Define a Parent Container with Grid Support:**
   - Place this div within another div that has a defined grid layout, such as an unordered list or a simple grid. This provides a structured parent container for subgrid functionality.

3. **Apply Container Type Inline Size:**
   - Use `container type inline size` on the parent div to define how children should be nested based on its structure. Consider using `'display:flex'` or `'grid'` for flexibility.

4. **Utilize Custom CSS Features:**
   - Employ custom stylesheets, Webpack, or a media query that supports both grid and flexbox properties for enhanced compatibility across browsers.

5. **Test Across Browsers and Devices:**
   - Ensure subgrid works on standard browsers (like Chrome) and iOS devices. If it doesn't work on older phones, consider using a fallback method to maintain compatibility.

By following these steps, you should be able to implement subgrid effectively in your CSS, leveraging container types and custom features for better support across different environments.
