import { useState } from "react"
import {
  Search,
  Edit,
  Eye,
  Download,
  Filter,
  ThumbsUp,
  ThumbsDown,
  BarChart,
  PieChart,
  LineChart,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  Legend,
} from "recharts"

export default function ChatbotMonitoring() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("analytics")
  const [timeRange, setTimeRange] = useState("7d")
  const { t, direction } = useLanguage()

  // Mock feedback data
  const feedbackData = [
    {
      id: 1,
      question: "How is my overtime calculated?",
      response: "Your overtime is calculated at 1.6x your regular hourly rate for weekdays and 2x for weekends...",
      rating: "helpful",
      comment: "Very clear explanation, thank you!",
      user: "john.doe@example.com",
      timestamp: "2023-11-15T14:32:00Z",
    },
    {
      id: 2,
      question: "Why was my tax deduction higher this month?",
      response:
        "Your tax deduction increased because you received a bonus this month, which pushed you into a higher tax bracket...",
      rating: "not_helpful",
      comment: "This doesn't explain the exact calculation.",
      category: "incorrect",
      user: "jane.smith@example.com",
      timestamp: "2023-11-14T09:15:00Z",
    },
    {
      id: 3,
      question: "What is included in my housing allowance?",
      response: "Your housing allowance is a fixed amount of $800 per month to help cover housing expenses...",
      rating: "helpful",
      user: "robert.johnson@example.com",
      timestamp: "2023-11-13T16:45:00Z",
    },
    {
      id: 4,
      question: "When will I receive my annual bonus?",
      response: "Annual bonuses are typically paid out in March, following the completion of performance reviews...",
      rating: "not_helpful",
      comment: "The answer is too vague.",
      category: "incomplete",
      user: "emily.davis@example.com",
      timestamp: "2023-11-12T11:20:00Z",
    },
    {
      id: 5,
      question: "How much is my retirement fund contribution?",
      response: "Your retirement fund contribution is 6.1% of your gross salary, which amounts to $400 per month...",
      rating: "helpful",
      comment: "Exactly what I needed to know!",
      user: "michael.wilson@example.com",
      timestamp: "2023-11-11T13:55:00Z",
    },
  ]

  // Mock analytics data
  const analyticsData = {
    totalInteractions: 8623,
    averageResponseTime: "1.2s",
    satisfactionRate: "87%",
    topQuestions: [
      { question: "How is overtime calculated?", count: 342 },
      { question: "What are the tax deduction rates?", count: 289 },
      { question: "When will I receive my salary?", count: 256 },
      { question: "How is my bonus calculated?", count: 231 },
      { question: "What benefits am I eligible for?", count: 198 },
    ],
    feedbackBreakdown: {
      helpful: 6872,
      notHelpful: 1751,
    },
    issueCategories: {
      incorrect: 823,
      incomplete: 512,
      unclear: 298,
      other: 118,
    },
  }

  // Chart data for feedback trend over time
  const feedbackTrendData = [
    { date: "Nov 9", helpful: 145, notHelpful: 23, satisfaction: 86.3 },
    { date: "Nov 10", helpful: 158, notHelpful: 31, satisfaction: 83.6 },
    { date: "Nov 11", helpful: 167, notHelpful: 28, satisfaction: 85.6 },
    { date: "Nov 12", helpful: 142, notHelpful: 35, satisfaction: 80.2 },
    { date: "Nov 13", helpful: 189, notHelpful: 22, satisfaction: 89.6 },
    { date: "Nov 14", helpful: 176, notHelpful: 29, satisfaction: 85.9 },
    { date: "Nov 15", helpful: 195, notHelpful: 18, satisfaction: 91.5 },
  ]

  // Chart data for feedback distribution
  const feedbackDistributionData = [
    { name: "Helpful", value: analyticsData.feedbackBreakdown.helpful, color: "#22c55e" },
    { name: "Not Helpful", value: analyticsData.feedbackBreakdown.notHelpful, color: "#ef4444" },
  ]

  // Chart data for issue categories
  const issueCategoriesData = [
    { category: "Incorrect Info", count: analyticsData.issueCategories.incorrect, percentage: 47.1 },
    { category: "Incomplete Answer", count: analyticsData.issueCategories.incomplete, percentage: 29.3 },
    { category: "Unclear Response", count: analyticsData.issueCategories.unclear, percentage: 17.1 },
    { category: "Other Issues", count: analyticsData.issueCategories.other, percentage: 6.5 },
  ]

  const filteredFeedback = feedbackData.filter(
    (feedback) =>
      feedback.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.response.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (feedback.comment && feedback.comment.toLowerCase().includes(searchQuery.toLowerCase())) ||
      feedback.user.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-subtle p-3 border-0 shadow-lg">
          <p className="font-medium text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
              {entry.name === "satisfaction" && "%"}
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
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t("admin.chatbot.title") || "Chatbot Monitoring"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("admin.chatbot.description") || "Monitor chatbot performance and user feedback"}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        <Tabs defaultValue="analytics" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analytics">{t("admin.chatbot.analytics") || "Analytics"}</TabsTrigger>
            <TabsTrigger value="feedback">{t("admin.chatbot.feedback") || "Feedback"}</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="mt-6">
            <div className="flex justify-end mb-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("admin.chatbot.timeRange") || "Time Range"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">{t("admin.chatbot.last24Hours") || "Last 24 Hours"}</SelectItem>
                  <SelectItem value="7d">{t("admin.chatbot.last7Days") || "Last 7 Days"}</SelectItem>
                  <SelectItem value="30d">{t("admin.chatbot.last30Days") || "Last 30 Days"}</SelectItem>
                  <SelectItem value="90d">{t("admin.chatbot.last90Days") || "Last 90 Days"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("admin.chatbot.totalInteractions") || "Total Interactions"}</CardTitle>
                  <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.totalInteractions}</div>
                  <p className="text-xs text-green-500 dark:text-green-400 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12.7% {t("admin.chatbot.fromLastPeriod") || "from last period"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("admin.chatbot.averageResponseTime") || "Average Response Time"}</CardTitle>
                  <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.averageResponseTime}</div>
                  <p className="text-xs text-blue-500 dark:text-blue-400 flex items-center">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    -0.3s {t("admin.chatbot.fromLastPeriod") || "from last period"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("admin.chatbot.satisfactionRate") || "Satisfaction Rate"}</CardTitle>
                  <ThumbsUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.satisfactionRate}</div>
                  <p className="text-xs text-green-500 dark:text-green-400 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2.3% {t("admin.chatbot.fromLastPeriod") || "from last period"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Issue Rate</CardTitle>
                  <ThumbsDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">13%</div>
                  <p className="text-xs text-blue-500 dark:text-blue-400 flex items-center">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    -2.3% {t("admin.chatbot.fromLastPeriod") || "from last period"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-5 mt-5 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                    {t("admin.chatbot.feedbackTrend") || "Feedback Trend"}
                  </CardTitle>
                  <CardDescription>{t("admin.chatbot.feedbackTrendDescription") || "User feedback trends over time"}</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={feedbackTrendData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="date" 
                        className="text-xs"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        className="text-xs"
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="helpful"
                        stroke="#22c55e"
                        strokeWidth={3}
                        dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "#22c55e", strokeWidth: 2 }}
                        name={t("admin.chatbot.helpful") || "Helpful"}
                      />
                      <Line
                        type="monotone"
                        dataKey="notHelpful"
                        stroke="#ef4444"
                        strokeWidth={3}
                        dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "#ef4444", strokeWidth: 2 }}
                        name={t("admin.chatbot.notHelpful") || "Not Helpful"}
                      />
                      <Line
                        type="monotone"
                        dataKey="satisfaction"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
                        name={t("admin.chatbot.satisfactionRate") || "Satisfaction Rate"}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                    {t("admin.chatbot.feedbackDistribution") || "Feedback Distribution"}
                  </CardTitle>
                  <CardDescription>{t("admin.chatbot.feedbackDistributionDescription") || "Overall feedback breakdown"}</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={feedbackDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        labelLine={false}
                      >
                        {feedbackDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="glass-subtle p-3 border-0 shadow-lg">
                                <p className="font-medium text-foreground">{data.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Count: {data.value.toLocaleString()}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Percentage: {((data.value / (feedbackDistributionData[0].value + feedbackDistributionData[1].value)) * 100).toFixed(1)}%
                                </p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-5 mt-5 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.chatbot.topQuestions") || "Top Questions"}</CardTitle>
                  <CardDescription>{t("admin.chatbot.mostFrequentlyAskedQuestions") || "Most frequently asked questions"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.topQuestions.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg glass-subtle">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <span className="ml-3 text-sm font-medium">{item.question}</span>
                        </div>
                        <Badge variant="outline" className="font-mono">
                          {item.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-orange-600 dark:text-orange-400" />
                    {t("admin.chatbot.issueCategories") || "Issue Categories"}
                  </CardTitle>
                  <CardDescription>{t("admin.chatbot.issueCategoriesDescription") || "Common issues with responses"}</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={issueCategoriesData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        type="number" 
                        className="text-xs"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        dataKey="category" 
                        type="category" 
                        width={100}
                        className="text-xs"
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="glass-subtle p-3 border-0 shadow-lg">
                                <p className="font-medium text-foreground">{label}</p>
                                <p className="text-sm text-muted-foreground">
                                  Count: {data.count}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Percentage: {data.percentage}%
                                </p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="#f97316"
                        radius={[0, 4, 4, 0]}
                        name="Issues"
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>{t("admin.chatbot.feedback") || "User Feedback"}</CardTitle>
                  <CardDescription>{t("admin.chatbot.reviewFeedbackDescription") || "Review and analyze user feedback on chatbot responses"}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    {t("admin.chatbot.exportFeedback") || "Export Feedback"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Input
                      placeholder={t("admin.chatbot.searchFeedback") || "Search feedback..."}
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t("admin.chatbot.filterByRating") || "Filter by rating"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("admin.chatbot.allRatings") || "All Ratings"}</SelectItem>
                        <SelectItem value="helpful">{t("admin.chatbot.helpful") || "Helpful"}</SelectItem>
                        <SelectItem value="not_helpful">{t("admin.chatbot.notHelpful") || "Not Helpful"}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      {t("admin.chatbot.moreFilters") || "More Filters"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  {filteredFeedback.map((feedback) => (
                    <div key={feedback.id} className="border rounded-lg p-4 glass-card shadow-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {feedback.user.split("@")[0].charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                {feedback.user.split("@")[0].replace(".", " ")}
                              </p>
                              <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(feedback.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <div className="mt-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t("admin.chatbot.question") || "Question"}:</p>
                              <p className="text-sm text-foreground mt-1">{feedback.question}</p>
                            </div>
                            <div className="mt-3">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t("admin.chatbot.response") || "Response"}:</p>
                              <p className="text-sm text-foreground mt-1">{feedback.response}</p>
                            </div>
                          </div>
                        </div>
                        <Badge
                          className={
                            feedback.rating === "helpful"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 flex items-center"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 flex items-center"
                          }
                        >
                          {feedback.rating === "helpful" ? (
                            <>
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {t("admin.chatbot.helpful") || "Helpful"}
                            </>
                          ) : (
                            <>
                              <ThumbsDown className="h-3 w-3 mr-1" />
                              {t("admin.chatbot.notHelpful") || "Not Helpful"}
                            </>
                          )}
                        </Badge>
                      </div>

                      {feedback.comment && (
                        <div className="mt-4 pl-14">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Feedback:</p>
                          <p className="text-sm text-foreground mt-1">{feedback.comment}</p>
                        </div>
                      )}

                      {feedback.category && (
                        <div className="mt-2 pl-14">
                          <Badge variant="outline" className="text-foreground">
                            Issue: {feedback.category}
                          </Badge>
                        </div>
                      )}

                      <div className="mt-4 pl-14 flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3 mr-1" />
                          Add Note
                        </Button>
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
  )
}
