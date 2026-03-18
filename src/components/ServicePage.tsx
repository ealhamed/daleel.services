'use client'

import { useState, useEffect } from 'react'
import { ServiceData } from '@/lib/types'
import { useLang } from './LangContext'
import { getCategorySlug } from '@/lib/categories'

// Escape special regex characters
function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Auto-link related services in step text by matching their title keywords
function buildStepLinks(service: ServiceData, relatedServices: ServiceData[]) {
  return relatedServices
    .filter(r => r.slug !== service.slug)
    .map(r => {
      // Build regex from key words in both titles (escaped for safety)
      const arWords = r.title_ar.split(/\s+/).filter(w => w.length > 3).slice(0, 3).map(escapeRegex)
      const enWords = r.title_en.split(/\s+/).filter(w => w.length > 3).slice(0, 3).map(escapeRegex)
      const patternStr = [...arWords, ...enWords].join('|')
      if (!patternStr) return null
      try {
        return {
          pattern: new RegExp(patternStr, 'i'),
          slug: r.slug,
          label_ar: r.title_ar.split(' عبر')[0],
          label_en: r.title_en.split(' via')[0],
        }
      } catch {
        return null
      }
    })
    .filter(Boolean) as { pattern: RegExp; slug: string; label_ar: string; label_en: string }[]
}

export default function ServicePage({ service, relatedServices }: { service: ServiceData; relatedServices: ServiceData[] }) {
  const { lang } = useLang()
  const [checked, setChecked] = useState<Record<number, boolean>>({})
  const [troubleOpen, setTroubleOpen] = useState(false)

  // Persist checklist in localStorage
  const storageKey = `daleel-check-${service.slug}`

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) setChecked(JSON.parse(saved))
    } catch {}
  }, [storageKey])

  const toggleCheck = (i: number) => {
    setChecked(prev => {
      const next = { ...prev, [i]: !prev[i] }
      localStorage.setItem(storageKey, JSON.stringify(next))
      return next
    })
  }

  const checkedCount = Object.values(checked).filter(Boolean).length
  const allChecked = checkedCount === service.checks.length
  const isEn = lang === 'en'

  // Auto-generated cross-links from related services
  const stepLinks = buildStepLinks(service, relatedServices)

  const getStepLink = (stepText: string): { slug: string; label: string } | null => {
    for (const link of stepLinks) {
      if (link.pattern.test(stepText)) {
        return { slug: link.slug, label: isEn ? link.label_en : link.label_ar }
      }
    }
    return null
  }

  return (
    <article>
      <div className="page-header">
        {/* Breadcrumb — functional links */}
        <nav className="breadcrumb">
          <a href="/">{isEn ? 'Home' : 'الرئيسية'}</a>
          <span className="breadcrumb__sep">/</span>
          <a href={`/category/${getCategorySlug(service.category_ar)}/`}>
            {isEn ? service.category_en : service.category_ar}
          </a>
          <span className="breadcrumb__sep">/</span>
          <span className="breadcrumb__current">
            {isEn ? service.title_en.split(' via')[0] : service.title_ar.split(' عبر')[0]}
          </span>
        </nav>

        <h1 className="page-title">{isEn ? service.title_en : service.title_ar}</h1>
        <p className="page-subtitle">{isEn ? service.title_ar : service.title_en}</p>

        <div className="tags">
          {service.tags.map((tag, i) => (
            <span key={i} className={`tag tag--${tag.type}`}>{tag.text_ar}</span>
          ))}
        </div>
      </div>

      <p className="page-desc">{service.description_ar}</p>

      {/* Checklist — persistent */}
      <div className="section-card">
        <div className="section-card__header">
          <div className="section-card__icon" style={{ background: 'var(--info-bg)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--info-text)" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
          </div>
          <span className="section-card__title">{isEn ? 'Before you start' : 'تأكد قبل البدء'}</span>
          <span className="section-card__badge" style={allChecked ? { color: 'var(--success-text)' } : undefined}>
            {allChecked ? (isEn ? '✓ Ready' : '✓ جاهز') : `${checkedCount} / ${service.checks.length}`}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {service.checks.map((c, i) => (
            <label key={i} className="check-item">
              <input type="checkbox" checked={!!checked[i]} onChange={() => toggleCheck(i)} />
              <div>
                <div className="check-item__ar">{isEn ? c.text_en : c.text_ar}</div>
                <div className="check-item__en">{isEn ? c.text_ar : c.text_en}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Fees */}
      <div className="section-card">
        <div className="section-card__header">
          <div className="section-card__icon" style={{ background: 'var(--accent-light)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          </div>
          <span className="section-card__title">{isEn ? 'Fees' : 'الرسوم'}</span>
        </div>
        <div className="metric-grid" style={{ gridTemplateColumns: `repeat(${Math.min(service.fees.length, 3)}, 1fr)` }}>
          {service.fees.map((fee, i) => (
            <div key={i} className="metric">
              <div className="metric__label">{fee.label_ar}</div>
              <div className="metric__value">
                {fee.amount === 0 ? '' : fee.amount.toLocaleString()} <span className="metric__unit">{fee.unit_ar}</span>
              </div>
            </div>
          ))}
        </div>
        {service.penalty_ar && (
          <div className="penalty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {service.penalty_ar}
          </div>
        )}
      </div>

      {/* Steps — with in-content links */}
      <div className="section-card">
        <div className="section-card__header">
          <div className="section-card__icon" style={{ background: 'var(--accent-light)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
          </div>
          <span className="section-card__title">{isEn ? 'Steps' : 'الخطوات'}</span>
        </div>
        {service.steps.map((step, i) => {
          const link = getStepLink(step.text_ar + ' ' + step.text_en)
          return (
            <div key={i} className="step" style={i < service.steps.length - 1 ? { paddingBottom: '18px' } : undefined}>
              <div className="step__dot">
                <div className="step__number">{i + 1}</div>
                {i < service.steps.length - 1 && <div className="step__line" />}
              </div>
              <div style={{ paddingTop: '3px' }}>
                <div className="step__text-ar">{isEn ? step.text_en : step.text_ar}</div>
                <div className="step__text-en">{isEn ? step.text_ar : step.text_en}</div>
                {link && (
                  <a href={`/service/${link.slug}/`} style={{ fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    {isEn ? `See: ${link.label}` : `انظر: ${link.label}`}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Troubleshooting */}
      {service.troubles.length > 0 && (
        <div className="section-card">
          <div className="collapsible__header" onClick={() => setTroubleOpen(!troubleOpen)}>
            <div className="section-card__icon" style={{ background: 'var(--warning-bg)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--warning-text)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <span className="section-card__title">{isEn ? 'Common problems & solutions' : 'مشاكل شائعة وحلولها'}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`collapsible__arrow ${troubleOpen ? 'collapsible__arrow--open' : ''}`}>
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
          {troubleOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
              {service.troubles.map((t, i) => (
                <div key={i} className="trouble-item">
                  <div className="trouble-item__q">{t.question_ar}</div>
                  <div className="trouble-item__a">{t.answer_ar}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      <a href={service.portal_url} target="_blank" rel="noopener noreferrer" className="cta-button" style={{ marginBottom: '20px' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 15, height: 15 }}>
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
        {isEn ? `Open ${service.portal} and start` : `افتح ${service.portal} وابدأ التنفيذ`}
      </a>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <div className="section-label">{isEn ? 'Related services' : 'خدمات ذات صلة'}</div>
          <div className="related-grid">
            {relatedServices.map(r => (
              <a key={r.slug} href={`/service/${r.slug}/`} className="related-card">
                <div className="related-card__title">{isEn ? r.title_en : r.title_ar}</div>
                <div className="related-card__meta">{isEn ? r.category_en : r.title_en}</div>
              </a>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
