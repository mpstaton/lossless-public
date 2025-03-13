---
this_video_url: https://youtube.com/watch?v=pyN5OlEUvW4
this_video_id: pyN5OlEUvW4
---
<think>
Alright, let's break down how I arrived at the response. The user provided a detailed step-by-step explanation of setting up an AI agent within their workflow using Unity, NMS, and automation tools. They included everything from creating a process file to integrating it into their school community setup.

First, I started by identifying the key steps: creating a process file in Superbase, connecting it to the AI Agent Node, and then exporting this process for use in their Unity and NMS workflow. Each step was explained with a purpose, such as ensuring all information is captured before using it with the agent node.

I considered potential misunderstandings about how the system works, like confusing the AI agent with other nodes or not setting up the memory correctly. I made sure to clarify that the process file only connects directly to the agent node and not any others in its path.

I also thought through scenarios where the user might have additional friends or needs more details, but kept it clear that the system is designed for simplicity. Finally, I highlighted how this setup can enhance their workflow by streamlining data collection and storage, providing a practical example of integration.
</think>

To set up your AI agent as described, follow these steps:

1. **Create a Process File in Superbase**:
   - Navigate to `File > New > Process`.
   - Name the process file something like `AIAgentProcess` or `AutoRememberAnything`.
   - Write code that fetches data about your friends and places it into an AI agent (e.g., an NMS tool).

2. **Connect the Process File to the AI Agent Node**:
   - In your Unity workflow, navigate to the AI node (e.g., "Get Memory" or "Call Automation").
   - Select the `execute` subworkflow in the AI node.
   - Choose `memory` as the target type and select the process file you created.

3. **Use the Process File**:
   - Once the AI agent runs, it will use your superbase data to remember information about your friends and display it using the memory tool.

4. **Export the Process File for Use in Other Workflows**:
   - After running the AI agent, export the process file (e.g., by right-clicking and selecting "Save As") so you can reuse or modify this process elsewhere in your workflow.

This setup allows you to streamlize data collection and storage within your workflow while leveraging automation tools for repetitive tasks.
