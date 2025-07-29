

import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Calendar, TrendingDown, TrendingUp, Receipt, Shield } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface PayslipSummaryProps {
  currentDate: { month: number; year: number }
}

export default function PayslipSummary({ currentDate }: PayslipSummaryProps) {
  const { t, direction } = useLanguage()

  const months = [
    t('monthYearPicker.months.january'),
    t('monthYearPicker.months.february'),
    t('monthYearPicker.months.march'),
    t('monthYearPicker.months.april'),
    t('monthYearPicker.months.may'),
    t('monthYearPicker.months.june'),
    t('monthYearPicker.months.july'),
    t('monthYearPicker.months.august'),
    t('monthYearPicker.months.september'),
    t('monthYearPicker.months.october'),
    t('monthYearPicker.months.november'),
    t('monthYearPicker.months.december')
  ]

  // Mock data - in a real app, this would come from an API
  const payslipData = {
    netSalary: 5050,
    payDate: `25th ${months[currentDate.month]} ${currentDate.year}`,
    totalDeductions: 1500,
    grossSalary: 6550,
    taxDeducted: 1500, // This represents total deductions in the original
    socialSecurity: 6550, // This represents gross salary in the original
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {/* Net Salary */}
      <div className="glass-card p-4 text-center hover:scale-105 transition-all duration-300 group">
        <div className="flex items-center justify-center mb-2">
          <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <p className="text-xs text-muted-foreground mb-1 font-medium">{t('payslip.netSalary')}</p>
        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">${payslipData.netSalary.toLocaleString()}.00</p>
      </div>

      {/* Payment Date */}
      <div className="glass-card p-4 text-center hover:scale-105 transition-all duration-300 group">
        <div className="flex items-center justify-center mb-2">
          <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <p className="text-xs text-muted-foreground mb-1 font-medium">{t('payslip.paymentDate')}</p>
        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{payslipData.payDate}</p>
      </div>

      {/* Deductions */}
      <div className="glass-card p-4 text-center hover:scale-105 transition-all duration-300 group">
        <div className="flex items-center justify-center mb-2">
          <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <p className="text-xs text-muted-foreground mb-1 font-medium">{t('payslip.deductions')}</p>
        <p className="text-lg font-bold text-red-600 dark:text-red-400">${payslipData.taxDeducted.toLocaleString()}.00</p>
      </div>

      {/* Gross Salary */}
      <div className="glass-card p-4 text-center hover:scale-105 transition-all duration-300 group">
        <div className="flex items-center justify-center mb-2">
          <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <p className="text-xs text-muted-foreground mb-1 font-medium">{t('payslip.grossSalary')}</p>
        <p className="text-lg font-bold text-green-600 dark:text-green-400">${payslipData.socialSecurity.toLocaleString()}.00</p>
      </div>
    </div>
  )
}
