const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * 为站内绝对路径添加 base 前缀。
 * GitHub Pages 子路径部署（real-bruce.github.io/weekly/）时返回带前缀的路径，
 * 本地开发（base 为 /）时原样返回。
 */
export function withBase(path: string): string {
  if (!path.startsWith('/')) return path;
  return BASE + path;
}