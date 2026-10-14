import { defineCollection } from 'astro:content';
// astro:content 再导出的 z 在 Astro 7 已标记弃用，改用官方的 astro/zod
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * 每个集合的 loader 都显式指定 base，且都指向 src/content 下的具体子目录。
 *
 * 这正是 src/content/template/（写作模板）与 src/content/weekly/collect.md（素材储备）
 * 不被解析的原因：Astro 7 的内容集合完全由这里的 loader 决定，不存在
 * 「src/content 下自动成为集合」的规则，没有 base 覆盖到的目录既不会产生条目，
 * 也不会生成路由。
 *
 * 新增集合时不要把 base 放宽到 './src/content'，否则带示例 front matter 的写作模板
 * 会被当成正式文章解析（例如 issue: 0 的周刊模板会凭空多出一期）。
 * tests/content-templates.test.ts 会守住这条约定。
 */

const sharedFields = {
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false)
};

const weekly = defineCollection({
  loader: glob({ pattern: ['*.md', '!collect.md'], base: './src/content/weekly' }),
  schema: z.object({
    ...sharedFields,
    issue: z.number(),
    digest: z.object({
      title: z.string().trim().min(1),
      highlights: z.array(z.string().trim().min(1)).max(2).default([])
    }).optional(),
    links: z.array(z.object({
      title: z.string(),
      url: z.url(),
      note: z.string().optional()
    })).default([])
  })
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    ...sharedFields,
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

const weeklyArchives = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/weekly/archives' })
});

export const collections = { weekly, weeklyArchives, blog, notes };
