import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const sharedFields = {
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false)
};

const weekly = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/weekly' }),
  schema: z.object({
    ...sharedFields,
    issue: z.number(),
    links: z.array(z.object({
      title: z.string(),
      url: z.string().url(),
      note: z.string().optional()
    })).default([])
  })
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    ...sharedFields,
    cover: z.string().optional(),
    series: z.string().optional()
  })
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    ...sharedFields,
    mood: z.string().optional(),
    location: z.string().optional()
  })
});

export const collections = { weekly, blog, notes };
