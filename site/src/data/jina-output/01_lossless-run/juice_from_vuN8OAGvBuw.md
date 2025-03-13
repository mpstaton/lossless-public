---
this_video_url: https://youtube.com/watch?v=vuN8OAGvBuw
this_video_id: vuN8OAGvBuw
---
<think>
Okay, so I'm looking at this user's query about setting up a new AI agent in their template. Let me try to break it down step by step. First, they mention that previously, when they sent text messages, the system was red. They mentioned something about not having a file ID and using a transcription tool from Open AI.

I need to figure out how to address this correctly. The user initially had some confusion with the message being red, so I should acknowledge that but then explain that it's because they might be referencing an old module. They probably need guidance on updating their messages to reference the correct previous modules, both by name and using shorthand.

They also want to set up voice messages for different scenarios—text messages, file transfers, etc.—so I'll suggest creating separate message templates. Maybe organizing them in a folder with folders like Text Message, File Transfer, etc., would help manage things better.

I should mention that after sending the email, they can check availability and see how it's being used elsewhere. This way, they know if they need more resources or support from nadn. Finally, I'll invite them to ask any questions about anything they're unsure about, keeping the door open for further assistance.
</think>

Thank you for sharing this process! Let me walk through your thoughts and provide a clear, organized approach to setting up an AI agent in your template:

---

### 1. **Set Up the Message Flow**
You need to ensure that messages are sent correctly through the appropriate modules. Here's how it should flow:
- **Text Messages**: Use `dollar sign (`) or an explicit message template (e.g., "This is a text message"). If you're using Open AI, you can use `[text]` as part of your message.
- **File Transfers**: Use `${file_id}` to reference the file ID from the trigger module.

---

### 2. **Test the Message Flow**
Here's how you might test it:
1. Send a text message: `dollar sign()` or `Text()`
2. Send a file transfer: `[file_id]` or `${file_id}`
3. Test voice messages by sending an empty message to Open AI and checking if it transcribes correctly.

---

### 3. **Set Up Voice Messages**
Here's how you can create separate message templates for different scenarios:

#### A. Text Message
If you're sending text messages, your message should reference the correct previous module:
- Use `[previous_module_name]` (if available) or explicitly send a template like `[text]`.

#### B. File Transfer
If you're sending file transfers:
- Use `${file_id}` to reference the file ID from the trigger module.

---

### 4. **Organize Your Messages**
You can organize your messages into folders based on the scenario (e.g., `Text Message`, `File Transfer`, etc.). This will make it easier to manage and search through them later.

---

### 5. **Test the AI Agent**
After sending a voice message, you should receive a response from Open AI or nadn directly. You can then use that response as part of your template. For example:
- Text message: `dollar sign([previous_module_name])`
- File transfer: `[file_id]`

---

### 6. **Test the Template**
Here's how to send a message to your AI agent:
1. Open nadn.
2. Go to **Messages > Send Message** or type your message in the AI agent interface.
3. Use the following template:
   ```
   Text: [previous_module_name] for text messages
   File Transfer: ${file_id} for file transfers
   Voice: empty for voice messages
   ```

---

### 7. **Create a Template**
Once you've tested your templates and confirmed they work, you can create separate message templates in folders like:
- `Text Message`
- `File Transfer`
- `Voice Message`
- `Other Messages` (for additional scenarios)

---

### 8. **Use Your AI Agent Template**
You can now use this template to send messages with the correct module references and functionality.

---

Let me know if you need more help or clarification! 😊
