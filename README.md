# دليل — Saudi Government Services Directory

A bilingual (Arabic/English) directory of Saudi government e-services, built with Next.js 14 and powered by Google Sheets as a CMS.

## Architecture

```
Google Sheet (2 tabs) → npm run sync → JSON files → npm run build → static HTML
```

- **Google Sheet** = your CMS (edit services, fees, steps in a spreadsheet)
- **JSON files** = auto-generated from the sheet (never edit by hand)
- **Next.js** = builds static HTML pages from JSON
- **Vercel/GitHub Pages** = free hosting

## Quick start (development)

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build static site + sitemap |
| `npm run build:full` | Sync from Google Sheets → build → sitemap |
| `npm run sync` | Fetch data from Google Sheets → generate JSON |
| `npm run export-sheets` | Export existing JSON → CSV files for Google Sheets import |

## Setting up Google Sheets

### Step 1: Export existing data to CSV

```bash
npm run export-sheets
```

This creates `sheets-export/services.csv` and `sheets-export/details.csv`.

### Step 2: Import into Google Sheets

1. Go to [sheets.google.com](https://sheets.google.com) → create new spreadsheet
2. Name it "Daleel CMS"
3. File → Import → Upload `services.csv` → "Replace current sheet"
4. Rename this tab to **services**
5. Click + to add new tab → File → Import → Upload `details.csv` → "Replace current sheet"
6. Rename this tab to **details**

### Step 3: Publish as CSV

1. File → Share → Publish to web
2. Select **services** tab → format: CSV → Publish → copy the URL
3. Select **details** tab → format: CSV → Publish → copy the URL

### Step 4: Configure sync

Edit `sheets.config.json`:

```json
{
  "services_csv_url": "https://docs.google.com/spreadsheets/d/.../pub?gid=0&single=true&output=csv",
  "details_csv_url": "https://docs.google.com/spreadsheets/d/.../pub?gid=12345&single=true&output=csv"
}
```

### Step 5: Sync and build

```bash
npm run build:full
```

## Sheet structure

### Tab: services (one row per service)

| Column | Description | Example |
|---|---|---|
| slug | URL-safe ID | renew-iqama |
| title_ar | Arabic title | تجديد هوية مقيم عبر أبشر |
| title_en | English title | Renew resident identity via Absher |
| description_ar | Arabic description | تمكّنك هذه الخدمة من... |
| portal | Platform name | أبشر أفراد |
| portal_url | Platform URL | https://www.absher.sa |
| ministry_ar | Ministry (Arabic) | وزارة الداخلية |
| ministry_en | Ministry (English) | Ministry of Interior |
| category_ar | Category (Arabic) | خدمات الجوازات |
| category_en | Category (English) | Passport Services |
| tags | Pipe-delimited | أبشر أفراد\|info, إلكترونية\|success |
| penalty_ar | Penalty text (optional) | غرامة 500 ر.س... |
| related_slugs | Comma-separated slugs | exit-reentry-visa, final-exit-visa |
| last_updated | Date | 2026-03-18 |

### Tab: details (multiple rows per service)

| Column | Description | Used by |
|---|---|---|
| slug | Links to service | All types |
| type | check / fee / step / trouble | All types |
| order | Sort order (1, 2, 3...) | All types |
| text_ar | Arabic text | checks, steps, fee labels, trouble questions |
| text_en | English text / trouble answers | checks, steps, trouble answers |
| amount | Numeric value | fees only |
| unit_ar | Fee unit | fees only (e.g. ر.س / سنة) |

## Adding a new service

1. Add a row in the **services** tab with all fields
2. Add rows in the **details** tab for checks, fees, steps, troubles
3. Run `npm run build:full`

## Project structure

```
daleel/
├── src/
│   ├── app/                    # Next.js pages
│   ├── components/             # React components
│   ├── data/services/          # Auto-generated JSON (don't edit)
│   └── lib/                    # Types, utilities, icons
├── sheets-export/              # CSV exports for Google Sheets
├── sync-sheets.js              # Google Sheets → JSON sync
├── export-sheets.js            # JSON → CSV export
├── generate-sitemap.js         # Post-build sitemap generator
├── sheets.config.json          # Google Sheets URLs
└── public/
    └── robots.txt
```

## Deployment

Push to GitHub → import in Vercel → deploy. Zero config needed.

Replace `daleel.example.com` in `generate-sitemap.js` and `robots.txt` with your real domain.
