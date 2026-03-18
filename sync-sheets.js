#!/usr/bin/env node
/**
 * Daleel — Google Sheets → JSON sync script
 * 
 * SETUP:
 * 1. Create a Google Sheet with 2 tabs: "services" and "details"
 * 2. File → Share → Publish to web → select each tab → Publish as CSV
 * 3. Copy the CSV URLs into .env (see below)
 * 
 * USAGE:
 *   npm run sync        — fetches sheet data and generates JSON files
 *   npm run build       — syncs then builds the site
 */

const fs = require('fs')
const path = require('path')

// ══════════════════════════════════════════════════════════════
// CONFIG — Replace these with your published Google Sheet CSV URLs
// ══════════════════════════════════════════════════════════════
const CONFIG_PATH = path.join(__dirname, 'sheets.config.json')

let SERVICES_CSV_URL = ''
let DETAILS_CSV_URL = ''

if (fs.existsSync(CONFIG_PATH)) {
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'))
  SERVICES_CSV_URL = config.services_csv_url || ''
  DETAILS_CSV_URL = config.details_csv_url || ''
}

const OUT_DIR = path.join(__dirname, 'src/data/services')

// ══════════════════════════════════════════════════════════════
// CSV PARSER (no dependencies)
// ══════════════════════════════════════════════════════════════
function parseCSV(text) {
  const lines = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === ',' && !inQuotes) {
      lines.push(current)
      current = ''
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && text[i + 1] === '\n') i++
      lines.push(current)
      current = ''
      // Mark row boundary
      lines.push('\n')
    } else {
      current += ch
    }
  }
  if (current) lines.push(current)

  // Split into rows
  const rows = []
  let row = []
  for (const cell of lines) {
    if (cell === '\n') {
      if (row.length > 0) rows.push(row)
      row = []
    } else {
      row.push(cell.trim())
    }
  }
  if (row.length > 0) rows.push(row)

  // Convert to objects using header row
  if (rows.length < 2) return []
  const headers = rows[0]
  return rows.slice(1).map(r => {
    const obj = {}
    headers.forEach((h, i) => { obj[h] = r[i] || '' })
    return obj
  }).filter(obj => Object.values(obj).some(v => v !== ''))
}

// ══════════════════════════════════════════════════════════════
// FETCH + GENERATE
// ══════════════════════════════════════════════════════════════
async function fetchCSV(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`)
  return res.text()
}

function buildServices(servicesRows, detailsRows) {
  const services = []

  for (const row of servicesRows) {
    if (!row.slug) continue

    const slug = row.slug.trim()

    // Parse tags (format: "text|type, text|type")
    const tags = (row.tags || '').split(',').map(t => t.trim()).filter(Boolean).map(t => {
      const [text_ar, type] = t.split('|').map(s => s.trim())
      return { text_ar, type: type || 'info' }
    })

    // Parse related_slugs (comma-separated)
    const related_slugs = (row.related_slugs || '').split(',').map(s => s.trim()).filter(Boolean)

    // Get details for this service
    const myDetails = detailsRows.filter(d => d.slug === slug)

    const checks = myDetails
      .filter(d => d.type === 'check')
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
      .map(d => ({ text_ar: d.text_ar, text_en: d.text_en }))

    const fees = myDetails
      .filter(d => d.type === 'fee')
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
      .map(d => ({ label_ar: d.text_ar, amount: Number(d.amount || 0), unit_ar: d.unit_ar || 'ر.س' }))

    const steps = myDetails
      .filter(d => d.type === 'step')
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
      .map(d => ({ text_ar: d.text_ar, text_en: d.text_en }))

    const troubles = myDetails
      .filter(d => d.type === 'trouble')
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
      .map(d => ({ question_ar: d.text_ar, answer_ar: d.text_en }))

    const service = {
      slug,
      title_ar: row.title_ar || '',
      title_en: row.title_en || '',
      description_ar: row.description_ar || '',
      portal: row.portal || '',
      portal_url: row.portal_url || '',
      ministry_ar: row.ministry_ar || '',
      ministry_en: row.ministry_en || '',
      category_ar: row.category_ar || '',
      category_en: row.category_en || '',
      tags,
      checks,
      fees,
      steps,
      troubles,
      related_slugs,
      last_updated: row.last_updated || new Date().toISOString().split('T')[0],
    }

    if (row.penalty_ar && row.penalty_ar.trim()) {
      service.penalty_ar = row.penalty_ar.trim()
    }

    services.push(service)
  }

  return services
}

async function main() {
  // If no URLs configured, generate from existing JSON (reverse sync for initial setup)
  if (!SERVICES_CSV_URL || !DETAILS_CSV_URL) {
    console.log('╔══════════════════════════════════════════════════════════╗')
    console.log('║  No Google Sheet URLs configured.                       ║')
    console.log('║                                                         ║')
    console.log('║  To set up:                                             ║')
    console.log('║  1. Import the template into Google Sheets              ║')
    console.log('║  2. Publish each tab as CSV                             ║')
    console.log('║  3. Add URLs to sheets.config.json                      ║')
    console.log('║                                                         ║')
    console.log('║  For now, using existing JSON files.                    ║')
    console.log('╚══════════════════════════════════════════════════════════╝')
    console.log('')
    console.log('Run "npm run export-sheets" to generate a CSV template')
    console.log('from your existing JSON files.')
    return
  }

  console.log('Fetching services sheet...')
  const servicesCSV = await fetchCSV(SERVICES_CSV_URL)
  const servicesRows = parseCSV(servicesCSV)
  console.log(`  → ${servicesRows.length} services found`)

  console.log('Fetching details sheet...')
  const detailsCSV = await fetchCSV(DETAILS_CSV_URL)
  const detailsRows = parseCSV(detailsCSV)
  console.log(`  → ${detailsRows.length} detail rows found`)

  const services = buildServices(servicesRows, detailsRows)

  // Clear existing JSON files
  if (fs.existsSync(OUT_DIR)) {
    fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.json')).forEach(f => {
      fs.unlinkSync(path.join(OUT_DIR, f))
    })
  } else {
    fs.mkdirSync(OUT_DIR, { recursive: true })
  }

  // Write new JSON files
  for (const s of services) {
    const filePath = path.join(OUT_DIR, `${s.slug}.json`)
    fs.writeFileSync(filePath, JSON.stringify(s, null, 2), 'utf-8')
  }

  console.log(`\n✓ Generated ${services.length} service JSON files in src/data/services/`)
}

main().catch(err => {
  console.error('Sync failed:', err.message)
  process.exit(1)
})
