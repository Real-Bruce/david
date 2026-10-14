import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import rehypePangu from './src/lib/rehype-pangu.mjs';

export default defineConfig({
  site: 'https://real-bruce.github.io',
  base: '/david',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  markdown: {
    // Astro 7 起 markdown.rehypePlugins 已弃用，改由 processor 配置
    processor: unified({
      rehypePlugins: [rehypePangu]
    }),
    shikiConfig: {
      theme: 'github-dark'
    }
  }
});
