import { useState } from "react"
import {
  FileText,
  Users,
  Database,
  Calculator,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import AdminInsights from "@/components/admin-insights"
import { useLanguage } from "@/contexts/language-context"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { t, direction } = useLanguage()

  // Chatbot performance data for the chart
  const chatbotPerformanceData = [
    { date: "Nov 9", accuracy: 87.2, satisfaction: 86.3, responseTime: 1.4 },
    { date: "Nov 10", accuracy: 89.1, satisfaction: 83.6, responseTime: 1.3 },
    { date: "Nov 11", accuracy: 91.5, satisfaction: 85.6, responseTime: 1.2 },
    { date: "Nov 12", accuracy: 88.7, satisfaction: 80.2, responseTime: 1.5 },
    { date: "Nov 13", accuracy: 93.2, satisfaction: 89.6, responseTime: 1.1 },
    { date: "Nov 14", accuracy: 90.8, satisfaction: 85.9, responseTime: 1.2 },
    { date: "Nov 15", accuracy: 94.1, satisfaction: 91.5, responseTime: 1.0 },
  ]

  const stats = [
    {
      name: t("admin.dashboard.totalEmployees"),
      value: "1,248",
      change: "+5.4%",
      trend: "up",
      icon: Users,
    },
    {
      name: t("admin.dashboard.activeDocuments"),
      value: "42",
      change: "+2.3%",
      trend: "up",
      icon: FileText,
    },
    {
      name: t("admin.dashboard.chatInteractions"),
      value: "8,623",
      change: "+12.7%",
      trend: "up",
      icon: MessageSquare,
    },
    {
      name: t("admin.dashboard.avgResponseTime"),
      value: "1.2s",
      change: "-0.3s",
      trend: "down",
      icon: Clock,
    },
  ]

  const recentActivities = [
    {
      id: 1,
      user: t("admin.userTitle"),
      action: t("admin.dashboard.activities.updatedWageType"),
      time: `2 ${t("admin.dashboard.timeLabels.hoursAgo")}`,
      icon: Calculator,
    },
    {
      id: 2,
      user: "System",
      action: t("admin.dashboard.activities.payrollImported"),
      time: `5 ${t("admin.dashboard.timeLabels.hoursAgo")}`,
      icon: Database,
    },
    {
      id: 3,
      user: t("admin.userTitle"),
      action: t("admin.dashboard.activities.documentAdded"),
      time: t("admin.dashboard.timeLabels.yesterday"),
      icon: FileText,
    },
    {
      id: 4,
      user: "System",
      action: t("admin.dashboard.activities.chatbotUpdated"),
      time: `2 ${t("admin.dashboard.timeLabels.daysAgo")}`,
      icon: MessageSquare,
    },
  ]

  const alerts = [
    {
      id: 1,
      title: t("admin.dashboard.alerts.payrollValidation"),
      description: t("admin.dashboard.alerts.payrollValidationDesc"),
      severity: "warning",
      time: `3 ${t("admin.dashboard.timeLabels.hoursAgo")}`,
      icon: AlertTriangle,
    },
    {
      id: 2,
      title: t("admin.dashboard.alerts.newFeedback"),
      description: t("admin.dashboard.alerts.newFeedbackDesc"),
      severity: "info",
      time: `12 ${t("admin.dashboard.timeLabels.hoursAgo")}`,
      icon: MessageSquare,
    },
    {
      id: 3,
      title: t("admin.dashboard.alerts.systemUpdate"),
      description: t("admin.dashboard.alerts.systemUpdateDesc"),
      severity: "success",
      time: `1 ${t("admin.dashboard.timeLabels.daysAgo")}`,
      icon: CheckCircle,
    },
  ]

  // Custom tooltip for the chatbot performance chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-subtle p-3 border-0 shadow-lg rounded-lg">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {t(`admin.dashboard.${entry.dataKey}`)}: {entry.value}
              {entry.dataKey === "responseTime" ? "s" : "%"}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="py-6" dir={direction}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t("admin.dashboard.title")}</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">{t("admin.dashboard.overview")}</TabsTrigger>
              <TabsTrigger value="activity">{t("admin.dashboard.activity")}</TabsTrigger>
              <TabsTrigger value="alerts">{t("admin.dashboard.alertsTab")}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="mb-6">
                <AdminInsights />
              </div>
              
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <Card key={stat.name} className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                      <stat.icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p
                        className={`text-xs ${
                          stat.trend === "up"
                            ? "text-green-500 dark:text-green-400"
                            : "text-blue-500 dark:text-blue-400"
                        } flex items-center`}
                      >
                        {stat.trend === "up" ? (
                          <TrendingUp className="mr-1 h-3 w-3" />
                        ) : (
                          <TrendingUp className="mr-1 h-3 w-3 transform rotate-180" />
                        )}
                        {stat.change}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>{t("admin.dashboard.chatbotPerformance")}</CardTitle>
                    <CardDescription>{t("admin.dashboard.chatbotDescription")}</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chatbotPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="date" 
                          className="text-xs"
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          className="text-xs"
                          tick={{ fontSize: 12 }}
                          domain={[0, 100]}
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          className="text-xs"
                          tick={{ fontSize: 12 }}
                          domain={[0, 2]}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="accuracy"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                          name={t("admin.dashboard.accuracy")}
                        />
                        <Line
                          type="monotone"
                          dataKey="satisfaction"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                          name={t("admin.dashboard.satisfaction")}
                        />
                        <Line
                          type="monotone"
                          dataKey="responseTime"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                          name={t("admin.dashboard.responseTime")}
                          yAxisId="right"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("admin.dashboard.quickActions")}</CardTitle>
                    <CardDescription>{t("admin.dashboard.quickActionsDescription")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Link to="/admin/documents" className="w-full">
                        <Button className="w-full justify-start" variant="outline">
                          <FileText className="mr-2 h-4 w-4" />
                          {t("admin.dashboard.uploadDocument")}
                        </Button>
                      </Link>
                      <Link to="/admin/employees" className="w-full">
                        <Button className="w-full justify-start" variant="outline">
                          <Users className="mr-2 h-4 w-4" />
                          {t("admin.dashboard.manageEmployees")}
                        </Button>
                      </Link>
                      <Link to="/admin/payroll" className="w-full">
                        <Button className="w-full justify-start" variant="outline">
                          <Database className="mr-2 h-4 w-4" />
                          {t("admin.dashboard.importPayrollData")}
                        </Button>
                      </Link>
                      <Link to="/admin/chatbot" className="w-full">
                        <Button className="w-full justify-start" variant="outline">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          {t("admin.dashboard.reviewFeedback")}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.dashboard.recentActivities")}</CardTitle>
                  <CardDescription>{t("admin.dashboard.recentActivitiesDescription")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex">
                        <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                          <activity.icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.user}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{activity.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.dashboard.systemAlerts")}</CardTitle>
                  <CardDescription>{t("admin.dashboard.systemAlertsDescription")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`flex p-4 rounded-lg ${
                          alert.severity === "warning"
                            ? "bg-yellow-50 dark:bg-yellow-900/20"
                            : alert.severity === "success"
                              ? "bg-green-50 dark:bg-green-900/20"
                              : "bg-blue-50 dark:bg-blue-900/20"
                        }`}
                      >
                        <div
                          className={`mr-4 flex h-10 w-10 items-center justify-center rounded-full ${
                            alert.severity === "warning"
                              ? "bg-yellow-100 dark:bg-yellow-900/50"
                              : alert.severity === "success"
                                ? "bg-green-100 dark:bg-green-900/50"
                                : "bg-blue-100 dark:bg-blue-900/50"
                          }`}
                        >
                          <alert.icon
                            className={`h-5 w-5 ${
                              alert.severity === "warning"
                                ? "text-yellow-600 dark:text-yellow-400"
                                : alert.severity === "success"
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-blue-600 dark:text-blue-400"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{alert.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{alert.time}</p>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{alert.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 