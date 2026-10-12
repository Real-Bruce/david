import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getArchiveYear, countArchiveEntries } from '../src/lib/weekly-archive-data.ts';

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
