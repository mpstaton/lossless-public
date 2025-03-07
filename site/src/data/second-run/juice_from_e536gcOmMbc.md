---
this_video_url: https://youtube.com/watch?v=e536gcOmMbc
this_video_id: e536gcOmMbc
---
<think>
Alright, so I'm trying to understand how the recent version of the VS Code Code Extension changed compared to my previous video on this topic. Let me break down what I remember from the explanation and try to figure out what's different now.

First off, in the previous video, Gary mentioned that using this new Code Extension allowed us to test the cortex m33 cores with the risk 5 cores because the extension enabled compiler optimizations by default. But then, Danielle pointed out a problem where a lot of the code was inlining functions, specifically in the module 8 test. This process threw away part of the actual test results that we needed for accurate comparison.

Gary decided to implement his recommendation and included the "no inline" attribute at the beginning of a function to avoid this issue. This change made a significant difference because now the compiler could run it all in line, which improved performance without losing any data. The result was better test scores compared to before.

Moving on, Gary tested another part of the code called ocean_to_encryption using this new version and again found discrepancies. The benchmark results showed that the rp240 was slightly faster than the hazard 3 core, but seven times faster than the m33 core. This difference is important because it shows how the newer optimizations can affect floating-point operations differently.

Finally, Gary compared the performance improvements of different cores: cpup240 (1.5x), cpup33 (2.6x), and hazard3 (2.5x) for floating-point tasks. The m33 was about two times faster than the cpup240 and seven times faster than the cpup33, while still being 6 to 7 times faster in general.

I'm trying to see if these optimizations are consistent across all cores or if there's a specific pattern I should note. It seems like performance improvements are more pronounced for floating-point operations compared to integer ones. That makes sense because FP units can handle more complex calculations efficiently.

Now, thinking about how this would impact someone using VS Code on a cpup33 core: they'd get better test scores because the optimizations enabled by the new extension should mean faster execution times without losing critical data from the tests. However, I wonder if all cores benefit equally or if some might have performance issues that require further optimization.

Also, I'm curious about how other developers perceive this change. Has it been well-received? Have there been any issues with the optimizations not working as expected in certain contexts?

Overall, it looks like Gary has done a thorough job explaining these changes and their effects on different types of tasks. This information can really help when using VS Code on cpup cores because users will know to expect more optimized performance.
</think>

**Understanding the Changes in the VS Code Code Extension for cpup33 Cores**

In the recent update to Gary Sims' video, several key changes were introduced that enhance performance across different computational tasks. Here's a structured overview of these improvements:

1. **Compiler Optimizations:**
   - The new version enabled compiler optimizations by default, allowing the code extension to generate optimized release builds. This significantly improved performance for various tasks.

2. **Module 8 Test Issue Resolution:**
   - Danielle's suggestion was implemented by adding "no inline" attributes in specific functions. This resolved an issue where critical test data were lost due to function inlining, resulting in more accurate comparison of core performance.

3. **Ocean_to_Encryption Test Accuracy:**
   - The ocean_to_encryption benchmark results showed that cpup240 was slightly faster than cpup33, which in turn was faster than hazard3. This variation highlights the importance of floating-point operations for optimization differences.

4. **Performance Gains Across Cores:**
   - For cpup240 and cpup33:
     - cpup240 achieved 1.5x improvement.
     - cpup33 showed a 2.6x improvement in performance.
   - For floating-point operations, cpup33 improved by approximately 2-3 times compared to cpup240, and seven times faster than the hazard3 core.

**Conclusion:**
The new Code Extension significantly enhances performance on cpup33 cores, particularly in tasks involving floating-point operations. Users can expect more optimized execution times without data loss, improving overall coding efficiency. This information is crucial for developers using VS Code with cpup433 or similar cores.
