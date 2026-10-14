import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  compareCategories,
  countArchiveEntries,
  getCategoryTitle,
  getArchiveYear
} from '../src/lib/weekly-archive-data.ts';

test('archive year comes from the year folder when present', () => {
  const content = '# website\n\n## Vol.69 / 2025.12.28\n';
  assert.equal(getArchiveYear('2025/website', content), 2025);
  assert.equal(getArchiveYear('2024/website', content), 2024);
});

test('root-level archive year is read from the first issue heading', () => {
  const content = '# website\n\n## Vol.104 / 2026.09.06\n\n#### [glaze](https://www.glaze.app/)\n';
  assert.equal(getArchiveYear('website', content), 2026);
});

test('root-level archive without a dated issue heading has no year', () => {
  assert.equal(getArchiveYear('website', '# website\n\n暂无内容\n'), null);
});

test('folder year takes precedence over the inline issue date', () => {
  const content = '## Vol.69 / 2025.12.28\n';
  assert.equal(getArchiveYear('2025/website', content), 2025);
});

// 回归：weekly-archives.ts 传入的是 import.meta.glob 的 key，而不是集合 id。
// 旧正则被 ^ 锚死，此时「年份文件夹优先」会静默失效；
// 年度滚动跨年（2025 文件夹里最后一期落在 2026.01）就会算错年份、生成 404 路由。
test('folder year wins for import.meta.glob style paths too', () => {
  const rolled = '## Vol.70 / 2026.01.04\n';
  assert.equal(getArchiveYear('../content/weekly/archives/2025/website.md', rolled), 2025);
  assert.equal(getArchiveYear('2025/website', rolled), 2025);
});

test('root-level glob path still falls back to the inline issue date', () => {
  const content = '## Vol.105 / 2026.10.12\n';
  assert.equal(getArchiveYear('../content/weekly/archives/website.md', content), 2026);
});

test('a year-looking filename is not mistaken for a year folder', () => {
  assert.equal(getArchiveYear('../content/weekly/archives/2025.md', '# website\n'), null);
});

test('archive entry count matches recommendation link lines only', () => {
  const content = [
    '# website',
    '',
    '## Vol.69 / 2025.12.28',
    '',
    '#### [awwwards](https://www.awwwards.com/)',
    '',
    '普通段落里的 [链接](https://example.com) 不计入',
    '',
    '#### [size of life](https://neal.fun/size-of-life/)',
    '',
    '#### [forty](https://forty.news/)'
  ].join('\n');
  assert.equal(countArchiveEntries(content), 3);
});

test('empty archive content counts zero entries', () => {
  assert.equal(countArchiveEntries('# website\n'), 0);
});

test('archive entry count is unaffected by CRLF line endings', () => {
  const content = [
    '# website',
    '',
    '## Vol.69 / 2025.12.28',
    '',
    '#### [awwwards](https://www.awwwards.com/)',
    '',
    '#### [forty](https://forty.news/)'
  ].join('\r\n');
  assert.equal(countArchiveEntries(content), 2);
});

test('known categories keep the documented order and unknown ones go last', () => {
  const ids = ['podcast', 'website', 'article', 'blogs', 'software', 'video'];
  assert.deepEqual(
    [...ids].sort(compareCategories),
    ['article', 'blogs', 'software', 'website', 'podcast', 'video']
  );
});

test('unknown category falls back to its raw id as the title', () => {
  assert.equal(getCategoryTitle('website'), '网站');
  assert.equal(getCategoryTitle('podcast'), 'podcast');
});
