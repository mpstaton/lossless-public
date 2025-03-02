import { defineCollection, z } from 'astro:content';

const cardCollection = defineCollection({
  type: 'data',
  schema: z.object({
    cards: z.array(z.object({
      id: z.string(),
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