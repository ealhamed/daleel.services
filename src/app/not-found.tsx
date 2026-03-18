'use client'
import { useLang } from '@/components/LangContext'

export default function NotFound() {
  const { lang } = useLang()
  const isEn = lang === 'en'

  return (
    <div style={{ paddingTop: '100px', textAlign: 'center', minHeight: '60vh' }}>
      <h1 style={{
        fontFamily: 'var(--font-head)',
        fontSize: '64px',
        fontWeight: 800,
        color: 'var(--accent)',
        marginBottom: '12px',
      }}>
        404
      </h1>
      <p style={{
        fontFamily: 'var(--font-ar)',
        fontSize: '18px',
        color: 'var(--text2)',
        marginBottom: '8px',
      }}>
        {isEn ? 'Page not found' : 'الصفحة غير موجودة'}
      </p>
      <p style={{
        fontFamily: 'var(--font-ar)',
        fontSize: '14px',
        color: 'var(--text3)',
        marginBottom: '28px',
      }}>
        {isEn
          ? 'The page you are looking for does not exist or has been moved.'
          : 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.'}
      </p>
      <a
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '10px 24px',
          background: 'var(--accent)',
          color: '#fff',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-ar)',
          fontSize: '14px',
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'var(--transition)',
        }}
      >
        {isEn ? 'Back to Home' : 'العودة للرئيسية'}
      </a>
    </div>
  )
}
