---
this_video_url: https://youtube.com/watch?v=o7jLoO5NPQ0
this_video_id: o7jLoO5NPQ0
---
<think>
Okay, so I want to build a data analytics AI agent using N8N. Let me start by understanding what N8N is first. From what I know, it's an extension for E2B Cloud. It allows for real-time coding and executing code in the background, which seems useful for running scripts while interacting with other parts of the app.

The user provided a detailed guide, but I need to break it down step by step. Let me go through each part carefully.

First, setting up E2B sandbox. That sounds complicated. I think I'll need to install some specific packages like 'e2b-sandbox' and 'pydub'. Maybe I should look up how to install these using pip or another Python package manager.

Next, installing the N8N extension. I know it's an extension for E2B Cloud, so I'd probably use pydub's command line tool, which is pydub --version. Once installed, I can enable it in N8N by going to 'File > Extensions' and selecting the right button.

After that, creating a file upload interface in the workflow canvas. I remember seeing some examples with uploads for files like CSV or PDF. It's probably using the 'Upload' option in each task. I'll need to set this up so that any attached files are displayed as input nodes.

Now, connecting the AI agents and automations. The main flow is creating a tool agent which includes an AI agent. From the user's guide, they mentioned using GPT-4 for the AI agent. So I should install 'sentence-transformers' to use LlamaCpp or another API. Then, set up the AI model with appropriate parameters.

The task itself involves scraping data from Google Finance. The user provided a script that uses pandas and requests to fetch stock prices. But since we're using N8N in the background, maybe I can run this code outside of E2B Cloud but on my machine. Or perhaps integrate it into a function that runs during interactions.

Handling API errors is another point. They suggested adding error handling with try-except blocks and logging to capture any issues. That makes sense for a robust system.

Visualizing the output requires both AI processing and data analysis. The user's guide mentions using matplotlib and plotly, so I'll need to install these. For plotting historical prices, pandas is useful. Maybe after the scrape, extract relevant data from the CSV or JSON files and pass it to the AI for analysis.

Connecting this to the main tool agent will involve creating an input node with the output of the scraping process. Then, building a pipeline that connects all necessary nodes, including the AI agent, to execute calculations in the background while processing other parts of the workflow.

I also need to ensure that when the AI completes its processing, it triggers the output node back to E2B Cloud. This should be done with an 'End' command from N8N.

Testing each part step by step might help catch any issues early on. Maybe I can run a small test where the AI agent processes some data and then see if it correctly outputs the results.

Finally, considering possible enhancements like integrating more tools or automating complex queries could improve the system further. It's also important to mention that this is just a starting point and there are many areas for expansion, such as adding more interactive features or handling different types of data uploads.

Overall, I think breaking down each component one by one will make it manageable. Starting with setting up E2B sandbox, then N8N extension, file uploads, connecting AI agents, scraping code, error handling, and visualization should be the priority steps.
</think>

To build a data analytics AI agent using N8N, follow these step-by-step instructions:

### 1. Set Up E2B Sandbox
- **Install Packages**: Use `pip install e2b-sandbox pydub`.
- **Enable E2B Cloud**: In N8N, go to the "Extensions" tab and enable "E2B sandbox".

### 2. Install N8N Extension
- **Command Line Tool**: Run `python -m pydub --version` in your terminal.
- **Install Extension**: Go to `File > Extensions`, select N8N, click "Add," and choose the appropriate extension.

### 3. Create File Upload Interface
- **Workflow Setup**: Design a file upload node in the workflow canvas for CSV or PDF uploads.
- **Upload Nodes**: Use the "Upload" option under each task's output to display attached files as input nodes.

### 4. Connect AI Agents and Automations
- **AI Agent Configuration**: Install `sentence-transformers` with `pip install sentence-transformers`, then select LlamaCpp for processing.
- **Main Tool Agent**: Create a tool agent incorporating an AI agent, connect it to the scraping script via E2B Cloud.

### 5. Handle API Errors
- **Error Management**: Implement try-except blocks around API calls and log any errors using `logger.error`.

### 6. Visualize Output with AI Processing
- **Data Analysis**: Use matplotlib or plotly to process data passed from the scraping script.
- **Integration**: Connect the output of the scraping script through a node to the AI for analysis.

### 7. End Processing with E2B Cloud
- **End Command**: Trigger the processing result using N8N's "End" command in the main tool agent pipeline.

### Enhancements and Considerations
- **Additional Tools**: Expand features like integrating machine learning models or handling more data formats.
- **Advanced Queries**: Explore automating complex queries with E2B Cloud for real-time analysis.

This structured approach ensures a robust, scalable, and user-friendly AI-driven system.
