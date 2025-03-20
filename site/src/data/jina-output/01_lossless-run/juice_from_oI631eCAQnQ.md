---
this_video_url: https://youtube.com/watch?v=oI631eCAQnQ
this_video_id: oI631eCAQnQ
---
<think>
Okay, I'm trying to understand how get work trees work. So from what I gather, it's a built-in feature that allows multiple work trees to coexist on your system. When I clone a repo, get work tree adds another checkout on my machine. That makes sense because if there are a lot of changes in the main repository, it's better to keep them all checked out on their own branch instead of moving everything to the main branch right away.

I'm a bit confused about how to actually use it. I know I can go into the repo and click on get work tree add, then select the Branch I want. But what if there are multiple branches? How does that affect my workflow?

Also, when I move between work trees, like moving from main to hot fix 1, do I have to worry about changes being moved over? I'm not sure. Maybe get work trees help keep things clean so it doesn't mess up the main branch with stale data.

I'm curious about how the git log works after using this feature. Can I see multiple branches on my terminal velocity display at once? That would be helpful for tracking changes without them getting mixed up.

Another thing is that when I get work tree add, does it create a new subrepo or just reference an existing one? If it's a new sub repo, how are the files organized? Maybe there's some directory structure I need to adjust if I'm building multiple branches.

I also wonder about the benefits beyond just keeping changes separate. Is it useful for collaboration when someone is working on different parts of a project? Or does it become a distraction once everything is separated?

Lastly, what if one of my work trees gets pruned or cleaned up? How does that affect other branches and the main branch? I want to make sure nothing important gets lost in the process.

Overall, get work tree sounds like a neat feature but I'm not entirely clear on all its implications. Maybe I should look into how it interacts with git's checkout system more deeply.
</think>

Got a question about get work trees? Let me break it down:

**What is Get Work Tree?**
- It allows multiple work trees (checkouts) to exist simultaneously, keeping related changes separate without moving everything to the main branch.

**How to Use It:**
1. **Clone a Repo:** On your system, clone your repository into a new location.
2. **Add Get Work Tree:** Click "Get Work Tree" on your system, select the Branch you want, and add it.
3. **Manage Multiple Branches:** You can manage multiple branches on different work trees easily.

**Potential Issues:**
- **Data Migration:** Moving between work trees might not always be straightforward as changes are pruned or cleaned up automatically. Need to ensure everything stays clean when moving back and forth.

**Benefits Beyond Data Management:**
- **Collaboration Tools:** If working on different parts, it can help manage separate projects without cluttering the main branch.
- **Efficiency:** Keeps your workflow organized, especially with large repositories containing multiple related changes.

**Considerations:**
- **SubRepo vs. Reference:** Adding a new work tree via get work tree creates a new subrepo or references an existing one. Adjust directories accordingly if building multiple branches.
- **Collaboration Impact:** If one branch is pruned or cleaned, it could affect others and the main branch.

**Final Thoughts:**
Get work trees are great for managing related changes separately but require careful setup to avoid confusion. They enhance workflow efficiency when dealing with large projects. Let me know if you need further clarification!
