import rss from '@astrojs/rss';
import { getPublishedPosts, getPostHref } from '../lib/posts';

export async function GET(context) {
  const posts = await getPublishedPosts();

  return rss({
    title: 'Personal Blog',
    description: '个人博客：周刊、长文与随笔。',
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: getPostHref(post)
    }))
  });
}
