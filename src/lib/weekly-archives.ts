/// <reference types="vite/client" />

export interface WeeklyArchiveSummary {
  id: string;
  title: string;
  total: number;
}

const archiveFiles = import.meta.glob('../content/weekly/archives/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>;

const categoryTitles: Record<string, string> = {
  article: '文章',
  blogs: '博客',
  software: '软件',
  website: '网站'
};

const categoryOrder = ['article', 'blogs', 'software', 'website'];

export function getWeeklyArchiveSummaries(): WeeklyArchiveSummary[] {
  const summaries = Object.entries(archiveFiles).map(([filePath, content]) => {
    const id = filePath.split('/').pop()?.replace(/\.md$/, '') ?? '';
    const total = [...content.matchAll(/^#### \[(.+?)\]\((.+?)\)$/gm)].length;

    return {
      id,
      title: categoryTitles[id] ?? id,
      total
    };
  });

  return summaries.sort((a, b) => categoryOrder.indexOf(a.id) - categoryOrder.indexOf(b.id));
}
