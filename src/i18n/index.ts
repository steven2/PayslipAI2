// Pure React i18n implementation
import enCommon from '@/assets/locales/en/common.json'
import frCommon from '@/assets/locales/fr/common.json'
import heCommon from '@/assets/locales/he/common.json'

export type Languages = 'en' | 'fr' | 'he'

export interface TranslationResources {
  en: Record<string, any>
  fr: Record<string, any>
  he: Record<string, any>
}

export const resources: TranslationResources = {
  en: enCommon,
  fr: frCommon,
  he: heCommon,
}

// Safe localStorage access that works on both client and server
export const getStoredLanguage = (): Languages => {
  if (typeof window === 'undefined') return 'en'
  try {
    const stored = localStorage.getItem('language') as Languages
    return stored && ['en', 'fr', 'he'].includes(stored) ? stored : 'en'
  } catch {
    return 'en'
  }
}

export const setStoredLanguage = (language: Languages): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('language', language)
  } catch {
    // Silent fail for environments without localStorage
  }
}

// Translation function
export const translate = (
  key: string, 
  language: Languages, 
  params?: Record<string, any>
): string => {
  const keys = key.split('.')
  let value = resources[language]

  for (const k of keys) {
    if (!value || typeof value !== 'object') return key
    value = value[k]
  }

  if (typeof value !== 'string') return key

  // Handle interpolation if params are provided
  if (params) {
    return value.replace(/{([^}]+)}/g, (match, param) => {
      return params[param] !== undefined ? String(params[param]) : match
    })
  }

  return value
} 