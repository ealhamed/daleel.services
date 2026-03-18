'use client'
import { useState, useRef, useEffect } from 'react'
import { ServiceData } from '@/lib/types'
import { useLang } from './LangContext'

// Common transliterations and aliases expats search for
const ALIASES: Record<string, string[]> = {
  'renew-iqama': ['iqama', 'اقامه', 'iqamah', 'residence', 'resident id', 'resident card'],
  'exit-reentry-visa': ['exit visa', 'reentry', 're-entry', 'travel visa', 'خروج وعودة'],
  'final-exit-visa': ['final exit', 'leave saudi', 'exit permit', 'خروج نهائي'],
  'renew-driving-license': ['driving', 'license', 'licence', 'رخصة', 'رخصه', 'driver'],
  'pay-traffic-fines': ['fine', 'fines', 'traffic', 'مخالفة', 'مخالفات', 'saher', 'ساهر'],
  'vehicle-registration-renewal': ['istimara', 'استمارة', 'استماره', 'car registration', 'vehicle'],
  'vehicle-ownership-transfer': ['sell car', 'buy car', 'car transfer', 'نقل ملكية'],
  'transfer-sponsorship': ['kafala', 'كفالة', 'sponsor', 'transfer', 'نقل كفالة', 'naqal'],
  'renew-work-permit': ['work permit', 'رخصة عمل', 'labor'],
  'absher-account-registration': ['absher', 'ابشر', 'register absher', 'create account'],
  'nafath-setup': ['nafath', 'نفاذ', 'nafaz', 'digital id', 'login'],
  'register-national-address': ['address', 'عنوان', 'national address', 'spl', 'سبل'],
  'renew-saudi-passport': ['passport', 'جواز', 'jawaz'],
  'renew-national-id': ['national id', 'هوية', 'hawiyya', 'id card'],
  'issue-commercial-registration': ['commercial registration', 'سجل تجاري', 'cr', 'business'],
  'family-visit-visa': ['family visa', 'visit visa', 'زيارة', 'ziyara'],
  'musaned-domestic-worker-visa': ['musaned', 'مساند', 'maid', 'driver', 'domestic', 'helper'],
  'gosi-register-employee': ['gosi', 'تأمينات', 'taminat', 'social insurance'],
  'zatca-vat-registration': ['vat', 'ضريبة', 'tax', 'zatca', 'زكاة'],
  'ejar-rental-contract': ['ejar', 'إيجار', 'rent', 'rental', 'lease'],
  'issue-birth-certificate': ['birth', 'مولود', 'baby', 'ميلاد'],
  'marriage-contract-najiz': ['marriage', 'زواج', 'wedding', 'najiz', 'ناجز'],
  'hajj-umrah-permit': ['hajj', 'umrah', 'حج', 'عمرة', 'nusuk', 'نسك'],
  'school-enrollment': ['school', 'مدرسة', 'noor', 'نور', 'enrollment', 'student'],
  'dependents-fee-payment': ['dependent', 'مرافق', 'مرافقين', 'companion fee'],
  'power-of-attorney-najiz': ['power of attorney', 'وكالة', 'wakala', 'najiz'],
  'property-deed-transfer-najiz': ['property', 'عقار', 'deed', 'ifraagh', 'إفراغ', 'real estate'],
  'jadarat-job-search': ['job', 'وظيفة', 'jadarat', 'جدارات', 'taqat', 'employment'],
  'renew-health-insurance': ['insurance', 'تأمين', 'health', 'صحي', 'cchi'],
}

export default function SearchBar({ services }: { services: ServiceData[] }) {
  const { lang } = useLang()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ServiceData[]>([])
  const [open, setOpen] = useState(false)
  const [noResults, setNoResults] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setNoResults(false) }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const search = (q: string) => {
    setQuery(q)
    if (q.length < 2) { setResults([]); setOpen(false); setNoResults(false); return }
    const lower = q.toLowerCase()

    const matched = services.filter(s => {
      // Direct field matches
      if (s.title_ar.includes(q)) return true
      if (s.title_en.toLowerCase().includes(lower)) return true
      if (s.category_ar.includes(q)) return true
      if (s.category_en.toLowerCase().includes(lower)) return true
      if (s.ministry_ar.includes(q)) return true
      if (s.portal.includes(q)) return true
      if (s.description_ar.includes(q)) return true

      // Alias matches
      const aliases = ALIASES[s.slug] || []
      return aliases.some(a => a.toLowerCase().includes(lower) || lower.includes(a.toLowerCase()))
    }).slice(0, 8)

    setResults(matched)
    setOpen(matched.length > 0)
    setNoResults(matched.length === 0)
  }

  return (
    <div className="search-wrap">
      <div className="search-box" ref={ref}>
        <input
          type="text"
          placeholder={lang === 'ar' ? 'ابحث عن خدمة... (مثال: إقامة، رخصة، iqama, visa)' : 'Search for a service... (e.g. iqama, visa, license, absher)'}
          value={query}
          onChange={(e) => search(e.target.value)}
          onFocus={() => { if (results.length > 0) setOpen(true); if (query.length >= 2 && results.length === 0) setNoResults(true) }}
        />
        <div className="search-box__icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        {open && (
          <div className="search-results active">
            {results.map(s => (
              <a key={s.slug} href={`/service/${s.slug}/`} className="search-result" onClick={() => setOpen(false)}>
                <div className="search-result__title">{lang === 'ar' ? s.title_ar : s.title_en}</div>
                <div className="search-result__meta">{lang === 'ar' ? `${s.title_en} • ${s.portal}` : `${s.portal} • ${s.category_en}`}</div>
              </a>
            ))}
          </div>
        )}
        {noResults && !open && (
          <div className="search-results active">
            <div style={{ padding: '14px', textAlign: 'center', color: 'var(--text3)', fontSize: '13px' }}>
              {lang === 'ar' ? `لم يتم العثور على نتائج لـ "${query}"` : `No results found for "${query}"`}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
