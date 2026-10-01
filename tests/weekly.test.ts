import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getWeeklyDigest, getWeeklyInsights } from '../src/lib/weekly.ts';

type WeeklyPost = Parameters<typeof getWeeklyDigest>[0];
const post = (body = '', digest?: WeeklyPost['data']['digest']) => ({
  body,
  data: { description: '没有正文推荐时使用的简介', digest }
}) as WeeklyPost;

test('editorial digest takes precedence without changing homepage insights', () => {
  const entry = post('## 工具\n#### [Original](https://example.com)\n', {
    title: '人工导读',
    highlights: ['精选一', '精选二']
  });
  assert.deepEqual(getWeeklyDigest(entry), entry.data.digest);
  assert.deepEqual(getWeeklyInsights(entry).links, ['Original']);
});

test('older issues use two recommendation titles, without extra statistics', () => {
  const entry = post('## 工具\r\n#### [第一项](https://example.com/1)\r\n#### [第二项](https://example.com/2)\r\n#### [第三项](https://example.com/3)');
  assert.deepEqual(getWeeklyDigest(entry), { title: '第一项 · 第二项', highlights: [] });
});

test('missing recommendations fall back to the existing description', () => {
  assert.deepEqual(getWeeklyDigest(post()), { title: '没有正文推荐时使用的简介', highlights: [] });
});

test('a single recommendation remains readable and is not duplicated', () => {
  assert.deepEqual(getWeeklyDigest(post('#### [唯一推荐](https://example.com)')), {
    title: '唯一推荐', highlights: []
  });
});
