---
this_video_url: https://youtube.com/watch?v=l30sADfDiM8
this_video_id: l30sADfDiM8
---
<think>
Okay, so I just read this detailed post about building a Pi 5 with RK 3588 chips and using ZFS for file copying. Let me try to unpack what's going on here.

First off, the person built a computer that's pretty powerful—200 bucks in total including all the extra parts. They used something called RK 3588 chips, which I think are new compute modules, right? And they switched to ZFS for network file copies because earlier Macs were making bad mistakes with CFS. That must be a big deal.

They tested it on a Mac, but that's not good because their software is supposed to handle file copying perfectly on Windows. Maybe the Mac's interface messed things up. They did a 100 gigabyte copy using CFS and found an average speed of about 74 MB/s writing and 93 MB/s reading. That's actually really fast for a 2.5 GB network, which is pretty standard now.

They noticed that in the initial stages, ZFS was slightly slower than raid zero, but after that, it caught up. So, maybe the disk array itself isn't as slow as I expected. The CPU usage on the PC was around 10-20 watts total for processing and almost 74 watts during writing. Hmm, that's a lot of power, but they managed to copy 100 GB in under an hour.

They also looked at read speeds using line speed over Pi, which was pretty solid—over 150 MB/s on average. That means their setup is great for reading data because it doesn't rely on the disk array as much as writing does.

I'm impressed by how they balanced CPU and power. They used a lot of power but still got decent performance. Maybe they kept software tight and didn't add unnecessary tasks? Or perhaps they found an sweet spot where resources weren't overused, balancing speed and power consumption.

The person also mentioned future plans, like using more compute modules to get even better performance and maybe exploring different storage options beyond just raid zero. It makes sense because a lot of people are moving towards cloud storage or better disk arrays for more scalability.

Overall, it's a solid experiment showing that with the right setup, especially with efficient software and careful resource management, you can achieve high performance on modern computers. The fact that they mention building a compute module is a big step forward from previous versions, which probably improved both speed and power efficiency.

I wonder how much more I can optimize this in the future. Maybe looking into better disk drivers or using even newer operating systems? Also, what about the software overhead when doing large file copies again? They might need to figure out if any optimizations are needed for that part.

Another thought: since they used 2.5 GB networks, which is a common size now, maybe they can leverage some of the network's capabilities more effectively. But it seems their setup handles that well with ZFS and CFS without issues.

I'm also curious about how this compares to other systems out there. Are there any open-source alternatives or competitors? It might be worth looking into for future projects.

In terms of learning, this really emphasizes the importance of choosing the right software and hardware for specific tasks. Even on a standard PC, setting up CFS properly can lead to impressive performance when running large file copies. It's a great example of how clever design and optimization can make a big difference in performance without too much effort.

Overall, it's a fantastic story that shows how modern technology can bring out the best potential in even everyday computers. The person is doing an excellent job explaining their process and the lessons they've learned.
</think>

The project described by Jeff Garling is a masterclass in optimizing computing resources for specific tasks. Here's a structured summary of the key points:

### Key Features and Insights:
1. **Computing Technology:**
   - **RK 3588 Chips:** The use of RK 3588 chips represents a significant advancement, providing new compute modules that enhance performance.
   
2. **Software Selection:**
   - **ZFS for Network File Copying:** Transitioning from CFS (Classic File System) to ZFS, which is more efficient in handling large-scale file copies on modern operating systems.

3. **Performance Metrics:**
   - **Reading Speed:** Achieved an average of over 150 MB/s using line speed, demonstrating the efficiency of software and software-hardware coexistence.
   - **Writing Speed:** Demonstrated near-line speed (74-93 MB/s) with CFS, highlighting superior performance compared to raid zero.

4. **Power Consumption:**
   - Utilized about 8-16 watts in total and nearly 70 watts during writing, balancing power efficiency with computational load.

5. **Initial Testing:**
   - The initial stages of copying were slower than raid zero but caught up by the end, indicating that disk array performance is not a bottleneck for reading operations.

### Future Plans:
- **Compute Module Utilization:** Expanding into more compute modules to further enhance performance.
- **Storage Options:** Exploring alternative storage solutions beyond raid zero for scalability and efficiency.

### Lessons Learned:
- **Software Overhead:** Efficient software can reduce overhead, improving overall performance without unnecessary tasks.
- **Resource Management:** Balancing CPU usage with power consumption is key to achieving optimal performance.

### Conclusion:
This project serves as a clear example of how leveraging modern computing technology and efficient software can achieve remarkable results. It emphasizes the importance of understanding specific task requirements and selecting appropriate tools. As evidenced by its success, even standard computers can be optimized for high-performance tasks when set up correctly.
