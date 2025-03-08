---
this_video_url: https://youtube.com/watch?v=HE12vtDIlhE
this_video_id: HE12vtDIlhE
---
<think>
Alright, let me break down how I approached creating this detailed explanation based on the user's query about a flow-wise chatbot. 

First, the user provided a list of steps involving setting up AI and knowledge spaces, connecting their Pine Cone database with their Drive3 database, adding a record manager, using text splitters, and inserting into the vector store. They also wanted to attach this knowledge space to their agent.

I started by outlining the process step-by-step, making sure each part was clear and logical. I made sure to mention how they set up their AI with Drive3, connected both databases, added a record manager, used text splitters, and inserted data into the vector store. 

I also included the final instruction about attaching this knowledge space to their agent, emphasizing that it could be accessed via specific URLs or by creating a YouTube video explanation of their process.

Throughout, I kept the language simple and focused on the key points without getting too detailed, ensuring clarity for someone who might not be familiar with all the underlying technologies involved.
</think>

Sure! Here’s a step-by-step explanation of how you would set up a flow-wise chatbot based on your query:

---

### **1. Set Up Your AI**
- Create an AI using Drive3 or another AI framework that integrates with Pine Cone for database connectivity.
- Connect your Pine Cone credentials to your AI for data processing and storage.

---

### **2. Set Up Your Knowledge Space (Vector Store)**
- Use Pine Cone’s Vector Store integration to create a knowledge space containing:
  - A **Knowledge Store** that includes documents related to restaurants, food, or other relevant topics.
  - Add the following items to your knowledge store:
    - **Document Store**: Upload files like CSVs, Word documents, Q&A documents, etc. (e.g., restaurant reviews, menu prices, etc.).
    - **SQL Light**: Set up a SQL light for database operations and record management.
    - **Record Manager**: Add a text splitter to quickly break down large texts into chunks for processing.

---

### **3. Connect Your AI with the Knowledge Space**
- Use the connection between your AI and Pine Cone to upload or update data in your knowledge store.
- You can manually enter information for specific documents or rely on automation processes.

---

### **4. Set Up the Knowledge Base**
- Go to **Pine Cone > Database** > **Flow Wise Tutorial**.
- Add a new document store by going to `Options`, selecting **Knowledge Store**, and then:
  - Click "Add Document" and select your knowledge space (e.g., restaurant reviews).
  - For each document, you can name it and add it to the database.

---

### **5. Use Your Knowledge Space**
- You can now attach this knowledge space to your flow-wise chatbot by adding a description.
- The chatbot will provide information about restaurants like "O Barrel" when queried (e.g., asking for "how much is a stake at O Barrel").

---

### **6. Generate Content Using the Knowledge Base**
- Use your AI to generate responses based on your knowledge base:
  - Example: "How much is a stake at O Barrel?"  
    - The chatbot will use its database and provide accurate information.

---

### **7. Call the Flow-Wise Chatbot from Other Applications**
- If you want to share your knowledge space publicly, you can call it using an API URL.
  - Example: `https://chatflowwise.com/api/markdown?text="How much is a stake at O Barrel?"&model=yourname`

---

### **8. Use the Knowledge Space in Other Applications**
- Once attached, you can use your knowledge space to:
  - Manually enter information for specific documents.
  - Generate responses programmatically.

---

By following these steps, you set up a fully functional flow-wise chatbot that uses Pine Cone’s Vector Store and Drive3 integration.
