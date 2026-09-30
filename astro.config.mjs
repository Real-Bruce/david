import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.com',
  trailingSlash: 'ignore',
  markdown: {
    shikiConfig: {
      theme: 'github-dark'
    }
  }
});
