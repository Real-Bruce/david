import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { renderLlmsTxt, type LlmsLink, type LlmsSection } from '../lib/llms';
import { getWeeklyArchiveCategories } from '../lib/weekly-archives';
import { siteConfig } from '../site.config';
import { withBase } from '../lib/base';

/**
 * /llms.txt —— 面向 AI 的站点概要与内容索引（llmstxt.org 提案）。
 *
 * 条目全部由内容集合实时生成，不要手写清单：新增周刊、博客或随笔后，
 * 下次构建这个文件会自动带上，与 sitemap、RSS 同源。
 * 渲染逻辑放在 src/lib/llms.ts，便于 Node 原生测试直接校验。
 */

const dateText = (date: Date) => date.toISOString().slice(0, 10);

const newestFirst = <T extends { data: { pubDate: Date } }>(posts: T[]): T[] =>
  [...posts].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

export async function GET(context: APIContext): Promise<Response> {
  // context.site 只是 astro.config 里的 site，不含 base；withBase('/') 才拼得出 /david/
  const origin = new URL(withBase('/'), context.site ?? siteConfig.url);
  // llms.txt 会被 AI 直接读取，链接一律给绝对地址
  const abs = (path: string) => new URL(withBase(path), origin).href;

  const link = (title: string, path: string, description?: string): LlmsLink => ({
    title,
    href: abs(path),
    description
  });
  const datedLink = (
    title: string,
    path: string,
    pubDate: Date,
    description: string
  ): LlmsLink => link(title, path, `${dateText(pubDate)} · ${description}`);

  const [weekly, blog, notes] = await Promise.all([
    getCollection('weekly', ({ data }) => !data.draft),
    getCollection('blog', ({ data }) => !data.draft),
    getCollection('notes', ({ data }) => !data.draft)
  ]);

  const sinceYear = weekly.reduce(
    (min, post) => Math.min(min, post.data.pubDate.getFullYear()),
    new Date().getFullYear()
  );

  const about = [
    `由 ${siteConfig.author.name} 维护的中文个人博客，自 ${sinceYear} 年起持续更新。内容分三类：周刊每周整理值得一读的文章、开源项目、网站与工具，并按「文章 / 博客 / 软件 / 网站」四个分类做年度整合；博客是长文，沉淀技术方案与复盘；随笔是碎片化记录。`,
    '站点用 Markdown 管理内容，经 Astro 构建为纯静态页面并托管在 GitHub Pages，不使用 React、Vue 或 Tailwind。页面以文字排版为主，没有封面图、弹窗和客户端框架噪音；每篇内容都有语义化 URL、发布日期与标签，RSS 与站点地图随构建同步更新。',
    `源码与联系方式：GitHub ${siteConfig.social.github}，邮箱 ${siteConfig.author.email}。`
  ].join('\n\n');

  const sections: LlmsSection[] = [
    {
      title: '站点入口',
      links: [
        link('周刊目录', '/weekly/', `全部周刊，按期数倒序，共 ${weekly.length} 期`),
        link('博客', '/blog/', `长文，共 ${blog.length} 篇`),
        link('随笔', '/notes/', `碎片化记录，共 ${notes.length} 篇`),
        link('时间归档与站内搜索', '/archive/', '按年份、月份分组，并提供全文搜索'),
        link('关于', '/about/', '站点说明、内容结构与联系方式'),
        link('RSS 订阅源', '/rss.xml', '全部已发布内容'),
        link('站点地图', '/sitemap-index.xml', '全部页面 URL')
      ]
    },
    {
      title: '周刊分类整合',
      links: getWeeklyArchiveCategories().flatMap(category =>
        category.years.map(item =>
          link(
            `${item.year} 年${category.title}推荐`,
            `/weekly/${category.id}/${item.year}/`,
            `${item.year} 年周刊中整理的${category.title}类推荐，共 ${item.total} 条`
          )
        )
      )
    },
    {
      title: '周刊',
      links: [...weekly]
        .sort((a, b) => b.data.issue - a.data.issue)
        .map(post =>
          datedLink(
            `第 ${post.data.issue} 期 · ${post.data.title}`,
            `/weekly/${post.id}/`,
            post.data.pubDate,
            post.data.description
          )
        )
    },
    {
      title: '博客',
      links: newestFirst(blog).map(post =>
        datedLink(post.data.title, `/blog/${post.id}/`, post.data.pubDate, post.data.description)
      )
    },
    {
      title: '随笔',
      links: newestFirst(notes).map(post =>
        datedLink(post.data.title, `/notes/${post.id}/`, post.data.pubDate, post.data.description)
      )
    }
  ];

  return new Response(
    renderLlmsTxt({ name: siteConfig.title, summary: siteConfig.description, about }, sections),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
}
