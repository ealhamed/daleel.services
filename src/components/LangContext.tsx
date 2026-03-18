'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Lang = 'ar' | 'en'
const LangContext = createContext<{ lang: Lang; toggle: () => void }>({ lang: 'ar', toggle: () => {} })

export function useLang() { return useContext(LangContext) }

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ar')

  useEffect(() => {
    const saved = localStorage.getItem('daleel-lang') as Lang | null
    if (saved === 'en') {
      setLang('en')
      applyLang('en')
    }
  }, [])

  function applyLang(l: Lang) {
    document.documentElement.setAttribute('data-lang', l)
    document.documentElement.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', l)
  }

  function toggle() {
    const next = lang === 'ar' ? 'en' : 'ar'
    setLang(next)
    localStorage.setItem('daleel-lang', next)
    applyLang(next)
  }

  return (
    <LangContext.Provider value={{ lang, toggle }}>
      {children}
    </LangContext.Provider>
  )
}
