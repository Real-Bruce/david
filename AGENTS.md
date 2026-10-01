# AGENTS.md

本文件面向后续维护者、协作者和自动化代理，用于说明当前项目的结构、约定和修改方式。

## 项目定位

这是一个 Astro 静态博客，内容使用 Markdown 管理，构建产物为纯静态 HTML。当前站点默认中文，不做多语言路由。

## 技术栈

- **框架**：Astro 7
- **内容**：Astro Content Collections
- **搜索**：Pagefind
- **字体**：霞鹜文楷 LXGW WenKai（全站统一），来自 `lxgw-wenkai-webfont` npm 包
- **样式**：原生 CSS，集中在 `src/styles/global.css`
- **部署**：Cloudflare Pages / GitHub Actions

不要在未明确要求时引入 React、Vue、Tailwind 或其他大型前端方案。

## 常用命令

```bash
npm install
npm run dev
npm run build
npm run preview
```

修改代码或内容后，应至少执行：

```bash
npm run build
```

确认构建通过后再提交。

## 目录职责

```text
src/content.config.ts   # 内容集合和 schema
src/site.config.ts      # 站点身份、联系方式
src/layouts/            # 全局布局
src/components/         # 可复用组件
src/pages/              # 路由
src/lib/posts.ts        # 内容排序、分组、路径工具
src/styles/global.css   # 全局样式和设计变量
src/content/            # Markdown 内容
```

不要修改：

- `dist/`
- `.astro/`
- `node_modules/`

## 当前页面约定

- `/` 首页只展示最新周刊，并提供博客、随笔、归档入口。
- `/weekly/` 周刊列表，最新看点卡 + 往期期刊墙。
- `/blog/` 博客列表，目录式条目列表。
- `/notes/` 随笔列表，目录式条目列表（含心情与地点）。
- `/archive/` 归档页，按「年份 → 月份」分组，并集成站内搜索。
- `/tags/xxx/` 标签页，目录式条目列表。
- `/about/` 关于页，采用「标题 + 无序列表」结构。
- 站点没有独立搜索页，搜索能力集中在归档页。
- 站点底部没有页脚。

## 主要组件

| 组件 | 作用 |
| --- | --- |
| `BaseLayout.astro` | 全局布局、SEO、字体、返回顶部按钮 |
| `SiteHeader.astro` | 半浮动顶部导航 |
| `PostCard.astro` | 目录式条目行，用于博客、随笔、标签与归档页 |
| `WeeklyCard.astro` | 周刊看点卡（解析正文推荐，无封面图） |
| `IssueWall.astro` | 往期期刊墙（数字方格跳转） |
| `TOC.astro` | 博客长文侧栏目录 |
| `ReadingProgress.astro` | 阅读进度条 |
| `ArchiveSearch.astro` | 归档页搜索 |
| `BackToTop.astro` | 返回顶部按钮 |
| `Icon.astro` | 通用 SVG 图标 |

注意：

- 全站不使用封面图，卡片和条目均为纯排版设计。
- 周刊最新期使用 `WeeklyCard.astro` 看点卡，往期使用 `IssueWall.astro`；博客/随笔/标签/归档使用 `PostCard.astro`，不要另起一套列表结构。

## 内容约定

内容集合在 `src/content.config.ts` 中定义：

- `weekly`
- `blog`
- `notes`

公共字段：

```md
title
description
pubDate
tags
draft
```

周刊额外字段：

```md
issue
links
```

博客额外字段：

```md
series
```

随笔额外字段：

```md
mood
location
```

新增内容时：

1. 放入对应集合目录。
2. 按现有 front matter 结构填写字段。
3. 不需要手动维护索引或列表。
4. `draft: true` 的内容不会发布。

## 样式约定

样式集中在：

```text
src/styles/global.css
```

设计变量位于文件顶部的 `:root` 中，包括：

- 背景
- 文字
- 卡片
- 边框
- 主色
- 三种内容类型色（周刊暖橙 / 博客墨绿 / 随笔灰紫）
- 圆角
- 最大宽度
- 字体

修改视觉时应遵循以下原则：

- 优先使用现有 CSS 变量。
- 保持导航、按钮和排版的统一性。
- 避免新增大量分散的局部样式。
- 避免使用蓝色强调色。
- 周刊卡片保持杂志感网格节奏，博客/随笔保持正式条目列表。
- 顶部保持半浮动、非吸顶、底部带柔和阴影。
- 页面滚动条保持隐藏，但不要破坏滚动能力。
- 返回顶部按钮位于右侧约 `75vh`，向下滚动后显示。
- 归档页保持「年 → 月」分组。

## 常见修改

### 修改站点名称、作者

编辑：

```text
src/site.config.ts
```

### 修改内容结构

编辑：

```text
src/content.config.ts
```

如果新增集合，还需要同步更新：

```text
src/lib/posts.ts
```

### 修改全局视觉

编辑：

```text
src/styles/global.css
```

优先调整 CSS 变量或现有组件样式，不要为一次性需求创建冗余样式。

### 修改顶部导航

编辑：

```text
src/components/SiteHeader.astro
```

当前顶部不显示站点描述，不使用分割线，整体是半浮动效果。

### 修改列表样式

编辑：

```text
src/components/PostCard.astro
src/components/WeeklyCard.astro
src/styles/global.css
```

博客/随笔/标签/归档共享 `PostCard.astro` 条目结构，周刊使用 `WeeklyCard.astro`。

### 修改归档分组

编辑：

```text
src/pages/archive.astro
```

当前按年份和月份倒序分组。

### 修改搜索

编辑：

```text
src/components/ArchiveSearch.astro
```

搜索应保留在归档页，不要恢复独立搜索页。

### 修改返回顶部按钮

编辑：

```text
src/components/BackToTop.astro
src/styles/global.css
```

当前按钮在向下滚动后出现，位置约为页面右侧 `75vh`。

## Git 约定

- 修改后先运行 `npm run build`。
- 构建通过后再提交。
- 提交信息使用简洁英文祈使句。
- 不要提交 `dist/`、`.astro/` 或 `node_modules/`。
- 保持每次提交聚焦一个主题。

## 部署约定

部署配置位于：

```text
.github/workflows/deploy.yml
```

构建命令：

```bash
npm run build
```

输出目录：

```text
dist
```

正式上线前必须替换以下文件中的占位域名：

```text
astro.config.mjs
public/robots.txt
src/site.config.ts
```

## 维护提醒

- 当前域名仍是 `https://example.com`。
- 周刊已包含 `issue-070` 到 `issue-104`，以及两篇示例内容。
- `links`（本期推荐）目前只有示例内容使用，真实期数未填写。
- 站点默认中文，不做 i18n。
- 不要新增页脚。
- 不要把搜索拆回独立页面。
- 不要改变现有路由结构，除非用户明确要求。