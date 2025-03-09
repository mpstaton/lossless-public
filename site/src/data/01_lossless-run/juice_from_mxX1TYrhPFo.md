---
this_video_url: https://youtube.com/watch?v=mxX1TYrhPFo
this_video_id: mxX1TYrhPFo
---
<think>
Alright, I just saw this video explanation on how they set up their survey using Google App Engine. Let me try to break it down step by step because some of the terms are a bit confusing.

First, they started with Survey Mage, which seems like an API that allows developers to create APIs and services for surveys. Then, they added custom domains so their website can be managed through the app store or Google Play Store instead of just relying on the URL. That makes sense because it gives them more control over where their app is accessible.

They also used a custom domain name registered with Survey Mage, which means their website will work seamlessly within that system. It’s like having a dedicated hub for everything related to surveys and data collection.

Next, they set up Google App Engine as the backend. I remember that App Engine has its own instance stack, so each app needs its own instance. They probably had to make sure they were using the right instance when deploying so that the server can handle all the API requests properly.

They also added a "Start" command in their package.json because Google App Engine apps require this for them to run. Without it, the server wouldn't know how to start or stop the application if needed.

The deployment was successful, and now they’re using a base URL that doesn’t have an Express route. This way, when you go to /api, it sends back the actual data instead of returning "Server unavailable," which makes sense because it's sending real API responses.

They managed to add surveys and questions, but I didn't have time to explore all features yet. It looks like they can now collect user data through these surveys easily. They also mentioned that the survey functionality is ready for testing, so if you need help with something specific in a survey, feel free to ask!

Overall, this was a comprehensive setup using two platforms—Survey Mage and Google App Engine—and added some custom domains to enhance their website management. It's all about making sure their app works seamlessly within both systems.
</think>

Great video! Here are the key points from your explanation:

1. **Setting Up SurveyMage**: They started by setting up **SurveyMage**, an API-based service for developers, which they could use to create APIs and services.

2. **Custom Domains**: Added custom domains to their website so it could be managed through the app store or Google Play Store instead of just relying on URLs.

3. **Google App Engine Backend**: Deployed a backend using **Google App Engine**. They added a "Start" command in their package.json and updated the deployment URL with the official API endpoint.

4. **Base URL Adjustment**: Set the base URL to avoid an "Server unavailable" response when accessing /api routes, ensuring real API data is returned.

5. ** surveys/Questions Added**: Successfully managed to add surveys and questions without needing additional setup beyond what was already done.

Would you like me to explain any specific aspect in more detail?
