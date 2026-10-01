import type { CollectionEntry } from 'astro:content';

export interface WeeklyStat {
  name: string;
  count: number;
}

export interface WeeklyInsights {
  stats: WeeklyStat[];
  links: string[];
  total: number;
}

/** 列表页优先使用人工导读；历史期数仍可直接从正文生成入口。 */
export function getWeeklyDigest(post: CollectionEntry<'weekly'>) {
  if (post.data.digest) return post.data.digest;

  const { links } = getWeeklyInsights(post);
  return {
    title: links.slice(0, 2).join(' · ') || post.data.description,
    highlights: [] as string[]
  };
}

/**
 * 从周刊正文中提取看点：
 * - `## 板块名` 下的 `#### [标题](链接)` 计为该板块的推荐
 * - 推荐标题按出现顺序收集，用于卡片展示
 */
export function getWeeklyInsights(post: CollectionEntry<'weekly'>): WeeklyInsights {
  const body = post.body ?? '';
  const stats: WeeklyStat[] = [];
  const links: string[] = [];

  const sections = body.split(/^## /m).slice(1);

  for (const section of sections) {
    const newlineIndex = section.indexOf('\n');
    const name = (newlineIndex === -1 ? section : section.slice(0, newlineIndex)).trim();
    const rest = newlineIndex === -1 ? '' : section.slice(newlineIndex);
    const sectionLinks = [...rest.matchAll(/^#### \[(.+?)\]/gm)].map(match => match[1].trim());

    if (name && sectionLinks.length > 0) {
      stats.push({ name, count: sectionLinks.length });
      links.push(...sectionLinks);
    }
  }

  if (links.length === 0) {
    const allLinks = [...body.matchAll(/^#### \[(.+?)\]/gm)].map(match => match[1].trim());
    links.push(...allLinks);
  }

  return { stats, links, total: links.length };
}
