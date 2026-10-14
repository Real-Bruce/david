# David's Blog

一个用 Markdown 写作、用 Astro 构建、托管在 GitHub Pages 上的中文个人博客。

站点地址：<https://real-bruce.github.io/david/>

当前站点以中文内容为主，包含三类内容：

- **周刊**：每周整理有趣网站、工具、文章和灵感，已发布 issue-001 至 issue-104。
- **博客**：完整长文，适合沉淀方案、复盘和思考。
- **随笔**：碎片化记录，不追求完整结构。

## 快速开始

```bash
npm install
npm run dev
```

本地开发地址（`astro.config.mjs` 里设了 `base: '/david'`，根路径是 404，必须带子路径）：

```text
http://localhost:4321/david/
```

构建和预览：

```bash
npm run build
npm run preview
```

构建完成后，`dist/` 是完整静态站点，并包含 Pagefind 搜索索引。工作流使用 Node.js 22。

## 主要命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动本地开发服务器 |
| `npm run build` | 构建静态站点并生成搜索索引 |
| `npm run preview` | 预览构建结果 |
| `npm run check` | 类型检查（`astro check`，需 TypeScript 6.x） |
| `npm run test` | 运行周刊导读与归档解析测试 |
| `npm run astro` | 直接调用 Astro CLI |

## 技术栈

- Astro 7 与 Astro Content Collections
- 原生 CSS，集中维护于 `src/styles/global.css`
- Pagefind，随 `npm run build` 生成静态搜索索引
- LXGW WenKai（霞鹜文楷），由 `lxgw-wenkai-webfont` 提供
- GitHub Actions 部署到 GitHub Pages

不使用 React、Vue、Tailwind 或其他大型前端框架。

## 项目结构

```text
src/
  content.config.ts       # 内容集合与 front matter 校验
  site.config.ts          # 站点名称、作者、简介与联系方式
  layouts/                # 全局布局
  components/             # 页面复用组件
  pages/                  # Astro 路由
  lib/                    # 内容读取与工具函数
    base.ts               # GitHub Pages 子路径链接辅助
    posts.ts              # 已发布内容汇总
    weekly.ts             # 周刊导读与推荐链接解析
    weekly-archives.ts    # 周刊分类入口数据
    weekly-archive-data.ts # 归档年份提取与条目统计纯函数
    rehype-pangu.mjs      # 中西文自动空格 rehype 插件
  styles/                 # 全局样式与设计变量
  content/
    weekly/               # 周刊 Markdown
      archives/           # 周刊分类整合 Markdown
    blog/                 # 博客 Markdown
    notes/                # 随笔 Markdown

template/                 # 周刊、博客、随笔写作模板（不参与渲染）
tests/                    # Node.js 原生测试
public/                   # favicon、robots.txt 等静态资源
.github/workflows/        # GitHub Pages 构建与部署流程
.gitattributes            # 全仓库 LF 换行策略
.editorconfig             # 编辑器缩进与 LF 约定
```

不要手动编辑或提交构建产物：`dist/`、`.astro/`、`node_modules/`。

## 页面结构

- `/` 首页：站点介绍、按期数倒序的最近 5 篇周刊，以及博客、随笔、归档入口
- `/weekly/` 周刊列表：分类入口在上、全部周刊目录在下，按期数倒序
- `/weekly/[slug]/` 周刊正文：头部为标题、描述、期数（Vol.xxx）、发布日期与标签；含结构化推荐链接时正文后显示「本期推荐」
- `/weekly/[category]/[year]/` 指定年份的周刊分类整合页，页头带年份胶囊导航（倒序、当前年高亮）
- `/weekly/archives/[category]/` 旧版分类归档入口，自动重定向到最新显式年份页
- `/blog/` 博客列表：按发布时间倒序，显示标题、摘要与标签
- `/blog/[slug]/` 博客长文详情：包含目录、阅读进度、阅读时长与标签
- `/notes/` 随笔列表：按发布时间倒序，可显示心情与地点
- `/notes/[slug]/` 随笔详情：显示地点和标签
- `/archive/` 时间归档：按年份、月份倒序分组，集成 Pagefind 站内搜索
- `/tags/[tag]/` 标签页
- `/about/` 关于页
- `/rss.xml` RSS
- `/sitemap-index.xml` 站点地图

## 内容模型

内容在 `src/content.config.ts` 中定义，分为四个集合：`weekly`、`blog`、`notes` 和 `weeklyArchives`。新增文章放入对应目录，按 schema 填写 front matter，无需手动维护列表；`draft: true` 的内容不会进入公开页面。

### 公共字段

```md
---
title: 文章标题
description: 一句话摘要
pubDate: 2026-09-30
tags:
  - 标签
draft: false
---
```

`tags` 默认为空数组，`draft` 默认为 `false`。

### 周刊额外字段

```md
issue: 104
```

`digest` 字段可选，用于周刊列表导读，包含 `title` 和最多两条 `highlights`：

```md
digest:
  title: 本期导读标题
  highlights:
    - 一条亮点
```

未提供 `digest` 时，会从正文推荐标题生成导读；若无推荐则回退到 `description`。

`links` 字段可选，用于结构化推荐链接，正文后渲染为「本期推荐」：

```md
links:
  - title: Example
    url: https://example.com
    note: 一句话说明
```

### 博客额外字段

```md
series: 可选系列名
```

### 随笔额外字段

```md
mood: 平静
location: 可选地点
```

心情仅出现在随笔列表；地点可出现在列表和详情。

### 周刊分类归档

`src/content/weekly/archives/**/*.md` 是分类整合 Markdown（文章、博客、软件、网站四个分类），不使用文章 front matter：

- 根目录 `*.md` 为**当前年**内容，年份从首个 `## Vol.xx / YYYY.MM.DD` 标题提取；
- 年份文件夹（`2025/`、`2024/`）为历年归档，文件夹名即年份。

新增分类时需同步更新 `src/lib/weekly-archive-data.ts` 中的标题与排序，条目数由 Markdown 中的推荐链接自动统计。每年 1 月首发周刊时，把根目录 4 个分类文件移入 `archives/{上一年}/` 并新建空根目录文件——无年份路径始终渲染最新一年，历史年份 URL 不失效。

## 写作建议

- 新文章直接放入对应集合目录，文件名使用小写英文、数字和连字符。
- 新建文章时可复制 `template/` 中对应模板到集合目录再填写 front matter。
- 首页、归档页、标签页都会自动读取内容，不需要手动登记。
- 修改 schema 或新增集合时，同步检查 `src/lib/posts.ts`、相关页面和测试。

## 设计现状

- 全站样式与设计变量集中在 `src/styles/global.css`。
- 不使用封面卡片，以文字、摘要、元信息和开放式目录排版为主。
- 周刊、博客、随笔使用各自的内容强调色（周刊暖橙、博客墨绿、随笔灰紫），避免蓝色强调色。
- 顶部为半浮动导航栏，带底部柔和阴影。
- 页面不显示滚动条，但保留滚动能力。
- 归档页按「年份 → 月份」分组，站内搜索集成在归档页中。
- 返回顶部按钮位于页面右侧约 `75vh` 处，向下滚动后出现。
- 站点底部不展示页脚。
- About 页使用「标题 + 无序列表」结构。

## 站点配置

站点名称、简介、作者、联系方式统一在 `src/site.config.ts`。站内以绝对路径书写的链接统一通过 `src/lib/base.ts` 的 `withBase()` 生成，确保 `/david/` 子路径部署正常。

如更换正式域名，需同步修改：

```text
astro.config.mjs
public/robots.txt
src/site.config.ts
```

## 部署

部署使用 GitHub Actions 推送到 GitHub Pages：

1. 仓库推送到 GitHub 的 `main` 分支后自动触发构建部署。
2. 构建流程位于 `.github/workflows/deploy.yml`，使用 Node.js 22，依次执行 `npm install`、`npm run check`、`npm run test`、`npm run build`，发布目录为 `dist/`；任一步失败都会中断部署。
3. `astro.config.mjs` 中的 `base: '/david'` 必须与部署仓库路径保持一致。

修改源码或内容后，提交前依次运行 `npm run check`、`npm run test` 和 `npm run build` 验证。不要提交 `dist/`、`.astro/` 或 `node_modules/`。

仓库内所有文本文件统一使用 **LF** 换行，由 `.gitattributes` 与 `.editorconfig` 共同约束，不要提交 CRLF。
