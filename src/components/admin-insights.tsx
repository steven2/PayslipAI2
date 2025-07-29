

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  LightbulbIcon, 
  BarChart3,
  AlertCircle,
  PieChart,
  Users,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Receipt
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function AdminInsights() {
  const [loading, setLoading] = useState(true)
  const [insights, setInsights] = useState<any>(null)
  const { t, direction } = useLanguage()
  
  useEffect(() => {
    const generateInsights = async () => {
      setLoading(true)
      
      try {
        // Simulate API call - in a real app, you'd call an API endpoint
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock data
        const mockInsights = {
          payroll: {
            processedThisMonth: 125,
            pendingApproval: 3,
            errorRate: 1.2,
            averageProcessingTime: 2.5
          },
          chatbot: {
            conversations: 342,
            questionsAnswered: 827,
            satisfactionRate: 94.3,
            commonQueries: [
              { topic: "Tax calculations", count: 87 },
              { topic: "Overtime pay", count: 64 },
              { topic: "Benefits details", count: 52 },
              { topic: "Payment methods", count: 38 }
            ]
          },
          employees: {
            total: 128,
            newHires: 5,
            turnover: 2,
            departmentBreakdown: [
              { name: "Engineering", count: 45 },
              { name: "Sales", count: 32 },
              { name: "Marketing", count: 18 },
              { name: "Operations", count: 23 },
              { name: "HR", count: 10 }
            ]
          },
          alerts: [
            { 
              type: "error", 
              message: "3 employees have missing tax information",
              impact: "high"
            },
            { 
              type: "warning", 
              message: "8 pending approvals need review before next payroll run",
              impact: "medium"
            },
            { 
              type: "info", 
              message: "New tax rates will take effect next month",
              impact: "low"
            }
          ]
        }
        
        setInsights(mockInsights)
      } catch (error) {
        console.error("Error generating admin insights:", error)
      } finally {
        setLoading(false)
      }
    }
    
    generateInsights()
  }, [])
  
  if (loading) {
    return (
      <Card className="w-full border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center text-purple-700 dark:text-purple-400">
            <LightbulbIcon className="h-4 w-4 mr-2" />
            {t("admin.dashboard.insights.title")}
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
          <LightbulbIcon className="h-4 w-4 mr-2" />
          {t("admin.dashboard.insights.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <Tabs defaultValue="payroll" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="payroll" className="flex items-center">
              <DollarSign className="h-3.5 w-3.5 mr-1.5" />
              <span>{t("admin.dashboard.insights.payroll")}</span>
            </TabsTrigger>
            <TabsTrigger value="chatbot" className="flex items-center">
              <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
              <span>{t("admin.dashboard.insights.chatbot")}</span>
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center">
              <Users className="h-3.5 w-3.5 mr-1.5" />
              <span>{t("admin.dashboard.insights.employees")}</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center">
              <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
              <span>{t("admin.dashboard.insights.alertsTab")}</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Payroll Tab */}
          <TabsContent value="payroll">
            {insights?.payroll && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">{t("admin.dashboard.insights.processed")}</h3>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{insights.payroll.processedThisMonth}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t("admin.dashboard.insights.thisMonth")}</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">{t("admin.dashboard.insights.pending")}</h3>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{insights.payroll.pendingApproval}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t("admin.dashboard.insights.needApproval")}</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">{t("admin.dashboard.insights.errorRate")}</h3>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{insights.payroll.errorRate}%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t("admin.dashboard.insights.downFromLastMonth")}</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">{t("admin.dashboard.insights.processingTime")}</h3>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{insights.payroll.averageProcessingTime}h</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t("admin.dashboard.insights.avgPerPayslip")}</p>
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Chatbot Tab */}
          <TabsContent value="chatbot">
            {insights?.chatbot && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">{t("admin.dashboard.insights.conversations")}</h3>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{insights.chatbot.conversations}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t("admin.dashboard.insights.thisMonth")}</p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">{t("admin.dashboard.insights.questions")}</h3>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{insights.chatbot.questionsAnswered}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t("admin.dashboard.insights.answered")}</p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">{t("admin.dashboard.insights.satisfaction")}</h3>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{insights.chatbot.satisfactionRate}%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t("admin.dashboard.insights.userRating")}</p>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
                  <h3 className="text-sm font-medium text-foreground mb-3">{t("admin.dashboard.insights.commonQueries")}</h3>
                  <div className="space-y-2">
                    {insights.chatbot.commonQueries.map((query: any, index: number) => (
                      <div key={index} className="w-full">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{query.topic}</span>
                          <span className="text-foreground">{query.count}</span>
                        </div>
                        <div className="w-full bg-muted/30 dark:bg-muted/20 h-1.5 rounded-full">
                          <div 
                            className="bg-purple-500 dark:bg-purple-400 h-1.5 rounded-full" 
                            style={{ width: `${(query.count / insights.chatbot.commonQueries[0].count) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Employees Tab */}
          <TabsContent value="employees">
            {insights?.employees && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">{t("admin.dashboard.insights.totalEmployees")}</h3>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{insights.employees.total}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t("admin.dashboard.insights.active")}</p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">{t("admin.dashboard.insights.newHires")}</h3>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{insights.employees.newHires}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t("admin.dashboard.insights.thisMonth")}</p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">{t("admin.dashboard.insights.turnover")}</h3>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{insights.employees.turnover}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t("admin.dashboard.insights.thisMonth")}</p>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
                  <h3 className="text-sm font-medium text-foreground mb-3">{t("admin.dashboard.insights.departmentBreakdown")}</h3>
                  <div className="space-y-2">
                    {insights.employees.departmentBreakdown.map((dept: any, index: number) => (
                      <div key={index} className="w-full">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{dept.name}</span>
                          <span className="text-foreground">{dept.count}</span>
                        </div>
                        <div className="w-full bg-muted/30 dark:bg-muted/20 h-1.5 rounded-full">
                          <div 
                            className={`h-1.5 rounded-full ${
                              index % 5 === 0 ? "bg-purple-500 dark:bg-purple-400" :
                              index % 5 === 1 ? "bg-blue-500 dark:bg-blue-400" :
                              index % 5 === 2 ? "bg-green-500 dark:bg-green-400" :
                              index % 5 === 3 ? "bg-yellow-500 dark:bg-yellow-400" :
                              "bg-red-500 dark:bg-red-400"
                            }`}
                            style={{ width: `${(dept.count / insights.employees.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Alerts Tab */}
          <TabsContent value="alerts">
            {insights?.alerts && (
              <div className="space-y-3">
                {insights.alerts.map((alert: any, index: number) => (
                  <div 
                    key={index} 
                    className={`flex items-start space-x-3 p-3 rounded-lg ${
                      alert.type === 'error' 
                        ? 'bg-red-50 dark:bg-red-900/20' 
                        : alert.type === 'warning'
                        ? 'bg-amber-50 dark:bg-amber-900/20'
                        : 'bg-blue-50 dark:bg-blue-900/20'
                    }`}
                  >
                    <AlertCircle className={`h-5 w-5 ${
                      alert.type === 'error' 
                        ? 'text-red-500' 
                        : alert.type === 'warning'
                        ? 'text-amber-500'
                        : 'text-blue-500'
                    } flex-shrink-0 mt-0.5`} />
                    <div>
                      <h4 className="text-sm font-medium text-foreground">
                        {alert.message}
                      </h4>
                      <div className="mt-2 flex space-x-2">
                        <div className={`text-xs px-2 py-1 rounded-md ${
                          alert.impact === 'high' 
                            ? 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300' 
                            : alert.impact === 'medium'
                            ? 'bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-300'
                            : 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300'
                        }`}>
                          {t(`admin.dashboard.insights.${alert.impact}Impact`)}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-md ${
                          alert.type === 'error' 
                            ? 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300' 
                            : alert.type === 'warning'
                            ? 'bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-300'
                            : 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300'
                        }`}>
                          {t(`admin.dashboard.insights.${alert.type}`)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 