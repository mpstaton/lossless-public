Nuxt: The Intuitive Vue Framework · Nuxt
===============
 

[Learn Nuxt with a Collection of 100+ Tips!Learn more](https://michaelnthiessen.com/nuxt-tips-collection?aff=J0Emk)

[v3.16](https://nuxt.com/)

*   [Docs](https://nuxt.com/docs)
    
*   [Integrations](https://nuxt.com/modules)
    
*   [Resources](https://nuxt.com/templates)
    
*   Products
    
*   [Enterprise](https://nuxt.com/enterprise)
    
*   [Blog](https://nuxt.com/blog)

[56.4K](https://go.nuxt.com/github)

[Nuxt v3.16 is out](https://nuxt.com/blog/v3-16)

The Intuitive  
Vue Framework
=============================

Nuxt is an [open source framework](https://go.nuxt.com/github) that makes web development intuitive and powerful.  
Create performant and production-grade full-stack web apps and websites with confidence.

[Get Started](https://nuxt.com/docs/getting-started/installation) Nuxt in 100 Seconds

Trusted by the best front-end teams
-----------------------------------

The power of  
Vue Components
-----------------------------

We love Vue Single-File Components as much as you do. Simple, intuitive and powerful, Nuxt lets you write Vue components in a way that makes sense. Every repetitive task is automated, so you can focus on writing your full-stack Vue application with confidence.

[Learn about Views](https://nuxt.com/docs/getting-started/views)[Hello World Example](https://nuxt.com/docs/examples/hello-world)

app.vue

```
<script setup>
useSeoMeta({
  title: 'Meet Nuxt',
  description: 'The Intuitive Vue Framework.'
})
</script>
<template>
  <div id="app">
    <AppHeader />
    <NuxtPage />
    <AppFooter />
  </div>
</template>
<style>
#app {
  background-color: #020420;
  color: #00DC82;
}
</style>
```

Static or Dynamic,  
the choice is yours
----------------------------------------

Decide what rendering strategy you need at the route level. By leveraging the hybrid rendering, you can get the best of both worlds: the performance of a static site and the interactivity of a dynamic one.

[Learn about Hybrid Rendering](https://nuxt.com/docs/guide/concepts/rendering#hybrid-rendering)[Nuxt on the Edge](https://nuxt.com/blog/nuxt-on-the-edge)

pages/index.vuenuxt.config.ts

```
<script setup>
// Pre-render the homepage at build time
defineRouteRules({
  prerender: true
})
</script>
<template>
  <div>
    <h1>Homepage</h1>
    <p>Pre-rendered at build time</p>
  </div>
</template>
```

Compose with  
everything you need.
-----------------------------------

[](https://nuxt.com/docs/getting-started/routing)

Routing & Layouts

File based routing system to build complex views and interfaces with a powerful and conventional approach.

[](https://nuxt.com/docs/getting-started/data-fetching)

Data Fetching

Composables that run on the server to fetch data for your components and enable you to render content in different ways.

[](https://nuxt.com/docs/getting-started/styling)

Assets & Style

Image, Font and Script optimizations with a built-in support for CSS Modules, Sass, PostCSS, CSS-in-JS and more.

[](https://nuxt.com/docs/getting-started/seo-meta)

SEO & Meta Tags

Production ready and indexable by search engines while giving the feeling of an app to the end-users.

[](https://nuxt.com/docs/getting-started/routing#route-middleware)

Middleware

Run custom code such as authentication, localization or A/B testing before rendering a page or a group of pages.

[](https://nuxt.com/docs/getting-started/state-management)

State Management

Nuxt provides a simple way to share a reactive and SSR-friendly state between components.

[](https://nuxt.com/docs/getting-started/transitions)

Transitions

Create smooth transitions between layouts, pages and components with a built-in support for Vue & browser transitions.

[](https://nuxt.com/docs/getting-started/error-handling)

Error Handling

Built-in error handling and logging to help you debug your application and provide a better user experience.

[](https://nuxt.com/docs/getting-started/layers)

Layers

Extend your Nuxt application with another Nuxt application to reuse components, composables, layouts, pages and more.

[](https://nuxt.com/docs/getting-started/server)

Server Routes

Create API endpoints and server routes to securely connect with third party services and consume from your frontend.

[](https://nuxt.com/docs/guide/concepts/auto-imports)

Auto Imports

Nuxt auto-imports helpers, composables, and Vue APIs to use across your app without explicitly importing them.

[](https://nuxt.com/docs/guide/concepts/typescript)

TypeScript

Nuxt provides helpful shortcuts to ensure you have access to accurate type information when you are coding.

Ship faster with  
endless integrations
---------------------------------------

Integrate with your favorite tools and services. Nuxt is built to be flexible and can be extended with a robust modules ecosystem. Connect your application with popular headless CMS, eCommerce, Database or UI/UX libraries with a single line of code.

[Explore Nuxt Modules](https://nuxt.com/modules)[Learn about Modules](https://nuxt.com/docs/guide/concepts/modules)

[![Image 1: Netlify](https://nuxt.com/assets/integrations/netlify.svg)](https://nuxt.com/deploy/netlify)[![Image 2: NuxtHub](https://nuxt.com/assets/integrations/nuxthub.svg)](https://nuxt.com/deploy/nuxthub)[![Image 3: Vercel](https://nuxt.com/assets/integrations/vercel.svg)](https://nuxt.com/deploy/vercel)[![Image 4: Heroku](https://nuxt.com/assets/integrations/heroku.svg)](https://nuxt.com/deploy/heroku)[![Image 5: Cloudflare](https://nuxt.com/assets/integrations/cloudflare.svg)](https://nuxt.com/deploy/cloudflare)[![Image 6: Amplify](https://nuxt.com/assets/integrations/aws-amplify.svg)](https://nuxt.com/deploy/aws-amplify)[![Image 7: DigitalOcean](https://nuxt.com/assets/integrations/digitalocean.svg)](https://nuxt.com/deploy/digitalocean)[![Image 8: Tailwind CSS](https://nuxt.com/assets/integrations/tailwind.svg)](https://nuxt.com/modules/tailwindcss)[![Image 9: Supabase](https://nuxt.com/assets/integrations/supabase.svg)](https://nuxt.com/modules/supabase)[![Image 10: Stripe](https://nuxt.com/assets/integrations/stripe.svg)](https://stripe.com/)[![Image 11: Firebase](https://nuxt.com/assets/integrations/firebase.svg)](https://nuxt.com/modules/vuefire)[![Image 12: Strapi](https://nuxt.com/assets/integrations/strapi.svg)](https://nuxt.com/modules/strapi)[![Image 13: WordPress](https://nuxt.com/assets/integrations/wordpress.svg)](https://wordpress.org/)[![Image 14: Directus](https://nuxt.com/assets/integrations/directus.svg)](https://nuxt.com/modules/directus)[![Image 15: Storyblok](https://nuxt.com/assets/integrations/storyblok.svg)](https://nuxt.com/modules/storyblok)[![Image 16: Sanity](https://nuxt.com/assets/integrations/sanity.svg)](https://nuxt.com/modules/sanity)[![Image 17: Sentry](https://nuxt.com/assets/integrations/sentry.svg)](https://nuxt.com/modules/sentry)[![Image 18: Shopify](https://nuxt.com/assets/integrations/shopify.svg)](https://www.shopify.com/)[![Image 19: Meilisearch](https://nuxt.com/assets/integrations/meilisearch.svg)](https://nuxt.com/modules/meilisearch)[![Image 20: Algolia](https://nuxt.com/assets/integrations/algolia.svg)](https://nuxt.com/modules/algolia)

Built by developers  
around the world.
---------------------------------------

The development of Nuxt and its ecosystem is led by an international team. From contributors to developer advocates, the community is made up of members with different horizons and skills. We are happy to see new members every day and encourage anyone to join us and help in many ways: answering questions, giving a talk, creating modules and contributing to the core.

[Nuxters](https://nuxters.nuxt.com/)[](https://go.nuxt.com/discord)[](https://go.nuxt.com/github)[](https://go.nuxt.com/x)[](https://go.nuxt.com/bluesky)

Trusted by the  
World Wide Web.
--------------------------------

Nuxt offers a compelling solution and a great ecosystem to help you ship fullstack Vue apps that are performant and SEO friendly. The flexibility to choose between SSR and SSG is icing on the cake.

![Image 21: Evan You](https://ipx.nuxt.com/f_auto,s_40x40/gh_avatar/yyx990803)

[](https://twitter.com/youyuxi)Evan You

Creator of Vue.js and Vite

Nuxt is a fantastic choice for teams building a production-grade product on the web. It aims to bake in performance best-practices while maintaining excellent Vue.js DX.

![Image 22: Addy Osmani](https://ipx.nuxt.com/f_auto,s_40x40/gh_avatar/addyosmani)

[](https://twitter.com/addyosmani)Addy Osmani

Chief Engineer of Chrome

Nuxt has been an incredible source of innovation and inspiration for developers and framework authors alike. It's been amazing to see its growth in web projects of all sizes on the web.

![Image 23: Guillermo Rauch](https://ipx.nuxt.com/f_auto,s_40x40/gh_avatar/rauchg)

[](https://twitter.com/rauchg)Guillermo Rauch

Co-founder and CEO of Vercel

Nuxt has outstanding developer productivity, experience, and performance right out of the gate! There’s so much attention to detail, ensuring teams have everything at their fingertips to productively build all manners of applications.

![Image 24: Sarah Drasner](https://ipx.nuxt.com/f_auto,s_40x40/gh_avatar/sdras)

[](https://twitter.com/sarah_edo)Sarah Drasner

Director of Engineering, Google

Nuxt has a unique approach of combining a great developer experience with reusable, fully integrated features that speed up the development and performance of your next website or application.

![Image 25: Dominik Angerer](https://ipx.nuxt.com/f_auto,s_40x40/gh_avatar/DominikAngerer)

[](https://twitter.com/domangerer)Dominik Angerer

Co-founder of Storyblok

The moment I used Nuxt for the first time I felt in love with it. Apart from its scalability, performance and developer experience, the team behind of it is also fantastic. Thanks for developing such a great framework and making our lives much easier!

![Image 26: Savas Vedova](https://ipx.nuxt.com/f_auto,s_40x40/gh_avatar/svedova)

[](https://twitter.com/savasvedova)Savas Vedova

Senior Frontend Engineer at GitLab

Nuxt’s blend of high performance and focused developer experience is a game changer. Its SSR and SSG flexibility, coupled with a community that’s as vibrant as the Vue.js ecosystem, makes it a great choice for modern web projects.

![Image 27: Rijk van Zanten](https://ipx.nuxt.com/f_auto,s_40x40/gh_avatar/rijkvanzanten)

[](https://github.com/rijkvanzanten)Rijk van Zanten

CTO at Directus

### Community

*   [Nuxters](https://nuxters.nuxt.com/)
*   [Team](https://nuxt.com/team)
*   [Design Kit](https://nuxt.com/design-kit)

### Products

*   [Nuxt UI Pro](https://ui.nuxt.com/pro?utm_source=nuxt-website&utm_medium=footer)
*   [Nuxt Studio](https://content.nuxt.com/studio/?utm_source=nuxt-website&utm_medium=footer)
*   [NuxtHub](https://hub.nuxt.com/?utm_source=nuxt-website&utm_medium=footer)

### Enterprise

*   [Support](https://nuxt.com/enterprise/support)
*   [Agencies](https://nuxt.com/enterprise/agencies)
*   [Sponsors](https://nuxt.com/enterprise/sponsors)

Subscribe to our newsletter

Stay updated on new releases and features, guides, and community updates.

Subscribe

[](https://go.nuxt.com/x)[](https://go.nuxt.com/bluesky)[](https://go.nuxt.com/linkedin)[](https://go.nuxt.com/discord)[](https://go.nuxt.com/github)

Copyright © 2016-2025 Nuxt - [MIT License](https://go.nuxt.com/license)

Links/Buttons:
- [Learn Nuxt with a Collection of 100+ Tips!Learn more](https://michaelnthiessen.com/nuxt-tips-collection?aff=J0Emk)
- [v3.16](https://nuxt.com/)
- [Docs](https://nuxt.com/docs)
- [Integrations](https://nuxt.com/modules)
- [Resources](https://nuxt.com/templates)
- [Enterprise](https://nuxt.com/enterprise)
- [Blog](https://nuxt.com/blog)
- [56.4K](https://go.nuxt.com/github)
- [Nuxt v3.16 is out](https://nuxt.com/blog/v3-16)
- [Get Started](https://nuxt.com/docs/getting-started/installation)
- [Learn about Views](https://nuxt.com/docs/getting-started/views)
- [Hello World Example](https://nuxt.com/docs/examples/hello-world)
- [Learn about Hybrid Rendering](https://nuxt.com/docs/guide/concepts/rendering#hybrid-rendering)
- [Nuxt on the Edge](https://nuxt.com/blog/nuxt-on-the-edge)
- [](https://go.nuxt.com/linkedin)
- [Learn about Modules](https://nuxt.com/docs/guide/concepts/modules)
- [Nuxters](https://nuxters.nuxt.com/)
- [Team](https://nuxt.com/team)
- [Design Kit](https://nuxt.com/design-kit)
- [Nuxt UI Pro](https://ui.nuxt.com/pro?utm_source=nuxt-website&utm_medium=footer)
- [Nuxt Studio](https://content.nuxt.com/studio/?utm_source=nuxt-website&utm_medium=footer)
- [NuxtHub](https://hub.nuxt.com/?utm_source=nuxt-website&utm_medium=footer)
- [Support](https://nuxt.com/enterprise/support)
- [Agencies](https://nuxt.com/enterprise/agencies)
- [Sponsors](https://nuxt.com/enterprise/sponsors)
- [MIT License](https://go.nuxt.com/license)
