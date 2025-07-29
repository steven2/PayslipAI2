

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { FileText, DollarSign, Calendar, User, Briefcase } from "lucide-react"
import { usePayslipCache } from "@/contexts/payslip-cache"
import { useLanguage } from "@/contexts/language-context"

interface PayslipViewerProps {
  currentDate: { month: number; year: number }
  zoomLevel: number
}

export default function PayslipViewer({ currentDate, zoomLevel }: PayslipViewerProps) {
  const [loading, setLoading] = useState(true)
  const { getCachedPayslip, setCachedPayslip } = usePayslipCache()
  const [payslipData, setPayslipData] = useState<any>(null)
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

  useEffect(() => {
    const loadPayslip = async () => {
      setLoading(true)
      
      // Check cache first
      const cachedData = getCachedPayslip(currentDate.month, currentDate.year)
      if (cachedData) {
        setPayslipData(cachedData)
        setLoading(false)
        return
      }

      try {
        // Simulate API call - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data with structured payslip information
        const mockData = {
          employeeInfo: {
            name: "John Doe",
            employeeId: "EMP-12345",
            department: "Engineering", 
            position: "Senior Developer"
          },
          paymentInfo: {
            payDate: `25th ${months[currentDate.month]} ${currentDate.year}`,
            paymentMethod: t('payslip.directBankTransfer')
          },
          earnings: {
            basicSalary: 5000.00,
            housingAllowance: 800.00,
            transportAllowance: 300.00,
            overtime: { hours: 10, amount: 450.00 },
            totalEarnings: 6550.00
          },
          deductions: {
            incomeTax: 850.00,
            healthInsurance: 250.00,
            retirementFund: 400.00,
            totalDeductions: 1500.00
          },
          summary: {
            grossSalary: 6550.00,
            totalDeductions: 1500.00,
            netSalary: 5050.00
          }
        }
        
        setPayslipData(mockData)
        setCachedPayslip(currentDate.month, currentDate.year, mockData)
      } catch (error) {
        console.error("Error loading payslip:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPayslip()
  }, [currentDate.month, currentDate.year, getCachedPayslip, setCachedPayslip, months])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 dark:border-purple-400"></div>
      </div>
    )
  }

  return (
    <Card className="w-full h-full overflow-auto shadow-lg dark:shadow-purple-900/10 transition-all duration-300 bg-white dark:bg-gray-800 border-0">
      <div
        className="p-3 md:p-6 bg-white dark:bg-gray-800 transition-colors duration-300"
        style={{
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: "top center",
          minHeight: "150%",
        }}
        dir={direction}
      >
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-8 max-w-3xl mx-auto shadow-md dark:shadow-purple-900/5 bg-white dark:bg-gray-800 transition-all duration-300">
          <div className="text-center mb-8 relative">
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-300 rounded-full flex items-center justify-center shadow-lg">
              <DollarSign className="h-10 w-10 text-white" />
            </div>
            <div className="pt-10">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-300 text-transparent bg-clip-text">
                {t('payslip.corporation')}
              </h2>
              <p className="text-muted-foreground">{t('payslip.statement')}</p>
              <p className="text-muted-foreground font-medium mt-2 flex items-center justify-center">
                <Calendar className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                {months[currentDate.month]} {currentDate.year}
              </p>
            </div>
          </div>

          <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-3">
              <User className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg font-semibold text-foreground">{t('payslip.employeeInfo')}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg transition-colors duration-300">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('payslip.employeeName')}</p>
                <p className="font-medium text-foreground">John Doe</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg transition-colors duration-300">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('payslip.employeeId')}</p>
                <p className="font-medium text-foreground">EMP-12345</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg transition-colors duration-300">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('payslip.department')}</p>
                <p className="font-medium text-foreground">Engineering</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg transition-colors duration-300">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('payslip.position')}</p>
                <p className="font-medium text-foreground">Senior Developer</p>
              </div>
            </div>
          </div>

          <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-3">
              <Briefcase className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg font-semibold text-foreground">{t('payslip.earnings')}</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                <span className="text-foreground">{t('payslip.basicSalary')}</span>
                <span className="font-medium text-foreground">₪{payslipData?.earnings?.basicSalary?.toLocaleString() || '5,000'}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                <span className="text-foreground">{t('payslip.housingAllowance')}</span>
                <span className="font-medium text-foreground">₪{payslipData?.earnings?.housingAllowance?.toLocaleString() || '800'}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                <span className="text-foreground">{t('payslip.transportAllowance')}</span>
                <span className="font-medium text-foreground">₪{payslipData?.earnings?.transportAllowance?.toLocaleString() || '300'}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                <span className="text-foreground">{t('payslip.overtime')} ({payslipData?.earnings?.overtime?.hours || 10} {t('payslip.hours')})</span>
                <span className="font-medium text-foreground">₪{payslipData?.earnings?.overtime?.amount?.toLocaleString() || '450'}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg mt-2">
                <span className="font-semibold text-foreground">{t('payslip.totalEarnings')}</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">₪{payslipData?.earnings?.totalEarnings?.toLocaleString() || '6,550'}</span>
              </div>
            </div>
          </div>

          <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-3">
              <svg
                className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <h3 className="text-lg font-semibold text-foreground">{t('payslip.deductions')}</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                <span className="text-foreground">{t('payslip.incomeTax')}</span>
                <span className="font-medium text-foreground">₪{payslipData?.deductions?.incomeTax?.toLocaleString() || '850'}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                <span className="text-foreground">{t('payslip.healthInsurance')}</span>
                <span className="font-medium text-foreground">₪{payslipData?.deductions?.healthInsurance?.toLocaleString() || '250'}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                <span className="text-foreground">{t('payslip.retirementFund')}</span>
                <span className="font-medium text-foreground">₪{payslipData?.deductions?.retirementFund?.toLocaleString() || '400'}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg mt-2">
                <span className="font-semibold text-foreground">{t('payslip.totalDeductions')}</span>
                <span className="font-semibold text-red-500 dark:text-red-400">₪{payslipData?.deductions?.totalDeductions?.toLocaleString() || '1,500'}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600/10 to-blue-500/10 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-xl shadow-sm transition-all duration-300">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-foreground">{t('payslip.netSalary')}</span>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-300 text-transparent bg-clip-text">
                ₪{payslipData?.summary?.netSalary?.toLocaleString() || '5,050'}
              </span>
            </div>
            <div className="text-sm text-muted-foreground mt-2 space-y-1">
              <p className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                {t('payslip.paymentDate')}: 25th {months[currentDate.month]} {currentDate.year}
              </p>
              <p className="flex items-center">
                <svg
                  className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                {t('payslip.paymentMethod')}: {t('payslip.directBankTransfer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
