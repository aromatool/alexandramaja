import { config, fields, collection, singleton } from '@keystatic/core';
import { block } from '@keystatic/core/content-components';

// Keystatic = the friendly editor on top of the content library.
// It writes plain Markdoc + images straight back into the repo, so the
// content stays an owned, portable asset (never locked into a platform).
//
// Storage mode is chosen automatically by environment:
//  • LOCAL dev (`npm run dev` → /keystatic): edits files on THIS computer.
//  • PRODUCTION (live site): GitHub mode — Alexandra logs in with GitHub and
//    her changes are committed straight to the repo, which auto-rebuilds the
//    site. This is what makes browser publishing (Pasul 3) work.
export default config({
  storage: import.meta.env.DEV
    ? { kind: 'local' }
    : { kind: 'github', repo: 'aromatool/alexandramaja' },
  ui: {
    brand: { name: 'Alexandra Maja' },
    navigation: {
      Conținut: ['biblioteca', 'atelier'],
      Pagini: ['home', 'despre', 'atelierPage'],
    },
  },
  // --- Pagini editabile (text din paginile „construite") ---
  // Doar TEXTUL e expus aici; designul, grilele și iconițele rămân în cod,
  // ca Alexandra să nu poată strica layout-ul din greșeală.
  singletons: {
    home: singleton({
      label: 'Pagina principală',
      path: 'src/content/pages/home',
      schema: {
        heroTitleLine1: fields.text({
          label: 'Hero — titlu (rândul 1)',
          defaultValue: 'Natură. Echilibru.',
        }),
        heroTitleAccent: fields.text({
          label: 'Hero — titlu accentuat (rândul 2, scris de mână)',
          defaultValue: 'Viață cu sens.',
        }),
        heroSub: fields.text({
          label: 'Hero — subtitlu',
          multiline: true,
        }),
        heroCta: fields.text({
          label: 'Hero — text buton',
          defaultValue: 'Intră în bibliotecă',
        }),
        heroPhoto: fields.image({
          label: 'Hero — poză de fundal (partea dreaptă)',
          directory: 'public/images/home',
          publicPath: '/images/home/',
        }),
        heroQuote: fields.text({
          label: 'Citat (caseta din colțul hero-ului)',
          multiline: true,
        }),
        benefits: fields.array(
          fields.object({
            title: fields.text({ label: 'Titlu' }),
            text: fields.text({ label: 'Text scurt' }),
          }),
          {
            label: 'Beneficii (banda cu iconițe)',
            itemLabel: (p) => p.fields.title.value || 'Beneficiu',
          }
        ),
        aboutTitle: fields.text({
          label: 'Bloc „Despre mine” — titlu',
          defaultValue: 'Despre mine',
        }),
        aboutText: fields.text({
          label: 'Bloc „Despre mine” — paragraf',
          multiline: true,
        }),
        aboutPhoto: fields.image({
          label: 'Bloc „Despre mine” — poză',
          directory: 'public/images/home',
          publicPath: '/images/home/',
        }),
      },
    }),
    despre: singleton({
      label: 'Despre mine (pagina)',
      path: 'src/content/pages/despre',
      schema: {
        heroEyebrow: fields.text({
          label: 'Hero — etichetă',
          defaultValue: 'Despre Alexandra',
        }),
        heroTitle: fields.text({
          label: 'Hero — titlu',
          defaultValue: 'Bună, sunt Alexandra.',
        }),
        heroLead: fields.text({
          label: 'Hero — introducere (textul mare)',
          multiline: true,
        }),
        heroBody: fields.text({
          label: 'Hero — al doilea paragraf',
          multiline: true,
        }),
        heroPhoto: fields.image({
          label: 'Hero — poză portret (arcul din dreapta)',
          directory: 'public/images/despre',
          publicPath: '/images/despre/',
        }),
        story: fields.array(
          fields.object({
            kicker: fields.text({ label: 'Etichetă (deasupra titlului)' }),
            title: fields.text({ label: 'Titlu capitol' }),
            body: fields.text({
              label: 'Text (desparte paragrafele cu un rând gol)',
              multiline: true,
            }),
            photo: fields.image({
              label: 'Poză (opțional)',
              directory: 'public/images/despre',
              publicPath: '/images/despre/',
            }),
            alt: fields.text({ label: 'Descrierea pozei (accesibilitate)' }),
          }),
          {
            label: 'Capitole din poveste',
            itemLabel: (p) => p.fields.title.value || 'Capitol',
          }
        ),
        beliefsEyebrow: fields.text({
          label: 'Principii — etichetă',
          defaultValue: 'În ce cred',
        }),
        beliefsTitle: fields.text({
          label: 'Principii — titlu',
          defaultValue: 'Trei lucruri care nu se schimbă',
        }),
        beliefs: fields.array(
          fields.object({
            title: fields.text({ label: 'Titlu' }),
            text: fields.text({ label: 'Text', multiline: true }),
          }),
          {
            label: 'Principii',
            itemLabel: (p) => p.fields.title.value || 'Principiu',
          }
        ),
      },
    }),
    // --- Atelier (pagina): pozele editabile din pagina /atelier ---
    // Toate „plasturii" foto din pagina /atelier sunt editabili de aici. Dacă
    // un câmp e gol, în pagină rămâne caseta-placeholder cu nota respectivă.
    atelierPage: singleton({
      label: 'Atelier — pagina',
      path: 'src/content/pages/atelier-pagina',
      schema: {
        heroImage: fields.image({
          label: 'Poza mare din capul paginii (hero)',
          description:
            'Fotografie lifestyle: masă de lemn, plante proaspete și uscate, borcane cu macerate, ceramică, lumină caldă. Dacă e goală, se arată caseta-placeholder.',
          directory: 'public/images/atelier-pagina',
          publicPath: '/images/atelier-pagina/',
        }),
        heroImageAlt: fields.text({
          label: 'Descrierea pozei hero (accesibilitate)',
          description: 'Ce se vede în poză, într-o propoziție.',
        }),
        // Pozele pentru secțiunea „De la plantă la produs" (4 etape fixe).
        process: fields.object(
          {
            culeg: fields.object(
              {
                image: fields.image({
                  label: 'Poză',
                  directory: 'public/images/atelier-pagina',
                  publicPath: '/images/atelier-pagina/',
                }),
                alt: fields.text({ label: 'Descriere (accesibilitate)' }),
              },
              { label: '„Culeg" — poză' }
            ),
            pregatesc: fields.object(
              {
                image: fields.image({
                  label: 'Poză',
                  directory: 'public/images/atelier-pagina',
                  publicPath: '/images/atelier-pagina/',
                }),
                alt: fields.text({ label: 'Descriere (accesibilitate)' }),
              },
              { label: '„Pregătesc" — poză' }
            ),
            incerc: fields.object(
              {
                image: fields.image({
                  label: 'Poză',
                  directory: 'public/images/atelier-pagina',
                  publicPath: '/images/atelier-pagina/',
                }),
                alt: fields.text({ label: 'Descriere (accesibilitate)' }),
              },
              { label: '„Încerc" — poză' }
            ),
            creez: fields.object(
              {
                image: fields.image({
                  label: 'Poză',
                  directory: 'public/images/atelier-pagina',
                  publicPath: '/images/atelier-pagina/',
                }),
                alt: fields.text({ label: 'Descriere (accesibilitate)' }),
              },
              { label: '„Creez" — poză' }
            ),
          },
          { label: 'Pozele „De la plantă la produs"' }
        ),
        journalImage: fields.image({
          label: 'Poza „Din caietul meu"',
          description: 'Ex: un borcan de macerat lângă un caiet deschis.',
          directory: 'public/images/atelier-pagina',
          publicPath: '/images/atelier-pagina/',
        }),
        journalImageAlt: fields.text({
          label: 'Descrierea pozei „Din caietul meu"',
        }),
      },
    }),
  },
  collections: {
    // --- Atelierul Alexandrei (lucruri făcute cu mâna) ---
    // FUNDAȚIE pentru viitor. Pagina /atelier e ascunsă deocamdată. Aici e
    // modelul complet de produs; aproape totul e opțional, ca să poți publica
    // și cu date parțiale. Nu e magazin: „price" e text liber, nu există coș.
    atelier: collection({
      label: 'Atelier (produse & cărți)',
      slugField: 'title',
      path: 'src/content/atelier/*',
      format: { contentField: 'story' },
      entryLayout: 'content',
      columns: ['title', 'category'],
      schema: {
        title: fields.slug({
          name: { label: 'Nume' },
          slug: {
            label: 'Adresă (slug)',
            description: 'Se generează din nume. Folosit ulterior în link.',
          },
        }),
        category: fields.select({
          label: 'Categorie',
          options: [
            { label: 'Îngrijire & ritualuri', value: 'Îngrijire & ritualuri' },
            { label: 'Plante & preparate', value: 'Plante & preparate' },
            { label: 'Cărți', value: 'Cărți' },
          ],
          defaultValue: 'Îngrijire & ritualuri',
        }),
        shortDescription: fields.text({
          label: 'Propoziția de poveste (scurtă)',
          description: 'Un rând care apare sub nume în atelier. Cald, personal.',
          multiline: true,
          validation: { isRequired: true },
        }),
        images: fields.array(
          fields.object({
            image: fields.image({
              label: 'Fotografie',
              directory: 'public/images/atelier',
              publicPath: '/images/atelier/',
            }),
            alt: fields.text({ label: 'Descrierea pozei (accesibilitate)' }),
          }),
          {
            label: 'Fotografii',
            itemLabel: (p) => p.fields.alt.value || 'Fotografie',
          }
        ),
        ingredients: fields.array(fields.text({ label: 'Ingredient' }), {
          label: 'Ingrediente (opțional)',
          itemLabel: (p) => p.value || 'Ingredient',
        }),
        usage: fields.text({
          label: 'Cum se folosește (opțional)',
          multiline: true,
        }),
        storage: fields.text({
          label: 'Mod de păstrare (opțional)',
          description: 'ex: „Se păstrează la loc răcoros și ferit de razele soarelui."',
          multiline: true,
        }),
        batch: fields.text({
          label: 'Lot (opțional)',
          description: 'ex: „Lot mic de vară". Fără urgență agresivă.',
        }),
        season: fields.text({
          label: 'Sezon / ediție (opțional)',
          description: 'ex: „Ediție de toamnă".',
        }),
        price: fields.text({
          label: 'Preț (text, opțional)',
          description: 'Momentan doar informativ — nu există cumpărare pe site.',
        }),
        volume: fields.text({
          label: 'Cantitate (opțional)',
          description: 'ex: „50 ml", „100 g". Apare discret lângă preț.',
        }),
        availability: fields.select({
          label: 'Disponibilitate',
          description:
            'Nu „stoc". „Revine în sezon" / „În pregătire" păstrează produsul vizibil, cu un indicator blând.',
          options: [
            { label: 'Disponibil acum', value: 'available' },
            { label: 'Lot terminat — revine în sezon', value: 'seasonal' },
            { label: 'Următorul lot în pregătire', value: 'preparing' },
          ],
          defaultValue: 'available',
        }),
        returnLabel: fields.text({
          label: 'Indicator „revine" (doar dacă nu e disponibil)',
          description:
            'Scurt, editorial. Ex: „Revine odată cu păpădiile", „Revine la primăvară", „Așteptăm următoarea recoltă". Gol = text implicit.',
        }),
        returnMessage: fields.text({
          label: 'Mesaj „revine" (pe pagina produsului)',
          description:
            'Un paragraf cald care explică de ce lipsește acum. Ex: „Lotul din acest an s-a terminat. Următorul îl voi pregăti când pajiștile se vor umple din nou de galben." Gol = text implicit.',
          multiline: true,
        }),
        audience: fields.text({
          label: 'Pentru cine e (opțional)',
          description: 'Util mai ales la cărți. ex: „Pentru cei mici".',
        }),
        featured: fields.checkbox({
          label: 'În prim-plan',
          description: 'Bifat = apare primul și puțin mai mare.',
          defaultValue: false,
        }),
        order: fields.integer({
          label: 'Ordine (opțional)',
          description:
            'Numerele mai mici apar primele (ex. 1, 2, 3). Cele „în prim-plan" urcă oricum înaintea celorlalte. Gol = la urmă, alfabetic.',
        }),
        relatedArticles: fields.array(
          fields.relationship({
            label: 'Articol din Bibliotecă',
            collection: 'biblioteca',
          }),
          {
            label: 'Din caietul meu (articole legate)',
            itemLabel: (p) => p.value || 'Articol',
          }
        ),
        draft: fields.checkbox({
          label: 'Ciornă',
          description: 'Bifat = nu apare în atelier.',
          defaultValue: false,
        }),
        story: fields.markdoc({
          label: 'Poveste lungă (opțional)',
          description: 'Textul de pe viitoarea pagină a produsului. Nu e obligatoriu acum.',
        }),
      },
    }),
    // --- Articolele din Bibliotecă ---
    biblioteca: collection({
      label: 'Biblioteca (articole)',
      slugField: 'title',
      path: 'src/content/biblioteca/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'pubDate'],
      schema: {
        title: fields.slug({
          name: { label: 'Titlu' },
          slug: {
            label: 'Adresă (slug în URL)',
            description: 'Partea din link de după /biblioteca/. Se generează din titlu.',
          },
        }),
        description: fields.text({
          label: 'Descriere scurtă',
          description: 'Apare pe card și în rezultatele Google. O propoziție-două.',
          multiline: true,
          validation: { isRequired: true },
        }),
        pubDate: fields.date({
          label: 'Data publicării',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),
        updatedDate: fields.date({
          label: 'Data actualizării (opțional)',
        }),
        category: fields.select({
          label: 'Categorie',
          options: [
            { label: '🌿 Plante', value: 'Plante' },
            { label: '🌸 Aromaterapie', value: 'Aromaterapie' },
            { label: '🌞 Stil de viață', value: 'Stil de viață' },
            { label: '📚 Experiențe & Conferințe', value: 'Experiențe & Conferințe' },
            { label: '✍️ Jurnal', value: 'Jurnal' },
          ],
          defaultValue: 'Plante',
        }),
        readingTime: fields.text({
          label: 'Timp de citire (opțional)',
          description: 'ex: „5 min”',
        }),
        // Keystatic saves the cover in a per-article subfolder named after the
        // slug and writes the FULL public path into frontmatter, e.g.
        //   file:  public/images/biblioteca/<slug>/image.jpg
        //   value: /images/biblioteca/<slug>/image.jpg
        // Templates read that value directly as an <img src>. The article's
        // slug is appended automatically — do NOT put a {slug} placeholder here.
        image: fields.image({
          label: 'Imagine de copertă',
          directory: 'public/images/biblioteca',
          publicPath: '/images/biblioteca/',
        }),
        imageAlt: fields.text({
          label: 'Descrierea imaginii (pentru accesibilitate)',
        }),
        draft: fields.checkbox({
          label: 'Ciornă',
          description: 'Bifat = nu apare pe site. Debifează când e gata de publicat.',
          defaultValue: false,
        }),
        content: fields.markdoc({
          label: 'Conținut',
          // --- Blocuri de inserat oriunde în text ---
          // Alexandra apasă „+” în editor și inserează „Ghid de descărcat"
          // exact acolo unde vrea în articol (nu doar la final). Pe site,
          // blocul devine caseta cu formular de email + link de descărcare.
          components: {
            ghid: block({
              label: 'Ghid de descărcat (PDF)',
              description:
                'Casetă cu formular de email + link de descărcare. Cititorul lasă emailul, intră în „Scrisori de suflet" și primește pe loc PDF-ul. O poți pune oriunde în articol.',
              schema: {
                pdf: fields.file({
                  label: 'Fișier PDF',
                  description: 'Ghidul pe care îl primește cititorul.',
                  directory: 'public/ghiduri',
                  publicPath: '/ghiduri/',
                  validation: { isRequired: true },
                }),
                title: fields.text({
                  label: 'Titlul casetei (opțional)',
                  description: 'Gol = „Descarcă ghidul gratuit".',
                }),
                text: fields.text({
                  label: 'Textul casetei (opțional)',
                  description: 'Un rând-două de invitație. Gol = text implicit.',
                  multiline: true,
                }),
              },
            }),
          },
        }),
      },
    }),
  },
});
