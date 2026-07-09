import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// The Biblioteca is the OWNED ASSET of the whole project.
// Content lives as portable Markdown files — never locked into any platform.
// The website is only a "view" on top of this library; it can be rebuilt
// anytime without losing a single word.
const biblioteca = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdoc}', base: './src/content/biblioteca' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    // Grouped around Alexandra's holistic "method" from day one, so the
    // library becomes a knowledge base, not a pile of posts.
    category: z.enum([
      'Plante',
      'Aromaterapie',
      'Ceaiuri',
      'Stil de viață',
      'Familie',
      'Cărți & Conferințe',
      'Jurnal',
    ]),
    readingTime: z.string().optional(),
    // Optional cover photo. Keystatic stores the FULL public path here and puts
    // the file in a per-article subfolder named after the slug, e.g.
    //   image: /images/biblioteca/<slug>/image.jpg
    //   file:  public/images/biblioteca/<slug>/image.jpg
    // So templates use this value directly as an <img src>. If absent, the
    // card/article falls back to the botanical placeholder.
    image: z.string().optional().nullable(),
    imageAlt: z.string().optional().nullable(),
    draft: z.boolean().optional().default(false),
  }),
});

// Downloadable resources shown on "Recomandările mele" — PDFs, guides,
// checklists. Same owned-asset principle: files live under /public, metadata
// lives as portable Markdoc next to them.
const resurse = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdoc}', base: './src/content/resurse' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    emoji: z.string().optional().nullable(),
    // Downloadable file. Like the cover image, Keystatic writes the FULL public
    // path and stores the file in a per-resource subfolder named after the slug:
    //   file:  public/resurse/<slug>/file.pdf
    //   value: /resurse/<slug>/file.pdf
    // Use this value directly as an <a href>.
    file: z.string().optional().nullable(),
    pubDate: z.coerce.date(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { biblioteca, resurse };
