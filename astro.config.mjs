// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// Site URL used for SEO, canonical links and sitemap generation.
// Change to https://alexandramaja.com if that becomes the primary domain.
//
// Architecture note (Pasul 2 — deploy):
// The public site is 100% STATIC. Every page and article is prerendered to
// plain HTML and served from Cloudflare Pages' free CDN — no server, no
// adapter, no running cost.
//
// Keystatic (the content editor) and React (which its admin UI needs) are
// loaded ONLY DURING LOCAL DEV (`npm run dev` → /keystatic). They are left
// OUT of the production build on purpose, so `astro build` produces a pure
// static `dist/` that deploys anywhere for free. Alexandra keeps editing on
// this computer; changes go live by pushing to GitHub.
//
// Pasul 3 (later): switch Keystatic to GitHub storage + add an adapter so the
// editor can run on the live site and she can publish straight from a browser.
const isDev = process.argv.includes('dev');

export default defineConfig({
  site: 'https://alexandramaja.ro',
  integrations: [
    markdoc(),
    sitemap(),
    ...(isDev ? [react(), keystatic()] : []),
  ],
});
