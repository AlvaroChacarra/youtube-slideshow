import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  output: 'static',
  // Type checking/builds must not invalidate the live preview's optimized modules.
  cacheDir: process.argv.includes('dev') ? './node_modules/.astro-dev' : './node_modules/.astro',
  base: process.env.PRESENTATION_BASE || '/',
  integrations: [react()],
  devToolbar: { enabled: false },
  server: { host: '0.0.0.0', port: 4173 },
  vite: { server: { allowedHosts: ['terminal.local'], hmr: false } },
});
