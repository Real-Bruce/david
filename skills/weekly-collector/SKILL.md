---
name: weekly-collector
description: 维护 David's Blog 的周刊素材收集文件与生成新一期周刊。当用户要往 collect.md 里收录/整理文章、开源项目、网站工具、资料博文等素材，或要把素材沉淀为正式周刊（issue）时使用。触发词：周刊素材、收集储备、整理周刊素材、生成周刊、写一期周刊、从 collect 生成周刊、本周周刊、新一期周刊。
agent_created: true
---

# 周刊素材收集与周刊生成

本 skill 用于维护本博客仓库的周刊素材储备文件 `src/content/weekly/collect.md`，以及将素材沉淀为正式周刊。

## 何时使用

- 用户提供链接/文章/项目，要求「收录」「储备」「记到素材」「放进 collect」时，把内容按约定写入 collect.md。
- 用户要求「生成新一期周刊」「写一期周刊」时，按「生成新一期周刊的步骤」执行 **issue、分类归档、collect.md 三处同步**改动。

## 关键约定（必须遵守）

1. **collect.md 不参与构建**：它是纯素材储备文件，不含 front matter，不生成页面。切勿给它添加 title/issue 等 front matter；`src/content.config.ts` 已通过 glob 排除规则 `['*.md', '!collect.md']` 将其排除出内容集合。不要修改该排除规则。
2. **正式周刊才走模板**：只有 `issue-*.md` 是发布内容，需要完整 front matter（title、description、issue、pubDate、tags、draft，可选 digest、links）。
3. **栏目固定且顺序稳定**：collect.md 与 issue 正文用同样的四个栏目，按此顺序分块，条目用四级标题（`#### [标题](链接)`）+ 一句简介：
   - `## 📜有价值的文章`
   - `## 🛸开源项目`
   - `## 🚀网站&工具`
   - `## ⛵资料&博文`
4. **文件命名**：正式周刊文件命名为 `src/content/weekly/issue-XXX.md`（XXX 为期数，现有最大期数 +1，三位数字补零）。
5. **三处同步缺一不可**：新 issue 文件、分类归档追加、collect.md 清理必须在同一次改动里完成，否则分类归档与期刊内容脱节。

## 收录素材的步骤

1. 读取 `src/content/weekly/collect.md`，了解现有栏目与条目顺序。
2. 判断素材类型，归入对应栏目：开源项目 → 开源项目；在线工具/网站 → 网站&工具；文章/博文/资料 → 资料&博文或（长文）有价值的文章。
3. 在对应栏目的末尾追加条目，格式保持一致：
   ```markdown
   #### [标题](https://链接)

   一句话介绍内容或价值。
   ```
   文章类长文可保留英文原段，每段后紧跟 `>中文译文`。
4. 检查无重复条目（同一链接不重复收录）。

## 生成新一期周刊的步骤

1. **定期数与日期**：列出 `src/content/weekly/issue-*.md` 取最大期数 +1；`pubDate` 用当天日期（用户指定则从其指定）。
2. **圈定本期素材**：本期只收录「上次发布之后新积累」的条目，**不要从历史库存里挑**——旧库存是跨期储备，历史上每期都只消化当周新素材。定位方法：
   ```bash
   git log -1 --format=%H -- "src/content/weekly/issue-*.md"  # 上次发布提交
   git diff <该提交> -- src/content/weekly/collect.md          # 已提交的新素材
   git diff -- src/content/weekly/collect.md                   # 未提交的新素材
   ```
   两段 diff 里新增的 `#### [标题](链接)` 条目即本期内容。某栏目当周没有新素材时该栏目可留空（issue-105 就只有 2 个网站工具），不要硬凑。
3. **写 issue 文件**：
   - front matter 结构参考 `src/content/template/weekly-template.md`，但模板里的期数、日期、标题、条目全是示例值，**必须全部替换**；`draft: false` 表示发布。
   - `title` 取本期主打文章的标题（原文或简短中文概括均可）。
   - `description` 固定句式：`收集整理每周看到的好玩有趣的内容，本期收录文章 X 篇、开源项目 X 个、网站工具 X 个、资料博文 X 篇。`——数量必须与正文一致。
   - 文章类条目排版：先写一段中文导读，再按「英文原段 + 紧随其后的 `>中文译文`（段落与译文之间不空行）」逐段排（参考 issue-106 与归档 Vol.102）；纯中文文章直接用全文。
   - 其余条目沿用 collect.md 里已有的简介文字，`#### [标题](链接)` + 空行 + 简介，不要重新发明描述。
4. **同步分类归档**：把本期每个条目按下方映射插到 `src/content/weekly/archives/` **根目录**对应分类文件的顶部，新小节标题 `## Vol.<期数> / <YYYY.MM.DD>`（与 pubDate 同日），置于现有内容之前；条目正文与 issue 保持一致（文章类含导读与译文）：

   | issue 栏目 | 归档文件 | 分类标题 |
   | --- | --- | --- |
   | 📜有价值的文章 | `archives/article.md` | 文章 |
   | 🛸开源项目 | `archives/software.md` | 软件 |
   | 🚀网站&工具 | `archives/website.md` | 网站 |
   | ⛵资料&博文 | `archives/blogs.md` | 博客 |

   根目录文件即「当前年」归档，年份由文件内首个 `## Vol.` 标题推导，新期插在顶部后依然成立。Vol 期数与 issue 期数一致。每年 1 月首发周刊前，先把根目录 4 个文件移入 `archives/{上一年}/` 并新建空根目录文件（细节见 README「周刊分类归档」）。
5. **清理 collect.md**：把已采用条目整块（含简介与译文）从 collect.md 删除，栏目标题保留；未采用的条目原样留存供下期使用。
6. **验证**：依次运行 `npm run check`、`npm run test`、`npm run build`（与 CI 同序，任一失败先修复再继续）。构建后抽查 `dist/weekly/issue-XXX/` 存在且 `dist/weekly/<分类>/<当年>/` 页面含新 Vol 小节；`git ls-files --eol` 确认新文件为 LF。
7. **提交**（仅在用户要求时）：沿用惯例信息 `Publish weekly issue XXX and archive entries`，包含 issue 文件、四个归档文件与 collect.md。

## 注意事项

- 新增栏目/分类需与用户确认，并同步更新 `src/lib/weekly-archive-data.ts` 的 `categoryTitles` 与 `categoryOrder`：未登记的分类会排到最后，并直接用英文 id 当标题。
- `links` 与 `digest` 至今没有任何一期实际填写，属于预留能力，改动无法靠现有内容验证，需自行补样例。
- 不改动 `src/content.config.ts` 的 collect.md 排除规则，也不改 `AGENTS.md` 中关于 collect.md 的约定，除非用户明确要求。
