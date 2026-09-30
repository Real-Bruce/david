import rss from '@astrojs/rss';
import { getPublishedPosts, getPostHref } from '../lib/posts';
import { siteConfig } from '../site.config';

export async function GET(context) {
  const posts = await getPublishedPosts();

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: getPostHref(post)
    }))
  });
}
