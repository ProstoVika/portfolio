// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // TODO: replace with the final domain (needed for canonical URLs, sitemap, OG tags)
  site: 'https://vanadium.example',
  integrations: [react()],
});
