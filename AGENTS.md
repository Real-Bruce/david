# AGENTS.md

给自动化代理的约束与陷阱清单。**项目的说明性内容都在 `README.md`**（目录结构、命令、内容模型、页面行为、设计现状、部署），需要时再去读，不要在本文件里复制一份。实现与文档不一致时，同步更新对应文件。

## 硬约束

- 改动源码、样式或内容后依次运行 `npm run check`、`npm run test`、`npm run build`；CI 按同样顺序执行，任一步失败即中断部署。
- `typescript` 必须锁在 6.x：`astro check` 尚不支持 TypeScript 7，装成 7 会直接报错退出。
- `npm run test` 等价于 `node --test "tests/*.test.ts"`：glob 要带引号交给 Node 自己展开，PowerShell/cmd 下不加引号会被 shell 先展开。
- 不修改、不提交生成产物与依赖目录：`dist/`、`.astro/`、`node_modules/`。
- 换行符一律 LF，禁止 CRLF（`.gitattributes` 与 `.editorconfig` 共同约束）。新增文件、从外部粘贴或用 Windows 编辑器另存后，用 `git ls-files --eol` 复查。
- 提交信息用简洁英文祈使句；仅在用户要求或任务明确包含提交时才提交。
- 保持改动聚焦；清理无效样式或未使用代码前，先确认没有模板或脚本引用。
- 测试与实现同名对应（`src/lib/weekly.ts` ↔ `tests/weekly.test.ts`）：改了纯函数就去补对应测试，不要新开无主的测试文件。
- 未获明确要求，不引入 React、Vue、Tailwind 或其他大型前端框架，也不改变现有路由结构。
- 站内以绝对路径书写的链接统一通过 `src/lib/base.ts` 的 `withBase()` 生成；Pagefind 的运行时导入路径用 `import.meta.env.BASE_URL`，不要写死站点路径。

## 按需查阅

| 想了解 | 去处 |
| --- | --- |
| 目录结构、命令、技术栈 | `README.md`「项目结构」「主要命令」「技术栈」 |
| 路由与每个页面的行为 | `README.md`「页面结构」，实现看 `src/pages/` |
| front matter 字段与内容集合 | `README.md`「内容模型」，schema 看 `src/content.config.ts` |
| 周刊分类归档与年度滚动 | `README.md`「周刊分类归档」，实现看 `src/lib/weekly-archives.ts`、`src/lib/weekly-archive-data.ts` |
| 设计原则与视觉现状 | `README.md`「设计现状」，样式集中在 `src/styles/global.css` |
| 爬虫与 AI 可见性策略 | `README.md`「爬虫与 AI 可见性」，文件是 `public/robots.txt` 与 `/llms.txt` |
| 部署、CI 与换域名清单 | `README.md`「部署」「站点配置」，工作流 `.github/workflows/deploy.yml` |
| 新建文章流程与写作模板 | `README.md`「写作建议」，模板在 `src/content/template/` |

改动落点（避免全仓搜索）：站点身份 `src/site.config.ts`；schema `src/content.config.ts`；首页 `src/pages/index.astro`；周刊 `src/pages/weekly/` 与 `src/lib/weekly.ts`；博客、随笔 `src/pages/blog/`、`src/pages/notes/`；时间归档 `src/pages/archive.astro`；站内搜索 `src/components/ArchiveSearch.astro`；标签页 `src/pages/tags/[tag].astro`；全局布局与视觉 `src/layouts/BaseLayout.astro`、`src/styles/global.css`；Markdown 管线与 sitemap `astro.config.mjs`；RSS `src/pages/rss.xml.js`；llms.txt `src/pages/llms.txt.ts` 与 `src/lib/llms.ts`。

## 陷阱：内容集合

- `z` 必须从 `astro/zod` 导入；`astro:content` 再导出的 `z` 在 Astro 7 已弃用。
- Astro 7 的集合完全由 loader 的 `base` 决定，不存在「`src/content/` 下自动成为集合」的规则。**不要把 `base` 放宽到 `'./src/content'`**，否则带示例 front matter 的写作模板会被当成正式文章解析（凭空多出一期 `issue: 0`）。`tests/content-templates.test.ts` 守着这条约定。
- `src/content/weekly/collect.md` 是素材储备，靠 weekly loader 的 `!collect.md` 排除：不要给它加 front matter，也不要改排除规则。
- `links` 与 `digest` 至今没有任何一期实际填写，`/weekly/[slug]/` 的「本期推荐」属于预留能力，改动无法靠现有内容验证，需自行补样例；`digest.highlights` 目前不在页面中展示。
- `getArchiveYear()` 的「文件夹名优先」靠 `/(\d{4})\/[^/]+$/` 匹配直接父目录，因此 `entryId` 同时接受集合 id（`2025/website`）与 `import.meta.glob` 的完整 key。**不要改回 `^` 锚定的写法**，否则 glob 调用路径会静默退化成正文取年，跨年时算错年份。
- 新增周刊分类时，同步更新 `src/lib/weekly-archive-data.ts` 的 `categoryTitles` 与 `categoryOrder`：未登记的分类会排到最后，并直接用英文 id 当标题显示。
- 修改 schema 或新增集合后，检查并同步更新 `src/lib/posts.ts`、相关页面和测试。

## 陷阱：样式与布局

- 优先复用 `src/styles/global.css` 里的设计变量与既有组件样式，避免新增一次性、分散的 CSS。
- `EditorialPostList.astro` 被博客、随笔、归档三处共用，改它会同时影响三个页面。
- TOC 只在 `≥1001px` 的侧栏吸顶。`≤1000px` 时 `.article-layout` 折叠为单列，TOC 必须回到文档流；若继续 `position: sticky`，它会钉在视口顶部跟着读者滚完整篇文章并遮住正文。
- 代码块复制按钮挂在 `.code-block` 容器上，不能放进 `<pre>` 内部：Shiki 会在 `<pre>` 上输出**内联** `overflow-x: auto`，内联样式压过任何选择器（`!important` 除外），按钮会跟着代码横向滚出可视区。`.code-block` 由 `BaseLayout.astro` 的脚本在运行时包裹，不加边框和内边距，靠外边距折叠维持原有间距；按钮默认 `opacity: 0`，靠 `:hover` / `:focus-within` 揭开，因此必须保留 `@media (hover: none)` 兜底，否则触屏上永远不可见。
- 响应式规则集中在 `global.css` 末尾：`@media (max-width: 760px)`（头部与移动导航）与「窄屏排版」区块（`767px` 安全边距 + 合并后的单个 `700px`）。窄屏区块必须位于 `.weekly-archive-*` 等基础规则之后——同优先级靠后胜出，提前会让移动端间距被基础值覆盖；也不要为同一断点再开第二个块。
- 列表条目当前不带右侧箭头图标，`.weekly-entry` / `.editorial-entry` 是两列网格。若要恢复箭头，需同时补回 `grid-template-areas` 的第三列与对应样式，别只加模板。
- 站点外壳组件（`SiteHeader`、`BackToTop`）带 `data-pagefind-ignore`，避免品牌名与导航文字被 Pagefind 索引进每一页；新增全局外壳组件时同样处理。
- Astro 不会移除模板里的 HTML 注释：`<!-- -->` 包裹的 JSX 会原样进入 `dist` 并泄漏模板源码。废弃代码直接删除，靠 Git 保留历史。

## 陷阱：构建产物与爬虫文件

- `sitemap({ filter })` 会排除 `/weekly/archives/*`：它们是自带 `noindex` 的重定向壳页，收进 sitemap 会与 `noindex` 自相矛盾。
- `rss.xml.js` 的 `site` 必须经 `withBase('/')` 拼出，否则频道链接会丢掉 `/david`。
- `robots.txt` 的注释必须独占一行：写在 `User-agent` / `Allow` / `Disallow` / `Sitemap` 之后会被当成值的一部分，规则随之失效；也不要给 `User-agent: *` 加 `Disallow`（会连带屏蔽传统搜索引擎）。UA 名单与分组策略见 `README.md`「爬虫与 AI 可见性」，`tests/robots.test.ts` 会校验分组归属与 Sitemap 地址。
- `/llms.txt` 的条目全部由内容集合生成，不要手写清单；链接一律用绝对地址。`tests/llms.test.ts` 校验行格式与空分区处理。
- 站点发布在 GitHub Pages 子路径 `/david/` 下，`robots.txt` 与 `llms.txt` 实际不在域名根，爬虫读不到，细节见 `README.md`「爬虫与 AI 可见性」。
