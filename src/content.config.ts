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
    category: z.enum(['Îngrijire & ritualuri', 'Plante & preparate', 'Cărți']),
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
    storage: z.string().optional().nullable(),
    // Elemente de brand „loturi mici" — NU scarcity agresiv.
    batch: z.string().optional().nullable(),       // ex: „Lot mic de vară"
    season: z.string().optional().nullable(),       // ex: „Ediție de toamnă"
    price: z.string().optional().nullable(),        // text liber (fără checkout)
    volume: z.string().optional().nullable(),        // ex: „50 ml" — apare lângă preț
    // Disponibilitate — nu „stoc". Atelierul lucrează cu anotimpuri și loturi
    // mici. `available` = disponibil acum; `seasonal` = lot terminat, revine în
    // sezon; `preparing` = următorul lot în pregătire. Normalizăm și valorile
    // vechi (în română), ca build-ul să nu pice la o salvare rămasă în urmă.
    availability: z
      .string()
      .optional()
      .default('available')
      .transform((v) => {
        if (v === 'seasonal' || v === 'preparing' || v === 'available') return v;
        if (v === 'Revine în sezon' || v === 'Lot încheiat') return 'seasonal';
        if (v === 'În pregătire') return 'preparing';
        return 'available'; // „În atelier acum" + orice altceva
      }),
    // Pentru produsele care revin (seasonal / preparing): un indicator scurt și
    // un mesaj cald. Dacă lipsesc, folosim un text implicit blând.
    returnLabel: z.string().optional().nullable(),   // ex: „Revine odată cu păpădiile"
    returnMessage: z.string().optional().nullable(), // paragraful calm de pe pagina produsului
    // Pentru cine e (util mai ales la cărți).
    audience: z.string().optional().nullable(),
    featured: z.boolean().optional().default(false),
    // Ordinea de afișare (numere mai mici apar primele). Produsele „în prim-plan"
    // urcă oricum înaintea celorlalte.
    order: z.number().optional().nullable(),
    // Slug-uri de articole din Bibliotecă, ca produsul să aibă „o lume în jur".
    relatedArticles: z.array(z.string()).optional().default([]),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { biblioteca, atelier };
