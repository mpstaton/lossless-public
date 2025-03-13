---
this_video_url: https://youtube.com/watch?v=qM1w8CwZE1M
this_video_id: qM1w8CwZE1M
---
<think>
Alright, so I'm trying to figure out how to use B. New with Expo integration for building a mobile app. Let me start by understanding what each part does.

First off, B. New is an open-source framework based on React Native, right? So it's supposed to help developers create native mobile apps without heavy libraries or frameworks. The key thing here is that Expo is integrating with it. I think Expo is a framework that allows creating native Android and iOS applications using React Native.

Now, the user mentioned they've already opened the Expo starter template in B. New and built a basic not taking and to-do app. That was pretty straightforward—just paste some code and see if it runs. But they're concerned about integrating Expo for real-time preview on mobile devices and getting working icons and keyboard issues.

Hmm, so I need to figure out how to do that. First, the user probably needs to install the Expo library in their project. Since B. New is being used, they might have to add Expo as a dependency. Let me think about how Expo works with React Native—does it run on native devices? Yes, I believe so. So once B. New app is built, installing Expo should let them preview it on their phone or tablet.

But there are some gotchas here. The user mentioned they can't find the icons when using Expo Go. Maybe the way Expo handles rendering changes the layout of the UI elements. I'm not sure if the same icons that appear in the terminal will show up on the app—probably not, because those might be from another library or framework.

Also, with the keyboard issue, they had to restart the app. That's probably because when using Expo Go, the keyboard layout is different from the actual UI elements. So after installing, restarting makes sense so that the keyboard doesn't interfere with the UI.

I should outline the steps clearly: install Expo as a dependency in B. New, create their basic not taking and to-do app, use Expo to preview on their device, troubleshoot any keyboard issues, then see if they can improve other features like icons or more complex apps later.

Wait, but maybe I'm missing something about how Expo works with React Native. Is there a specific way to set up the Expo UI elements within B. New? Or do they need to handle that differently?

Also, regarding the icons—B. New might not have those, so it's probably better to use a framework like Opple or Figma for UI design. That would make integrating with Expo more seamless.

I should also consider performance when using Expo on mobile apps since native app performance is crucial. Maybe there are some optimizations needed in B. New when combined with Expo.

Overall, the user seems into improving their app beyond just the initial basic version. They might be looking to enhance features and ensure everything works smoothly across different devices. So I should suggest further steps or tools they can use for that.
</think>

To integrate B. New with Expo for creating a mobile app, follow these organized steps:

### Step-by-Step Guide to Integrating B. New with Expo

1. **Install Excaool Library**:
   - Since Expo is built on Excaool, ensure you have this library installed in your project.
   - Add the following CDN link at the top of your React Native file or within a separate `excaool-react` file for local installation.

2. **Create Your B. New App**:
   - Build a basic not-taking and to-do app using B. New as you initially did, with necessary UI elements.
   - Ensure your app is self-contained without relying on external frameworks that might complicate Expo integration.

3. **Preview on Your Device Using Expo Go**:
   - Install the Expo app store for Android (Excaool) or iOS (Excaool Pro).
   - Open your B. New app, install Expo, and use Expo's preview tool to view your app on your device.
   - Use the Expo Go application's keyboard feature carefully, restarting if you encounter issues.

4. **Troubleshoot Key Issues**:
   - If icons are missing or displayed incorrectly, ensure that Expo is correctly configured in your B. New setup.
   - Restart your app after installation to fix any keyboard layout discrepancies during preview.

5. **Improve Feature and UI Design**:
   - Move non-react Native UI elements (like icons) to a more suitable framework like Opple or Figma for better integration with Expo.
   - Enhance the basic app by improving its functionality, such as adding a theme or customizing the to-do list.

6. **Optimize Performance**:
   - Ensure your B. New app runs smoothly on mobile devices by setting up appropriate performance optimizations, especially if handling multiple user interfaces.

### Additional Tips

- **Research and Learn**: Utilize Excaool's documentation and community resources for best practices with Expo integration.
- **Follow Best Practices**: Keep your code clean and follow best practices for React Native to ensure seamless development.

By following these steps, you can effectively integrate B. New with Expo and create a more robust mobile app experience.
