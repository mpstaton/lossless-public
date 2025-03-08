---
this_video_url: https://youtube.com/watch?v=XvbVePuP7NY
this_video_id: XvbVePuP7NY
---
<think>
Alright, let me try to figure this out. The user has given me some information about their setup as a Microsoft Windows user, which seems to be a bit confusing because they mentioned "SoMo" and "Samba," but the context is all about Windows. Hmm.

Wait, maybe I'm misinterpreting it. They talk about connecting to home assistant's file system using SoMo, which might actually refer to Samba in a different context or perhaps a typo. Since the user is on Windows, they probably don't need to worry about SoMo anymore because that term isn't standard here.

Looking back at their steps, after setting up the wake word training environment, I noticed they tried typing "Terry" and it didn't recognize the sounds correctly. Maybe there's an issue with how Samba is set up for Windows or perhaps a problem with file uploads not working as expected.

They mention that running this process took some time and using machine learning to train a wake word. That makes sense because training involves recognizing patterns in files, which could take some effort to optimize the weights so they recognize "Terry" correctly.

I wonder if there are any specific issues with their configuration or if they need to adjust certain settings for better performance. Perhaps after successfully uploading the files, they should check if all connections and uploads worked smoothly without errors.

Also, I'm curious about why the lights in the room were turned off when they tried to set up this wake word training environment. Maybe that's a coincidence or perhaps there's another reason related to their setup that I'm missing.

Overall, it seems like a comprehensive setup for connecting to home assistant and setting up wake word training, but I need to ensure all configurations are correct before proceeding further.
</think>

Alright, let me clarify and provide a step-by-step explanation based on the information you've provided:

### Step 1: Connecting to Home Assistant via Samba
Since you're using **Windows**, we'll use **Samba** for connecting to your home assistant. Here's how to set it up:

1. Open **Windows Explorer** or any file explorer.
2. In the search bar, type in `slb/our IP address` (replace the IP address with your actual network address).
3. A dialog will pop up asking you to log in to **Home Assistant** and provide a username and password.

### Step 2: Creating a New Wake Word Directory
1. After logging in to **Home Assistant**, go to **Settings > Voice Assistant > Voice Assistant Settings > Open Wake Word**.
2. Click on the "New" button next to "Open Wake Word."
3. A dialog will prompt you to create a new directory named "Terry." Click "Yes."

### Step 3: Adding Files to the Wake Word Directory
1. Drag and drop your **TF Light File** into this directory.
2. Drag and drop your **Onyx File** into the same directory.

### Step 4: Updating Your Home Assistant Connection (Windows Only)
1. Go back to **Settings > Voice Assistant**, click on "Update," and then select **Home Assistant** from the list of available Add-Ons.
2. Search for **Samba** under the Add-ons folder.
3. Click on **Install Samba** to set up your connection to home assistant's file system.

### Step 5: Connecting Samba to Home Assistant
1. After installation, return to **Settings > Voice Assistant > Update**, click "Update," then select **Samba** from the Add-Ons folder.
2. Click on **Install Samba** again (if not already installed) and follow the prompts to connect your Samba instance to home assistant.

### Step 6: Verifying connectivity
1. Open a web browser.
2. Type in `https://your IP address` (replace with your actual network address).
3. If you're successful, your Samba connection should work as expected.

This setup will allow **Terry** to be trained on the sounds of your files and appear in voice assistants like **Home Assistant**, **Alexa**, or other connected devices.

Let me know if you need further assistance!
