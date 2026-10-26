/** Only official HTTPS single-song links are accepted; discard sharing parameters. */
export function parseNeteaseSong(value: string): { playerUrl: string } | null {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.hostname !== 'music.163.com' || url.port || url.username || url.password) return null;
    let params: URLSearchParams;
    if (url.pathname === '/song' && !url.hash) {
      params = url.searchParams;
    } else if (url.pathname === '/' && url.hash.startsWith('#/song?')) {
      // Reject ambiguous IDs split between the URL query and hash query.
      if (url.searchParams.has('id')) return null;
      params = new URLSearchParams(url.hash.slice('#/song?'.length));
    } else return null;
    const ids = params.getAll('id');
    if (ids.length !== 1 || !/^[1-9]\d*$/.test(ids[0])) return null;
    const id = ids[0];
    return {
      playerUrl: `https://music.163.com/outchain/player?type=2&id=${id}&auto=0&height=66`
    };
  } catch {
    return null;
  }
}
