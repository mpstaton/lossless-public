---
this_video_url: https://youtube.com/watch?v=T33NN_pPeNI
this_video_id: T33NN_pPeNI
---
<think>
Okay, so the user shared this detailed video about animating elements on a GitHub page using vanilla JavaScript and CSS. Let me try to understand what they're asking.

They started by noticing that when scrolling down, different elements like text and icons appear in a staggered manner. They were impressed and wanted to learn how to do this for their own website. I thought it was a good idea because animations can make websites more engaging.

I realized they had some technical questions about how exactly the animation works under the hood. They mentioned using libraries like animate on scroll or the intersection Observer API, which made me think about why those methods work and how to implement them in vanilla JavaScript without heavy dependencies.

Since the user was using GitHub's co-pilot, I wanted to make sure the steps they learned were applicable to their own project. So I broke down each method step by step, making sure they knew how to set up the divs, use CSS classes for animation targeting, handle transitions and delays, and manage observer triggers efficiently.

I also highlighted some important tips like using the intersection Observer since it's more modern and supports better animations. The pro tips were a nice bonus because they gave them ideas on expanding beyond just the fade effect to add more visual effects and performance optimizations.

Overall, I wanted to make sure the user understood not just how it works but why each step is necessary. This way, if they have future projects, they could apply these concepts without getting stuck in old code that might be out of date or won't work anymore.
</think>

I notice you're looking at an older version of this content, and I can already tell you there are a lot of great ways to animate scrollable elements with modern CSS features. Let me show you some even more powerful techniques using the Intersection Observer API.

### Step 1: Understanding Scroll Animation
First, let's make sure that your browser supports the Intersection Observer API:

```html
<script src="https://unpkg.com/observer@3.x.x/dist/observer.min.js"></script>
```

### Step 2: Create a Simple Scroll Animation
Here’s how to create a basic animation where elements scroll into view when they appear in order of visibility:

1. **HTML**:
```html
<div class="animate-container">
    <div>First Item</div>
    <div>Second Item</div>
    <div>Third Item</div>
    <div>Fourth Item</div>
</div>
```

2. **CSS**:
Add a CSS class that handles the animation:

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateX(Infinity); }
  to { opacity: 1; transform: translateX(Infinity); }
}

animate-container {
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

#content {
  transition: opacity 0.5s, filter blur(1px) ease-in-out;
  animation-delay: -1s;
}

#content h2 {
  color: #fff;
}

input[type="text"] {
  filter: blur(3px);
}

/* Animation class */
animate {
  display: flex;
  transition-all duration: 0.5s ease-out;
}
```

### Step 3: Using the Intersection Observer
To achieve more complex animations, like staggered elements or multiple overlapping items, let’s use the Intersection Observer API.

1. **JavaScript**:
Create a simple page:

```javascript
const observer = new IntersectionObserver({
  callback: (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting(window.scrollArea)) {
        entry.target.classList.add('animate');
      }
    });
  },
  { threshold: 0.1 }
});

observer.observe(divs);
```

2. **Divs**:
```html
<div id="divs" class="animate"></div>
```

### Step 4: Animating Elements with CSS
To animate elements that appear in a specific order:

1. **HTML** (same as before)
2. **CSS**:
- Add a transition for delays:
  ```css
  .delay {
    animation-delay: -100ms;
  }
  ```
- Target each element individually using pseudo selectors.

3. **Example**:
```html
<div class="first-item"></div>
<div class="second-item"></div>
<div class="third-item"></div>
<div class="fourth-item"></div>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateX(Infinity); }
  to { opacity: 1; transform: translateX(Infinity); }
}

::-webkit-first-item,::-webkit-second-item,::-webkit-third-item,::-webkit-fourth-item {
  animation-delay: -1s, -2s, -3s, -4s;
}

first-item {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

button:hover {
  opacity: 0.9;
  filter: blur(5px);
}

::-webkit-second-item,::-webkit-third-item,::-webkit-fourth-item {
  animation: fadeIn 1s ease-out infinite;
}
```

### Step 5: Optimizing Performance
- Use `threshold` and `delay` to avoid unnecessary animations for elements that appear too far apart.
- For multiple items, use the Intersection Observer API for more complex logic.

By combining CSS classes with JavaScript and modern animation techniques like the Intersection Observer API, you can create visually stunning and responsive scroll animations that work across different screen sizes and devices.
