# CLAUDE.md — daleel.services Project Context

## What is this?

**daleel.services** is a bilingual (Arabic/English) directory of Saudi government e-services. It provides step-by-step guides, fees, checklists, and troubleshooting for every major government service in Saudi Arabia — targeting Saudi citizens, residents, and the 13M+ expat population.

**Live URL:** https://daleel.services
**GitHub repo:** https://github.com/ealhamed/daleel.services
**Owner:** Ebrahim AlHamed (@ealhamed)

---

## Architecture

```
Google Sheet (2 tabs) → npm run sync → JSON files → Next.js static build → Vercel auto-deploy
```

### Stack
- **Framework:** Next.js 14, TypeScript, static export (`output: 'export'` in next.config.js)
- **Hosting:** Vercel (auto-deploys on push to `main`)
- **Domain:** daleel.services (Namecheap, DNS pointed to Vercel)
- **CMS:** Google Sheets (2 tabs: services + details, published as CSV)
- **Analytics:** Google Analytics GA4 (measurement ID: `G-C8VYCYPLXD`)
- **Search Console:** Verified, sitemap submitted at `/sitemap.xml`
- **Fonts:** IBM Plex Sans Arabic, Outfit, Plus Jakarta Sans
- **Styling:** CSS variables, light mode default with dark mode toggle

### Data flow
1. Ebrahim edits the Google Sheet (add/edit services, fees, steps, etc.)
2. `npm run sync` fetches the published CSV URLs and generates individual JSON files in `src/data/services/`
3. `npm run build` builds the Next.js static site from those JSON files
4. `npm run build:full` does both: sync → build → generate sitemap
5. `git push` triggers Vercel auto-deploy

---

## Current state (as of March 18, 2026)

### Content
- **50 services** across **16 categories**
- **15 dedicated category pages** at `/category/{slug}/`
- **66 total pages** (1 home + 15 categories + 50 services)
- All services have: Arabic title, English title, Arabic description, portal URL, ministry, checks (with EN), fees, steps (with EN), troubleshooting (Arabic only), related services
- Language toggle switches UI between Arabic and English (titles, steps, checks, nav, labels)
- Descriptions, fees, penalties, and troubleshooting are **Arabic only** — English translations for these fields are the biggest content gap

### Features implemented
- Bilingual Arabic/English toggle (persists in localStorage)
- Light/dark mode toggle (light default, persists in localStorage)
- Search with 28 keyword aliases (iqama, absher, kafala, visa, etc.)
- "No results" state for search
- Collapsible categories on homepage (3 preview, "show all" button)
- Interactive checklist per service (persists in localStorage per service)
- In-content step links (STEP_LINKS map for cross-references between services)
- Related services grid at bottom of each service page
- Working breadcrumbs: Home → Category Page → Service
- HowTo JSON-LD schema on every service page
- FAQPage JSON-LD schema on every service page with troubleshooting
- Auto-generated sitemap.xml (66 URLs) with priority weighting
- robots.txt pointing to sitemap
- SVG icons per category (no emoji)
- "With warm regards from ESH" footer

### Infrastructure
- Google Sheets CMS connected and syncing (2 published CSV URLs in `sheets.config.json`)
- Google Analytics G-C8VYCYPLXD active in layout.tsx
- Google Search Console verified via DNS TXT record
- Sitemap submitted (66 URLs)
- ~10 URLs manually indexed (day 1 quota), ~40 remaining

---

## File structure

```
daleel/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (GA4 script, ClientShell wrapper)
│   │   ├── globals.css             # All CSS (variables, components, dark mode)
│   │   ├── page.tsx                # Homepage (server component, loads services)
│   │   ├── service/[slug]/page.tsx # Service route (HowTo + FAQ schema, metadata)
│   │   └── category/[slug]/page.tsx # Category route (metadata, service listing)
│   │
│   ├── components/
│   │   ├── ClientShell.tsx         # Wraps everything in LangProvider + nav + footer
│   │   ├── LangContext.tsx         # React Context for AR/EN language state
│   │   ├── LangToggle.tsx          # AR/EN toggle button
│   │   ├── ThemeToggle.tsx         # Light/dark mode toggle
│   │   ├── SearchBar.tsx           # Bilingual search with aliases + no-results state
│   │   ├── HomePage.tsx            # Category grid, collapsible service lists
│   │   ├── ServicePage.tsx         # Checklist, fees, steps, troubles, related
│   │   └── CategoryPage.tsx        # Dedicated category landing page
│   │
│   ├── data/
│   │   └── services/               # Auto-generated JSON (one file per service, DO NOT EDIT)
│   │       ├── renew-iqama.json
│   │       ├── pay-traffic-fines.json
│   │       └── ... (50 files)
│   │
│   └── lib/
│       ├── types.ts                # ServiceData interface
│       ├── services.ts             # JSON file loader (getAllServices, getServiceBySlug, getAllSlugs)
│       ├── categories.ts           # Category slug mapping (Arabic → English URL slugs)
│       └── icons.tsx               # SVG category icons + CATEGORY_EN name mapping
│
├── public/
│   └── robots.txt                  # Points to sitemap
│
├── sheets-export/                  # CSV exports for Google Sheets (generated by export-sheets.js)
│
├── sync-sheets.js                  # Google Sheets → JSON sync script
├── export-sheets.js                # JSON → CSV export for Sheets import
├── generate-sitemap.js             # Post-build sitemap generator
├── sheets.config.json              # Google Sheet published CSV URLs
├── package.json                    # Scripts: dev, build, build:full, sync, export-sheets
├── next.config.js                  # Next.js config (static export)
├── tsconfig.json                   # TypeScript config
└── .gitignore                      # node_modules, .next, out
```

---

## Data schema

### ServiceData interface (src/lib/types.ts)

```typescript
interface ServiceData {
  slug: string              // URL-safe ID: "renew-iqama"
  title_ar: string          // Arabic title
  title_en: string          // English title
  description_ar: string    // Arabic description (NO English equivalent yet)
  portal: string            // Platform name: "أبشر أفراد"
  portal_url: string        // Platform URL
  ministry_ar: string       // Ministry Arabic
  ministry_en: string       // Ministry English
  category_ar: string       // Category Arabic: "خدمات الجوازات"
  category_en: string       // Category English: "Passport Services"
  tags: { text_ar: string; type: 'info' | 'success' | 'warning' }[]
  checks: { text_ar: string; text_en: string }[]
  fees: { label_ar: string; amount: number; unit_ar: string }[]
  penalty_ar?: string       // Optional penalty text (NO English equivalent yet)
  steps: { text_ar: string; text_en: string }[]
  troubles: { question_ar: string; answer_ar: string }[]  // NO English equivalents yet
  related_slugs: string[]
  last_updated: string      // ISO date
}
```

### Google Sheet structure

**Tab 1: "services"** — one row per service (50 rows)
Columns: slug, title_ar, title_en, description_ar, portal, portal_url, ministry_ar, ministry_en, category_ar, category_en, tags, penalty_ar, related_slugs, last_updated

**Tab 2: "details"** — multiple rows per service (654 rows)
Columns: slug, type (check/fee/step/trouble), order, text_ar, text_en, amount, unit_ar

### Google Sheet CSV URLs (in sheets.config.json)
- Services: `https://docs.google.com/spreadsheets/d/e/2PACX-1vRF5Alw7FAArf3aMqqlALsThp8SI1xAUl5ufEM16t-mkVo6MXnBEfpBTZ224ZwyancIVw_sdEAKnDWp/pub?gid=0&single=true&output=csv`
- Details: `https://docs.google.com/spreadsheets/d/e/2PACX-1vRF5Alw7FAArf3aMqqlALsThp8SI1xAUl5ufEM16t-mkVo6MXnBEfpBTZ224ZwyancIVw_sdEAKnDWp/pub?gid=1052692309&single=true&output=csv`

---

## Category slug mapping

| Arabic | English slug | Count |
|---|---|---|
| خدمات الجوازات | passport-services | 7 |
| خدمات المرور | traffic-services | 7 |
| خدمات العمل | labor-services | 5 |
| خدمات تجارية | business-services | 3 |
| خدمات الأحوال المدنية | civil-affairs | 5 |
| خدمات عامة | general-services | 5 |
| خدمات العمالة المنزلية | domestic-workers | 3 |
| خدمات ضريبية | tax-services | 2 |
| خدمات عدلية | justice-services | 2 |
| خدمات التأمينات | insurance-services | 4 |
| خدمات الإسكان | housing-services | 2 |
| خدمات صحية | health-services | 1 |
| خدمات تعليمية | education-services | 1 |
| خدمات التأشيرات | visa-services | 1 |
| خدمات الحج والعمرة | hajj-umrah-services | 1 |
| خدمات مالية | financial-services | 1 |

---

## NPM scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server at localhost:3000 |
| `npm run sync` | Fetch Google Sheet CSVs → generate JSON files |
| `npm run build` | Next.js build + generate sitemap |
| `npm run build:full` | sync + build + sitemap (the full pipeline) |
| `npm run export-sheets` | Export JSON → CSV files for Google Sheets import |

---

## Update workflow

### To add a new service:
1. Add a row in Google Sheet **services** tab
2. Add rows in **details** tab (type = check/fee/step/trouble)
3. Run `npm run build:full`
4. `git add . && git commit -m "Add {service}" && git push`
5. Vercel auto-deploys

### To edit an existing service:
1. Edit in Google Sheet
2. Run `npm run build:full`
3. `git add . && git commit -m "Update {service}" && git push`

### To add a new category:
1. Add the Arabic→English mapping in `src/lib/categories.ts` (CATEGORY_SLUGS)
2. Add the English name in `src/lib/icons.tsx` (CATEGORY_EN)
3. Add an SVG icon in `src/lib/icons.tsx` (CATEGORY_ICONS)
4. Add the slug to `generate-sitemap.js` (CAT_SLUGS)

---

## Design system

### Colors (CSS variables in globals.css)
- Accent: `#008577` (teal)
- Light mode: white background, dark text
- Dark mode: `#0a0f1a` background, triggered by `[data-theme="dark"]`
- Tag types: info (blue), success (green), warning (amber)

### Fonts
- Arabic: IBM Plex Sans Arabic (Google Fonts)
- Headings: Outfit
- Body: Plus Jakarta Sans
- Mono: IBM Plex Mono

### Brand
- No logo mark yet — just "دليل" in text
- Footer: "With warm regards from ESH"

---

## Known issues and gaps

### Critical (should fix soon)
1. **Partial English** — descriptions, fees, penalties, and troubleshooting are Arabic-only. The language toggle works for titles, steps, checks, nav, and labels, but these fields have no English equivalents in the data schema. Need to add: description_en, penalty_en, fee.label_en, fee.unit_en, trouble.question_en, trouble.answer_en
2. **STEP_LINKS map is manual** — only covers 5 services. Should auto-generate from related_slugs
3. **Search only on homepage** — no global search in nav bar

### Medium (improve before scaling)
4. No brand logo/mark
5. No Open Graph images for social sharing
6. No "popular" badge on high-traffic services
7. No print-friendly CSS for service pages
8. No JSON validation script before build
9. Fee verification not done — amounts may be outdated
10. Some troubleshooting sections have only 2-3 items (should be 4+)

### Low (polish)
11. No canonical URLs
12. No hreflang tags for ar/en
13. No 404 custom page
14. No back-to-top floating button (only footer link)
15. Sitemap domain was `daleel.example.com` — updated to `daleel.services` but verify

---

## Revenue model (not yet implemented)

- **Phase 1:** Google AdSense (apply after 2 weeks of traffic)
- **Phase 2:** Affiliate referrals to PRO service companies (خدمات تعقيب)
- **Target:** $3,000-$10,000/mo at 150K-300K monthly sessions within 12 months

---

## SEO status

- Sitemap submitted with 66 URLs
- ~10 pages manually indexed in Search Console (quota: ~15/day)
- HowTo + FAQPage structured data on every service page
- Arabic-first content targeting low-competition queries
- No backlinks yet (brand new domain, registered March 18, 2026)
- Competitors: Sarkosa (blog-style, SEO-padded), my.gov.sa (official but hard to navigate)

---

## Ebrahim's local setup

- **Working directory:** `%USERPROFILE%\Desktop\Github\daleel`
- **Node.js** installed
- **Git** configured with GitHub (ealhamed)
- **Workflow:** Edit Google Sheet → `npm run build:full` → `git add . && git commit -m "msg" && git push` → Vercel auto-deploys
