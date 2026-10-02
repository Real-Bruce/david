# AGENTS.md

本文件说明当前 Astro 博客的实际结构、页面行为和修改约定，供后续维护者与自动化代理使用。调整项目后，如实现与本文不一致，应同步更新本文。

## 项目概况

这是一个以 Markdown 管理内容、通过 Astro 构建为静态站点的中文个人博客。站点部署在 GitHub Pages 的 `/david/` 子路径下；没有多语言路由，也不使用客户端框架。

技术栈：

- Astro 7 与 Astro Content Collections
- 原生 CSS，集中维护于 `src/styles/global.css`
- Pagefind，随 `npm run build` 为静态站点生成搜索索引
- LXGW WenKai（霞鹜文楷），由 `lxgw-wenkai-webfont` 提供
- GitHub Actions 部署到 GitHub Pages

未获明确要求时，不引入 React、Vue、Tailwind 或其他大型前端框架。

## 常用命令

```bash
npm install
npm run dev
npm run build
npm run preview
node --test tests/weekly.test.ts
```

工作流使用 Node.js 22。改动 Astro 源码、样式或内容后，提交前至少运行 `npm run build`；修改周刊导读逻辑时也运行对应测试。构建会生成 `dist/` 和 Pagefind 索引，不要手动编辑或提交生成产物。

## 目录职责

```text
src/content.config.ts       # 内容集合与 front matter schema
src/site.config.ts          # 站点名称、作者、简介与联系方式
src/layouts/BaseLayout.astro # 全局 HTML、SEO、字体、导航与返回顶部按钮
src/components/             # 页面复用组件
src/pages/                  # 页面与动态路由
src/lib/base.ts             # GitHub Pages 子路径链接辅助函数
src/lib/posts.ts            # 已发布内容汇总、类型与链接工具
src/lib/weekly.ts           # 周刊导读与正文推荐解析
src/lib/weekly-archives.ts  # 周刊分类入口标题、顺序与数量
src/styles/global.css       # 设计变量及全站样式
src/content/                # 周刊、博客、随笔及周刊分类 Markdown
public/                     # favicon、robots.txt 等静态资源
tests/                      # Node.js 原生测试
.github/workflows/          # GitHub Pages 构建与部署流程
```

不要直接修改构建输出或依赖目录：`dist/`、`.astro/`、`node_modules/`。

## 路由与页面行为

- `/`：站点介绍、按期数倒序展示的前 5 篇已发布周刊，以及博客、随笔、归档入口；不突出单独一篇。
- `/weekly/`：分类入口在上、全部周刊目录在下，按期数倒序排列。
- `/weekly/[slug]/`：周刊正文；若 front matter 提供结构化 `links`，正文后显示“本期推荐”。
- `/weekly/archives/[category]/`：渲染 `src/content/weekly/archives/` 中对应 Markdown 的完整内容。
- `/blog/`：博客目录，按发布时间倒序，显示标题、摘要与标签。
- `/blog/[slug]/`：博客长文详情，包含目录、阅读进度、阅读时长与标签（目录在有多个二级/三级标题时出现）。
- `/notes/`：随笔目录，按发布时间倒序；可显示心情与地点。
- `/notes/[slug]/`：随笔详情显示地点和标签，不显示心情。
- `/archive/`：汇总周刊、博客和随笔，按年份、月份倒序分组，并集成 Pagefind 搜索。
- `/tags/[tag]/`：展示带对应标签的已发布内容。
- `/about/`：关于页面，使用标题与无序列表组织内容。
- `/rss.xml`：RSS；`/sitemap-index.xml` 由 Astro sitemap 集成生成。

没有独立搜索页，也没有站点页脚。不要改变现有路由结构，除非用户明确要求。

## 主要组件与工具

| 文件 | 职责 |
| --- | --- |
| `BaseLayout.astro` | 全局布局、SEO 元信息、字体预加载、导航与返回顶部按钮 |
| `SiteHeader.astro` | 桌面与移动端主导航、归档和关于入口 |
| `EditorialPostList.astro` | 博客、随笔、归档共用的开放式目录条目 |
| `PostCard.astro` | 标签页条目 |
| `TOC.astro` | 博客文章目录 |
| `ReadingProgress.astro` | 博客与周刊详情页阅读进度 |
| `ArchiveSearch.astro` | 归档页 Pagefind 搜索交互 |
| `BackToTop.astro` | 返回顶部交互 |
| `Icon.astro` | 通用 SVG 图标 |
| `src/lib/posts.ts` | 汇总已发布内容并生成内容路径 |
| `src/lib/weekly.ts` | 生成周刊目录导读、解析推荐链接 |
| `src/lib/weekly-archives.ts` | 生成周刊分类入口数据 |

## 内容约定

内容集合在 `src/content.config.ts` 定义：`weekly`、`blog`、`notes` 和 `weeklyArchives`。新增文章放入对应目录，按 schema 填写 front matter；无需手动维护列表。`draft: true` 的文章不会进入公开页面。

周刊、博客和随笔共用字段：

```yaml
title: 标题
description: 一句话摘要
pubDate: 2026-09-30
tags: []
draft: false
```

集合专属字段：

- 周刊：`issue`；`links`（可选推荐链接数组，含 `title`、合法 `url`，可选 `note`）；`digest`（可选，包含 `title` 和最多两条 `highlights`）。列表使用 `digest.title`；未提供 `digest` 时，`src/lib/weekly.ts` 从正文推荐标题生成导读，若无推荐则回退到 `description`。目前 `highlights` 字段不在页面中展示。
- 博客：可选 `series`。
- 随笔：可选 `mood`、`location`；心情仅出现在随笔列表，地点可出现在列表和详情。
- `weeklyArchives`：`src/content/weekly/archives/*.md` 中的分类整合 Markdown，不使用文章 front matter。

`tags` 默认为空数组，`draft` 默认为 `false`。修改 schema 或新增集合时，检查并同步更新 `src/lib/posts.ts`、相关页面和测试。

增加周刊分类时，同时添加分类 Markdown，并更新 `src/lib/weekly-archives.ts` 中的标题与排序。分类条目数由 Markdown 中的推荐链接自动统计。

## 视觉与样式约定

全站样式与设计变量集中在 `src/styles/global.css`，优先复用现有变量和组件样式，避免新增一次性、分散的 CSS。

- 不使用封面卡片；以文字、摘要、元信息和开放式目录排版为主。
- 周刊、博客、随笔列表保持一致的目录节奏，最新内容自然排在前面；使用各自的内容强调色（周刊暖橙、博客墨绿、随笔灰紫），避免蓝色强调色。
- 首页保持简洁：介绍区、最近周刊目录、少量内容入口，并留出明确的区块间距。
- 顶部导航为半浮动、非吸顶样式，带柔和阴影。
- 页面隐藏滚动条时必须保留正常滚动能力。
- 返回顶部按钮在向下滚动后出现，位于页面右侧约 `75vh`。
- 归档维持「年份 → 月份」分组。

修改导航、列表、文章详情、归档或返回顶部样式时，先检查相应组件与 `global.css`，维持桌面端和移动端布局一致。

## 常见修改位置

- 站点身份、作者和联系方式：`src/site.config.ts`
- 内容 schema：`src/content.config.ts`
- 首页：`src/pages/index.astro`
- 周刊列表与详情：`src/pages/weekly/index.astro`、`src/pages/weekly/[slug].astro`
- 博客、随笔列表与详情：各自 `src/pages/blog/`、`src/pages/notes/`
- 归档分组：`src/pages/archive.astro`
- 归档搜索：`src/components/ArchiveSearch.astro`
- 标签列表：`src/pages/tags/[tag].astro`
- 全局视觉：`src/styles/global.css`
- 周刊摘要解析与测试：`src/lib/weekly.ts`、`tests/weekly.test.ts`
- 周刊分类入口：`src/lib/weekly-archives.ts` 与 `src/content/weekly/archives/`

站内以绝对路径书写的链接统一通过 `src/lib/base.ts` 的 `withBase()` 生成，确保 `/david/` 子路径部署正常。Pagefind 的运行时导入路径应使用 `import.meta.env.BASE_URL`，不要写死站点路径。

## Git 与部署

- 保持修改聚焦；清理无效样式和未使用代码时，先确认没有模板或脚本引用。
- 源码或内容变更后运行 `npm run build`；周刊导读逻辑变更后运行 `node --test tests/weekly.test.ts`。
- 提交信息使用简洁英文祈使句；仅在用户要求或任务明确包含提交时提交。
- 不要提交 `dist/`、`.astro/` 或 `node_modules/`。

GitHub Pages 部署配置位于 `.github/workflows/deploy.yml`，使用 Node.js 22、`npm install` 和 `npm run build`，发布目录为 `dist/`。`astro.config.mjs` 的 `base: '/david'` 必须与部署仓库路径保持一致。

如果更换正式域名，核对并同步更新 `astro.config.mjs`、`public/robots.txt` 和 `src/site.config.ts`。
