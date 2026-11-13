import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import rehypeImageFigures from '../src/lib/rehype-image-figures.mjs';

const processor = await createMarkdownProcessor({ rehypePlugins: [rehypeImageFigures] });

test('图题和多张图片生成同一图框，保留行内样式、图片链接及顺序', async () => {
  const { code } = await processor.render([
    '| **配置示例** |',
    '| --- |',
    '| ![第一张](/one.webp) |',
    '| [![第二张](/two.webp)](/full.webp) |'
  ].join('\n'));

  assert.match(code, /<figure class="image-figure"><figcaption><strong>配置示例<\/strong><\/figcaption>/);
  assert.match(code, /<img src="\/one.webp" alt="第一张"><a href="\/full.webp"><img src="\/two.webp" alt="第二张"><\/a>/);
  assert.doesNotMatch(code, /<table>/);
});

test('普通表格、多列表格和含说明文字的图片表格保留表格结构', async () => {
  const tables = [
    ['| 配置项 |', '| --- |', '| 默认值 |'],
    ['| 配置 | 预览 |', '| --- | --- |', '| 默认值 | ![](/one.webp) |'],
    ['| 配置示例 |', '| --- |', '| ![](/one.webp) |', '| 说明文字 |']
  ];

  for (const rows of tables) {
    const { code } = await processor.render(rows.join('\n'));
    assert.match(code, /<table>/);
    assert.doesNotMatch(code, /<figure/);
  }
});
