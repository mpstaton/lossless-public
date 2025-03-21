Skip, the reactive framework
===============

DocsBlogAboutGet started[](https://discord.gg/4dMEBA46mE)[](https://www.linkedin.com/company/skiplabs/)[](https://github.com/SkipLabs/skip)

[New blog posts: where Skip came from and why it matters.](https://skiplabs.io/blog)

[Docs](https://skiplabs.io/docs)[Blog](https://skiplabs.io/blog)[About](https://skiplabs.io/about)

[](https://github.com/SkipLabs/skip)[](https://www.linkedin.com/company/skiplabs/)[](https://discord.gg/4dMEBA46mE)

Get started

Code declaratively,  
compute continuously
------------------------------------------

Skip lets you build streaming services where you don’t worry about managing side effects

excessiv|

Learn More

From the creators of the Hack and Skip programming languages at Meta

![Image 1](https://skiplabs.io/images/boost-arrow-smooth.svg)

![Image 2](https://skiplabs.io/images/above-fold.svg)

TypeScriptPythonJava

npm i @skiplabs/skip

![Image 3](https://skiplabs.io/images/below-fold.svg)

Introduction

How Skip works
--------------

Clients

\[frontend or backend\]

* * *

![Image 4](https://skiplabs.io/graphics/what-is-skip-clients.svg)

![Image 5](https://skiplabs.io/graphics/what-is-skip-clients-shadow.png)

Application logic

\[Node.js or Bun\]

* * *

![Image 6](https://skiplabs.io/graphics/application-logic-box.svg)

![Image 7](https://skiplabs.io/graphics/application-logic-box-shadow.png)

Skip runtime

* * *

![Image 8](https://skiplabs.io/graphics/skip-runtime.svg)

![Image 9](https://skiplabs.io/graphics/skip-runtime-shadow.png)

![Image 10](https://skiplabs.io/images/heap.png)

External resource manager

Ext.ernal services

* * *

![Image 11](https://skiplabs.io/graphics/backend-box.svg)

![Image 12](https://skiplabs.io/graphics/backend-box-shadow.png)

![Image 13](https://skiplabs.io/graphics/backend-box-icons.svg)

![Image 14](https://skiplabs.io/graphics/backend-box-icons-shadow.png)

Skip is an open source framework first developed at Meta to build & run services where state updates incrementally.

Explore

*   ![Image 15](https://skiplabs.io/graphics/pixel-anchor.svg)
    
    Resource manager
    
    Data sources are streamed or polled selectively based on client needs.
    
*   ![Image 16](https://skiplabs.io/graphics/pixel-anchor.svg)
    
    The Skip runtime
    
    Manages your objects in a transactional heap guaranteeing immutability and correctness so services can recompute only what has changed.
    
*   ![Image 17](https://skiplabs.io/graphics/pixel-anchor.svg)
    
    The Skip API
    
    Provides a simple declaritive “init time” programming model ensuring programs are effect-free and replayable.
    
*   ![Image 18](https://skiplabs.io/graphics/pixel-anchor.svg)
    
    Clients
    
    Views are continually kept up to date with the latest data and state changes.
    

Explore

Exit

![Image 19](https://skiplabs.io/images/ceremony-01-grid-full.svg)

![Image 20](https://skiplabs.io/images/ceremony-01-grid-waterfall-shadow.png)

Real-time

BFF

CQRS

Where to use Skip

Real-time features
------------------

Real-time features
------------------

Skip lets you build real-time features without the complexity of programming streams or the cost of excessive recomputing.

It has a declarative point-in-time programming model that removes the challenges of programming streams.

Its incremental runtime only triggers recomputation for the data that has changed.

![Image 21](https://skiplabs.io/graphics/pixel-anchor.svg)

Reactivity powers real time

Client app

* * *

![Image 22](https://skiplabs.io/graphics/clients.svg)

![Image 23](https://skiplabs.io/graphics/clients-shadow.png)

![Image 24](https://skiplabs.io/graphics/arrows-two-way.svg)

Backend service

* * *

![Image 25](https://skiplabs.io/graphics/clients.svg)

![Image 26](https://skiplabs.io/graphics/api.svg)

![Image 27](https://skiplabs.io/graphics/api-shadow.png)

![Image 28](https://skiplabs.io/graphics/arrows-two-way.svg)

![Image 29](https://skiplabs.io/graphics/dbms.svg)

![Image 30](https://skiplabs.io/graphics/dbms-shadow.png)

Features
--------

Open source

100% MIT licensed

Real-time

Generate simple, reliable real-time API's for web & mobile clients

Simple

No async complexity

Familiar

JSON & TypeScript

Flexible

Work with batch data, streaming data or mix of the two

Resilient

Transparent state management and failure handling

Lightweight

Runs locally with no server to manage

Reusable

Reuse the services you build with mirroring

How to use Skip

Developer experience
--------------------

*   Import services, streams, and databases as collections
    
    ![Image 31](https://skiplabs.io/temp/connect-card.png)
    
*   Write simple TypeScript map functions against collections
    
    ![Image 32](https://skiplabs.io/temp/transform-card.png)
    
*   Compose more complex logic with reuse
    
    ![Image 33](https://skiplabs.io/temp/compose-card.png)
    
*   Clients subscribe to real-time updates over http
    
    ![Image 34](https://skiplabs.io/temp/subscribe-card.png)
    

How to use Skip

Developer experience
--------------------

Import services, streams, and databases as collections

Connect

Transform

Compose

Subscribe

Skip

![Image 35](https://skiplabs.io/temp/connect-card.png)

![Image 36](https://skiplabs.io/temp/connect-card-activated.png)

![Image 37](https://skiplabs.io/images/grid-testimonial-top.svg)

Stories from our community

*   ![Image 38](https://skiplabs.io/images/quotes.svg)
    
    React has dramatically simplified the way we write front-end code by coming up with a different way to deal with state updates. Skip is finally doing the same for the backend!
    
    ![Image 39](https://skiplabs.io/_next/image?url=https%3A%2F%2Fcdn.candycode.com%2Ftemp%2Fchedeau.jpg&w=1024&q=75)
    
    Christopher Chedeau (Vjeux)
    
    Principal Software Engineer at Meta
    
    co-creator of React Native and Prettier
    
    Principal Software Engineer at Meta
    
    co-creator of React Native and Prettier
    
*   ![Image 40](https://skiplabs.io/images/quotes.svg)
    
    Skip is like streaming without the streams!
    
    ![Image 41](https://skiplabs.io/_next/image?url=https%3A%2F%2Fcdn.candycode.com%2Ftemp%2Fjoulin.jpg&w=1024&q=75)
    
    Armand Joulin
    
    Research Director at Google
    
    lead of Gemma AI models
    
    Research Director at Google
    
    lead of Gemma AI models
    
*   ![Image 42](https://skiplabs.io/images/quotes.svg)
    
    Reactive programming done right!
    
    ![Image 43](https://skiplabs.io/_next/image?url=https%3A%2F%2Fcdn.candycode.com%2Ftemp%2Fvitek.jpg&w=1024&q=75)
    
    Jan Vitek
    
    Dir. of Language Theory, Epic Games
    
    Prof. of Computer Science, Khoury
    
    Director of Language Theory, Epic Games
    
    Professor of Computer Science, Khoury
    

![Image 44](https://skiplabs.io/images/arrow-left.svg)

![Image 45](https://skiplabs.io/images/arrow-right.svg)

![Image 46](https://skiplabs.io/images/grid-testimonial-bottom.svg)

Skip roadmap, What’s next

What’s

next

Star our GitHub repository and follow along for the latest updates

[Explore the Code](https://github.com/SkipLabs/skip)

![Image 47](https://skiplabs.io/images/boost-arrow-right.svg)

![Image 48](https://skiplabs.io/graphics/pixels-tab-ornament.svg)[Support for writing skip runtime services in skiplang](https://github.com/SkipLabs/skip/issues/495)

![Image 49](https://skiplabs.io/graphics/pixels-tab-ornament.svg)[Persistence of skip heap](https://github.com/SkipLabs/skip/issues/492)

![Image 50](https://skiplabs.io/graphics/pixels-tab-ornament.svg)[Python Skip runtime support](https://github.com/SkipLabs/skip/issues/491)

![Image 51](https://skiplabs.io/graphics/pixels-tab-ornament.svg)[Java Skip runtime support](https://github.com/SkipLabs/skip/issues/490)

![Image 52](https://skiplabs.io/graphics/pixels-tab-ornament.svg)[Confidential client and user impersonation for auth to other backend services](https://github.com/SkipLabs/skip/issues/489)

![Image 53](https://skiplabs.io/graphics/pixels-tab-ornament.svg)[Skip heap / provenance debugger](https://github.com/SkipLabs/skip/issues/487)

![Image 54](https://skiplabs.io/graphics/pixels-tab-ornament.svg)[SQL integration for skip runtime data](https://github.com/SkipLabs/skip/issues/486)

![Image 55](https://skiplabs.io/graphics/pixels-tab-ornament.svg)[Support for writing skip runtime services in skiplang](https://github.com/SkipLabs/skip/issues/495)

![Image 56](https://skiplabs.io/graphics/pixels-tab-ornament.svg)[Persistence of skip heap](https://github.com/SkipLabs/skip/issues/492)

![Image 57](https://skiplabs.io/graphics/pixels-tab-ornament.svg)[Python Skip runtime support](https://github.com/SkipLabs/skip/issues/491)

![Image 58](https://skiplabs.io/graphics/pixels-tab-ornament.svg)[Java Skip runtime support](https://github.com/SkipLabs/skip/issues/490)

![Image 59](https://skiplabs.io/graphics/pixels-tab-ornament.svg)[Confidential client and user impersonation for auth to other backend services](https://github.com/SkipLabs/skip/issues/489)

![Image 60](https://skiplabs.io/graphics/pixels-tab-ornament.svg)[Skip heap / provenance debugger](https://github.com/SkipLabs/skip/issues/487)

![Image 61](https://skiplabs.io/graphics/pixels-tab-ornament.svg)[SQL integration for skip runtime data](https://github.com/SkipLabs/skip/issues/486)

Get Started
-----------

TypeScriptPythonJava

npm i @skiplabs/skip

Sign up to get updates on the Skip Framework, Skiplabs, new examples, and tips on reactivity

Submit

![Image 62](https://skiplabs.io/images/floppy-disk-texture.png)![Image 63](https://skiplabs.io/images/floppy-disk.svg)![Image 64](https://skiplabs.io/images/floppy-disk-shadow.svg)

Copyright © 2025 Skiplabs Inc.  
All rights reserved.

[Read the Docs](https://skiplabs.io/docs)[Join the Community](https://discord.gg/4dMEBA46mE)

Ask an Engineer

[website by![Image 65: candycode alternative React design development agency San Diego branding websites](https://storage.googleapis.com/candycode/candycode.svg)](https://candycode.com/)

[website by![Image 66: candycode alternative React design development agency San Diego branding websites](https://storage.googleapis.com/candycode/candycode.svg)](https://candycode.com/)

Links/Buttons:
- [](https://github.com/SkipLabs/skip)
- [New blog posts: where Skip came from and why it matters.](https://skiplabs.io/blog)
- [Docs](https://skiplabs.io/docs)
- [About](https://skiplabs.io/about)
- [Support for writing skip runtime services in skiplang](https://github.com/SkipLabs/skip/issues/495)
- [Persistence of skip heap](https://github.com/SkipLabs/skip/issues/492)
- [Python Skip runtime support](https://github.com/SkipLabs/skip/issues/491)
- [Java Skip runtime support](https://github.com/SkipLabs/skip/issues/490)
- [Confidential client and user impersonation for auth to other backend services](https://github.com/SkipLabs/skip/issues/489)
- [Skip heap / provenance debugger](https://github.com/SkipLabs/skip/issues/487)
- [SQL integration for skip runtime data](https://github.com/SkipLabs/skip/issues/486)
- [website by](https://candycode.com/)
