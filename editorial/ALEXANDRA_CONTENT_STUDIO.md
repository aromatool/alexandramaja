# Alexandra Content Studio — configurare (fără publicare automată)

## Ce există deja în acest repository
- Site Astro 5 + Keystatic (content git-based) + Cloudflare; `main` declanșează deploy.
- Articole: `src/content/biblioteca/*.mdoc`, schema în `src/content.config.ts`, editorul în `keystatic.config.ts`.
- `src/pages/biblioteca/index.astro` și `src/pages/biblioteca/[...slug].astro` exclud articolele cu `draft: true` din site.
- **Important**: repo-ul este public. `draft: true` nu asigură confidențialitate: orice fișier comis într-un branch public poate fi citit.

## Arhitectura propusă (etapa 1)
1. **Claude Code + skillul** `.claude/skills/alexandra-content-studio/SKILL.md`: cercetare, redactare, verificare.
2. **Spațiu privat separat**, încă neconfigurat, de exemplu un nou repository GitHub **private** numit `aromatool/alexandra-editorial-private`. Acest nume este o propunere, nu un repo existent. Aici se salvează propunerile, ciornele, sursele și feedbackul. NU faceți fork/copie în repo-ul public.
3. **Aprobare de către Alexandra**: citește, editează, aprobă versiunea finală. În prima etapă aprobarea este manuală, într-un canal privat; nu există încă butoane funcționale.
4. **Publicare**: numai după aprobare, se copiază articolul acceptat în colecția Keystatic sau se pregătește un PR separat de publicare, cu confirmare finală înainte de merge. Postările Facebook/Instagram și newsletterele nu se trimit fără un pas separat de aprobare.

## Stările editoriale
`IDEI` → `PROPUS` → `ÎN REVIZIE` → `APROBAT` → `PUBLICAT`.
`RESPINS` poate închide orice propunere. Numai Alexandra poate atribui `APROBAT`. Aprobarea este pentru o versiune identificabilă, nu pentru orice modificare viitoare.

## Structura recomandată în workspace-ul privat
```
content-packs/
  YYYY-MM-DD-slug/
    brief.md            # intenție, audiență, căutări, diferențiator
    research.md         # afirmații, surse, data verificării, limite
    article.md          # ciornă articol
    social.md           # FB + carusel IG + caption
    newsletter.md       # ciornă, nu trimisă
    review.md           # decizii, aprobări, revizii
```
Nu puneți datele abonaților, parole, chei MailerLite, secrete Cloudflare sau materiale personale în repo-uri.

## Inițializare sigură — de făcut de proprietar
1. Configurați și verificați un repository PRIVAT separat, accesibil numai celor implicați; nu folosiți `aromatool/alexandramaja` pentru ciorne.
2. Încercați manual skillul în Claude Code (în proiect): „Folosește alexandra-content-studio și pregătește o cercetare pilot fără să publici”.
3. Validați calitatea surselor și vocea Alexandrei; corectați instrucțiunile dacă e necesar.
4. Doar apoi configurați o **Claude Code Routine** (dacă e disponibilă în cont), cu promptul din `editorial/ROUTINE_PROMPT.md`, pe bază săptămânală. Asigurați accesul rutinei la spațiul privat și la surse, plus verificarea manuală a rezultatelor.
5. Testați o rulare manuală înainte de activarea programării. Dacă rutina nu poate accesa spațiul privat, trebuie să se oprească fără a salva conținut în repo-ul public.

## Calendar pilot recomandat
O rulare/săptămână: 3–5 idei cercetate, un singur articol complet + 1 postare FB + un carusel IG + o schiță MailerLite. Volumul se ajustează după timpul Alexandrei și limitele Claude.

## Condiții de acceptare înainte de automatizare
- [ ] Site-ul public rămâne neschimbat (nicio publicare prin instalarea acestui skill).
- [ ] Testul verifică sursele reale și marchează incertitudinea medicală.
- [ ] O ciornă de test rămâne exclusiv în locația privată.
- [ ] Alexandra poate citi și aproba o versiune identificabilă.
- [ ] Niciun merge/deploy/trimitere social/newsletter fără aprobare.
- [ ] Nu se folosesc date SEO inventate și nu se inventează experiențe personale.

Această etapă **instalează numai instrucțiunile și procesul**, nu pornește un agent recurent, nu creează un repository privat și nu implementează o interfață de aprobare. Acestea sunt etape separate.
