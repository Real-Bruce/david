import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { join, resolve, sep } from 'node:path';

const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const configPath = join(repoRoot, 'src', 'content.config.ts');
const templateDir = join(repoRoot, 'src', 'content', 'template');

const withSep = (path: string) => (path.endsWith(sep) ? path : path + sep);

/** 取出 content.config.ts 中所有 glob loader 的 base。 */
function getLoaderBases(source: string): string[] {
  return [...source.matchAll(/base:\s*['"]([^'"]+)['"]/g)].map(match => match[1]);
}

test('写作模板位于 src/content/template 下', () => {
  assert.ok(existsSync(templateDir), '缺少 src/content/template 目录');
  assert.deepEqual(readdirSync(templateDir).sort(), [
    'blog-template.md',
    'notes-template.md',
    'weekly-template.md'
  ]);
});

test('没有任何集合的 loader base 覆盖模板目录', () => {
  const bases = getLoaderBases(readFileSync(configPath, 'utf8'));
  // 若配置写法变化导致抓不到 base，宁可让测试失败，也不要静默通过
  assert.ok(bases.length >= 4, `expected at least 4 loader bases, got ${bases.length}`);

  for (const base of bases) {
    const abs = resolve(repoRoot, base);
    const covers = templateDir === abs || templateDir.startsWith(withSep(abs));
    assert.equal(
      covers,
      false,
      `loader base "${base}" 覆盖了 src/content/template，写作模板会被当成正式内容解析`
    );
  }
});

test('根目录不再残留 template 目录', () => {
  assert.equal(existsSync(join(repoRoot, 'template')), false, '根目录 template/ 应已移入 src/content/');
});

test('weekly loader 保留 collect.md 排除规则', () => {
  const source = readFileSync(configPath, 'utf8');
  assert.match(source, /!collect\.md/, 'weekly loader 丢掉了 !collect.md 排除规则');
});
