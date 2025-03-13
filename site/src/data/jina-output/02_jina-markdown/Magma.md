Magma: A Foundation Model for Multimodal AI Agents
===============
                   

![Image 1: Magma Logo](https://microsoft.github.io/Magma/static/images/logo.png)

Magma: A Foundation Model for Multimodal AI Agents
==================================================

### CVPR 2025

[Jianwei Yang](https://jwyang.github.io/)\*1†    [Reuben Tan](https://cs-people.bu.edu/rxtan/)1†    [Qianhui Wu](https://qianhuiwu.github.io/)1†    [Ruijie Zheng](https://ruijiezheng.com/)2‡    Baolin Peng1‡    [Yongyuan Liang](https://cheryyunl.github.io/)2‡     
[Yu Gu](http://yu-gu.me/)1    [Mu Cai](https://pages.cs.wisc.edu/~mucai/)3    [Seonghyeon Ye](https://seonghyeonye.github.io/)4    [Joel Jang](https://joeljang.github.io/)5    Yuquan Deng5    [Lars Liden](https://sites.google.com/site/larsliden)1    [Jianfeng Gao](https://www.microsoft.com/en-us/research/people/jfgao/)1▽     
  
1Microsoft Research    2University of Maryland    3University of Wisconsin-Madison    4KAIST    5University of Washington  
\* Project lead.    †First authors.    ‡Second authors.    ▽Leadership

[ArXiv](https://www.arxiv.org/pdf/2502.13130) [Code](https://github.com/microsoft/Magma) [![Image 2](https://microsoft.github.io/Magma/static/images/hf_icon.svg)Hugging Face Model](https://huggingface.co/microsoft/Magma-8B) [☁️ Azure AI Foundry](https://ai.azure.com/explore/models/microsoft-magma-8b/version/1/registry/HuggingFace?tid=72f988bf-86f1-41af-91ab-2d7cd011db47) [Twitter / X](https://x.com/jw2yang4ai/status/1892348660484280669) [Youtube Video](https://www.youtube.com/watch?v=SbfzvUU5yM8)

[Magma-UI](https://huggingface.co/spaces/microsoft/Magma-UI) [Magma-Gaming](https://huggingface.co/spaces/microsoft/Magma-Gaming)

![Image 3: Image description](https://microsoft.github.io/Magma/static/images/magma_teaser.png)

  

**Magma** is the first foundation model for multimodal AI agents. As the bedrock for mutimodal agentic models, it possesse strong capabilities to perceive the multimodal groundingly world AND take goal-driven actions precisely. By effectively transferring knowledge from freely available visual and language data, **Magma** bridges verbal, spatial and temporal intelligence to navigate complex tasks and settings across digial and physical world.
--------------------------------------------------------------------------------------------------------------------------------

Abstract
--------

We present **Magma**, a foundation model serving multimodal AI agentic tasks in both the digital and physical worlds. **Magma** is a significant extension of vision-language (VL) models in that the former not only retains the VL understanding ability (verbal intelligence) of the latter, but is also equipped with the ability to plan and act in the visual-spatial world (spatial intelligence) and to complete agentic tasks ranging from UI navigation to robot manipulation. **Magma** is pretrained on large amounts of heterogeneous VL datasets including images, videos and robotics data, where the actionable visual objects (e.g., clickable buttons in GUI) in images are labeled by Set-of-Mark (SoM) and the object movements (e.g., the trace of a robotic arm) in videos are labeled by Trace-of-Mark (ToM). Extensive experiments show that SoM and ToM facilitate the acquisition of spatial intelligence from large-scale training data. **Magma** creates new state-of-the-art results on UI navigation and robotic manipulation tasks, outperforming previous models that are tailored specifically to these tasks. On VL tasks, Magma also compares favorably to popular VL models that are trained on much larger datasets.

Magma Pretraining
-----------------

![Image 4](https://microsoft.github.io/Magma/static/images/magma_pretrain.png)

**Magma pretraining pipeline.** For all training data, texts are tokenized into tokens, while images and videos from different domains are encoded by a shared vision encoder. The resulted discrete and continuous tokens are then fed into a LLM to generate the outputs in verbal, spatial and action types.

Magma Technical Details
-----------------------

![Image 5: Image description](https://microsoft.github.io/Magma/static/images/som_fig.jpg)

**Set-of-Mark (SoM) for Action Grounding.** Set-of-Mark prompting enables effective action grounding in images for both UI screenshot (left), robot manipulation (middle) and human video (right) by having the model predict numeric marks for clickable buttons or robot arms in image space.

![Image 6: Image description](https://microsoft.github.io/Magma/static/images/tom_fig.png)

**Trace-of-Mark (ToM) for Action Planning.** Trace-of-Mark supervisions for robot manipulation (left) and human action (right). It compels the model to comprehend temporal video dynamics and anticipate future states before acting, while using fewer tokens than next-frame prediction to capture longer temporal horizons and action-related dynamics without ambient distractions.

![Image 7](https://microsoft.github.io/Magma/static/images/magma_data_sunburst.png) ![Image 8](https://microsoft.github.io/Magma/static/images/magma_data_sample.png)

**Overview of Pretraining Data Sources**: instructional videos, robotics manipulation, UI navigation, and multimodal understanding. We apply SoM and ToM for different data types, with SoM enabling unified action grounding across all modalities while ToM is specifically applied to video and robotics data.

Robot Visual Planning
---------------------

**Magma plans the future trajectories for robot manipulation tasks.**

**Task: Pick up the chip bag.**

**Task: Push chip bag to left edge of table.**

**Task: Pick up the coke can.**

Magma Gaming
------------

**Ask multi-modal models to PLAY a 2D game:** Collects the green blocks by automatically moving up, down, left and right.

**Magma Agent vs. LLaVA-OneVision Agent**

**Magma Agent vs. Qwen2-VL Agent**

**Magma Agent vs. GPT-4o mini Agent**

Agentic Intelligence
--------------------

![Image 9](https://microsoft.github.io/Magma/static/images/magma_agentic.png)

**Zero-shot evaluation on agentic intelligence.** We report the results for pretrained Magma without any domain-specific finetuning. Magma is the **only model** that can conduct the **full task spectrum**.

UI Navigation
-------------

What's weather in Seattle? & turn on flight mode

Share and message this to Bob Steve, click send button to complete

![Image 10](https://microsoft.github.io/Magma/static/images/ui_efficient_mind2web.png)

**Efficient finetuning on Mind2Web for web UI navigation.**

![Image 11](https://microsoft.github.io/Magma/static/images/ui_efficient_aitw.png)

**Efficient finetuning on AITW for mobile UI navigation.**

Robot Manipulation
------------------

WidowX videos show real robot rollouts with **Magma** model. (Videos are sped up by 2.5x.)

**Magma**

**OpenVLA**

Pick Place Hotdog Sausage

Put Mushroom Place Pot

Push Cloth Left to Right (Out-of-Dist.)

**Few-shot finetuning on WidowX robot.** **Magma** consistently outperforms OpenVLA (finetuning) across soft object manipulation and pick-and-place operations, demonstrating reliable performance in both in-distribution and out-of-distribution generalization tasks on real robots.

![Image 12](https://microsoft.github.io/Magma/static/images/magma_real.png)Magma on Real Robot

![Image 13](https://microsoft.github.io/Magma/static/images/magma_libero.png)Magma on LIBERO

**Few-shot finetuning on LIBERO.** **Magma** achieves a significantly higher average success rate in all task suites. Additionally, removing SoM and ToM during pretraining has a negative impact on model performance.

![Image 14: Image description](https://microsoft.github.io/Magma/static/images/magma_simpler.png)

**Zero-shot SimplerEnv evaluation on Google Robots and Bridge.** **Magma** shows strong zero-shot cross-domain robustness and demonstrates impressive results in cross-embodiment manipulation simulation tasks.

Spatial Reasoning
-----------------

![Image 15](https://microsoft.github.io/Magma/static/images/magma_spatial_table.png)

![Image 16](https://microsoft.github.io/Magma/static/images/magma_spatial_visualizations.png)

**Spatial reasoning evaluations.** Spatial reasoning questions are challenging even for GPT-4o but Magma can answer relatively well despite relying on much fewer pretraining data.

Multimodal Understanding
------------------------

![Image 17](https://microsoft.github.io/Magma/static/images/magma_video_qa.png)

**Zero-shot Video QA benchmarks.** **Magma** performs competitively and even outperforms some state-of-the-art approaches such as Video-Llama2 and ShareGPT4Video on most benchmarks, despite using much fewer video instruction tuning data.

Video conversation examples
---------------------------

**User**: I really want to win this game. Can you suggest the next move that I should make to maximize my chances of winning?

**Magma**: I suggest moving the pawn to d4 to maximize your chances of winning.

**User**: I want to relax for a few hours in here. Can you suggest some things for me to do?

**Magma**: Watch TV, read a book, and enjoy the view of the autumn forest.

**User**: Please provide a detailed description of the video, focusing on the main subject and the actions taking place as well as predict what is going to happen next.

**Magma**: The video takes place in a convenience store, focusing on the checkout counter. It begins with a view of the counter displaying a sign that reads 'PICK 5 FOR $8.00' along with images of various snacks. The counter is filled with various items, including snacks and a payment terminal. An employee, wearing a black shirt with white sleeves, is seen handling the payment terminal. A customer, identifiable by their white sleeve and colorful bracelet, places a red shopping basket filled with snacks and a drink on the counter. The employee continues to operate the payment terminal while the customer adjusts the items in the basket. The interaction between the customer and the employee is highlighted, with the employee assisting the customer with the items. The scene continues at the same checkout counter, with the 'PICK 5 FOR $8.00' sign still prominently displayed. The customer's red shopping basket, now filled with snacks including a drink cup labeled 'Fruit Swoosh' and a blue package of cookies, is placed on the counter. The employee is seen handling the payment terminal. The customer's hand, adorned with a colorful bracelet, interacts with the items in the basket. The employee continues to assist the customer, adjusting the items on the counter. The interaction between the customer and the employee remains the focal point, with the employee assisting the customer with the items. The person behind the counter is likely to process the payment and possibly hand over the items.

**User**: Please describe in detail what is happening in the video by focusing on the main actions.

**Magma**: The video begins with a close-up of a hand reaching for a red potted plant placed on a wooden shelf. The plant has green and yellow-striped leaves and is accompanied by a book titled 'YOUNG' and a wooden bowl stacked on top of each other. The hand carefully adjusts the position of the plant on the shelf, ensuring it is properly placed. The background includes a beige watering can hanging on a stand and a radiator with white pipes. The hand then adjusts the plant once more, making sure it is centered on the shelf. The scene develops as the hand, now wearing a yellow sweater and a ring on the left hand, reaches out to adjust the plant's position once more. The hand then moves away from the plant, and the camera shifts to show more of the surrounding area, including a red high chair and a wooden countertop with various items, such as a smartphone and a small red cup. The video wraps up with a wider view of the room, revealing a checkered floor and several other plants in the background, adding a homely touch to the setting.

**User**: Please describe in detail what is happening in the video by focusing on the main actions.

**Magma**: The video begins with a close-up view of a kitchen sink area. The sink has a shiny silver faucet with water running, and a person is holding a black mug under the running water. On the left side of the sink, there is a bottle of dish soap and a blue toothbrush. The person then picks up a blue sponge and starts scrubbing the inside of the mug. The scene continues with the person methodically scrubbing the mug, ensuring it is clean. The video wraps up with the person placing the scrubbed mug in the sink and the blue sponge beside it, indicating that the cleaning process is complete.

**User**: What drink did the person choose in the video?

**Magma**: The person chose a soy beverage labeled as 'SAVE SOY'.

**User**: Can you predict the next actions that the person is going to carry out beyond the video?

**Magma**: The person is likely about to pour hot water into the cup and proceed with the tea preparation process.

**User**: Can you describe what the person is doing in the video?

**Magma**: The person is interacting with the coffee machine by pressing buttons, likely to make a coffee choice.

BibTeX
------

```
@misc{yang2025magmafoundationmodelmultimodal,
        title={Magma: A Foundation Model for Multimodal AI Agents}, 
        author={Jianwei Yang and Reuben Tan and Qianhui Wu and Ruijie Zheng and Baolin Peng and Yongyuan Liang and Yu Gu and Mu Cai and Seonghyeon Ye and Joel Jang and Yuquan Deng and Lars Liden and Jianfeng Gao},
        year={2025},
        eprint={2502.13130},
        archivePrefix={arXiv},
        primaryClass={cs.CV},
        url={https://arxiv.org/abs/2502.13130},
      }
```

  
  
  

[Return to top](https://microsoft.github.io/Magma/#top)Website adapted from [NeRFies](https://github.com/nerfies/nerfies.github.io) and [TraceVLA](https://github.com/tracevla/tracevla.github.io) under [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/)

Links/Buttons:
- [Jianwei Yang](https://jwyang.github.io/)
- [Reuben Tan](https://cs-people.bu.edu/rxtan/)
- [Qianhui Wu](https://qianhuiwu.github.io/)
- [Ruijie Zheng](https://ruijiezheng.com/)
- [Yongyuan Liang](https://cheryyunl.github.io/)
- [Yu Gu](http://yu-gu.me/)
- [Mu Cai](https://pages.cs.wisc.edu/~mucai/)
- [Seonghyeon Ye](https://seonghyeonye.github.io/)
- [Joel Jang](https://joeljang.github.io/)
- [Lars Liden](https://sites.google.com/site/larsliden)
- [Jianfeng Gao](https://www.microsoft.com/en-us/research/people/jfgao/)
- [ArXiv](https://www.arxiv.org/pdf/2502.13130)
- [Code](https://github.com/microsoft/Magma)
- [Hugging Face Model](https://huggingface.co/microsoft/Magma-8B)
- [☁️ Azure AI Foundry](https://ai.azure.com/explore/models/microsoft-magma-8b/version/1/registry/HuggingFace?tid=72f988bf-86f1-41af-91ab-2d7cd011db47)
- [Twitter / X](https://x.com/jw2yang4ai/status/1892348660484280669)
- [Youtube Video](https://www.youtube.com/watch?v=SbfzvUU5yM8)
- [Magma-UI](https://huggingface.co/spaces/microsoft/Magma-UI)
- [Magma-Gaming](https://huggingface.co/spaces/microsoft/Magma-Gaming)
- [Return to top](https://microsoft.github.io/Magma/#top)
- [NeRFies](https://github.com/nerfies/nerfies.github.io)
- [TraceVLA](https://github.com/tracevla/tracevla.github.io)
- [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/)
