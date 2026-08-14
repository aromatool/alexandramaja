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
      'Stil de viață',
      'Experiențe & Conferințe',
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

// Atelierul Alexandrei — colecția de „lucruri făcute cu mâna" (creme, ceaiuri,
// cărți). Momentan e o FUNDAȚIE: pagina /atelier e ascunsă (noindex, nu în
// meniu/sitemap) și nu vinde nimic. Modelul de date e complet, ca ulterior
// fiecare produs să poată avea poveste, ingrediente, lot, sezon etc. — dar
// aproape totul e opțional, ca prototipul să arate frumos și cu date parțiale.
const atelier = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdoc}', base: './src/content/atelier' }),
  schema: z.object({
    title: z.string(),
    // Maxim 3 categorii — deliberat. „Cărți" e afișată într-o secțiune separată.
    category: z.enum(['Îngrijire & ritualuri', 'Plante & ceaiuri', 'Cărți']),
    // Propoziția scurtă de poveste care apare sub nume în listă.
    shortDescription: z.string(),
    // Galerie foto. Keystatic salvează în public/images/atelier/<slug>/…
    images: z
      .array(
        z.object({
          image: z.string(),
          alt: z.string().optional().nullable(),
        })
      )
      .optional()
      .default([]),
    ingredients: z.array(z.string()).optional().default([]),
    usage: z.string().optional().nullable(),
    // Elemente de brand „loturi mici" — NU scarcity agresiv.
    batch: z.string().optional().nullable(),       // ex: „Lot mic de vară"
    season: z.string().optional().nullable(),       // ex: „Ediție de toamnă"
    price: z.string().optional().nullable(),        // text liber (fără checkout)
    volume: z.string().optional().nullable(),        // ex: „50 ml" — apare lângă preț
    availability: z
      .enum(['În atelier acum', 'Lot încheiat', 'Revine în sezon', 'În pregătire'])
      .optional()
      .default('În atelier acum'),
    // Pentru cine e (util mai ales la cărți).
    audience: z.string().optional().nullable(),
    featured: z.boolean().optional().default(false),
    // Slug-uri de articole din Bibliotecă, ca produsul să aibă „o lume în jur".
    relatedArticles: z.array(z.string()).optional().default([]),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { biblioteca, atelier };
