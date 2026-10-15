import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderLlmsLink, renderLlmsTxt } from '../src/lib/llms.ts';

const site = {
  name: "David's Blog",
  summary: '记录每周发现、长期思考与随手灵感。',
  about: '由 David 维护。\n\n静态站点。'
};

test('头部依次是站点名、单行摘要与 About 段落', () => {
  assert.equal(
    renderLlmsTxt(site, []),
    "# David's Blog\n\n> 记录每周发现、长期思考与随手灵感。\n\n由 David 维护。\n\n静态站点。\n"
  );
});

test('About 为空时只保留标题与摘要', () => {
  assert.equal(
    renderLlmsTxt({ ...site, about: '   ' }, []),
    "# David's Blog\n\n> 记录每周发现、长期思考与随手灵感。\n"
  );
});

test('摘要里的换行会压成一行，避免破坏引用块', () => {
  const text = renderLlmsTxt({ ...site, summary: '第一行\n第二行' }, []);
  assert.match(text, /^# David's Blog\n\n> 第一行 第二行\n/);
});

test('链接条目格式为「- [标题](绝对地址): 描述」，描述可省略', () => {
  assert.equal(
    renderLlmsLink({ title: '周刊目录', href: 'https://example.com/david/weekly/' }),
    '- [周刊目录](https://example.com/david/weekly/)'
  );
  assert.equal(
    renderLlmsLink({
      title: '第 105 期 · 或许没人在意的细节',
      href: '  https://example.com/david/weekly/issue-105/  ',
      description: '2026-10-12 · 收录文章 1 篇、开源项目 4 个'
    }),
    '- [第 105 期 · 或许没人在意的细节](https://example.com/david/weekly/issue-105/): 2026-10-12 · 收录文章 1 篇、开源项目 4 个'
  );
});

test('标题与描述里的换行、多余空格和方括号都会被处理', () => {
  assert.equal(
    renderLlmsLink({
      title: '标题\n换行 [x]',
      href: 'https://example.com/',
      description: '  多   空格\n描述 '
    }),
    '- [标题 换行 \\[x\\]](https://example.com/): 多 空格 描述'
  );
});

test('分区保持顺序，空分区不输出孤立标题', () => {
  const text = renderLlmsTxt(site, [
    { title: '站点入口', links: [{ title: '关于', href: 'https://example.com/david/about/' }] },
    { title: '空分区', links: [] },
    {
      title: '周刊',
      links: [{ title: '第 2 期', href: 'https://example.com/david/weekly/issue-002/', description: '说明' }]
    }
  ]);

  assert.match(
    text,
    /## 站点入口\n- \[关于\]\(https:\/\/example\.com\/david\/about\/\)\n\n## 周刊\n- \[第 2 期\]\(https:\/\/example\.com\/david\/weekly\/issue-002\/\): 说明\n$/
  );
  assert.equal(text.includes('空分区'), false, '没有条目的分区不该留下标题');
});
