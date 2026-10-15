/**
 * llms.txt（https://llmstxt.org 提案）的渲染纯函数。
 *
 * 与 weekly-archive-data.ts 一样不依赖 astro / vite 运行时，因此可以被 Node 原生测试直接引用；
 * 真实数据由 src/pages/llms.txt.ts 在构建时组装后传进来。
 */

export interface LlmsLink {
  /** 链接文字：AI 靠它判断这一条讲什么，不要写成「点击这里」 */
  title: string;
  /** 必须是绝对地址：AI 拿到文件后不会再去解析相对路径 */
  href: string;
  description?: string;
}

export interface LlmsSection {
  title: string;
  links: LlmsLink[];
}

export interface LlmsSite {
  name: string;
  /** 一句话摘要，渲染成一级标题下方的引用块 */
  summary: string;
  /** About 段落，可以多段，段落之间用空行分隔 */
  about: string;
}

/** 标题、摘要与描述都必须压成单行：换行会破坏 llms.txt 的 Markdown 结构 */
function inline(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

/** 正文段落保留换行，只统一换行符并压缩连续空行 */
function block(value: string): string {
  return value.replace(/\r\n?/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

/** 方括号会截断 Markdown 链接文字，需要转义 */
function linkTitle(value: string): string {
  return inline(value).replace(/[[\]]/g, '\\$&');
}

/** 渲染成一行链接条目：短横线 + [标题](绝对地址) + 可选的冒号与描述 */
export function renderLlmsLink(link: LlmsLink): string {
  const description = inline(link.description ?? '');
  const head = `- [${linkTitle(link.title)}](${link.href.trim()})`;
  return description ? `${head}: ${description}` : head;
}

/** 空分区返回空串，由 renderLlmsTxt 统一丢弃 */
export function renderLlmsSection(section: LlmsSection): string {
  const lines = section.links.map(renderLlmsLink);
  if (lines.length === 0) return '';
  return [`## ${inline(section.title)}`, ...lines].join('\n');
}

/**
 * 渲染完整 llms.txt：一级标题（站点名）→ 引用块（一句话摘要）→ About 段落 → 各二级分区。
 * 只有标题没有条目的分区会被丢掉，避免给 AI 添噪音。
 */
export function renderLlmsTxt(site: LlmsSite, sections: LlmsSection[]): string {
  const head = [`# ${inline(site.name)}`, `> ${inline(site.summary)}`];
  const about = block(site.about);
  if (about) head.push(about);

  const body = sections.map(renderLlmsSection).filter(section => section !== '');
  return [...head, ...body].join('\n\n') + '\n';
}
