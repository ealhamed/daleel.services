'use client'
import { useState, useRef, useEffect } from 'react'
import { useLang } from './LangContext'

interface SearchResult {
  slug: string
  title_ar: string
  title_en: string
  portal: string
  category_en: string
}

// Lightweight: loads service index on first focus
let cachedIndex: SearchResult[] | null = null

export default function NavSearch() {
  const { lang } = useLang()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const loadIndex = async () => {
    if (cachedIndex) return cachedIndex
    try {
      const resp = await fetch('/search-index.json')
      cachedIndex = await resp.json()
      return cachedIndex
    } catch {
      return []
    }
  }

  const search = async (q: string) => {
    setQuery(q)
    if (q.length < 2) { setResults([]); setOpen(false); return }

    const index = await loadIndex()
    if (!index) return

    const lower = q.toLowerCase()
    const matched = index.filter((s: SearchResult) =>
      s.title_ar.includes(q) ||
      s.title_en.toLowerCase().includes(lower) ||
      s.portal.includes(q)
    ).slice(0, 6)

    setResults(matched)
    setOpen(matched.length > 0)
  }

  return (
    <div className="nav__search" ref={ref}>
      <input
        type="text"
        placeholder={lang === 'ar' ? 'ابحث عن خدمة...' : 'Search services...'}
        value={query}
        onChange={(e) => search(e.target.value)}
        onFocus={() => { if (results.length > 0) setOpen(true); loadIndex() }}
      />
      <div className="nav__search__icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </div>
      {open && results.length > 0 && (
        <div className="search-results active">
          {results.map(s => (
            <a key={s.slug} href={`/service/${s.slug}/`} className="search-result" onClick={() => setOpen(false)}>
              <div className="search-result__title">{lang === 'ar' ? s.title_ar : s.title_en}</div>
              <div className="search-result__meta">{lang === 'ar' ? s.title_en : s.category_en} • {s.portal}</div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
