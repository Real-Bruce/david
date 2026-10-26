import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseNeteaseSong } from '../src/lib/note-music.ts';

test('official song URLs discard sharing parameters and generate the official player URL', () => {
  for (const url of [
    'https://music.163.com/song?id=2795465',
    'https://music.163.com/song?userid=123&id=2795465&app_version=1',
    'https://music.163.com/#/song?id=2795465&userid=123',
    'https://music.163.com/?from=share#/song?from=share&id=2795465'
  ]) assert.deepEqual(parseNeteaseSong(url), {
    playerUrl: 'https://music.163.com/outchain/player?type=2&id=2795465&auto=0&height=66'
  });
});

test('rejects missing, duplicated and invalid IDs in either URL format', () => {
  for (const query of ['', 'foo=1', 'id=', 'id=0', 'id=-1', 'id=1.2', 'id=1e3', 'id=01', 'id=abc', 'id=%201', 'id=1&id=1', 'id=1&id=2', 'id=1&%69d=2', 'id=1%23/song?id=2']) {
    for (const path of ['/song?', '/#/song?']) assert.equal(parseNeteaseSong(`https://music.163.com${path}${query}`), null);
  }
  assert.equal(parseNeteaseSong('https://music.163.com/?id=2#/song?id=1'), null);
});

test('rejects unofficial hosts, protocols, ports, credentials and non-song paths', () => {
  for (const url of [
    'http://music.163.com/song?id=1', 'javascript:alert(1)', '//music.163.com/song?id=1',
    'https://music.163.com.evil.test/song?id=1', 'https://evil.test/music.163.com/song?id=1',
    'https://music.163.com@evil.test/song?id=1', 'https://user@music.163.com/song?id=1',
    'https://music.163.com:444/song?id=1', 'https://163cn.tv/abc',
    'https://music.163.com/playlist?id=1', 'https://music.163.com/#/playlist?id=1',
    'https://music.163.com/song/?id=1', 'https://music.163.com/song?id=1#/song?id=2',
    '<iframe src="https://music.163.com/song?id=1"></iframe>'
  ]) assert.equal(parseNeteaseSong(url), null, url);
});
