import rss from '@astrojs/rss';
import { getPublishedPosts, getPostHref } from '../lib/posts';
import { siteConfig } from '../site.config';
import { withBase } from '../lib/base';

export async function GET(context) {
  const posts = await getPublishedPosts();
  // context.site 只是 astro.config 里的 site，不含 base；
  // 直接当频道链接会指向 real-bruce.github.io/ 而不是 /david/。
  const site = new URL(withBase('/'), context.site ?? siteConfig.url);

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site,
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: getPostHref(post)
    }))
  });
}
