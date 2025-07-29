

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  LightbulbIcon, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  InfoIcon, 
  BarChart3,
  AlertCircle,
  PieChart,
  MinusCircle,
  PlusCircle,
  Bell
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { usePayslipCache } from "@/contexts/payslip-cache"
import { cn } from "@/lib/utils"

interface PayslipInsightsProps {
  currentDate: { month: number; year: number }
}

export default function PayslipInsights({ currentDate }: PayslipInsightsProps) {
  const [loading, setLoading] = useState(true)
  const [insights, setInsights] = useState<any>(null)
  const { getCachedPayslip } = usePayslipCache()
  const { t, direction } = useLanguage()
  
  // Utility function for direction-aware margin
  const getIconMargin = () => {
    return direction === 'rtl' ? 'ml-2' : 'mr-2'
  }
  
  // Utility function for direction-aware spacing
  const getSpacing = () => {
    return direction === 'rtl' ? 'space-x-reverse space-x-3' : 'space-x-3'
  }
  
  // Handle RTL percentage bars
  const getProgressStyle = (percentage: string) => {
    if (direction === 'rtl') {
      return { 
        width: percentage,
        marginLeft: 'auto', 
        marginRight: '0'
      }
    }
    return { width: percentage }
  }

  useEffect(() => {
    const generateInsights = async () => {
      setLoading(true)
      
      // Get current payslip data
      const currentPayslip = getCachedPayslip(currentDate.month, currentDate.year)
      
      // Get previous month's payslip (for comparison)
      const prevMonth = currentDate.month === 0 ? 11 : currentDate.month - 1
      const prevYear = currentDate.month === 0 ? currentDate.year - 1 : currentDate.year
      const prevPayslip = getCachedPayslip(prevMonth, prevYear)
      
      try {
        // Simulate AI analysis - in a real app, you'd call an API endpoint
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Generate insights (same as before but will be organized into tabs)
        let insightData = {
          // Overview insights
          salaryChange: null as any,
          taxInsight: null as any,
          savingOpportunity: null as any,
          
          // Deductions insights
          retirementContribution: null as any,
          taxBreakdown: null as any,
          healthInsuranceInfo: null as any,
          
          // Earnings insights
          overtimeDetails: null as any,
          allowanceDetails: null as any,
          
          // Alerts
          unusualItems: null as any,
          taxBracketChange: null as any
        }
        
        // Populate the insight data with the same logic as before
        if (prevPayslip && currentPayslip) {
          const currentNet = currentPayslip.summary.netSalary
          const prevNet = prevPayslip.summary.netSalary
          const difference = currentNet - prevNet
          const percentChange = ((difference / prevNet) * 100).toFixed(1)
          
          insightData.salaryChange = {
            type: difference > 0 ? 'increase' : difference < 0 ? 'decrease' : 'unchanged',
            percentChange: percentChange,
            amountChange: Math.abs(difference).toFixed(2),
            reason: difference > 0 
              ? "Increase due to overtime hours"
              : difference < 0 
              ? "Decrease due to higher tax deductions"
              : "No change from previous month"
          }
        }
        
        // Tax insight
        if (currentPayslip) {
          const taxRate = (currentPayslip.deductions.incomeTax / currentPayslip.earnings.totalEarnings) * 100
          insightData.taxInsight = {
            currentRate: taxRate.toFixed(1),
            comparisonToAverage: taxRate > 15 ? 'higher' : 'lower',
            tip: taxRate > 15 
              ? "Consider maximizing your retirement contributions to reduce taxable income"
              : "Your tax rate is optimized compared to industry average",
            amount: currentPayslip.deductions.incomeTax.toFixed(2)
          }
          
          // Tax breakdown (for Deductions tab)
          insightData.taxBreakdown = {
            federalTax: (currentPayslip.deductions.incomeTax * 0.6).toFixed(2),
            stateTax: (currentPayslip.deductions.incomeTax * 0.3).toFixed(2),
            localTax: (currentPayslip.deductions.incomeTax * 0.1).toFixed(2),
            effectiveRate: taxRate.toFixed(1)
          }
        }
        
        // Saving opportunity (for Overview tab)
        if (currentPayslip) {
          const recommendedSavingRate = 0.2 // 20% of net income
          const recommendedAmount = (currentPayslip.summary.netSalary * recommendedSavingRate).toFixed(2)
          
          insightData.savingOpportunity = {
            recommendedAmount: recommendedAmount,
            savingGoal: "Emergency fund (3-6 months of expenses)",
            tip: "Setting up automatic transfers on payday can help build savings consistently"
          }
        }
        
        // Retirement contribution (for Deductions tab)
        if (currentPayslip) {
          const currentContribution = currentPayslip.deductions.retirementFund
          const maxRecommended = (currentPayslip.earnings.totalEarnings * 0.15).toFixed(2) // 15% of gross
          const isOptimal = currentContribution >= parseFloat(maxRecommended)
          
          insightData.retirementContribution = {
            currentAmount: currentContribution.toFixed(2),
            recommendedAmount: maxRecommended,
            isOptimal: isOptimal,
            potentialTaxSaving: isOptimal ? 0 : ((parseFloat(maxRecommended) - currentContribution) * 0.25).toFixed(2),
            percentOfSalary: ((currentContribution / currentPayslip.earnings.totalEarnings) * 100).toFixed(1)
          }
        }
        
        // Health insurance info (for Deductions tab)
        if (currentPayslip) {
          insightData.healthInsuranceInfo = {
            premium: currentPayslip.deductions.healthInsurance.toFixed(2),
            coverageType: "Family",
            employerContribution: (currentPayslip.deductions.healthInsurance * 1.5).toFixed(2),
            totalCoverage: (currentPayslip.deductions.healthInsurance * 2.5).toFixed(2)
          }
        }
        
        // Overtime details (for Earnings tab)
        if (currentPayslip?.earnings?.overtime) {
          insightData.overtimeDetails = {
            hours: currentPayslip.earnings.overtime.hours,
            amount: currentPayslip.earnings.overtime.amount.toFixed(2),
            rate: (currentPayslip.earnings.overtime.amount / currentPayslip.earnings.overtime.hours).toFixed(2),
            percentOfTotal: ((currentPayslip.earnings.overtime.amount / currentPayslip.earnings.totalEarnings) * 100).toFixed(1)
          }
        }
        
        // Allowance details (for Earnings tab)
        if (currentPayslip) {
          insightData.allowanceDetails = {
            housing: {
              amount: currentPayslip.earnings.housingAllowance.toFixed(2),
              percentOfTotal: ((currentPayslip.earnings.housingAllowance / currentPayslip.earnings.totalEarnings) * 100).toFixed(1)
            },
            transport: {
              amount: currentPayslip.earnings.transportAllowance.toFixed(2),
              percentOfTotal: ((currentPayslip.earnings.transportAllowance / currentPayslip.earnings.totalEarnings) * 100).toFixed(1)
            }
          }
        }
        
        // Unusual items (for Alerts tab)
        insightData.unusualItems = {
          found: currentPayslip?.earnings?.overtime?.hours > 0,
          items: currentPayslip?.earnings?.overtime?.hours > 0 
            ? [{
                label: "Overtime hours",
                amount: currentPayslip.earnings.overtime.amount.toFixed(2),
                hours: currentPayslip.earnings.overtime.hours,
                impact: "positive"
              }] 
            : []
        }
        
        // Tax bracket change (for Alerts tab)
        if (prevPayslip && currentPayslip) {
          const prevTaxRate = (prevPayslip.deductions.incomeTax / prevPayslip.earnings.totalEarnings) * 100
          const currentTaxRate = (currentPayslip.deductions.incomeTax / currentPayslip.earnings.totalEarnings) * 100
          
          insightData.taxBracketChange = {
            changed: Math.abs(currentTaxRate - prevTaxRate) > 2,
            previousRate: prevTaxRate.toFixed(1),
            currentRate: currentTaxRate.toFixed(1),
            impact: currentTaxRate > prevTaxRate ? "negative" : "positive"
          }
        }
        
        setInsights(insightData)
      } catch (error) {
        console.error("Error generating insights:", error)
      } finally {
        setLoading(false)
      }
    }
    
    generateInsights()
  }, [currentDate, getCachedPayslip])
  
  if (loading) {
    return (
      <Card className="w-full border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center text-purple-700 dark:text-purple-400">
            <LightbulbIcon className={cn("h-4 w-4", getIconMargin())} />
            {t('insights.title') || "AI Insights"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 dark:border-purple-400"></div>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="w-full border-0 shadow-md bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20" dir={direction}>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center text-purple-700 dark:text-purple-400">
          <LightbulbIcon className={cn("h-4 w-4", getIconMargin())} />
          {t('insights.title') || "AI Insights"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <Tabs defaultValue="overview" className="w-full" dir={direction}>
          <TabsList className={`grid grid-cols-4 mb-4 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <TabsTrigger value="overview" className="flex items-center">
              <PieChart className={cn("h-3.5 w-3.5", direction === 'rtl' ? 'ml-1.5' : 'mr-1.5')} />
              <span>{t('insights.tabs.overview') || "Overview"}</span>
            </TabsTrigger>
            <TabsTrigger value="deductions" className="flex items-center">
              <MinusCircle className={cn("h-3.5 w-3.5", direction === 'rtl' ? 'ml-1.5' : 'mr-1.5')} />
              <span>{t('insights.tabs.deductions') || "Deductions"}</span>
            </TabsTrigger>
            <TabsTrigger value="earnings" className="flex items-center">
              <PlusCircle className={cn("h-3.5 w-3.5", direction === 'rtl' ? 'ml-1.5' : 'mr-1.5')} />
              <span>{t('insights.tabs.earnings') || "Earnings"}</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center">
              <Bell className={cn("h-3.5 w-3.5", direction === 'rtl' ? 'ml-1.5' : 'mr-1.5')} />
              <span>{t('insights.tabs.alerts') || "Alerts"}</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-3">
            {/* Salary Change */}
            {insights?.salaryChange && (
              <div className={cn("flex items-start p-2 rounded-lg glass-subtle hover:glass-card transition-colors duration-200", getSpacing())}>
                {insights.salaryChange.type === 'increase' ? (
                  <ArrowUpCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                ) : insights.salaryChange.type === 'decrease' ? (
                  <ArrowDownCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <InfoIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    {insights.salaryChange.type === 'increase'
                      ? t('insights.salaryIncrease') || "Salary Increase"
                      : insights.salaryChange.type === 'decrease'
                      ? t('insights.salaryDecrease') || "Salary Decrease"
                      : t('insights.salaryUnchanged') || "Salary Unchanged"}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {insights.salaryChange.type !== 'unchanged'
                      ? t('insights.changeFromLastMonth', {
                          percent: insights.salaryChange.percentChange,
                          amount: insights.salaryChange.amountChange
                        }) || 
                        `${insights.salaryChange.percentChange}% (${insights.salaryChange.amountChange}) from last month due to ${insights.salaryChange.reason}.`
                      : t('insights.noChange') || "No change from previous month."}
                  </p>
                </div>
              </div>
            )}
            
            {/* Tax Insight */}
            {insights?.taxInsight && (
              <div className={cn("flex items-start p-2 rounded-lg glass-subtle hover:glass-card transition-colors duration-200", getSpacing())}>
                <BarChart3 className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    {t('insights.taxOptimization') || "Tax Optimization"}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {t('insights.currentTaxRate', { rate: insights.taxInsight.currentRate }) || 
                    `Current tax rate is ${insights.taxInsight.currentRate}% (${insights.taxInsight.comparisonToAverage} than average). ${insights.taxInsight.tip}.`}
                  </p>
                </div>
              </div>
            )}
            
            {/* Saving Opportunity */}
            {insights?.savingOpportunity && (
              <div className={cn("flex items-start p-2 rounded-lg glass-subtle hover:glass-card transition-colors duration-200", getSpacing())}>
                <InfoIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    {t('insights.savingOpportunity') || "Saving Opportunity"}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {t('insights.savingRecommendation', { 
                      amount: insights.savingOpportunity.recommendedAmount,
                      goal: insights.savingOpportunity.savingGoal
                    }) || 
                    `Consider saving $${insights.savingOpportunity.recommendedAmount} toward ${insights.savingOpportunity.savingGoal}. ${insights.savingOpportunity.tip}.`}
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Deductions Tab */}
          <TabsContent value="deductions" className="space-y-3">
            {/* Tax Breakdown */}
            {insights?.taxBreakdown && (
              <div className={cn("flex items-start p-2 rounded-lg glass-subtle hover:glass-card transition-colors duration-200", getSpacing())}>
                <BarChart3 className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <div className="w-full">
                  <h4 className="text-sm font-medium text-foreground">
                    {t('insights.deductions.taxBreakdown') || "Tax Breakdown"}
                  </h4>
                  <div className="mt-1 space-y-1 w-full">
                    <div className="w-full">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {t('insights.deductions.federalTax', { amount: insights.taxBreakdown.federalTax }) || 
                           `Federal Tax: $${insights.taxBreakdown.federalTax}`}
                        </span>
                        <span className="text-foreground">60%</span>
                      </div>
                      <div className="w-full bg-muted/30 dark:bg-muted/20 h-1.5 rounded-full mt-1">
                        <div className="bg-purple-500 dark:bg-purple-400 h-1.5 rounded-full" style={getProgressStyle('60%')}></div>
                      </div>
                    </div>
                    
                    <div className="w-full">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {t('insights.deductions.stateTax', { amount: insights.taxBreakdown.stateTax }) || 
                           `State Tax: $${insights.taxBreakdown.stateTax}`}
                        </span>
                        <span className="text-foreground">30%</span>
                      </div>
                      <div className="w-full bg-muted/30 dark:bg-muted/20 h-1.5 rounded-full mt-1">
                        <div className="bg-blue-500 dark:bg-blue-400 h-1.5 rounded-full" style={getProgressStyle('30%')}></div>
                      </div>
                    </div>
                    
                    <div className="w-full">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {t('insights.deductions.localTax', { amount: insights.taxBreakdown.localTax }) || 
                           `Local Tax: $${insights.taxBreakdown.localTax}`}
                        </span>
                        <span className="text-foreground">10%</span>
                      </div>
                      <div className="w-full bg-muted/30 dark:bg-muted/20 h-1.5 rounded-full mt-1">
                        <div className="bg-green-500 dark:bg-green-400 h-1.5 rounded-full" style={getProgressStyle('10%')}></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {t('insights.deductions.effectiveRate', { rate: insights.taxBreakdown.effectiveRate }) || 
                     `Effective Rate: ${insights.taxBreakdown.effectiveRate}%`}
                  </p>
                </div>
              </div>
            )}
            
            {/* Retirement Contribution */}
            {insights?.retirementContribution && (
              <div className={cn("flex items-start p-2 rounded-lg glass-subtle hover:glass-card transition-colors duration-200", getSpacing())}>
                <InfoIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="w-full">
                  <h4 className="text-sm font-medium text-foreground">
                    {t('insights.deductions.retirement') || "Retirement Contribution"}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('insights.deductions.currentContribution', { 
                      amount: insights.retirementContribution.currentAmount,
                      percent: insights.retirementContribution.percentOfSalary
                    }) || 
                     `Current: $${insights.retirementContribution.currentAmount} (${insights.retirementContribution.percentOfSalary}% of salary)`}
                  </p>
                  
                  <div className="w-full mt-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {direction === 'rtl' ? t('current') || "נוכחי" : "Current"}
                      </span>
                      <span className="text-muted-foreground">
                        {direction === 'rtl' ? t('recommended') || "מומלץ" : "Recommended"}
                      </span>
                    </div>
                    <div className="relative w-full bg-muted/30 dark:bg-muted/20 h-2 rounded-full mt-1">
                      <div 
                        className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full" 
                        style={getProgressStyle(`${Math.min(
                          (parseFloat(insights.retirementContribution.currentAmount) / 
                          parseFloat(insights.retirementContribution.recommendedAmount)) * 100, 
                          100
                        )}%`)}
                      ></div>
                      {!insights.retirementContribution.isOptimal && (
                        <div 
                          className="absolute right-0 top-0 h-full w-1 bg-red-500 dark:bg-red-400 rounded-full"
                          style={{ 
                            [direction === 'rtl' ? 'left' : 'right']: `${Math.max(
                              100 - (parseFloat(insights.retirementContribution.recommendedAmount) / 
                              parseFloat(insights.retirementContribution.currentAmount) * 100), 
                              0
                            )}%` 
                          }}
                        ></div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    {t('insights.deductions.recommendedContribution', { 
                      amount: insights.retirementContribution.recommendedAmount 
                    }) || 
                     `Recommended: $${insights.retirementContribution.recommendedAmount}`}
                  </p>
                  
                  {!insights.retirementContribution.isOptimal && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      {t('insights.deductions.potentialSaving', { 
                        amount: insights.retirementContribution.potentialTaxSaving 
                      }) || 
                       `Potential Tax Saving: $${insights.retirementContribution.potentialTaxSaving}`}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {/* Health Insurance */}
            {insights?.healthInsuranceInfo && (
              <div className={cn("flex items-start p-2 rounded-lg glass-subtle hover:glass-card transition-colors duration-200", getSpacing())}>
                <InfoIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    {t('insights.deductions.healthInsurance') || "Health Insurance"}
                  </h4>
                  <div className="mt-1 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      {t('insights.deductions.premium', { 
                        amount: insights.healthInsuranceInfo.premium 
                      }) || 
                       `Your Premium: $${insights.healthInsuranceInfo.premium}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('insights.deductions.coverageType', { 
                        type: insights.healthInsuranceInfo.coverageType 
                      }) || 
                       `Coverage Type: ${insights.healthInsuranceInfo.coverageType}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('insights.deductions.employerContribution', { 
                        amount: insights.healthInsuranceInfo.employerContribution 
                      }) || 
                       `Employer Contribution: $${insights.healthInsuranceInfo.employerContribution}`}
                    </p>
                    <p className="text-xs font-medium text-foreground">
                      {t('insights.deductions.totalCoverage', { 
                        amount: insights.healthInsuranceInfo.totalCoverage 
                      }) || 
                       `Total Coverage Value: $${insights.healthInsuranceInfo.totalCoverage}`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="earnings" className="space-y-3">
            {/* Overtime Details */}
            {insights?.overtimeDetails && (
              <div className={cn("flex items-start p-2 rounded-lg glass-subtle hover:glass-card transition-colors duration-200", getSpacing())}>
                <PlusCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="w-full">
                  <h4 className="text-sm font-medium text-foreground">
                    {t('insights.earnings.overtime') || "Overtime Details"}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('insights.earnings.overtimeHours', { 
                      hours: insights.overtimeDetails.hours,
                      rate: insights.overtimeDetails.rate
                    }) || 
                     `${insights.overtimeDetails.hours} hours at $${insights.overtimeDetails.rate}/hour`}
                  </p>
                  
                  <div className="mt-2 w-full">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Overtime</span>
                      <span className="text-foreground">${insights.overtimeDetails.amount}</span>
                    </div>
                    <div className="w-full bg-muted/30 dark:bg-muted/20 h-2 rounded-full mt-1">
                      <div 
                        className="bg-green-500 dark:bg-green-400 h-2 rounded-full" 
                        style={getProgressStyle(`${insights.overtimeDetails.percentOfTotal}%`)}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('insights.earnings.overtimeTotal', { 
                        amount: insights.overtimeDetails.amount,
                        percent: insights.overtimeDetails.percentOfTotal
                      }) || 
                       `Total: $${insights.overtimeDetails.amount} (${insights.overtimeDetails.percentOfTotal}% of earnings)`}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Allowances Breakdown */}
            {insights?.allowanceDetails && (
              <div className={cn("flex items-start p-2 rounded-lg glass-subtle hover:glass-card transition-colors duration-200", getSpacing())}>
                <BarChart3 className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="w-full">
                  <h4 className="text-sm font-medium text-foreground">
                    {t('insights.earnings.allowances') || "Allowances Breakdown"}
                  </h4>
                  
                  <div className="mt-2 space-y-3">
                    {/* Housing Allowance */}
                    <div className="w-full">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Housing</span>
                        <span className="text-foreground">
                          {t('insights.earnings.housingAllowance', { 
                            amount: insights.allowanceDetails.housing.amount,
                            percent: insights.allowanceDetails.housing.percentOfTotal
                          }) || 
                           `$${insights.allowanceDetails.housing.amount} (${insights.allowanceDetails.housing.percentOfTotal}%)`}
                        </span>
                      </div>
                      <div className="w-full bg-muted/30 dark:bg-muted/20 h-2 rounded-full mt-1">
                        <div 
                          className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full" 
                          style={getProgressStyle(`${insights.allowanceDetails.housing.percentOfTotal}%`)}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Transport Allowance */}
                    <div className="w-full">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Transport</span>
                        <span className="text-foreground">
                          {t('insights.earnings.transportAllowance', { 
                            amount: insights.allowanceDetails.transport.amount,
                            percent: insights.allowanceDetails.transport.percentOfTotal
                          }) || 
                           `$${insights.allowanceDetails.transport.amount} (${insights.allowanceDetails.transport.percentOfTotal}%)`}
                        </span>
                      </div>
                      <div className="w-full bg-muted/30 dark:bg-muted/20 h-2 rounded-full mt-1">
                        <div 
                          className="bg-purple-500 dark:bg-purple-400 h-2 rounded-full" 
                          style={getProgressStyle(`${insights.allowanceDetails.transport.percentOfTotal}%`)}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      <InfoIcon className={cn("h-3.5 w-3.5 inline-block", direction === 'rtl' ? 'ml-1' : 'mr-1')} />
                      {t('allowances_tip') || "Allowances are generally tax-advantaged compared to base salary. Talk to HR about optimizing your compensation structure."}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Basic Salary Visual */}
            <div className={cn("flex items-start p-2 rounded-lg glass-subtle hover:glass-card transition-colors duration-200", getSpacing())}>
              <PieChart className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
              <div className="w-full">
                <h4 className="text-sm font-medium text-foreground">
                  {t('insights.earnings.distribution') || "Earnings Distribution"}
                </h4>
                
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <div className="h-full flex flex-col space-y-2">
                      {/* Basic Salary */}
                      <div className="flex-1 w-full">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{t('payslip.basicSalary') || "Basic Salary"}</span>
                          <span className="text-foreground">76.3%</span>
                        </div>
                        <div className="w-full bg-muted/30 dark:bg-muted/20 h-2 rounded-full mt-1">
                          <div className="bg-purple-500 dark:bg-purple-400 h-2 rounded-full" style={getProgressStyle('76.3%')}></div>
                        </div>
                      </div>
                      
                      {/* Housing */}
                      <div className="flex-1 w-full">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{t('payslip.housingAllowance') || "Housing"}</span>
                          <span className="text-foreground">12.2%</span>
                        </div>
                        <div className="w-full bg-muted/30 dark:bg-muted/20 h-2 rounded-full mt-1">
                          <div className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full" style={getProgressStyle('12.2%')}></div>
                        </div>
                      </div>
                      
                      {/* Transport */}
                      <div className="flex-1 w-full">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{t('payslip.transportAllowance') || "Transport"}</span>
                          <span className="text-foreground">4.6%</span>
                        </div>
                        <div className="w-full bg-muted/30 dark:bg-muted/20 h-2 rounded-full mt-1">
                          <div className="bg-green-500 dark:bg-green-400 h-2 rounded-full" style={getProgressStyle('4.6%')}></div>
                        </div>
                      </div>
                      
                      {/* Overtime */}
                      <div className="flex-1 w-full">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{t('payslip.overtime') || "Overtime"}</span>
                          <span className="text-foreground">6.9%</span>
                        </div>
                        <div className="w-full bg-muted/30 dark:bg-muted/20 h-2 rounded-full mt-1">
                          <div className="bg-yellow-500 dark:bg-yellow-400 h-2 rounded-full" style={getProgressStyle('6.9%')}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative h-32">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full border-8 border-purple-500 dark:border-purple-400 flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-700 dark:text-purple-300">$6,550</span>
                      </div>
                      <div className={`absolute top-0 ${direction === 'rtl' ? 'left-0' : 'right-0'} w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-400`}></div>
                      <div className={`absolute bottom-0 ${direction === 'rtl' ? 'left-0' : 'right-0'} w-3 h-3 rounded-full bg-green-500 dark:bg-green-400`}></div>
                      <div className={`absolute bottom-0 ${direction === 'rtl' ? 'right-0' : 'left-0'} w-3 h-3 rounded-full bg-yellow-500 dark:bg-yellow-400`}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="alerts" className="space-y-3">
            {/* Unusual Items */}
            {insights?.unusualItems?.found && (
              <div className={cn("flex items-start p-2 rounded-lg glass-subtle hover:glass-card transition-colors duration-200", getSpacing())}>
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    {t('insights.unusualItems') || "Unusual Items"}
                  </h4>
                  <div className="space-y-1 mt-1">
                    {insights.unusualItems.items.map((item: any, index: number) => (
                      <p key={index} className="text-xs text-muted-foreground flex items-center">
                        <span className={cn(`w-2 h-2 rounded-full ${
                          item.impact === 'positive' ? 'bg-green-500' : 'bg-red-500'
                        }`, direction === 'rtl' ? 'ml-2' : 'mr-2')}></span>
                        {t('insights.unusualItemDetail', {
                          label: item.label,
                          amount: item.amount,
                          hours: item.hours
                        }) || 
                        `${item.label}: $${item.amount} (${item.hours} hours)`}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Tax Bracket Change */}
            {insights?.taxBracketChange?.changed && (
              <div className={cn("flex items-start p-2 rounded-lg glass-subtle hover:glass-card transition-colors duration-200", getSpacing())}>
                <AlertCircle className={`h-5 w-5 ${
                  insights.taxBracketChange.impact === 'negative' ? 'text-red-500' : 'text-green-500'
                } flex-shrink-0 mt-0.5`} />
                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    {t('insights.alerts.taxBracketChange') || "Tax Bracket Change"}
                  </h4>
                  <div className="space-y-1 mt-1">
                    <p className="text-xs text-muted-foreground">
                      {t('insights.alerts.previousRate', { rate: insights.taxBracketChange.previousRate }) || 
                       `Previous: ${insights.taxBracketChange.previousRate}%`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('insights.alerts.currentRate', { rate: insights.taxBracketChange.currentRate }) || 
                       `Current: ${insights.taxBracketChange.currentRate}%`}
                    </p>
                    <p className="text-xs font-medium">
                      {t('insights.alerts.impact', { 
                        impact: insights.taxBracketChange.impact === 'negative' ? 
                          'Higher tax burden' : 'Lower tax burden'
                      }) || 
                       `Impact: ${insights.taxBracketChange.impact === 'negative' ? 
                         'Higher tax burden' : 'Lower tax burden'}`}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Year-End Tax Planning Alert */}
            <div className={cn("flex items-start p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200", getSpacing())}>
              <InfoIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground">
                  {t('year_end_tax_planning') || "Year-End Tax Planning"}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('tax_planning_tip') || "Consider maximizing your retirement contributions before the end of the year to reduce taxable income."}
                </p>
                <div className={cn("mt-2 flex", direction === 'rtl' ? 'space-x-reverse space-x-2' : 'space-x-2')}>
                  <div className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded-md text-blue-700 dark:text-blue-300">
                    {t('tax_optimization') || "Tax Optimization"}
                  </div>
                  <div className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded-md text-blue-700 dark:text-blue-300">
                    {t('retirement_planning') || "Retirement Planning"}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Benefit Enrollment Period Alert */}
            <div className={cn("flex items-start p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors duration-200", getSpacing())}>
              <Bell className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground">
                  {t('open_enrollment_period') || "Open Enrollment Period"}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('benefits_enrollment_period') || "The benefits enrollment period is from Nov 1 to Nov 15. Review your health insurance and other benefits."}
                </p>
                <div className={cn("mt-2 flex", direction === 'rtl' ? 'space-x-reverse space-x-2' : 'space-x-2')}>
                  <div className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-800 rounded-md text-amber-700 dark:text-amber-300">
                    {t('payslip.healthInsurance') || "Health Insurance"}
                  </div>
                  <div className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-800 rounded-md text-amber-700 dark:text-amber-300">
                    {t('benefits') || "Benefits"}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Unused Vacation Days Alert */}
            <div className={cn("flex items-start p-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200", getSpacing())}>
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground">
                  {t('vacation_days_expiring') || "Vacation Days Expiring"}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('vacation_days_expiring_message') || "You have 8 vacation days that will expire at the end of the year. Consider scheduling time off soon."}
                </p>
                <div className={cn("mt-2 flex", direction === 'rtl' ? 'space-x-reverse space-x-2' : 'space-x-2')}>
                  <div className="text-xs px-2 py-1 bg-red-100 dark:bg-red-800 rounded-md text-red-700 dark:text-red-300">
                    {t('time_off') || "Time Off"}
                  </div>
                  <div className="text-xs px-2 py-1 bg-red-100 dark:bg-red-800 rounded-md text-red-700 dark:text-red-300">
                    {t('expiring_benefits') || "Expiring Benefits"}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 