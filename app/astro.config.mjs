// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwind from '@astrojs/tailwind';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  site: 'https://mail.fakeact.fun',
  integrations: [react(), tailwind({
    applyBaseStyles: false,
  })],
  adapter: cloudflare()
});