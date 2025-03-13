---
this_video_url: https://youtube.com/watch?v=xfzNXa8WYW8
this_video_id: xfzNXa8WYW8
---
<think>
Okay, so I'm trying to figure out how to make my React app use these new experimental view transition features. I remember seeing some stuff about this new view transition system introduced into React in 2019 with RSC running on it. It's supposed to be pretty cool and allows for more dynamic UI interactions.

First, I think I need to get the new view transition names mapped correctly. I've heard that they map like "view transition stable" and "view transition unstable." I should probably check where these are coming from so I know how to use them properly in my code. Maybe there's a utility or a mapping file that can help me with that.

Next, the user mentioned something about a new template for view transitions. They talked about using the viewTransitionNew and viewTransitionOld selectors. That sounds like it would be useful when we want to control how elements appear on either side of a button or switch icon. I need to make sure I understand how these selectors work so I can use them effectively in my component's props.

I also heard that they mentioned adding CSS animations for a smoother transition effect. The user provided an example with slideIn and slideOut animations modifying the opacity. That should help make the transitions look nicer instead of just being static images. I think it would be helpful to include this animation code somewhere in my file so that it works consistently across all view transitions.

Another thing I need to consider is how these view transitions can handle multiple elements or when an element might change its appearance on one side but not the other. I should look into any limitations or workarounds for those cases, maybe using CSS custom properties or some JavaScript to manage which side each element appears on.

Testing it out would be important too. I'll need to try all these features in my app and make sure they work as expected. If everything goes smoothly without errors, that's a good sign. But if I run into any issues with view transitions not showing up or the animations not working, I should probably ask for help from more experienced developers.

Oh, and there's also something about using these view transitions with the experimental branch in TanStack Router. I think this means that when the experimental branch is enabled, it can automatically handle creating multiple view transitions for a single component. That would save me some time because I don't have to manually create two separate components; one will do it all.

In summary, my plan is:
1. Map the new view transition names correctly.
2. Use the viewTransitionNew and viewTransitionOld selectors in my components.
3. Add CSS animations for a smooth transition effect.
4. Test all these features across different parts of my app.
5. Consider using TanStack Router's experimental support for more complex scenarios.

I think I have a good grasp now on what I need to do next. Time to dive into the code and try it out!
</think>

To implement React's new view transition system, follow these steps:

1. **Map View Transition Names**:
   - Use the `viewTransition` mapping with your specific names in your React app. For example, if you're using "view transition stable" and "view transition unstable," make sure to reference them correctly.
   - You can use a utility or file that maps these names to their respective UI elements.

2. **Use View Transitions**:
   - In your component's props, specify the view transitions for each side of an element using `viewTransitionNew` and `viewTransitionOld`.

3. **Add CSS Animations**:
   - Include these animations in your styles file or use a custom class to control the opacity changes.
     ```html
     @keyframes slideIn {
       0%, 100% { opacity: 0; }
       50% { opacity: 1; }
     }

     @keyframes slideOut {
       0%, 100% { opacity: 1; }
       50% { opacity: 0; }
     }

     .viewTransition-stable {
       opacity: 1;
     }

     .viewTransition-unstable {
       opacity: 0;
     }
     ```

4. **Handle Multiple view Transitions**:
   - Use CSS properties or JavaScript to manage which side an element appears on.

5. **Test All Features**:
   - Ensure your app works with multiple elements and edge cases.
   - Consider using TanStack Router's experimental support for better handling of view transitions in complex scenarios.

6. **Use Experimental Branch**:
   - Enable the experimental branch in TanStack Router to automatically create multiple view transitions when needed.

By following these steps, you'll effectively implement React's new view transition system and enhance your UI interactions.
