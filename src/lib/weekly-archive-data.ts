export interface WeeklyArchiveYear {
  year: number;
  total: number;
}

export interface WeeklyArchiveCategory {
  id: string;
  title: string;
  years: WeeklyArchiveYear[];
  total: number;
}

const yearFromFolder = /^(\d{4})\//;
const yearFromContent = /^## Vol\.\d+ \/ (\d{4})\./m;
const entryPattern = /^#### \[(.+?)\]\((.+?)\)$/gm;

/**
 * 解析归档文件年份：
 * - 位于年份文件夹（如 2025/website.md）时直接取文件夹名；
 * - 位于根目录（当前年）时从首个期数标题「## Vol.xx / YYYY.MM.DD」提取。
 */
export function getArchiveYear(entryId: string, content: string): number | null {
  const folder = entryId.match(yearFromFolder);
  if (folder) return Number(folder[1]);
  const inline = content.match(yearFromContent);
  return inline ? Number(inline[1]) : null;
}

/** 统计归档 Markdown 中的推荐条目数（#### [标题](链接) 行）。 */
export function countArchiveEntries(content: string): number {
  return [...content.matchAll(entryPattern)].length;
}

const categoryTitles: Record<string, string> = {
  article: '文章',
  blogs: '博客',
  software: '软件',
  website: '网站'
};

const categoryOrder = ['article', 'blogs', 'software', 'website'];

export function getCategoryTitle(id: string): string {
  return categoryTitles[id] ?? id;
}

export function compareCategories(a: string, b: string): number {
  return categoryOrder.indexOf(a) - categoryOrder.indexOf(b);
}
