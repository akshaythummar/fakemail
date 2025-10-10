// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwind from '@astrojs/tailwind';

import cloudflare from '@astrojs/cloudflare';

import clerk from '@clerk/astro';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  site: 'https://teraboxplay.info',
  integrations: [react(), tailwind({
    applyBaseStyles: false,
  }), clerk()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
      configPath: 'wrangler.toml'
    }
  }),
  vite: {
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      alias: import.meta.env.PROD ? {
        "react-dom/server": "react-dom/server.edge",
      } : {},
    }
  }
});
