# David's Blog

一个用 Markdown 写作、用 Astro 构建、托管在静态平台上的个人博客。

当前站点以中文内容为主，包含三类内容：

- **周刊**：每周整理有趣网站、工具、文章和灵感。
- **博客**：完整长文，适合沉淀方案、复盘和思考。
- **随笔**：碎片化记录，不追求完整结构。

## 快速开始

```bash
npm install
npm run dev
```

本地开发地址：

```text
http://localhost:4321
```

构建和预览：

```bash
npm run build
npm run preview
```

构建完成后，`dist/` 是完整静态站点，并包含 Pagefind 搜索索引。

## 主要命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动本地开发服务器 |
| `npm run build` | 构建静态站点并生成搜索索引 |
| `npm run preview` | 预览构建结果 |
| `npm run astro` | 直接调用 Astro CLI |

## 项目结构

```text
src/
  content.config.ts       # 内容集合与 front matter 校验
  site.config.ts          # 站点身份、作者、导航、社交链接
  layouts/                # 全局布局
  components/             # 页面组件
  pages/                  # Astro 路由
  lib/                    # 内容读取与工具函数
  styles/                 # 全局样式与设计变量
  content/
    weekly/               # 周刊 Markdown
    blog/                 # 博客 Markdown
    notes/                # 随笔 Markdown

public/
  images/                 # 封面图、占位图等静态资源
  robots.txt
  favicon.svg

.github/workflows/
  deploy.yml              # Cloudflare Pages 部署流程
```

## 页面结构

- `/` 首页，展示最新内容，约四行卡片
- `/weekly/` 周刊列表
- `/blog/` 博客列表
- `/notes/` 随笔列表
- `/archive/` 时间归档与站内搜索
- `/tags/xxx/` 标签页
- `/about/` 关于页
- `/rss.xml` RSS
- `/sitemap-index.xml` 站点地图

## 内容模型

内容在 `src/content.config.ts` 中定义，分为三个集合。

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

### 周刊额外字段

```md
issue: 104
cover: /images/weekly/issue-104.svg
```

`links` 字段可选，用于结构化推荐链接：

```md
links:
  - title: Example
    url: https://example.com
    note: 一句话说明
```

### 博客额外字段

```md
cover: /images/blog/example.svg
series: 可选系列名
```

### 随笔额外字段

```md
cover: /images/notes/example.svg
mood: 平静
location: 可选地点
```

`draft: true` 的内容不会发布。

## 写作建议

- 新文章直接放入对应集合目录。
- 文件名建议使用小写英文、数字和连字符。
- 封面图放在 `public/images/<集合名>/`。
- 首页、归档页、标签页都会自动读取内容，不需要手动登记。
- 当前周刊已导入 `issue-070` 到 `issue-104`，另有两篇示例 `issue-001` 和 `issue-002`。
- 周刊封面当前多为生成占位图，可按需替换为真实图片。

## 设计现状

- 顶部为半浮动导航栏，带底部柔和阴影。
- 页面不显示滚动条，但保留滚动能力。
- 首页、周刊、博客、随笔、归档、标签页统一使用卡片流布局。
- 归档页按「年份 → 月份」分组。
- 站内搜索集成在归档页中。
- 返回顶部按钮位于页面右侧约 `75vh` 处，向下滚动后出现。
- 站点底部不展示页脚。
- About 页使用「标题 + 无序列表」结构。

## 站点配置

站点名称、简介、作者、导航和联系方式统一在：

```text
src/site.config.ts
```

当前域名仍是占位地址。正式上线前需要同步修改：

```text
astro.config.mjs
public/robots.txt
src/site.config.ts
```

## 部署

推荐使用 Cloudflare Pages：

1. 将仓库推送到 GitHub。
2. 在 Cloudflare Pages 中创建项目并关联该仓库。
3. 构建命令设置为 `npm run build`。
4. 输出目录设置为 `dist`。
5. 绑定独立域名。
6. 替换项目中的占位域名。

仓库也包含 GitHub Actions 部署流程：

```text
.github/workflows/deploy.yml
```

如使用该流程，需要在 GitHub Secrets 中配置：

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

如果后续国内访问速度不理想，可将同一份 `dist` 迁移到腾讯云 EdgeOne Pages 或其他国内静态托管服务，内容结构无需重写。
