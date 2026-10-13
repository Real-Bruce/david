import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypePangu from './src/lib/rehype-pangu.mjs';

export default defineConfig({
  site: 'https://real-bruce.github.io',
  base: '/david',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  markdown: {
    rehypePlugins: [rehypePangu],
    shikiConfig: {
      theme: 'github-dark'
    }
  }
});