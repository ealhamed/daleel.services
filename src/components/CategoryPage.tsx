'use client'
import { ServiceData } from '@/lib/types'
import { useLang } from './LangContext'
import SearchBar from './SearchBar'

export default function CategoryPage({ services, categoryAr, categoryEn, slug }: {
  services: ServiceData[]; categoryAr: string; categoryEn: string; slug: string
}) {
  const { lang } = useLang()
  const isEn = lang === 'en'

  return (
    <div>
      <div className="page-header">
        <nav className="breadcrumb">
          <a href="/">{isEn ? 'Home' : 'الرئيسية'}</a>
          <span className="breadcrumb__sep">/</span>
          <span className="breadcrumb__current">{isEn ? categoryEn : categoryAr}</span>
        </nav>
        <h1 className="page-title">{isEn ? categoryEn : categoryAr}</h1>
        <p className="page-subtitle">{isEn ? categoryAr : categoryEn}</p>
        <p className="page-desc">
          {isEn
            ? `All ${categoryEn.toLowerCase()} available electronically in Saudi Arabia. ${services.length} services with step-by-step guides, fees, and troubleshooting.`
            : `جميع ${categoryAr} المتاحة إلكترونياً في المملكة العربية السعودية. ${services.length} خدمة مع خطوات تفصيلية ورسوم وحلول للمشاكل الشائعة.`}
        </p>
      </div>

      <SearchBar services={services} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {services.map(s => (
          <a key={s.slug} href={`/service/${s.slug}/`} className="card card--link">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div className="service-card__title">{isEn ? s.title_en : s.title_ar}</div>
                <div className="service-card__meta">
                  {isEn ? `${s.ministry_en} • ${s.portal}` : `${s.title_en} • ${s.portal}`}
                </div>
              </div>
              <svg className="service-card__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: isEn ? 'none' : 'scaleX(-1)' }}>
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
