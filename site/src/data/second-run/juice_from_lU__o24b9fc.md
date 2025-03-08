---
this_video_url: https://youtube.com/watch?v=lU__o24b9fc
this_video_id: lU__o24b9fc
---
<think>
Alright, so I'm trying to figure out how to set up a MDP with my browser tools using the mCP server features. Let me go through what I understand step by step.

First, I know that when I open browser tools, it loads an mCP server. From what I remember, mCP is a protocol that allows browser tools to run on any web server, not just browsers. So, in browser tools, the default extension is browser_tools, and it's running against my browser's local mCP server.

Now, after running the mCP server, the agent can communicate with me directly through the browser tools chat. I'm using Chat 2.0, which allows the agent to know about browser tools via its chat ID. That's pretty cool because the agent doesn't need an extension to access my browser tools.

I want to use the MDP feature so that when I run an action on browser_tools, it can be tracked across all active users. To do this, I think I need to register some actions and set up a MDP server. But wait, how does this work exactly?

First, I'll go into browser_tools settings and find where I can add new actions for my own browser tools extension. Maybe under the "Actions" section or something similar. I believe adding an action that runs my browser tools is necessary to track them.

Next, on the main page of MDP, I need to set up a server. The URL should point to the mCP server where I'm running browser_tools. From what I recall, it's usually something like `http://localhost:7524`. But I might have missed some details about how browsers handle this.

I remember that when I first start MDP, there are options in the settings like "Track Browser Tools" and setting a tracking ID so my agent can know I'm using browser_tools. That makes sense because it allows me to use browser_tools for tracking across multiple users.

Now, on each page where I run an action with browser_tools, I should add some actions that track specific browsers or websites. For example, adding a command that runs `runAction("/browser_tools", "runBrowserTools", 0)` so my agent can know when browser_tools is being used. That way, if something happens during the run of browser_tools, it's tracked by me.

I'm also thinking about how to define some commands. The MDP server needs a list of commands that browsers can execute. I think I should define some common commands like `runAction`, `writeAction`, etc., so more users know how to use them.

Another thing is setting up the default command when browser_tools runs an action. Maybe something like `defaultCommand("/browser_tools", "browser_tools", 0)`. This tells browsers that if they run this command, I'm tracking their execution.

I should also check if MDP has any specific documentation or tutorials on how to set this all up. Maybe the official mCP server documentation or guides on using MDP with browser tools would be helpful. They might have more detailed steps or tips on best practices for tracking across multiple users.

One thing I'm a bit confused about is whether browser_tools can run actions directly through its chat ID and how it interacts with the MDP server. I think it's managed via the browser_tools extension, but I need to make sure that when browser_tools runs an action, it triggers the corresponding command in the MDP server.

I also wonder if there are any common issues people face when setting up MDP and browser tools together. Maybe some browsers aren't accepting the commands properly or there's a configuration issue with the MDP server settings. I should check the console logs for any errors that might pop up after adding actions to my extension or defining commands.

Overall, it seems like a manageable process once I break it down into steps: registering browser tools, setting up MDP on the local mCP server, adding actions specific to my own browser tools, and ensuring communication between browser_tools and me. But I need to take my time with each step, especially since I'm still getting used to how these features integrate together.
</think>

To set up a MDP with your browser tools using the mCP server features, follow these organized steps:

1. **Run Browser Tools Extension:**
   - Open browser_tools in your browser (e.g., Chrome or Firefox).
   - In the extension settings, add an action that runs `runAction("/browser_tools")` and specify a tracking ID to identify it globally.

2. **Set Up MDP Server:**
   - Navigate to your browser tools extension's page where you can configure actions.
   - Add any necessary actions for your own browser tools extension (e.g., commands like `runAction`, `writeAction`) so they can be tracked across users.

3. **Define Commands in MDP:**
   - On the main browser_tools page, define a default command such as:
     ```
     defaultCommand("/browser_tools", "browser_tools", 0)
     ```
     This ensures browsers know to run this command when it's executed via your extension.

4. **Add Tracking Actions:**
   - Add actions for specific browsers or websites that you track, e.g.,
     ```
     addAction(
       browser_id: "my-browser-id",
       command: "/browser_tools",
       command_id: 0
     )
     ```
     This allows tracking when `my-bearer` is used.

5. **Configure Common Commands (if necessary):**
   - Define common commands for broader use, such as:
     ```
     addCommand("browser_tools", "browser_tools")
     addCommand("browser_tools/executeAction", "execute action")
     ```

6. **Check for Errors:**
   - After adding actions and configurations, check the browser console logs for any errors that might occur during these processes.

7. **Test MDP and Browser Tools Interaction:**
   - Run an action with your browser tools extension and verify that MDP tracks its execution across multiple users.
   - Test specific commands or actions to ensure they function correctly and log appropriately.

By following these steps, you can effectively set up MDP to track browser tools usage across your active users. Each step builds on the previous one, ensuring seamless integration between browser tools and the MDP server.
