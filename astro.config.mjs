import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://example.com',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark'
    }
  }
});
