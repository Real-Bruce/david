import { getCollection, type CollectionEntry } from 'astro:content';

export type AnyPost =
  | CollectionEntry<'weekly'>
  | CollectionEntry<'blog'>
  | CollectionEntry<'notes'>;

export async function getPublishedPosts(): Promise<AnyPost[]> {
  const [weekly, blog, notes] = await Promise.all([
    getCollection('weekly', ({ data }) => !data.draft),
    getCollection('blog', ({ data }) => !data.draft),
    getCollection('notes', ({ data }) => !data.draft)
  ]);

  return [...weekly, ...blog, ...notes].sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}

export function getPostKind(post: AnyPost): 'weekly' | 'blog' | 'notes' {
  return post.collection as 'weekly' | 'blog' | 'notes';
}

export function getPostHref(post: AnyPost): string {
  const kind = getPostKind(post);
  return `/${kind}/${post.id}/`;
}

export function getPostKindLabel(kind: 'weekly' | 'blog' | 'notes'): string {
  return kind === 'weekly' ? '周刊' : kind === 'blog' ? '博客' : '随笔';
}
