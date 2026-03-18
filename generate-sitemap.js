const fs = require('fs')
const path = require('path')

const BASE_URL = 'https://daleel.services' // ← REPLACE WITH YOUR DOMAIN
const SERVICES_DIR = path.join(__dirname, 'src/data/services')
const OUT_DIR = path.join(__dirname, 'out')

const files = fs.readdirSync(SERVICES_DIR).filter(f => f.endsWith('.json'))
const services = files.map(f => JSON.parse(fs.readFileSync(path.join(SERVICES_DIR, f), 'utf-8')))

// Category slug mapping
const CAT_SLUGS = {
  'خدمات الجوازات': 'passport-services',
  'خدمات المرور': 'traffic-services',
  'خدمات العمل': 'labor-services',
  'خدمات تجارية': 'business-services',
  'خدمات عامة': 'general-services',
  'خدمات التأمينات': 'insurance-services',
  'خدمات التأشيرات': 'visa-services',
  'خدمات الأحوال المدنية': 'civil-affairs',
  'خدمات العمالة المنزلية': 'domestic-workers',
  'خدمات ضريبية': 'tax-services',
  'خدمات عدلية': 'justice-services',
  'خدمات الإسكان': 'housing-services',
  'خدمات صحية': 'health-services',
  'خدمات تعليمية': 'education-services',
  'خدمات الحج والعمرة': 'hajj-umrah-services',
}

// Collect unique categories
const categories = [...new Set(services.map(s => s.category_ar))].filter(c => CAT_SLUGS[c])

const urls = [
  { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'weekly' },
  ...categories.map(c => ({
    loc: `${BASE_URL}/category/${CAT_SLUGS[c]}/`,
    priority: '0.9',
    changefreq: 'weekly',
  })),
  ...services.map(s => ({
    loc: `${BASE_URL}/service/${s.slug}/`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: s.last_updated,
  }))
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

const outPath = fs.existsSync(OUT_DIR) ? path.join(OUT_DIR, 'sitemap.xml') : path.join(__dirname, 'public', 'sitemap.xml')
fs.writeFileSync(outPath, xml)
console.log(`Sitemap: ${urls.length} URLs (1 home + ${categories.length} categories + ${services.length} services)`)
