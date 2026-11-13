import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import postcss from 'postcss';
import fontDisplay from '../src/lib/postcss-font-display.mjs';

const require = createRequire(import.meta.url);

for (const weight of ['regular', 'bold']) {
  test(`WenKai ${weight}: every subset avoids late swaps and retains its glyph mapping`, async () => {
    const path = require.resolve(`lxgw-wenkai-webfont/lxgwwenkai-${weight}.css`);
    const source = readFileSync(path, 'utf8');
    const result = await postcss([fontDisplay()]).process(source, { from: path });
    assert.ok(source.includes('font-display: swap'));
    assert.equal(result.css, source.replaceAll('font-display: swap', 'font-display: optional'));
  });
}

test('unrelated fonts and ordinary declarations are unchanged', async () => {
  const source = `@font-face { font-family: "Other"; font-display: swap; src: url(other.woff2); }
body { font-family: "LXGW WenKai"; }`;
  const result = await postcss([fontDisplay()]).process(source, { from: undefined });
  assert.equal(result.css, source);
});
