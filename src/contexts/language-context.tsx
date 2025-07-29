

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Languages, getStoredLanguage, setStoredLanguage, translate } from '@/i18n'

interface LanguageContextType {
  language: Languages
  setLanguage: (lang: Languages) => void
  t: (key: string, params?: Record<string, any>) => string
  direction: 'ltr' | 'rtl'
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Languages>('en')
  const [mounted, setMounted] = useState(false)
  const direction = language === 'he' ? 'rtl' : 'ltr'

  // Initialize language after component mounts to avoid hydration issues
  useEffect(() => {
    setMounted(true)
    const storedLanguage = getStoredLanguage()
    setLanguageState(storedLanguage)
    
    // Set initial HTML attributes
    document.documentElement.lang = storedLanguage
    document.documentElement.dir = storedLanguage === 'he' ? 'rtl' : 'ltr'
  }, [])

  const setLanguage = (lang: Languages) => {
    setLanguageState(lang)
    setStoredLanguage(lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr'
  }

  // Update DOM attributes when language changes
  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = language
      document.documentElement.dir = direction
    }
  }, [language, direction, mounted])

  const t = (key: string, params?: Record<string, any>) => {
    return translate(key, language, params)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, direction }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 