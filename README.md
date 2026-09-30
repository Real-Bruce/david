# Personal Blog

一个用 Markdown 写作、用 Astro 构建的个人博客示例。

## 内容结构

```text
src/content/
  weekly/  # 周刊
  blog/    # 完整博客
  notes/   # 随笔
```

## 页面结构

- `/` 首页
- `/weekly/` 周刊列表
- `/blog/` 博客列表
- `/notes/` 随笔列表
- `/archive/` 时间归档
- `/tags/xxx/` 标签页
- `/search/` 全站搜索
- `/about/` 关于页
- `/rss.xml` RSS

## 本地启动

```bash
npm install
npm run dev
```

构建：

```bash
npm run build
npm run preview
```

构建完成后，`dist/` 是完整静态站点，搜索索引也会生成。

## 部署建议

推荐使用 Cloudflare Pages：

1. 将仓库推送到 GitHub。
2. 在 Cloudflare Pages 中创建项目，选择该 GitHub 仓库。
3. 构建命令填 `npm run build`，输出目录填 `dist`。
4. 绑定独立域名。
5. 将 `astro.config.mjs` 里的 `site` 改成实际域名。

也可以使用仓库中的 GitHub Actions 工作流，需要在 GitHub 仓库 Secrets 中配置：

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

如果后续国内访问速度不理想，同一份 `dist` 可以迁移到腾讯云 EdgeOne Pages 或其他国内静态托管服务，无需重写内容。

## 写作约定

文章 front matter 示例：

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

`draft: true` 的文章不会被发布。

## 站点信息

站点名称、简介、作者、导航和社交链接统一配置在 `src/site.config.ts`。后续要改站点身份，只需要修改这个文件。

当前 `astro.config.mjs` 和 `public/robots.txt` 中的域名还是占位地址，拿到正式域名后需要替换。
