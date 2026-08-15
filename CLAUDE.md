# Alexandra Maja — instrucțiuni pentru Claude

> Site personal de brand pentru Alexandra Maja (aromaterapie / plante medicinale / stil de viață natural). Owner-ul **nu scrie cod** — Claude e „creierul", ea editează exclusiv în Keystatic. Interacțiunea e în română. Fii critic ca un cofondator, nu executant.

## Stack

- **Astro 5.x** static site + adapter `@astrojs/cloudflare` (Workers)
- **Keystatic** (git-based CMS) la `/keystatic` — Alexandra publică din browser (login GitHub)
- **Cloudflare Workers Build** — rebuild automat pe push la `main`. $0/lună. Failed build → deploy vechi rămâne live.
- **MailerLite** — newsletter „Scrisori de suflet"
- **Cloudflare Web Analytics** — gratuit, fără cookies (fără GDPR banner)
- Node: `$HOME/.nvm/versions/node/v20.19.5/bin` (NU e în PATH implicit)

## Directoare cheie

```
src/content/biblioteca/*.mdoc    articolele din Bibliotecă
src/content/atelier/*.mdoc       produsele din Atelier
src/content/pages/*.yaml         content editabil din pagini construite
src/pages/                       .astro pages (index, biblioteca, atelier, despre, lucreaza-cu-alexandra)
src/pages/api/subscribe.ts       endpoint MailerLite (SSR pe Worker)
src/components/                  Header, Footer, ArticleCard, AtelierBag, ToteIcon, SproutIcon, GuideDownload, NewsletterSignup, BotanicalDivider, CategoryIcon
src/lib/atelier.ts               WHATSAPP_NUMBER, orderUrl(), availabilityInfo() — sursa unică pentru logica atelierului
src/styles/global.css            design system: culori, fonturi, .btn, .photo-ph, .price-tag, .bag-add
src/content.config.ts            Zod schemas pentru biblioteca + atelier
keystatic.config.ts              editorul (singletons: home, despre, atelierPage; collections: biblioteca, atelier)
email-templates/                 HTML-uri pentru MailerLite (bun-venit.html)
public/images/                   toate fotografiile (Keystatic uploaded)
public/email/                    ornamente botanice pentru email (sprig.png, divider.png)
public/ghiduri/                  PDF-uri lead-magnet
wrangler.jsonc                   config Cloudflare Workers + env vars
astro.config.mjs                 integrations (sitemap, markdoc, keystatic, react, cloudflare)
```

## Brand voice — reguli neschimbabile

Tonul: **calm, Provence, artizanal, feminin discret, nu-vând-soluții-minune**. Alexandra e antiteza „coach-ului de wellness care-ți vinde".

- **Nu**: „SOLD OUT", „stoc epuizat", „grăbește-te", „doar 3 rămase", „ofertă limitată", badge-uri agresive, roșu de urgență.
- **Da**: „loturi mici", „revine în sezon", „așteptăm împreună", „lot mic de vară".
- **Nu** promisiuni medicale. Ex: „Sirop pentru răceli" a fost redenumit „Muguri de brad în miere" (mențiune de sănătate → descriere).
- Prețuri = **hârtiuță kraft** mică (`.price-tag`), nu casă de marcat. Vezi `global.css`.
- Cumpărare = **desagă + WhatsApp**, nu coș/checkout. Săculețul e o metaforă (`AtelierBag.astro`), nu un cart real.
- Produsele epuizate rămân **vizibile** cu indicator blând (nu ascunse) — vezi Atelier > Disponibilitate.

## Content model — Atelier

3 categorii (nu adăuga altele fără să întrebi):
- `Îngrijire & ritualuri`
- `Plante & preparate`
- `Cărți` (secțiune vizuală separată; se ascunde automat când nu-s cărți)

Câmpuri produs (`src/content.config.ts`):
- `title`, `category`, `shortDescription` (obligatorii)
- `images[]` (WebP din Keystatic, deja optimizate ~150-300 KB), `ingredients[]`, `usage`
- `batch` (ex: „Lot mic de vară"), `season`, `price` („40 lei"), `volume` („50 ml" — cu spațiu!)
- `availability`: `available` | `seasonal` | `preparing`
- `returnLabel` + `returnMessage` — pentru sezoniere / în pregătire (opționale, au fallback blând)
- `audience`, `featured`, `order` (numere mici primele), `relatedArticles[]`, `draft`

**Ordonare**: strict prin `order`. `featured` = doar mărire vizuală, NU influențează poziția.

## Content model — Bibliotecă

Categorii fixe: `Plante`, `Aromaterapie`, `Stil de viață`, `Experiențe & Conferințe`, `Jurnal`.

Blocuri Markdoc: `{% ghid pdf="..." title="..." text="..." /%}` — caseta de download PDF cu formular de email (definită în `markdoc.config.mjs`, componenta în `GuideDownload.astro`).

## Design system (`src/styles/global.css`)

**Culori** (variabile CSS):
- Bg: `--bg-page` #f4ede6, `--bg-card` #f6efe9, `--bg-soft` #fbf7f2
- Text: `--text-main` #312d1d, `--text-secondary` #6e6050, `--text-muted` #907458
- Accente: `--accent-lavender` #9a7a84, `--accent-lavender-deep` #7d5f68, `--accent-sage` #aba286, `--accent-sage-dark` #605132, `--accent-terracotta` #c79b77, `--accent-pink` #ccbcc3
- Tinte pastel: `--tint-lavender` #efe7ea, `--tint-sage` #eae7db, `--tint-terracotta` #f2e7db
- Border: `--border-soft` #e7ddd2

**Fonturi**:
- `--font-display` Cormorant Garamond (titluri)
- `--font-body` Lora (text corp)
- `--font-script` The Girl Next Door (accente scrise de mână)

**Iconițe**: SVG custom în `src/components/*Icon.astro`, monocrome cu `currentColor`. Fără biblioteci externe (Lucide etc.).

**Placeholder foto**: `.photo-ph` cu `data-note="..."`. Face casetă crem cu notă scrisă de mână despre ce foto să pui. **Trebuie condiționat** — să apară doar când NU e imagine, altfel se suprapune peste poză.

## Atelier — sistem disponibilitate

Logica e într-un singur loc: `availabilityInfo(d)` din `src/lib/atelier.ts`. Ambele pagini (listare + detaliu) o folosesc — nu duplica.

- **available**: se afișează normal, buton „Pune în desagă"
- **seasonal** / **preparing**: 
  - Fotografia rămâne colorată (NU gri)
  - Etichetă mică pe fotografie (stânga-jos): `.piece-return` cu frunzuliță salvie + `returnLabel`
  - Pe pagina detaliu: bloc calm lavandă cu label + `returnMessage` + buton „Așteptăm împreună" (pilulă lavandă, `SproutIcon`)
  - Butonul „Pune în desagă" dispare

## Workflow git — CRITIC

**Alexandra editează în paralel** în Keystatic. Salvările ei comit direct pe origin/main ca `aromatool <aromatictool@gmail.com>`. Deci:

1. **Înainte de ORICE commit local**: `git fetch origin -q && git merge --ff-only origin/main`
2. Dacă merge-ul eșuează (a editat același fișier): **NU forța**, merge manual. Păstrează ce a scris ea, aplică peste corecturile tale.
3. Dacă i-am corectat un fișier deschis în editorul ei, salvarea ei îl VA revert. Aviz: după corecturi, spune-i „refresh în Keystatic înainte să atingi X".
4. La schimbări de **schema/config** (content.config, keystatic.config): rulează `npm run build` local ÎNAINTE de push. Un config rupt strică deploy-ul.
5. Commit message + `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>`.
6. **NU** comite fără cerere explicită („dai push"). Excepție: task-uri intitulate „schimbă X" — atunci comit + push cu descriere clară.

Conturi git:
- **aromatool** (personal, HTTPS) — folosit pentru acest proiect
- **amaja89** (work, SSH) — NU atinge

## MailerLite & newsletter

- Grup: **„Scrisori de suflet"** (id `193702956451759960`) — versionat în `wrangler.jsonc` `vars.MAILERLITE_GROUP_ID`. **NU** pune plain vars în dashboard-ul Cloudflare, se șterg la deploy. Secretele (`MAILERLITE_API_KEY`, `KEYSTATIC_*`) rămân în dashboard.
- Sign-up: `src/pages/api/subscribe.ts` — POST `/api/subscribe` cu `{email}` → MailerLite API + adaugă în grup.
- Bun-venit automat: MailerLite Automation → trigger „joins group Scrisori de suflet" → email `email-templates/bun-venit.html`.
- Formularul de „Anunță-mă când revine" din Atelier duce la `#atelier-newsletter` — același endpoint, același grup.

## Gotchas — atenție la astea!

1. **Nu folosi `const process = [...]`** într-un .astro care importă Keystatic reader. Umbrește global `process.cwd()` → build error „Cannot access 'process' before initialization". Redenumește (ex. `steps`).
2. **Meniul mobil iOS Safari**:
   - Checkbox de toggle NU trebuie `display:none` — ascunde-l vizual (`opacity:0`, absolute, `pointer-events:none`). iOS Safari nu comută label→checkbox display:none.
   - Header-ul NU are `backdrop-filter` pe mobil (< 1080px) — devine containing block pentru drawer-ul `position:fixed` și iOS îl decupează. Vezi `Header.astro`.
3. **Astro scoped CSS**: subcomponentele au propriul scope. Pentru un element din subcomponentă vizat din părinte: `.parent :global(.child)`. Ex: `.wait-btn :global(.sprout-icon)`.
4. **Astro Image nu merge pe adapter Cloudflare** (fără `sharp` la runtime). Toate `<img>` sunt native cu `src` direct.
5. **JPEG optimization**: dacă Alexandra urcă PNG mare (>1MB), optimizează în JPEG:
   ```
   sips -Z 1280 -s format jpeg -s formatOptions 72 in.PNG --out out.jpg
   ```
   Actualizează calea în content .yaml/.mdoc și șterge PNG-ul cu `git rm`.
6. **Pagina /atelier e PUBLICĂ** — nu mai are `noindex`, e în meniu, în sitemap.
7. **Rate limit MailerLite**: 422 = deja abonat (tratat ca succes în subscribe.ts).

## Când începi un task nou

1. `cd /Users/amaja/Projects/alexandramaja` (dacă nu ești deja)
2. `git fetch origin -q && git merge --ff-only origin/main` — prinzi ce a editat Alexandra
3. Pentru schimbări de cod: modifică → `npm run build` local → dacă trece → commit → push
4. Pentru schimbări de conținut: verifică dacă ea nu editează în paralel (sync); dacă lucrează, așteaptă sau întreabă-o
5. Textele mereu în română, cu diacritice complete

## Economisirea de tokeni (foarte important)

Chat-urile lungi ard limita zilnică. Reguli pentru chat-uri viitoare:

- **NU face screenshot** decât dacă e absolut necesar (imaginile = tokeni scumpi). Pentru verificare că merge → `curl -sL | grep`.
- **NU poll-ui build-ul live** după fiecare push. Cloudflare durează 1-2 min oricum; utilizatorul poate verifica.
- **NU citi fișiere întregi** dacă poți `grep` sau `Read` cu `offset`/`limit`.
- **Bulk-uri de schimbări**, nu una câte una. Adună 3-4 modificări similare → o singură rundă build+push.
- **Comit + push în ONE flow**, nu separat. `git add && git commit && git push` deodată.
- La început de chat: NU re-explora structura. Ea e aici, în CLAUDE.md. Sari direct la task.

## Idei/roadmap salvate pentru alte proiecte

Alexandra & Alex au mai multe idei în paralel (bedtime story app, printable family game, service marketplace, Mokki cabin site, School Companion). Vezi memoria (`~/.claude/projects/-Users-amaja/memory/`). Nu confunda contexte — verifică unde ești în filesystem înainte de a acționa.
