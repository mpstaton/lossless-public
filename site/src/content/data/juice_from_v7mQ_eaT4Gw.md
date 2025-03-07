---
this_video_url: https://youtube.com/watch?v=v7mQ_eaT4Gw
this_video_id: v7mQ_eaT4Gw
---
<think>
Alright, so I was really excited about Chrome getting all these AI models built into it. The user mentioned that Chrome is going to be shipping AI models directly in the browser and that they'll be able to set this up pretty easily with just a few lines of code. They even showed how to sign up for the preview program and go through some setup steps.

I wanted to make sure I followed all the steps correctly because sometimes these things can get tricky, especially if you're not very tech-savvy. Let me walk through my thought process as I tried setting this up.

First, I needed to access the AI early preview program. The user suggested checking it out from Google by putting a link in their description and filling out the form that took about 24 hours. That seemed a bit long, but manageable. Once I had access, I wanted to go through all the documentation they provided on how to set this up.

Next, the setup process involved installing some flags within the description of the video. The user mentioned turning off the optimization guide for device model and enabling the prompt API for Gemini Nano. They also gave specific paths for these flags in case they weren't right below the system's settings. I didn't have to do that part because Chrome was pre-downloaded, but it's something important to note.

After installation, I opened Chrome and went into the Console section. The first thing I noticed was that there were some console prompts asking me for my API key. That looked a bit intimidating at first, but after a moment of thought, I realized I didn't need an API key because all this is done locally on the client side.

I then proceeded to create a text session using await window.createTextSession(). Once that was set up, I wanted to test how responses would appear. The user showed me how to stream out the responses using prompt.stream(), which made sense. They also mentioned that if you just want all the text at once, you can use prompt.fetch(), but I wasn't sure about that yet.

I tried getting a response and saw that it was pretty quick—under a second for small tokens. That's a big deal because it means no need to wait for API calls or depend on external providers. It also makes sense why they're going for something local since external API keys are often associated with third-party services, which can be risky.

Now, I thought about the benefits of this setup. Since Chrome is part of the Google ecosystem and many developers already know how to set up APIs within Chrome, using this means developers don't have to worry about third-party services or API keys. It's more accessible and reduces vendor lock-in. Plus, because it's running locally on the client side, there's no latency issues that come with remote APIs.

I also considered potential limitations. While this is great for development, there might be security concerns if an external API provider is compromised. But since Chrome is a secure browser by default, relying on internal APIs probably helps mitigate those risks. Additionally, because it's running locally, any data generated won't be exposed online, which could be useful in certain scenarios.

I wanted to make sure I wasn't missing anything else. The user didn't mention any third-party services or additional steps beyond installing the flags and using window.createTextSession(). It seems like once that's done, everything works as expected without needing access to external keys or APIs.

After setting this up successfully, I thought about how it could be integrated into applications. Developers would just need to ensure they're using local storage when interacting with this API since local data doesn't get saved unless explicitly told to do so via chrome.storage.local. That's a good point because having local storage is more secure and transparent.

I also wondered about the future. As Chrome continues to evolve, perhaps even expanding into other AI models or technologies within the future updates. It would be interesting to see how these capabilities might expand further as developers utilize this setup effectively.

In summary, setting up all of this was manageable once I followed the instructions correctly and understood the benefits it offered. The key steps were accessing Chrome's API through Console, installing the necessary flags, creating a text session, and using stream methods for responses. The result is a powerful tool that enhances development without relying on external services or API keys.
</think>

To set up AI models in Chrome, follow these streamlined steps:

1. **Access AI Early Preview Program**: Go to Google's Help > Get Started > Early Preview to access the built-in AI within Chrome.

2. **Install Flags**:
   - Turn off "Optimization Guide on Device Model" to avoid performance issues.
   - Enable "Prompt API for Gemini Nano."
   - Set paths for these flags if necessary.

3. **Set Up in Console**:
   - Open Chrome and navigate to the Console section.
   - Create a text session: `await window.createTextSession()`.
   - Use `prompt.stream()` or `prompt.fetch()` as needed, depending on your needs.

4. **Response Handling**: The system provides quick responses, such as under a second for small tokens, making it efficient and reliable without external API keys.

5. **Benefits**:
   - **Accessibility**: Accessible to developers with local storage without external services.
   - **Security**: Risks are mitigated by relying on Chrome's secure nature.
   - **Integration**: Easy integration into apps by managing local data through chrome.storage.local.

6. **Future Expansions**: Consider expanding features based on future Chrome updates, enhancing development efficiency.

By following these steps, you can leverage Chrome's internal AI capabilities to enhance your applications without external dependencies or API keys.
