Aceternity UI
===============

 [Introducing Aceternity UI Pro - Premium component packs and templates to build awesome websites.](https://pro.aceternity.com/)

[![Image 1: Logo](https://ui.aceternity.com/_next/image?url=%2Flogo.png&w=128&q=75)![Image 2: Logo](https://ui.aceternity.com/_next/image?url=%2Flogo-dark.png&w=128&q=75) Aceternity UI =============](https://ui.aceternity.com/)

[![Image 3: Logo](https://ui.aceternity.com/_next/image?url=%2Flogo.png&w=128&q=75)](https://ui.aceternity.com/)

[Components](https://ui.aceternity.com/components)[Templatesnew](https://pro.aceternity.com/templates)[Pricing](https://ui.aceternity.com/pricing)[Showcase](https://ui.aceternity.com/showcase)

[Discord](https://discord.gg/ftZbQvCdN7)[Twitter](https://twitter.com/mannupaaji)Toggle themeSearch Components⌘K

[![Image 4: Logo](https://ui.aceternity.com/_next/image?url=%2Flogo.png&w=128&q=75)](https://ui.aceternity.com/)

Introducing Proactiv Template

Make your websites look  
10x

better


=======================================

Copy paste the most trending components and use them in your websites without having to worry about styling and animations.
---------------------------------------------------------------------------------------------------------------------------

[Browse Components](https://ui.aceternity.com/components)[Custom Components](https://ui.aceternity.com/pricing)

Next.js

React

TailwindCSS

Framer Motion

![Image 5: Manu Arora](https://ui.aceternity.com/_next/image?url=https%3A%2F%2Fassets.aceternity.com%2Fmanu.png&w=256&q=75)

![Image 6: Robert Johnson](https://ui.aceternity.com/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1535713875002-d1d0cf377fde%3Fixlib%3Drb-4.0.3%26ixid%3DM3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww%26auto%3Dformat%26fit%3Dcrop%26w%3D800%26q%3D60&w=256&q=75)

![Image 7: Jane Smith](https://ui.aceternity.com/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1580489944761-15a19d654956%3Fixlib%3Drb-4.0.3%26ixid%3DM3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww%26auto%3Dformat%26fit%3Dcrop%26w%3D800%26q%3D60&w=256&q=75)

![Image 8: Emily Davis](https://ui.aceternity.com/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1438761681033-6461ffad8d80%3Fixlib%3Drb-4.0.3%26ixid%3DM3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%253D%253D%26auto%3Dformat%26fit%3Dcrop%26w%3D800%26q%3D60&w=256&q=75)

![Image 9: Tyler Durden](https://ui.aceternity.com/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1472099645785-5658abf4ff4e%3Fixlib%3Drb-4.0.3%26ixid%3DM3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%253D%253D%26auto%3Dformat%26fit%3Dcrop%26w%3D3540%26q%3D80&w=256&q=75)

![Image 10: Dora](https://ui.aceternity.com/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1544725176-7c40e5a71c5e%3Fixlib%3Drb-4.0.3%26ixid%3DM3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%253D%253D%26auto%3Dformat%26fit%3Dcrop%26w%3D3534%26q%3D80&w=256&q=75)

Beautify your website within minutes
------------------------------------

With Aceternity UI, you can build great looking websites within minutes.

Copy paste this

Hover over me to reveal

![Image 11: thumbnail](https://ui.aceternity.com/_next/image?url=%2Fdemo%2Fthumbnail.png&w=3840&q=75)

Copy paste components like these in minutes.
--------------------------------------------

28th March, 2023

Read More

![Image 12: glare card demo image](https://ui.aceternity.com/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1512618831669-521d4b375f5d%3Fq%3D80%26w%3D3388%26auto%3Dformat%26fit%3Dcrop%26ixlib%3Drb-4.0.3%26ixid%3DM3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%253D%253D&w=2048&q=75)Hover over me

As simple as copy and paste
---------------------------

Copy paste the code into your ui folder and use the components in your projects. It's that simple, really.

esc

F1

F2

F3

F4

F5

F6

F7

F8

F8

F10

F11

F12

~\`

!1

@2

#3

$4

%5

^6

&7

\*8

(9

)0

—\_

+ =

delete

tab

Q

W

E

R

T

Y

U

I

O

P

{\[

}\]

|\\

caps lock

A

S

D

F

G

H

J

K

L

:;

"'

return

shift

Z

X

C

V

B

N

M

<,

\>.

?/

shift

fn

control

option

command

command

option

```javascript
"use client";
  import { useEffect, useState } from "react";
  import { motion } from "motion/react";
  
  let interval: any;
  
  type Card = {
    id: number;
    name: string;
    designation: string;
    content: React.ReactNode;
  };
  
  export const CardStack = ({
    items,
    offset,
    scaleFactor,
  }: {
    items: Card[];
    offset?: number;
    scaleFactor?: number;
  }) => {
    const CARD_OFFSET = offset || 10;
    const SCALE_FACTOR = scaleFactor || 0.06;
    const [cards, setCards] = useState<Card[]>(items);
  
    useEffect(() => {
      startFlipping();
  
      return () => clearInterval(interval);
    }, []);
    const startFlipping = () => {
      interval = setInterval(() => {
        setCards((prevCards: Card[]) => {
          const newArray = [...prevCards]; // create a copy of the array
          newArray.unshift(newArray.pop()!); // move the last element to the front
          return newArray;
        });
      }, 5000);
    };
  
    return (
      <div className="relative  h-60 w-60 md:h-60 md:w-96">
        {cards.map((card, index) => {
          return (
            <motion.div
              key={card.id}
              className="absolute dark:bg-black bg-white h-60 w-60 md:h-60 md:w-96 rounded-3xl p-4 shadow-xl border border-neutral-200 dark:border-white/[0.1]  shadow-black/[0.1] dark:shadow-white/[0.05] flex flex-col justify-between"
              style={{
                transformOrigin: "top center",
              }}
              animate={{
                top: index * -CARD_OFFSET,
                scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
                zIndex: cards.length - index, //  decrease z-index for the cards that are behind
              }}
            >
              <div className="font-normal text-neutral-700 dark:text-neutral-200">
                {card.content}
              </div>
              <div>
                <p className="text-neutral-500 font-medium dark:text-white">
                  {card.name}
                </p>
                <p className="text-neutral-400 font-normal dark:text-neutral-200">
                  {card.designation}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };
  
```

The first rule ofFight Club is that you do not talk about fight club. The second rule ofFight club is that you DO NOT TALK about fight club.

Tyler Durden

Manager Project Mayhem

These cards are amazing, I want to use them in my project. Framer motion is a godsend ngl tbh fam 🙏

Manu Arora

Senior Software Engineer

I dont like this Twitter thing, deleting it right away because yolo. Instead, I would like to call it X.com so that it can easily be confused with adult sites.

Elon Musk

Senior Shitposter

Loved by thousands of people
----------------------------

Here's what some of our users have to say about Aceternity UI.

Featured by popular YouTubers
-----------------------------

[![Image 13: Fireship](https://ui.aceternity.com/_next/image?url=https%3A%2F%2Fassets.aceternity.com%2Ffireship.jpg&w=1080&q=75)](https://www.youtube.com/watch?v=RPa3_AD1_Vs)[![Image 14: Josh Tried Coding](https://ui.aceternity.com/_next/image?url=https%3A%2F%2Fassets.aceternity.com%2Fjosh.jpg&w=1080&q=75)](https://www.youtube.com/watch?v=e_QcQ6A8fNw&)[![Image 15: Chai Aur Code](https://ui.aceternity.com/_next/image?url=https%3A%2F%2Fassets.aceternity.com%2Fchai-aur-code.jpg&w=1080&q=75)](https://www.youtube.com/watch?v=cVKB5NQPiFA)[![Image 16: Adrian Twarog](https://ui.aceternity.com/_next/image?url=https%3A%2F%2Fassets.aceternity.com%2Fxyz.jpg&w=1080&q=75)](https://www.youtube.com/watch?v=IYLV26d0dOc&t)[![Image 17: Javascript Mastery](https://ui.aceternity.com/_next/image?url=https%3A%2F%2Fassets.aceternity.com%2Fjs-mastery.jpg&w=1080&q=75)](https://www.youtube.com/watch?v=FTH6Dn3AyIQ&t=1s)[![Image 18: Raj Talks Tech](https://ui.aceternity.com/_next/image?url=https%3A%2F%2Fassets.aceternity.com%2Fraj.jpg&w=1080&q=75)](https://www.youtube.com/watch?v=1fj6XqyKxkE&t)

[![Image 19: Logo](https://ui.aceternity.com/_next/image?url=%2Flogo.png&w=128&q=75)![Image 20: Logo](https://ui.aceternity.com/_next/image?url=%2Flogo-dark.png&w=128&q=75) Aceternity UI =============](https://ui.aceternity.com/)

A product by [Aceternity](https://aceternity.com/)

Building in public at [@mannupaaji](https://twitter.com/mannupaaji)

[Pricing](https://ui.aceternity.com/pricing)[Components](https://ui.aceternity.com/components)[Templates](https://ui.aceternity.com/templates)[Categories](https://ui.aceternity.com/categories)[Blog](https://ui.aceternity.com/blog)[Box Shadows](https://ui.aceternity.com/tools/box-shadows)[Showcase](https://ui.aceternity.com/showcase)

[Twitter](https://twitter.com/aceternitylabs)[Discord](https://discord.gg/ftZbQvCdN7)

[Aceternity UI Pro](https://pro.aceternity.com/)[Aceternity](https://aceternity.com/)

Links/Buttons:
- [Introducing Aceternity UI Pro - Premium component packs and templates to build awesome websites.](https://pro.aceternity.com/)
- [Aceternity UI](https://ui.aceternity.com/)
- [Components](https://ui.aceternity.com/components)
- [Templatesnew](https://pro.aceternity.com/templates)
- [Pricing](https://ui.aceternity.com/pricing)
- [Showcase](https://ui.aceternity.com/showcase)
- [Discord](https://discord.gg/ftZbQvCdN7)
- [Twitter](https://twitter.com/aceternitylabs)
- [](https://www.youtube.com/watch?v=1fj6XqyKxkE&t)
- [Aceternity](https://aceternity.com/)
- [Templates](https://ui.aceternity.com/templates)
- [Categories](https://ui.aceternity.com/categories)
- [Blog](https://ui.aceternity.com/blog)
- [Box Shadows](https://ui.aceternity.com/tools/box-shadows)
