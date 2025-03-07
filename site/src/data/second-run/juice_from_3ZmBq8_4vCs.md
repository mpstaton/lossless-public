---
this_video_url: https://youtube.com/watch?v=3ZmBq8_4vCs
this_video_id: 3ZmBq8_4vCs
---
<think>
Okay, so I'm trying to understand how sequential agents work in Flowwise. From what I gather, they help manage multiple nodes that need to execute one after another. Let me walk through my thought process as I try to grasp this.

First, I remember seeing a supervisor node with the name "Supervisor." It seems like it's responsible for determining which node should run next and looping back around if needed. That makes sense because sometimes you want multiple agents or nodes in play at once, needing to take turns.

I see that there are two agent nodes: one for software developers and another for code reviewers. The software developer is called "Software Developer," and the code reviewer is named "Code Reviewer." Each of these has a supervisor node attached to them. So when the supervisor determines which node should run next, it loops back around to check if the other agents are still running.

The end state seems important. It's triggered either by another agent or when all nodes have finished their work. The end state outputs "End State," but in this case, we added an "Summary" node before that. That summary node aggregates all previous messages and provides a final answer for the user. This feels like a good idea because it keeps everything moving smoothly.

I also notice some flow metrics mentioned: 0.761438, 0.592212, and 0.683171. These probably represent the efficiency of node execution times compared to the maximum possible. A high number like 0.76 suggests that the software developer node is being utilized most effectively in the workflow.

But wait, I'm a bit confused about how exactly nodes are connected. When I added the supervisor node and attached it to both agent nodes, does each agent run on their own path? Or do they share execution paths? From what I understand, since there's only one supervisor node, both agents should be running in parallel. The flow metric of 0.76 would show how well these agents are being utilized together.

I'm also wondering about the purpose of adding the "End State" and then the "Summary" nodes. Why is the summary node necessary? I think it's to aggregate all messages so that the user doesn't have to follow each agent step by step anymore, which could be overwhelming. The final answer given in "Summary" probably summarizes everything, making it easier for the end user.

Another thing I'm considering is how this setup can scale. If we need more nodes or agents, how would the flow metrics change? Would adding another supervisor node affect these numbers? Maybe the metrics should adjust based on the number of active nodes and their execution times.

Also, I'm curious about the human prompts in the system prompt section. Why are they being appended to each node's messages? Is it for maintaining context or ensuring that all previous interactions are accounted for? I think it ensures that each agent's output is correctly attributed back to their role, which might be important for accountability and clarity.

I'm also thinking about how this setup handles loops versus non-loops. In the example given, after the code reviewer loops back around, the software developer produces some output, then the supervisor repeats the process. The flow metrics suggest that each node is being executed efficiently, but does it handle multiple loop iterations smoothly? What if a loop needs to run more than once? Would the metrics adjust accordingly?

Lastly, I'm considering how this setup can be modified for different use cases. For example, if we wanted the agents to take turns running one after another without looping, would that require adding separate supervisor nodes or some other structure? Or could we just have multiple agent nodes in parallel with their own supervisors? It seems like they are designed to run sequentially, which might be more appropriate for certain workflows.

Overall, I think sequential agents provide a neat way to manage multiple tasks efficiently by controlling the execution order. The flow metrics give insights into how well each node is being utilized, and the summary nodes help keep everything moving without getting bogged down in too much detail.
</think>

**Sequential Agents Explanation and Implementation**

**1. Understanding Sequential Agents:**
   - **Function:** Sequential agents manage multiple tasks that need to execute in a specific order.
   - **Structure:** Each agent node is controlled by a supervisor node, which loops back around if necessary.
   - **Example Workflow:**
     1. **Supervisor Node:** Determines the next task and loops back after completion.
     2. **Agent Nodes (Software Developer & Code Reviewer):** Run in parallel until all active and are paused.
     3. **End States & Summary Node:** Aggregates outputs, providing a final answer or summarizing all messages.

**2. Implementation Details:**
   - **Node Execution:** Each agent runs on its own path with their supervisor, ensuring efficient execution together.
   - **Flow Metrics:** The metrics (0.761438, 0.592212, 0.683171) indicate the efficiency of node utilization, showing how well agents are utilized in a workflow.

**3. Benefits:**
   - **Simplicity:** Reduces complexity by managing multiple tasks efficiently.
   - **Clarity:** Summaries aggregate all messages, making it easier for end users to follow progress without step-by-step tracking.
   - **Scalability:** Metrics can adjust based on the number of active nodes and execution times.

**4. Considerations:**
   - **Loop vs Non-Loop:** Designed for sequential execution; non-loop scenarios might require alternative setups.
   - **Human Interaction:** Human prompts are appended to ensure context is maintained, aiding accountability and clarity.

**5. Future Enhancements:**
   - **Multiple Loop Iterations:** Adjust metrics based on loop iterations if needed.
   - **Parallel Execution:** Use separate supervisor nodes for parallel execution without loops, enhancing workflow flexibility.

This setup efficiently manages workflows with multiple agents by controlling execution order, ensuring smooth and organized task execution.
