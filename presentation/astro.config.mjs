import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  output: 'static',
  base: process.env.PRESENTATION_BASE || '/',
  integrations: [react()],
  devToolbar: { enabled: false },
  server: { host: '0.0.0.0', port: 4173 },
  vite: { server: { allowedHosts: ['terminal.local'], hmr: false } },
});
