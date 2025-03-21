Scalar - Document, Test & Discover APIs
===============

[Register](https://dashboard.scalar.com/register)[Login](https://dashboard.scalar.com/login)[Documentation](https://guides.scalar.com/)

[X (formerly Twitter)](https://x.com/scalar) [Discord](https://discord.gg/scalar) [GitHub](https://github.com/scalar/scalar)

Landing Page

[Introduction](https://scalar.com/#introduction) [Users](https://scalar.com/#users) [API Docs](https://scalar.com/#api-docs) [Integrations](https://scalar.com/#integrations) [API Client](https://scalar.com/#api-client) [Pricing](https://scalar.com/#pricing) [Contact Us](https://scalar.com/#contact-us) [Footer](https://scalar.com/#footer)

Product Demos

[Swagger Editor](https://scalar.com/swagger-editor) [API Client](https://client.scalar.com/)

Additional Resources

[Changelog](https://scalar.com/changelog) [Contact Us](mailto:support@scalar.com)

Marc

![Image 1: image of marc](https://scalar.com/marchuddle.png)

[Answer](https://cal.com/scalar/30min)

The modern open-source developer experience platform for your APIs.
===================================================================

Create world-class _API Docs_ with a built-in _interactive playground_ which seamlessly turns to a full featured _API Client_.
------------------------------------------------------------------------------------------------------------------------------

[Get started for free](https://dashboard.scalar.com/register) [Chat with sales](https://cal.com/scalar/30min)

api.scalar.com

Search

⌘K

Resources

Markdown

Authentication

_Create a User_POST

Get a token POST

Get authenticated user GET

Planets

Get all planets GET

Create a planet POST

Get a planet GET

Update a planet PUT

Delete a planet DEL

Upload image to planet POST

Webhooks

Models

Authentication

Some endpoints are public, but some require authentication. We provide all the required endpoints to create an account and authorize yourself.

ENDPOINTS

_POST_/user/signup

_POST_/auth/token

_GET_/me

Create a User

Time to create a user account, eh?

Bodyapplication/json

nameRequiredstring

emailRequiredstringemail

passwordRequiredstringmin: 8

Responses

201

Created

400

Bad Request

POST/user/signup

1curl\--request POST\\

2\--url https://galaxy.scalar.com/user/signup \\

3\--headerContent-Type: application/json' \\

4\--data'{

5"name": "Marc",

6"email": "marc@scalar.com",

7"password": "i-love-scalar"

8}'

Test Request

201400

1{

2"id":"1"

3"name":"Marc"

4"email":"marc@scalar.com"

5}

Create a User

Get all planets

Delete a planet

Workspace

POST galaxy.scalar.com/user/signup Send

Open in Scalar

Search

⌘K

My First API

Authentication

_Create a User_POST

Get a token POST

Get authenticated user GET

Planets

Get all planets GET

Create a planet POST

Get a planet GET

Update a planet PUT

Delete a planet DEL

Upload image to planet POST

Webhooks

Create a User

Cookies

<table class="mb-0 grid min-h-8 auto-rows-auto"><tbody><tr class="group flex contents w-fit min-w-full"><td class="group/cell relative m-0 flex min-h-8 min-w-8 items-center border-b-1/2 border-l-0 border-r-1/2 border-t-0 p-0 px-2.5 text-sm last:border-r-0 group-last:border-b-transparent"><svg class="h-animation-14 size-3 text-c-3 opacity-50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" /></td><td class="relative m-0 flex min-h-8 w-full min-w-8 items-center border-b-1/2 border-l-0 border-r-1/2 border-t-0 p-0 px-2.5 text-sm last:border-r-0 group-last:border-b-transparent"><span class="text-c-3">Key</span></td><td class="relative m-0 flex min-h-8 w-full min-w-8 items-center border-b-1/2 border-l-0 border-r-1/2 border-t-0 p-0 px-2.5 text-sm last:border-r-0 group-last:border-b-transparent"><span class="text-c-3">Value</span></td></tr></tbody></table>

Headers

<table class="mb-0 grid min-h-8 auto-rows-auto"><tbody><tr class="group flex contents w-fit min-w-full"><td class="group/cell relative m-0 flex min-h-8 min-w-8 items-center border-b-1/2 border-l-0 border-r-1/2 border-t-0 p-0 px-2.5 text-sm last:border-r-0 group-last:border-b-transparent"><svg class="h-animation-14 size-3 text-c-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" /></td><td class="relative m-0 flex min-h-8 w-full min-w-8 items-center border-b-1/2 border-l-0 border-r-1/2 border-t-0 p-0 px-2.5 text-sm last:border-r-0 group-last:border-b-transparent"><span class="text-c-1">Content-Type</span></td><td class="relative m-0 flex min-h-8 w-full min-w-8 items-center border-b-1/2 border-l-0 border-r-1/2 border-t-0 p-0 px-2.5 text-sm last:border-r-0 group-last:border-b-transparent"><span class="text-c-1">application/json</span></td></tr><tr class="group flex contents w-fit min-w-full"><td class="group/cell relative m-0 flex min-h-8 min-w-8 items-center border-b-1/2 border-l-0 border-r-1/2 border-t-0 p-0 px-2.5 text-sm last:border-r-0 group-last:border-b-transparent"><svg class="h-animation-14 size-3 text-c-3 opacity-50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" /></td><td class="relative m-0 flex min-h-8 w-full min-w-8 items-center border-b-1/2 border-l-0 border-r-1/2 border-t-0 p-0 px-2.5 text-sm last:border-r-0 group-last:border-b-transparent"><span class="text-c-3">Key</span></td><td class="relative m-0 flex min-h-8 w-full min-w-8 items-center border-b-1/2 border-l-0 border-r-1/2 border-t-0 p-0 px-2.5 text-sm last:border-r-0 group-last:border-b-transparent"><span class="text-c-3">Value</span></td></tr></tbody></table>

Query Parameters

<table class="mb-0 grid min-h-8 auto-rows-auto"><tbody><tr class="group flex contents w-fit min-w-full"><td class="group/cell relative m-0 flex min-h-8 min-w-8 items-center border-b-1/2 border-l-0 border-r-1/2 border-t-0 p-0 px-2.5 text-sm last:border-r-0 group-last:border-b-transparent"><svg class="h-animation-14 size-3 text-c-3 opacity-50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" /></td><td class="relative m-0 flex min-h-8 w-full min-w-8 items-center border-b-1/2 border-l-0 border-r-1/2 border-t-0 p-0 px-2.5 text-sm last:border-r-0 group-last:border-b-transparent"><span class="text-c-3">Key</span></td><td class="relative m-0 flex min-h-8 w-full min-w-8 items-center border-b-1/2 border-l-0 border-r-1/2 border-t-0 p-0 px-2.5 text-sm last:border-r-0 group-last:border-b-transparent"><span class="text-c-3">Value</span></td></tr></tbody></table>

Body

1{

2"name":"Marc"

3"email":"marc@scalar.com"

4"password":"i-love-scalar"

5}

639ms

201 Created

Cookies

Headers

Body

1{

2"id":"1"

3"name":"Marc"

4"email":"marc@scalar.com"

5}

Our users range from startups to Fortune 500s.

[Scalar powers Gitbook's API Testing](https://docs.gitbook.com/)

[api.supabase.com](https://api.supabase.com/api/v1)

[developer.maersk.com](https://developer.maersk.com/api-catalogue)

[tailscale.com/api](https://tailscale.com/api)

[api-docs.facet.org](https://api-docs.facet.org/)

[docs.machines.dev](https://docs.machines.dev/)

[docs.acctual.com](https://docs.acctual.com/)

[cortex.so/api-reference](https://cortex.so/api-reference)

Las Vegas Sphere

### Works with your OpenAPI document.

#### Write and publish APIs, seamlessly manage your OpenAPI documents

[Get started for Free](https://dashboard.scalar.com/register) [Try it out today](https://docs.scalar.com/)

**Fully Brandable**Bring your brand easily to Scalar Docs, we don't want your docs to look like everyone elses

**Git + Markdown Sync**Let your docs live alongside your code, write docs in markdown and link your OpenAPI files

**Custom HTML/CSS/JS**We don't charge an extra $150 so you can add custom code to your site, do it all on our free plan

**OpenAPI Support**Import your OpenAPI file and get beautiful documentation with our API References

**Integrated API Client**Let your users quickly try out your APIs right inside of the docs, reducing onboarding time

**Custom Domains**Publish on your domain for $12/month, or use our free apidocumentation.com subdomain

api.scalar.com

Search

⌘K

Resources

Markdown

Authentication

_Create a User_POST

Get a token POST

Get authenticated user GET

Planets

Get all planets GET

Create a planet POST

Get a planet GET

Update a planet PUT

Delete a planet DEL

Upload image to planet POST

Webhooks

Models

Authentication

Some endpoints are public, but some require authentication. We provide all the required endpoints to create an account and authorize yourself.

ENDPOINTS

_POST_/user/signup

_POST_/auth/token

_GET_/me

Create a User

Time to create a user account, eh?

Bodyapplication/json

nameRequiredstring

emailRequiredstringemail

passwordRequiredstringmin: 8

Responses

201

Created

400

Bad Request

POST/user/signup

1curl\--request POST\\

2\--url https://galaxy.scalar.com/user/signup \\

3\--headerContent-Type: application/json' \\

4\--data'{

5"name": "Marc",

6"email": "marc@scalar.com",

7"password": "i-love-scalar"

8}'

Test Request

201400

1{

2"id":"1"

3"name":"Marc"

4"email":"marc@scalar.com"

5}

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_|,---------------. |\\|| \*#\*\*#\*#\*\*\*\* |= | ||| /\* \*\\ || | ||| |--\[@\]^\[@\]--| || | ||| \\ \_\_\_\_\_ / || | ||| \\ \\\_\_\_/ / \_o| | | \_\_|\`----------------' |/ /~/ ~~~~~~~~~~~~~~~~~~~ / / ~~

**Watch Video**Scalar walkthrough coming soon!

[, ,|\\\\\\\\ ////|| \\\\\\V/// || |===| || |~~~| || | | || | | | \\ | | / \\|===|/ '---' **Try for Free**No signup required!](https://www.scalar.com/swagger-editor)

### Integrations for (almost) everything:

.NET

Nitro

Platformatic

FastAPI

Hono

NestJS

Nuxt

Rust

AdonisJS

Elysia

Express

Fastify

GO

Laravel

Litestar

Next.js

HTML

React

Vue.js

Docusaurus

Install

Copy content

```shell
dotnet add package Scalar.AspNetCore
```

Usage

Copy content

```csharp
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder();

builder.Services.AddOpenApi();

var app = builder.Build();

app.MapOpenApi();

if (app.Environment.IsDevelopment())
{
    app.MapScalarApiReference();
}

app.MapGet("/", () => "Hello world!");

app.Run();
```

### An offline first API Client built for OpenAPI.

#### Minimal, powerful, & [open-source](https://github.com/scalar/scalar) client built by us + our community

[Download for free](https://scalar.com/download)[Try it out today](https://client.scalar.com/)

**API Framework Integration**Link to your server frameworks and keep Scalar's API Client in sync  
(coming soon)

**Offline First**We built this product for ourselves, offline first & always will be. If your team needs collaboration it's opt-in

**Collaboration**Your team needs to collaborate on testing APIs? We got you covered with our sync that's on our paid plan

**All Platforms**Web? MacOS? Linux? Windows? We release on all platforms so you can work seamlessy with your preferred dev setup

**OpenAPI Support**We keep the OpenAPI spec alive, getting all the downstream benefits of building with Scalar from docs to sdks

**No Vendor Lock In**Don't stress your engineering team out, our API Client is built all based on the OpenAPI Specification

Create a User

Get all planets

Delete a planet

Workspace

POST galaxy.scalar.com/user/signup Send

Open in Scalar

Search

⌘K

My First API

Authentication

_Create a User_POST

Get a token POST

Get authenticated user GET

Planets

Get all planets GET

Create a planet POST

Get a planet GET

Update a planet PUT

Delete a planet DEL

Upload image to planet POST

Webhooks

Create a User

Cookies

<table class="mb-0 grid min-h-8 auto-rows-auto"><tbody><tr class="group flex contents w-fit min-w-full"><td class="group/cell relative m-0 flex min-h-8 min-w-8 items-center border-b-1/2 border-l-0 border-r-1/2 border-t-0 p-0 px-2.5 text-sm last:border-r-0 group-last:border-b-transparent"><svg class="h-animation-14 size-3 text-c-3 opacity-50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" /></td><td class="relative m-0 flex min-h-8 w-full min-w-8 items-center border-b-1/2 border-l-0 border-r-1/2 border-t-0 p-0 px-2.5 text-sm last:border-r-0 group-last:border-b-transparent"><span class="text-c-3">Key</span></td><td class="relative m-0 flex min-h-8 w-full min-w-8 items-center border-b-1/2 border-l-0 border-r-1/2 border-t-0 p-0 px-2.5 text-sm last:border-r-0 group-last:border-b-transparent"><span class="text-c-3">Value</span></td></tr></tbody></table>

Headers

<table class="mb-0 grid min-h-8 auto-rows-auto"><tbody><tr class="group flex contents w-fit min-w-full"><td class="group/cell relative m-0 flex min-h-8 min-w-8 items-center border-b-1/2 border-l-0 border-r-1/2 border-t-0 p-0 px-2.5 text-sm last:border-r-0 group-last:border-b-transparent"><svg class="h-animation-14 size-3 text-c-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" /></td><td class="relative m-0 flex min-h-8 w-full min-w-8 items-center border-b-1/2 border-l-0 border-r-1/2 border-t-0 p-0 px-2.5 text-sm last:border-r-0 group-last:border-b-transparent"><span class="text-c-1">Content-Type</span></td><td class="relative m-0 flex min-h-8 w-full min-w-8 items-center border-b-1/2 border-l-0 border-r-1/2 border-t-0 p-0 px-2.5 text-sm last:border-r-0 group-last:border-b-transparent"><span class="text-c-1">application/json</span></td></tr><tr class="group flex contents w-fit min-w-full"><td class="group/cell relative m-0 flex min-h-8 min-w-8 items-center border-b-1/2 border-l-0 border-r-1/2 border-t-0 p-0 px-2.5 text-sm last:border-r-0 group-last:border-b-transparent"><svg class="h-animation-14 size-3 text-c-3 opacity-50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" /></td><td class="relative m-0 flex min-h-8 w-full min-w-8 items-center border-b-1/2 border-l-0 border-r-1/2 border-t-0 p-0 px-2.5 text-sm last:border-r-0 group-last:border-b-transparent"><span class="text-c-3">Key</span></td><td class="relative m-0 flex min-h-8 w-full min-w-8 items-center border-b-1/2 border-l-0 border-r-1/2 border-t-0 p-0 px-2.5 text-sm last:border-r-0 group-last:border-b-transparent"><span class="text-c-3">Value</span></td></tr></tbody></table>

Query Parameters

<table class="mb-0 grid min-h-8 auto-rows-auto"><tbody><tr class="group flex contents w-fit min-w-full"><td class="group/cell relative m-0 flex min-h-8 min-w-8 items-center border-b-1/2 border-l-0 border-r-1/2 border-t-0 p-0 px-2.5 text-sm last:border-r-0 group-last:border-b-transparent"><svg class="h-animation-14 size-3 text-c-3 opacity-50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" /></td><td class="relative m-0 flex min-h-8 w-full min-w-8 items-center border-b-1/2 border-l-0 border-r-1/2 border-t-0 p-0 px-2.5 text-sm last:border-r-0 group-last:border-b-transparent"><span class="text-c-3">Key</span></td><td class="relative m-0 flex min-h-8 w-full min-w-8 items-center border-b-1/2 border-l-0 border-r-1/2 border-t-0 p-0 px-2.5 text-sm last:border-r-0 group-last:border-b-transparent"><span class="text-c-3">Value</span></td></tr></tbody></table>

Body

1{

2"name":"Marc"

3"email":"marc@scalar.com"

4"password":"i-love-scalar"

5}

639ms

201 Created

Cookies

Headers

Body

1{

2"id":"1"

3"name":"Marc"

4"email":"marc@scalar.com"

5}

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_|,---------------. |\\|| \*#\*\*#\*#\*\*\*\* |= | ||| /\* \*\\ || | ||| |--\[@\]^\[@\]--| || | ||| \\ \_\_\_\_\_ / || | ||| \\ \\\_\_\_/ / \_o| | | \_\_|\`----------------' |/ /~/ ~~~~~~~~~~~~~~~~~~~ / / ~~

**Watch Video**Scalar walkthrough coming soon!

[+#INTRODUCING#. +#SCALAR##API#- -CLIENT- -TEST -UR- -FAV# -##- -APIs -##-\-LETS -++-.GO- **Try for Free**No signup required!](https://client.scalar.com/)

### Affordable Pricing that scales with you.

,\\ \\\\\\,\_ \\\` ,\\ \_\_,.-" =\_\_) ." ),\_/ , \\/\\\_\\\_| )\_-\\ \\\_-\` \`-----\` \`--\`

**Free - 1 User**

*   Unlimited Workspaces
*   Free Subdomains
*   API References (OpenAPI)
*   Fully Stylable with Themes
*   Custom CSS/Javascript
*   Built in Scalar API Client

[Try for free](https://dashboard.scalar.com/register)

//\\\\\_//\\\\ \_\_\_\_ \\\_ \_/ / / / \* \* \\ /^^^\] \\\_\\O/\_/ \[ \] / \\\_ \[ / \\ \\\_ / / \[ \[ / \\/ \_/ \_\[ \[ \\ /\_/

**Pro - $12 Seat**

*   Everything in Free
*   Custom Domains
*   Sync with GitHub
*   Guides & Versions
*   Search (by TypeSense)
*   Priority Support

[Subscribe](https://dashboard.scalar.com/register)

.'''''. ' . \_\_' 0 ; / \\ ;| .-| ;\\/~~' ; /;. .;;. . ; /;;;;;;;;;;;;;\\

**Enterprise**

*   Everything in Pro
*   Priority Support
*   SSO/SAML
*   Monthly Audit of Docs
*   Verified Workspaces
*   Dedicated Slack Channel

[Chat with Marc](https://cal.com/scalar/30min)

### Our phone lines are open, 24/7.

[**Sign up for Scalar**https://dashboard.scalar.com/register](https://dashboard.scalar.com/register)[**Set up ![Image 2: cat doing a silly yapping emote](https://cdn.betterttv.net/emote/5fa8f232eca18f6455c2b2e1/1x.webp) Call**https://cal.com/scalar/30min](https://cal.com/scalar/30min)[**Chat on Discord**https://discord.gg/scalar](https://discord.gg/scalar)[**Star us on GitHub**https://github.com/scalar/scalar](https://github.com/scalar/scalar)

*   [API Documentation](https://docs.scalar.com/)
*   [API Client](https://client.scalar.com/)
*   [Swagger Editor](https://docs.scalar.com/swagger-editor)

*   [Support](mailto:support@scalar.com)
*   [Changelog](https://scalar.com/changelog)
*   [Terms & Conditions](https://scalar.com/terms-and-conditions)
*   [Privacy Policy](https://scalar.com/privacy-policy)

*   [X (Formerly Twitter)](https://twitter.com/scalar)
*   [GitHub](https://github.com/scalar/scalar)

Links/Buttons:
- [Register](https://dashboard.scalar.com/register)
- [Login](https://dashboard.scalar.com/login)
- [Documentation](https://guides.scalar.com/)
- [X (formerly Twitter)](https://x.com/scalar)
- [Discord](https://discord.gg/scalar)
- [GitHub](https://github.com/scalar/scalar)
- [Introduction](https://scalar.com/#introduction)
- [Users](https://scalar.com/#users)
- [API Docs](https://scalar.com/#api-docs)
- [Integrations](https://scalar.com/#integrations)
- [API Client](https://client.scalar.com/)
- [Pricing](https://scalar.com/#pricing)
- [Contact Us](mailto:support@scalar.com)
- [Footer](https://scalar.com/#footer)
- [Swagger Editor](https://docs.scalar.com/swagger-editor)
- [Changelog](https://scalar.com/changelog)
- [Answer](https://cal.com/scalar/30min)
- [Scalar powers Gitbook's API Testing](https://docs.gitbook.com/)
- [api.supabase.com](https://api.supabase.com/api/v1)
- [developer.maersk.com](https://developer.maersk.com/api-catalogue)
- [tailscale.com/api](https://tailscale.com/api)
- [api-docs.facet.org](https://api-docs.facet.org/)
- [docs.machines.dev](https://docs.machines.dev/)
- [docs.acctual.com](https://docs.acctual.com/)
- [cortex.so/api-reference](https://cortex.so/api-reference)
- [Try it out today](https://docs.scalar.com/)
- [, ,|\\\\ ////|| \\\V/// || |===| || |~~~| || | | || | | | \ | | / \|===|/ '---'Try for FreeNo signup required!](https://www.scalar.com/swagger-editor)
- [Download for free](https://scalar.com/download)
- [Terms & Conditions](https://scalar.com/terms-and-conditions)
- [Privacy Policy](https://scalar.com/privacy-policy)
- [X (Formerly Twitter)](https://twitter.com/scalar)
