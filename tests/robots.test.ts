import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';

const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const read = (...parts: string[]) => readFileSync(join(repoRoot, ...parts), 'utf8');

const robots = read('public', 'robots.txt');
const astroConfig = read('astro.config.mjs');
const siteConfigSource = read('src', 'site.config.ts');

/** robots.txt 的一个规则组：连续的 User-agent 行共享同一批 Allow / Disallow。 */
interface RobotsGroup {
  agents: string[];
  allow: string[];
  disallow: string[];
}

function parseGroups(source: string): RobotsGroup[] {
  const groups: RobotsGroup[] = [];

  for (const rawLine of source.split('\n')) {
    const line = rawLine.trim();
    if (line === '' || line.startsWith('#')) continue;

    const separator = line.indexOf(':');
    assert.ok(separator > 0, `无法解析的行：${line}`);
    const field = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();
    const last = groups.at(-1);

    if (field === 'user-agent') {
      if (last && last.allow.length === 0 && last.disallow.length === 0) {
        last.agents.push(value.toLowerCase());
      } else {
        groups.push({ agents: [value.toLowerCase()], allow: [], disallow: [] });
      }
      continue;
    }

    assert.ok(last, `规则 ${field} 出现在任何 User-agent 之前`);
    if (field === 'allow') last.allow.push(value);
    if (field === 'disallow') last.disallow.push(value);
  }

  return groups;
}

const groups = parseGroups(robots);
const lines = robots.split('\n').map(line => line.trim());

const groupsFor = (agent: string) =>
  groups.filter(group => group.agents.includes(agent.toLowerCase()));

const groupFor = (agent: string) => {
  const matched = groupsFor(agent);
  assert.equal(matched.length, 1, `${agent} 应该只出现在一个规则组里，实际 ${matched.length} 个`);
  return matched[0];
};

// 检索类 + 用户触发类：放行，决定 AI 能否搜到本站、能否替用户读取被分享的页面
const allowedAgents = [
  'OAI-SearchBot',
  'Claude-SearchBot',
  'PerplexityBot',
  'DuckAssistBot',
  'Applebot',
  'ChatGPT-User',
  'Claude-User',
  'Perplexity-User',
  'Google-Agent',
  'meta-externalfetcher'
];

// 训练类 + 退出标识 + 未声明类：屏蔽，只影响是否进入训练语料
const blockedAgents = [
  'GPTBot',
  'anthropic-ai',
  'ClaudeBot',
  'Claude-Web',
  'CCBot',
  'Meta-ExternalAgent',
  'FacebookBot',
  'Amazonbot',
  'cohere-ai',
  'AI2Bot',
  'Ai2Bot-Dolma',
  'Diffbot',
  'ImagesiftBot',
  'omgili',
  'omgilibot',
  'TimpiBot',
  'Google-Extended',
  'Applebot-Extended',
  'Bytespider',
  'Grok'
];

test('搜索检索类 AI 爬虫被放行', () => {
  for (const agent of allowedAgents.slice(0, 5)) {
    const group = groupFor(agent);
    assert.deepEqual(group.disallow, [], `${agent} 是检索爬虫，不该被 Disallow`);
    assert.ok(group.allow.includes('/'), `${agent} 需要 Allow: /`);
  }
});

test('用户触发类 AI 爬虫被放行', () => {
  for (const agent of allowedAgents.slice(5)) {
    const group = groupFor(agent);
    assert.deepEqual(group.disallow, [], `${agent} 是用户触发爬虫，不该被 Disallow`);
    assert.ok(group.allow.includes('/'), `${agent} 需要 Allow: /`);
  }
});

test('训练爬虫、退出标识与未声明爬虫被屏蔽', () => {
  for (const agent of blockedAgents) {
    const group = groupFor(agent);
    assert.deepEqual(group.allow, [], `${agent} 是训练/未声明爬虫，不该被 Allow`);
    assert.ok(group.disallow.includes('/'), `${agent} 需要 Disallow: /`);
  }
});

test('放行名单与屏蔽名单不重叠', () => {
  const overlap = allowedAgents.filter(agent => blockedAgents.includes(agent));
  assert.deepEqual(overlap, [], '同一个 UA 同时出现在放行与屏蔽名单里');
});

test('默认组放行全站，交给传统搜索引擎兜底', () => {
  const group = groupFor('*');
  assert.ok(group.allow.includes('/'), '缺少 User-agent: * 的 Allow: /');
  assert.deepEqual(group.disallow, [], '不要给 User-agent: * 加 Disallow，会连带屏蔽搜索引擎');
});

test('Sitemap 与 llms.txt 地址跟随 astro.config 的 site + base', () => {
  const site = /site:\s*['"]([^'"]+)['"]/.exec(astroConfig)?.[1];
  const base = /base:\s*['"]([^'"]+)['"]/.exec(astroConfig)?.[1];
  assert.ok(site && base, 'astro.config.mjs 里读不到 site / base');

  const origin = `${site}${base}`;
  assert.ok(
    lines.includes(`Sitemap: ${origin}/sitemap-index.xml`),
    `Sitemap 行应为 ${origin}/sitemap-index.xml`
  );
  assert.ok(
    lines.includes(`# ${origin}/llms.txt`),
    `robots.txt 应注明 llms.txt 地址 ${origin}/llms.txt`
  );
  assert.equal(
    /url:\s*['"]([^'"]+)['"]/.exec(siteConfigSource)?.[1],
    origin,
    'src/site.config.ts 的 url 与 astro.config.mjs 的 site + base 不一致'
  );
});

test('指令行不写行内注释，换行符为 LF', () => {
  // RFC 9309 只承认独占一行的 #，写在值后面会被当成 UA / 路径的一部分
  const offenders = lines.filter(line =>
    /^(user-agent|allow|disallow|sitemap)\s*:.*#/i.test(line)
  );
  assert.deepEqual(offenders, [], '注释必须独占一行，否则该条规则会失效');
  assert.equal(robots.includes('\r'), false, 'robots.txt 出现 CRLF');
});
