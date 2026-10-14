/// <reference types="vite/client" />

import {
  getArchiveYear,
  countArchiveEntries,
  getCategoryTitle,
  compareCategories,
  type WeeklyArchiveCategory,
  type WeeklyArchiveYear
} from './weekly-archive-data';

export type { WeeklyArchiveCategory, WeeklyArchiveYear };

const archiveFiles = import.meta.glob('../content/weekly/archives/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>;

export { getArchiveYear, countArchiveEntries };

/**
 * 汇总周刊分类归档：根目录文件为当前年，年份文件夹为历年。
 * years 按年份倒序，total 为跨年总和。
 */
export function getWeeklyArchiveCategories(): WeeklyArchiveCategory[] {
  const byCategory = new Map<string, WeeklyArchiveYear[]>();

  for (const [filePath, content] of Object.entries(archiveFiles)) {
    // glob key 形如 '../content/weekly/archives/2025/website.md'，
    // 先归一成与内容集合一致的 entryId（'2025/website' | 'website'），
    // 保证与 pages/weekly/[category]/[year].astro 的 getStaticPaths 判定同源。
    const entryId = filePath.replace(/^.*\/archives\//, '').replace(/\.md$/, '');
    const id = entryId.split('/').pop() ?? '';
    const year = getArchiveYear(entryId, content);
    if (!id || year === null) continue;

    const years = byCategory.get(id) ?? [];
    years.push({ year, total: countArchiveEntries(content) });
    byCategory.set(id, years);
  }

  const categories: WeeklyArchiveCategory[] = [...byCategory.entries()].map(([id, years]) => ({
    id,
    title: getCategoryTitle(id),
    years: years.sort((a, b) => b.year - a.year),
    total: years.reduce((sum, item) => sum + item.total, 0)
  }));

  return categories.sort((a, b) => compareCategories(a.id, b.id));
}
