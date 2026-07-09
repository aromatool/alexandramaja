// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
// import cloudflare from '@astrojs/cloudflare'; // Pasul 2 (deploy) — see note below

// Site URL used for SEO, canonical links and sitemap generation.
// Change to https://alexandramaja.com if that becomes the primary domain.
//
// Architecture note: the public site stays static (every article/page is
// prerendered to plain HTML on the free Cloudflare CDN). Only Keystatic's
// admin routes (/keystatic, /api/keystatic) run on-demand — that's why we
// have an adapter. React is required because Keystatic's editor UI is a React
// app; it is NOT used by the public pages.
export default defineConfig({
  site: 'https://alexandramaja.ro',
  integrations: [markdoc(), react(), keystatic(), sitemap()],
  // adapter: cloudflare(),
});
