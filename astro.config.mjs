import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import rehypePangu from './src/lib/rehype-pangu.mjs';

export default defineConfig({
  site: 'https://real-bruce.github.io',
  base: '/david',
  trailingSlash: 'ignore',
  integrations: [
    // /weekly/archives/* 只是重定向壳页，且自带 <meta name="robots" content="noindex">，
    // 收进 sitemap 会与 noindex 自相矛盾。
    sitemap({
      filter: (page) => !page.includes('/weekly/archives/')
    })
  ],
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
