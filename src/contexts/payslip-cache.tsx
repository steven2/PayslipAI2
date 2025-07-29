

import { createContext, useContext, useState, ReactNode } from "react"

interface PayslipCacheContextType {
  cachedPayslips: Record<string, any>
  setCachedPayslip: (month: number, year: number, data: any) => void
  getCachedPayslip: (month: number, year: number) => any | null
}

const PayslipCacheContext = createContext<PayslipCacheContextType | undefined>(undefined)

export function PayslipCacheProvider({ children }: { children: ReactNode }) {
  const [cachedPayslips, setCachedPayslips] = useState<Record<string, any>>({})

  const setCachedPayslip = (month: number, year: number, data: any) => {
    const key = `${year}-${month}`
    setCachedPayslips(prev => ({
      ...prev,
      [key]: data
    }))
  }

  const getCachedPayslip = (month: number, year: number) => {
    const key = `${year}-${month}`
    return cachedPayslips[key] || null
  }

  return (
    <PayslipCacheContext.Provider value={{ cachedPayslips, setCachedPayslip, getCachedPayslip }}>
      {children}
    </PayslipCacheContext.Provider>
  )
}

export function usePayslipCache() {
  const context = useContext(PayslipCacheContext)
  if (context === undefined) {
    throw new Error("usePayslipCache must be used within a PayslipCacheProvider")
  }
  return context
} 