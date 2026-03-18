'use client'
import { useState } from 'react'
import { ServiceData } from '@/lib/types'
import { CATEGORY_ICONS, CATEGORY_EN } from '@/lib/icons'
import { getCategorySlug } from '@/lib/categories'
import SearchBar from '@/components/SearchBar'
import { useLang } from '@/components/LangContext'

const PREVIEW_COUNT = 3

export default function HomePage({ services }: { services: ServiceData[] }) {
  const { lang } = useLang()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const catMap = new Map<string, number>()
  services.forEach(s => catMap.set(s.category_ar, (catMap.get(s.category_ar) || 0) + 1))
  const categories = Array.from(catMap.entries())
  const ministries = new Set(services.map(s => s.ministry_ar))

  const toggleCat = (cat: string) => {
    setExpanded(prev => ({ ...prev, [cat]: !prev[cat] }))
  }

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <h1>{lang === 'ar' ? 'دليل الخدمات الحكومية' : 'Saudi Government Services Guide'}</h1>
        <p>
          {lang === 'ar'
            ? 'خطوات واضحة، رسوم محدّثة، وحلول للمشاكل الشائعة — لكل خدمة حكومية إلكترونية في المملكة'
            : 'Clear steps, updated fees, and troubleshooting — for every government e-service in Saudi Arabia'}
        </p>
      </section>

      <SearchBar services={services} />

      {/* Category grid */}
      <div className="section-label">
        {lang === 'ar' ? 'تصفح حسب التصنيف' : 'Browse by category'}
      </div>
      <div className="cat-grid">
        {categories.map(([cat, count]) => (
          <a key={cat} href={`/category/${getCategorySlug(cat)}/`} className="cat-badge">
            <div className="cat-badge__icon">
              {CATEGORY_ICONS[cat] || (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              )}
            </div>
            <div className="cat-badge__name">{lang === 'ar' ? cat : (CATEGORY_EN[cat] || cat)}</div>
            <div className="cat-badge__count">{count}</div>
          </a>
        ))}
      </div>

      {/* Service list grouped by category — collapsible */}
      {categories.map(([cat]) => {
        const catServices = services.filter(s => s.category_ar === cat)
        const isExpanded = expanded[cat] || false
        const visible = isExpanded ? catServices : catServices.slice(0, PREVIEW_COUNT)
        const hasMore = catServices.length > PREVIEW_COUNT

        return (
          <section key={cat} id={`cat-${cat.replace(/\s/g, '-')}`} style={{ marginBottom: '28px' }}>
            <div className="section-label">
              {lang === 'ar' ? cat : (CATEGORY_EN[cat] || cat)}
              <span style={{ fontSize: '11px', fontWeight: 400, color: 'var(--text3)' }}>
                {lang === 'ar' ? (CATEGORY_EN[cat] || '') : cat} ({catServices.length})
              </span>
            </div>
            {visible.map(s => (
              <a key={s.slug} href={`/service/${s.slug}/`} className="card card--link">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div className="service-card__title">{lang === 'ar' ? s.title_ar : s.title_en}</div>
                    <div className="service-card__meta">
                      {lang === 'ar'
                        ? `${s.title_en} • ${s.portal}`
                        : `${s.ministry_en} • ${s.portal}`}
                    </div>
                  </div>
                  <svg className="service-card__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: lang === 'ar' ? 'scaleX(-1)' : 'none' }}>
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </a>
            ))}
            {hasMore && (
              <button
                onClick={() => toggleCat(cat)}
                style={{
                  width: '100%', padding: '10px', marginTop: '4px',
                  background: 'var(--accent-glow)', border: '1px dashed var(--accent)',
                  borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                  color: 'var(--accent)', fontSize: '13px', fontWeight: 500,
                  fontFamily: 'var(--font-ar)', transition: 'var(--transition)',
                }}
              >
                {isExpanded
                  ? (lang === 'ar' ? 'عرض أقل' : 'Show less')
                  : (lang === 'ar' ? `عرض الكل (${catServices.length})` : `Show all (${catServices.length})`)}
              </button>
            )}
          </section>
        )
      })}

      {/* Back to top */}
      <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
        <a href="#" style={{ fontSize: '13px', color: 'var(--text3)', textDecoration: 'none' }}>
          {lang === 'ar' ? '↑ العودة للأعلى' : '↑ Back to top'}
        </a>
      </div>
    </div>
  )
}
