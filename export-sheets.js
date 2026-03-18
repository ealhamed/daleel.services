#!/usr/bin/env node
/**
 * Export existing JSON service files to CSV format
 * for importing into Google Sheets.
 *
 * Generates 2 CSV files:
 *   - services.csv (main tab)
 *   - details.csv (checks, fees, steps, troubles)
 */

const fs = require('fs')
const path = require('path')

const SERVICES_DIR = path.join(__dirname, 'src/data/services')
const OUT_DIR = path.join(__dirname, 'sheets-export')

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR)

const files = fs.readdirSync(SERVICES_DIR).filter(f => f.endsWith('.json'))
const services = files.map(f => JSON.parse(fs.readFileSync(path.join(SERVICES_DIR, f), 'utf-8')))

function csvEscape(val) {
  if (val === null || val === undefined) return ''
  const str = String(val)
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"'
  }
  return str
}

function toCSVRow(arr) {
  return arr.map(csvEscape).join(',')
}

// ═══ SERVICES TAB ═══
const servicesHeaders = [
  'slug', 'title_ar', 'title_en', 'description_ar', 'description_en',
  'portal', 'portal_url', 'ministry_ar', 'ministry_en',
  'category_ar', 'category_en', 'tags', 'penalty_ar', 'penalty_en',
  'related_slugs', 'last_updated'
]

const servicesRows = services.map(s => [
  s.slug,
  s.title_ar,
  s.title_en,
  s.description_ar,
  s.description_en || '',
  s.portal,
  s.portal_url,
  s.ministry_ar,
  s.ministry_en,
  s.category_ar,
  s.category_en,
  (s.tags || []).map(t => `${t.text_ar}|${t.type}`).join(', '),
  s.penalty_ar || '',
  s.penalty_en || '',
  (s.related_slugs || []).join(', '),
  s.last_updated
])

const servicesCSV = [toCSVRow(servicesHeaders), ...servicesRows.map(toCSVRow)].join('\n')
fs.writeFileSync(path.join(OUT_DIR, 'services.csv'), '\uFEFF' + servicesCSV, 'utf-8')

// ═══ DETAILS TAB ═══
const detailsHeaders = ['slug', 'type', 'order', 'text_ar', 'text_en', 'amount', 'unit_ar', 'label_en', 'unit_en', 'question_en', 'answer_en']
const detailsRows = []

for (const s of services) {
  // Checks
  ;(s.checks || []).forEach((c, i) => {
    detailsRows.push([s.slug, 'check', i + 1, c.text_ar, c.text_en, '', '', '', '', '', ''])
  })
  // Fees
  ;(s.fees || []).forEach((f, i) => {
    detailsRows.push([s.slug, 'fee', i + 1, f.label_ar, '', f.amount, f.unit_ar, f.label_en || '', f.unit_en || '', '', ''])
  })
  // Steps
  ;(s.steps || []).forEach((st, i) => {
    detailsRows.push([s.slug, 'step', i + 1, st.text_ar, st.text_en, '', '', '', '', '', ''])
  })
  // Troubles
  ;(s.troubles || []).forEach((t, i) => {
    detailsRows.push([s.slug, 'trouble', i + 1, t.question_ar, t.answer_ar, '', '', '', '', t.question_en || '', t.answer_en || ''])
  })
}

const detailsCSV = [toCSVRow(detailsHeaders), ...detailsRows.map(toCSVRow)].join('\n')
fs.writeFileSync(path.join(OUT_DIR, 'details.csv'), '\uFEFF' + detailsCSV, 'utf-8')

console.log(`Exported ${services.length} services to sheets-export/`)
console.log(`  services.csv (${servicesRows.length} rows, ${servicesHeaders.length} columns)`)
console.log(`  details.csv  (${detailsRows.length} rows, ${detailsHeaders.length} columns)`)
console.log('')
console.log('NEXT STEPS:')
console.log('1. Open Google Sheets → File → Import → Upload services.csv')
console.log('   Name this tab "services"')
console.log('2. Add a new sheet tab → File → Import → Upload details.csv')
console.log('   Name this tab "details"')
console.log('3. File → Share → Publish to web')
console.log('   Select "services" tab → Publish as CSV → copy URL')
console.log('   Select "details" tab → Publish as CSV → copy URL')
console.log('4. Update sheets.config.json with the new URLs')
console.log('5. Run: npm run sync')
