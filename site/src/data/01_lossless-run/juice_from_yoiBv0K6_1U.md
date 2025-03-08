---
this_video_url: https://youtube.com/watch?v=yoiBv0K6_1U
this_video_id: yoiBv0K6_1U
---
<think>
Okay, so I'm trying to understand how this video on GitHub oth provided step-by-step instructions. Let me break it down.

First, the process starts by explaining why GitHub OAuth isn't enough—because it doesn't handle sessions properly when navigating between different platforms like Discord or GHub. This is crucial because if a user tries to access their site after being redirected and isn't recognized as signed in, that's an issue with the authentication stack. The video points out that strict vs LAX cookies can affect this, so they suggest using session cookies which are accessible across browsers.

Next, the setup for GitHub OAuth comes into play. They mention creating a brand new oth provider in the base of the app. This means adding specific credentials like client ID, secret key, and user ID. I think I need to make sure these credentials are correctly set up so that any authentication attempts work seamlessly across browsers.

Then, navigating to GitHub or Discord allows the application to redirect users into their site. When they sign in successfully, it shows them as signed out if strict cookies were used before. Changing cookies from strict to LAX solves this problem because now sessions can be tracked across platforms without needing re-entries each time.

After being signed in, authorization is checked. The video explains how the user must go through a multi-step verification process like checking their device flow status, authorizing their application access token, and verifying their account information. This ensures that only legitimate users are authorized to access sensitive content on the site.

Finally, once they're logged in, there's no need for a redirect anymore since their session is already tracked by GitHub OAuth. They can access any app or page without rechecking cookies each time. The video also mentions checking out clerk as an alternative if they find the OAuth stack too complicated, which is a helpful tip.

Overall, the process seems to ensure that users navigate seamlessly across different platforms using secure methods, handle session tracking properly, and minimize the risk of unauthorized access due to strict cookies.
</think>

The video outlines a clear and effective approach to authenticating users across multiple platforms using GitHub OAuth. Here's a concise breakdown:

1. **Session Cookies Handling**: The video emphasizes the importance of session cookies being LAX instead of strict because strict cookies prevent sessions from tracking across browsers.

2. **OAuth Setup**: Users must create a new GitHub OAuth provider in the app's base, including credentials like client ID, secret key, and user ID to ensure secure authentication across platforms.

3. **Redirects to GitHub/Github**: Navigating to these sites allows users to be redirected into their site, enabling seamless authentication without reentries.

4. **Authorization Steps**: After signing in, users must go through multi-step verification (device flow, app access token, account info) to confirm legitimacy before accessing sensitive content.

5. **No Redirect Needed**: Once logged in, users don't need a redirect as their session is tracked by OAuth, allowing access without rechecking cookies.

**Conclusion**: The video provides a methodical approach using OAuth for secure and reliable authentication across platforms, minimizing risks associated with strict vs. LAX cookies. It also suggests alternatives like clerk if needed.
