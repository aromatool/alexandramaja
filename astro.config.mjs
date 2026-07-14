// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

// Site URL used for SEO, canonical links and sitemap generation.
// Change to https://alexandramaja.com if that becomes the primary domain.
//
// Architecture (Pasul 3 — publicare din browser):
// The PUBLIC site stays STATIC — every page/article is prerendered to plain
// HTML and served from Cloudflare's free CDN. The ONLY on-demand route is
// Keystatic's admin API (/api/keystatic/...), which runs inside the Cloudflare
// Worker so Alexandra can log in with GitHub and publish straight from the
// browser. A failed build never takes the site down — Cloudflare keeps the
// last good deploy live.
//
// React powers Keystatic's editor UI. The `react-dom/server.edge` alias below
// is a REQUIRED Cloudflare + React 19 workaround — without it the Worker
// throws "MessageChannel is not defined" at deploy time.
export default defineConfig({
  site: 'https://alexandramaja.ro',
  integrations: [react(), markdoc(), keystatic(), sitemap()],
  adapter: cloudflare(),
  vite: import.meta.env.PROD
    ? { resolve: { alias: { 'react-dom/server': 'react-dom/server.edge' } } }
    : {},
});
