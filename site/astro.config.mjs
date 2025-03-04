// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import { fileURLToPath } from 'url';

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: 'standalone'
  }),
  experimental: {
    contentLayer: true
  },
  vite: {
    resolve: {
      alias: {
        '@basics': fileURLToPath(new URL('./src/components/basics', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
        '@utils': fileURLToPath(new URL('./src/utils', import.meta.url))
      }
    }
  }
});