'use client'
import { LangProvider } from './LangContext'
import ThemeToggle from './ThemeToggle'
import LangToggle from './LangToggle'
import { ReactNode } from 'react'

export default function ClientShell({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <nav className="nav">
        <div className="nav__inner">
          <a href="/" className="nav__logo">
            دليل
            <span className="nav__logo-sub">الخدمات الحكومية</span>
          </a>
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
          <p>المعلومات مستقاة من المصادر الرسمية — لا يُغني عن مراجعة الجهة المختصة</p>
          <p>With warm regards from ESH</p>
        </div>
      </footer>
    </LangProvider>
  )
}
