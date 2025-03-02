import { defineCollection, z } from 'astro:content';

export const cardCollection = defineCollection({
  type: 'data',
  schema: z.object({
    cards: z.array(z.object({
      title: z.string(),
      content: z.string(),
      order: z.number().optional(),
      tags: z.array(z.string()).optional()
    }))
  })
});

export const collections = {
  'cards': cardCollection,
};
