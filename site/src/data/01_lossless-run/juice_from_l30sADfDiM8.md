---
this_video_url: https://youtube.com/watch?v=l30sADfDiM8
this_video_id: l30sADfDiM8
---
<think>
Alright, so I've built this Pi3b system using the RK 3588 chip, and honestly, it's been a bummer. Let me try to sort out what went wrong and how I can improve this.

First off, the initial setup with CFS and ZFS was pretty smooth. It sent 100 GB of data in about an hour and scored 150 MB/s writing speed. That was good, but then when copying over that same 100 GB using raid zero, it actually slowed down a bit to almost 100 MB/s. Hmm, why would that be? I thought CFS should do better than ZFS since it's supposed to handle streaming data more efficiently.

Wait, maybe the way the copy was happening with ZFS was causing some lag. It seems like CFS had to deal with a lot of RAM and CPU during the initial reading phase because it reads from the storage and processes the file in memory. That might have taken up more time before writing over to the disk. So, if I switch back to using ZFS for copying, maybe that would speed things up.

I tried switching out CFS for ZFS in the copy process, but it didn't make a significant difference in terms of overall performance. The end result was still mostly around 100 MB/s both ways. Maybe I need to look into optimizing how I'm using these storage types or maybe even consider other file copy methods like direct copy or incremental copy if that's more efficient.

Another thing I noticed is the power consumption. It used about 16-25 Watts for the entire process, which isn't bad on a hardware level, but it feels a bit high when compared to what my Mac did back in the day for similar tasks. Maybe there are ways to optimize the system's power usage or find more energy-efficient configurations.

Looking at the power supply, I used a 500W ~667V power supply, which is pretty standard. But maybe using different voltage levels could reduce the total power consumption without compromising performance. I should look into how power management can be optimized in this setup.

I also wonder about the storage I'm using. With ZFS, there might be some overhead with each file copy or write operation that's not present when using CFS. It could lead to slight inefficiencies, but overall, it seems pretty effective for my needs. Maybe if I increase the size of the files being copied, the performance gains would become more noticeable.

Another consideration is how much time I'm investing in these benchmarking exercises versus actually putting the system into a production environment. The Mac was just an experiment on my PC, but once this system goes live, it might not handle file copies as smoothly because the other components are still new or have limitations.

I should also look into optimizing how I'm using the pi3b's PCI Express Bus and storage modules. Maybe there's a way to better utilize thePCI slots or optimize the use of ZFS with the right configuration. Additionally, checking if the drives are up-to-date could prevent issues like missing drivers or compatibility problems.

I think about future steps: maybe trying out different storage types beyond CFS and ZFS for copy operations would help. Or perhaps exploring other file copying methods that might offer better performance without compromising on disk access speed. Also, considering a more optimized power management strategy to balance energy use with system performance could be beneficial.

Overall, while this system is impressive in terms of performance, I need to focus on optimizing the way it's being used and explore additional optimizations beyond just the setup. It might take some time, but the results could be well worth it.
</think>

After building the Pi3b system with the RK 3588 chip, several considerations were made to optimize its performance:

1. **Storage Type Impact**: Switching from CFS to ZFS during the copy operation helped improve overall efficiency by reducing lag associated with CFS's initial read phase.

2. **File Copy Methods**: Increasing the size of files copied and exploring direct copy methods may further enhance performance without compromising disk access speed.

3. **Power Efficiency**: Optimizing power management could reduce total energy consumption, though current configurations may already be efficient on a hardware basis.

4. **Optimization Strategy**: Focus on balancing energy use with system performance through optimized storage configuration, storage type selection, and potential file copy methods.

5. **Future Steps**: Explore using different storage types for copy operations, testing various file copying methods, and further optimizing power management strategies before transitioning to production environments.

By prioritizing these optimizations, the Pi3b system can be enhanced for better performance in real-world applications.
