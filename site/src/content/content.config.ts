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