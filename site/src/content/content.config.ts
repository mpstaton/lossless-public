import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cardCollection = defineCollection({
  type: 'data',
  schema: z.object({
    cards: z.array(z.object({
      id: z.string(),
      title: z.string(),
      content: z.string(),
      imageUrl: z.string().optional(),
      order: z.number().optional(),
      tags: z.array(z.string()).optional()
    }))
  })
});

/* Based on the knowledge sources provided, 
I can answer your question about loading two directory "bases" into one collection 
in Astro's Content Collections API.

Unfortunately, the base option in the glob() loader does not accept an array of paths. 
The base option is designed to accept a single string or URL path. 

However, you can achieve what you're looking for by using an array of patterns in the pattern option instead. Here's how you can modify your code to load from two different directories:

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const toolCollection = defineCollection({
  loader: glob({ 
    pattern: ["./src/content/tooling/*.md", "./src/content/ai-toolkit/*.md"],
    base: "." 
  }),
  schema: z.object({
    url: z.string(),
    site_name: z.string().optional(),
    title: z.string().optional(),
    zinger: z.string().optional(),
    image: z.string().optional(),
    favicon: z.string().optional(),
    description: z.string().optional(),
    description_site_cp: z.string().optional(),
    tags: z.array(z.string()).optional(),
    og_screenshot_url: z.string().optional(),
    og_last_fetch: z.string().optional(),
  })
}); */

export const toolCollection = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/tooling" }),
  schema: z.object({
    url: z.string(),
    site_name: z.string().optional(),
    title: z.string().optional(),
    zinger: z.string().optional(),
    image: z.string().optional(),
    favicon: z.string().optional(),
    description: z.string().optional(),
    description_site_cp: z.string().optional(),
    tags: z.array(z.string()).optional(),
    og_screenshot_url: z.string().optional(),
    og_last_fetch: z.string().optional(),
  })
});

export const collections = {
  'cards': cardCollection,
  'tools': toolCollection,
}; 