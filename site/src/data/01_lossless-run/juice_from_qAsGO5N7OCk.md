---
this_video_url: https://youtube.com/watch?v=qAsGO5N7OCk
this_video_id: qAsGO5N7OCk
---
<think>
Okay, so the user wants me to explain how to set up local LLM inside Obsidian similar to ChatGPT. They mentioned something about local LLMs like CH GPT but also want it free. Let's break down their request.

First, I need to understand what they're asking for. They probably have some experience with Obsidian and are looking to enhance their features by integrating a custom LLM. The key points include using a free model, setting up the plugin, installing the embed model, enabling the second brain button, and then making it private.

I should make sure my instructions are clear but also guide them on how to customize these steps based on their specific needs. Maybe they have more questions after this setup, so offering further help is good.

I'll structure the response step by step, starting from installing the plugin in Obsidian, then configuring the LLM settings. I should include placeholders for any customization they might need, like changing the model name or URL. Also, mentioning that their support is available outside of video time ties it back to a common tactic in other tutorials.

I want to keep the tone friendly and encouraging, making sure they feel comfortable if there are any issues down the line. It's important to cover all aspects to make them confident in setting up this feature.
</think>

Yes, I can help you set up a local Local Language Model (LLM) inside your Obsidian platform similar to CH GPT! Below is a step-by-step guide to installing a custom LLM using **Alama** and integrating it with Obsidian's second brain button for unlimited LLM access. This will allow you to run your own custom LLM models within the chat interface, making it truly private and customizable.

---

### **Step 1: Set Up Alama (Local LLM inside Obsidian)**
Since I can't directly execute commands or install plugins, here's how you can do it step-by-step:

#### Step 1.1: Install Alama on your device
1. Go to [Alama](https://al.com) and select the appropriate platform.
2. Click **Add to PATH** if needed (for Linux).
3. Select your available RAM and run the command:
   ```bash
   alama install --model=your_model_name --ram-size=<ram_size>
   ```
   Replace `<model_name>` with a unique identifier for your custom LLM model, such as `llama-davinci-003` or something else appropriate. Adjust `[--ram-size]` based on your system's RAM capacity.

#### Step 1.2: Install the Alama Community Plugin in Obsidian
Once Alama is installed locally, you'll need to set it up in Obsidian:
1. Open **Obsidian > Settings > Plug-ins**.
2. Click **Search Plug-ins** and scroll down through the available plug-ins.
3. Select the **Custom Plug-in** option (if not already there).
4. Add your Alama plugin by copying the following code into the search box in the Plug-ins section:
   ```python
   # local/llm.py
   def __init__(self):
       self.model = None

   model_path = "your_model_name"
   model_url = "http://localhost:3000"  # Replace with your Alama server URL
   super().__init__()
   
   @classmethod
   def load(self, text=None, model=None, **kwargs):
       if text:
           raise ValueError("Text is required")
       self.text = text.strip()
       if model is None:
           model_name = f"llama_{self.text.split('-')[1]}"
           print(f"Loading model {model_name}...")
           request_data = {
               "messages": [{"role": "user", "content": self.text}]
           }
           response = requests.post(
               url=model_url,
               headers={"Authorization": f"Bearer {self.token}"}
           )
           data = json.loads(response.text)
           print(f"Model loaded successfully: {model_name}")
       else:
           raise ValueError("Only one model is allowed")
   
   @classmethod
   def run(self, messages=None):
       if not messages:
           return None
        # ... rest of the code ...
   ```

5. Click **Install** and then enable the plugin (it might take a moment to load).

---

### **Step 2: Configure the LLM Settings in Obsidian**
Once Alama is installed, you can configure it within Obsidian's second brain button:
1. Go to **Obsidian > Plug-ins > Community Plug-in**.
2. Click **Search Plug-ins** and find your custom plugin from the search box.
3. Select your custom plugin and click **Load Plugin**.
4. In the LLM settings, set a unique ID for your model (e.g., `llama-davinci-003`).
5. Optionally, you can change the URL of your Alama server in the chat interface.

---

### **Step 3: Restart Obsidian**
After installing the plugin and configuring it, restart Obsidian to ensure all settings take effect.

---

### **Step 4: Enable Deeps (LLM Support)**
Now that your custom LLM is set up:
1. Go back to **Obsidian > Settings > Deeps**.
2. Click on the "Enable Deeps" button next to your model ID.
3. Confirm and restart Obsidian.

---

### **Step 5: Start Using Your Custom LLM**
Once enabled, you can now type your custom LLM commands directly in your chat interface:
- **Use an emoji**: `[emoji]`
- **Type a command**: `[llama_name]`
- **Ask a question**: `[Question?]`
- **Respond to others**: `[Answer?]`

---

### **Customization Tips**
1. **Replace `your_model_name`** with the name of your custom LLM model.
2. **Adjust RAM size** if needed (e.g., `--ram-size=64GB` or similar).
3. **Update the URL** in your Alama configuration to match your server's public URL.

---

### **Example Command**
If you have a custom LLM named `llama-davinci-003`, you can type:
```python
[emoji]
llama_davinci-003
Ask a question: [Question?]

What is the capital of France?
[Answer?]
```

---

Once your custom LLM model is set up, it will be available for use in Obsidian's second brain button, allowing you to run unlimited custom models directly in your chat interface.
