'use client'
import { useLang } from './LangContext'

export default function LangToggle() {
  const { lang, toggle } = useLang()
  return (
    <button className="nav-btn" onClick={toggle} aria-label="Toggle language"
      style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)', width: 'auto', padding: '0 10px' }}>
      {lang === 'ar' ? 'EN' : 'ع'}
    </button>
  )
}
