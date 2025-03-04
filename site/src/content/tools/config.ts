import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

export const toolCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/tools" }),
  schema: z.object({
    url: z.string(),
    site_name: z.string().optional(),
    title: z.string().optional(),
    image: z.string().optional(),
    favicon: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional()
  })
});

export const collections = {
  'tools': toolCollection,
};