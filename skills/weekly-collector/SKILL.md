---
name: weekly-collector
description: 维护 David's Blog 的周刊素材收集文件与生成新一期周刊。当用户要往 collect.md 里收录/整理文章、开源项目、网站工具、资料博文等素材，或要把素材沉淀为正式周刊（issue）时使用。触发词：周刊素材、收集储备、整理周刊素材、生成周刊、写一期周刊、从 collect 生成周刊、本周周刊。
agent_created: true
---

# 周刊素材收集与周刊生成

本 skill 用于维护本博客仓库的周刊素材储备文件 `src/content/weekly/collect.md`，以及将素材沉淀为正式周刊。

## 何时使用

- 用户提供链接/文章/项目，要求「收录」「储备」「记到素材」「放进 collect」时，把内容按约定写入 collect.md。
- 用户要求「生成新一期周刊」「写一期周刊」「从素材里挑内容出周刊」时，从 collect.md 摘取素材，套用周刊模板生成新的 issue 文件。

## 关键约定（必须遵守）

1. **collect.md 不参与构建**：它是纯素材储备文件，不含 front matter，不生成页面。切勿给它添加 title/issue 等 front matter；`src/content.config.ts` 已通过 glob 排除规则 `['*.md', '!collect.md']` 将其排除出内容集合。不要修改该排除规则。
2. **正式周刊才走模板**：只有 `issue-*.md` 才是发布内容，需要完整 front matter（title、description、issue、pubDate、tags、draft，可选 digest、links）。
3. **栏目固定**：collect.md 按栏目用二级标题（`##`）分块，条目用四级标题（`#### [标题](链接)`）+ 一句简介。当前栏目为：
   - `## 🛸开源项目`
   - `## 🚀网站&工具`
   - `## ⛵资料&博文`
   - `## 📜有价值的文章`（正文首部出现过，收录长文时用）
   新增素材时归入对应栏目；若需要新栏目，与用户确认后新增，并保持栏目顺序稳定。
4. **文件命名**：正式周刊文件命名为 `src/content/weekly/issue-XXX.md`（XXX 为期数，紧接现有最大期数 +1）。

## 收录素材的步骤

1. 读取 `src/content/weekly/collect.md`，了解现有栏目与条目顺序。
2. 判断素材类型，归入对应栏目：开源项目 → 开源项目；在线工具/网站 → 网站&工具；文章/博文/资料 → 资料&博文或有价值的文章。
3. 在对应栏目的末尾追加条目，格式保持一致：
   ```markdown
   #### [标题](https://链接)

   一句话介绍内容或价值。
   ```
4. 检查无重复条目（同一链接不重复收录）。

## 生成周刊的步骤

1. 读取 `src/content/template/weekly-template.md`，了解 front matter 结构与正文栏目（模板已在该目录，勿在 skill 内重复存放模板内容）。
2. 读取 `src/content/weekly/collect.md`，挑选本期要收录的素材。
3. 确定新期数：列出 `src/content/weekly/issue-*.md`，取最大期数 +1。
4. 创建 `src/content/weekly/issue-XXX.md`，填写 front matter（`draft: false` 表示发布，草稿则 `draft: true`），正文按模板栏目组织，为每条素材补写一句话介绍，可在 `links` 字段填写本期推荐链接。
5. 将已采用的素材从 collect.md 中移除（避免重复），未采用的保留供下期使用。
6. 运行 `npm run build` 验证无报错，确认新 issue 出现在周刊列表。

## 注意事项

- 周刊正文栏目参考模板：`📜有价值的文章`、`🛸开源项目`、`🚀网站&工具`、`⛵资料&博文`、`💭碎碎念`，与 collect.md 栏目对齐。
- 不改动 `src/content.config.ts`、`AGENTS.md` 中关于 collect.md 的约定，除非用户明确要求。
