'use client'
import { LangProvider } from './LangContext'
import ThemeToggle from './ThemeToggle'
import LangToggle from './LangToggle'
import NavSearch from './NavSearch'
import BackToTop from './BackToTop'
import { ReactNode } from 'react'
import { useLang } from './LangContext'

function ShellInner({ children }: { children: ReactNode }) {
  const { lang } = useLang()
  const isEn = lang === 'en'

  return (
    <>
      <nav className="nav">
        <div className="nav__inner">
          <a href="/" className="nav__logo">
            دليل
            <span className="nav__logo-sub">
              {isEn ? 'Gov Services' : 'الخدمات الحكومية'}
            </span>
          </a>
          <NavSearch />
          <div className="nav__actions">
            <LangToggle />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="container">
        {children}
      </main>

      <footer className="footer">
        <div className="container">
          <p>{isEn
            ? 'Information sourced from official channels — always verify with the relevant authority'
            : 'المعلومات مستقاة من المصادر الرسمية — لا يُغني عن مراجعة الجهة المختصة'}</p>
          <p>With warm regards from ESH</p>
        </div>
      </footer>

      <BackToTop />
    </>
  )
}

export default function ClientShell({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <ShellInner>{children}</ShellInner>
    </LangProvider>
  )
}
