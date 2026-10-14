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

// 只要「直接父目录」是 4 位年份即命中，因此同时接受内容集合 id（'2025/website'）
// 与 import.meta.glob 的完整 key（'../content/weekly/archives/2025/website.md'）。
// 旧写法 /^(\d{4})\// 被 ^ 锚死，传入 glob key 时永远不匹配，
// 「年份文件夹优先」会静默失效并回落到正文标题取年 —— 年度滚动跨年时就会算错年份。
const yearFromFolder = /(\d{4})\/[^/]+$/;
const yearFromContent = /^## Vol\.\d+ \/ (\d{4})\./m;
const entryPattern = /^#### \[(.+?)\]\((.+?)\)$/gm;

/**
 * 解析归档文件年份：
 * - 位于年份文件夹（如 2025/website.md）时直接取文件夹名；
 * - 位于根目录（当前年）时从首个期数标题「## Vol.xx / YYYY.MM.DD」提取。
 *
 * entryId 传内容集合 id 或 import.meta.glob 的文件路径均可。
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

/**
 * 已登记分类按 categoryOrder 排序；未登记的新分类排到最后并按名称稳定排序。
 * 直接相减 indexOf 会让未登记分类得到 -1，从而静默插到「文章」前面。
 */
export function compareCategories(a: string, b: string): number {
  const ia = categoryOrder.indexOf(a);
  const ib = categoryOrder.indexOf(b);
  if (ia === -1 || ib === -1) {
    if (ia === ib) return a.localeCompare(b);
    return ia === -1 ? 1 : -1;
  }
  return ia - ib;
}
