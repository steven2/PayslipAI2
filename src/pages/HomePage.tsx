import type React from "react"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  History,
  Moon,
  Sun,
  FileText,
  MessageSquare,
  ChevronUp,
  ChevronDown,
  Shield,
  Globe,
  ChevronDown as ChevronDownIcon,
  Expand,
  Lightbulb
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import PayslipViewer from "@/components/payslip-viewer"
import ChatInterface from "@/components/chat-interface"
import MonthYearPicker from "@/components/month-year-picker"
import PayslipSummary from "@/components/payslip-summary"
import { useMobile } from "@/hooks/use-mobile"
import { Link } from "react-router-dom"
import Footer from "@/components/footer"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import PayslipInsights from "@/components/payslip-insights"
import PayslipDialog from "@/components/payslip-dialog"

export default function HomePage() {
  const [currentDate, setCurrentDate] = useState<{ month: number; year: number }>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  })
  const [zoomLevel, setZoomLevel] = useState(100)
  const [showHistory, setShowHistory] = useState(false)
  const isMobile = useMobile()
  const [activePane, setActivePane] = useState<"payslip" | "insights" | "chat">("payslip")
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const { t, language, setLanguage } = useLanguage()

  // Language flags - simple emoji flags
  const languages = [
    { code: 'en' as const, name: t('languages.en'), flag: '🇺🇸' },
    { code: 'fr' as const, name: t('languages.fr'), flag: '🇫🇷' },
    { code: 'he' as const, name: t('languages.he'), flag: '🇮🇱' },
  ]

  // Get current language flag
  const currentLanguage = languages.find(lang => lang.code === language) || languages[0]

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePreviousMonth = () => {
    setCurrentDate((prev) => {
      const newMonth = prev.month === 0 ? 11 : prev.month - 1
      const newYear = prev.month === 0 ? prev.year - 1 : prev.year
      return { month: newMonth, year: newYear }
    })
  }

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const newMonth = prev.month === 11 ? 0 : prev.month + 1
      const newYear = prev.month === 11 ? prev.year + 1 : prev.year
      return { month: newMonth, year: newYear }
    })
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 150))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 50))
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handlePaneChange = (newPane: "payslip" | "insights" | "chat") => {
    if (newPane !== activePane) {
      setIsTransitioning(true)
      setTimeout(() => {
        setActivePane(newPane)
        setIsTransitioning(false)
      }, 200) // Match this with the transition duration
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="flex flex-col h-screen transition-colors duration-300">
      <header className={`glass-card mx-2 mt-2 border-0 py-4 px-6 shadow-lg transition-all duration-300 ${isMobile ? "fixed top-0 left-0 right-0 z-20 mx-2 mt-2" : ""}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-300 text-transparent bg-clip-text">
              {t('payslip.statement')}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Link to="/admin">
              <Button variant="outline" size="sm" className="rounded-full hidden sm:flex glass-button-outline">
                <Shield className="h-4 w-4 mr-2" />
                {t('admin.title')}
              </Button>
            </Link>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full glass-button-ghost flex items-center"
                >
                  <span className="mr-1 text-base">{currentLanguage.flag}</span>
                  <ChevronDownIcon className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem 
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className="flex items-center cursor-pointer"
                  >
                    <span className="mr-2 text-base">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full glass-button-ghost"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-purple-600" />
              )}
            </Button>

          </div>
        </div>
      </header>

      <main className={`flex flex-1 overflow-hidden ${isMobile ? "pt-[64px]" : ""}`} data-active-pane={activePane}>
        {isMobile ? (
          <div className="flex flex-col w-full h-full">
            {/* Fixed header section */}
            <div className="flex justify-center p-3 glass-subtle mx-2 mt-20 rounded-2xl shadow-lg fixed top-[64px] left-0 right-0 z-20">
              <div className="flex space-x-2 p-1 glass-card rounded-lg">
                <Button
                  variant={activePane === "payslip" ? "default" : "ghost"}
                  onClick={() => handlePaneChange("payslip")}
                  className={`rounded-lg transition-all duration-300 ${
                    activePane === "payslip"
                      ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg"
                      : "glass-button-ghost text-foreground"
                  }`}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {t('payslip.title')}
                </Button>
                <Button
                  variant={activePane === "insights" ? "default" : "ghost"}
                  onClick={() => handlePaneChange("insights")}
                  className={`rounded-lg transition-all duration-300 ${
                    activePane === "insights"
                      ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg"
                      : "glass-button-ghost text-foreground"
                  }`}
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  {t('insights.title') || "Insights"}
                </Button>
                <Button
                  variant={activePane === "chat" ? "default" : "ghost"}
                  onClick={() => handlePaneChange("chat")}
                  className={`rounded-lg transition-all duration-300 ${
                    activePane === "chat"
                      ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg"
                      : "glass-button-ghost text-foreground"
                  }`}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {t('chat.title')}
                </Button>
              </div>
            </div>

            {/* Scrollable content area with proper padding for fixed elements */}
            <div className={`flex-1 overflow-hidden relative pt-[116px] ${activePane === "payslip" ? "pb-[120px]" : "pb-[8px]"}`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePane}
                  initial={{ opacity: 0, x: determineInitialX(activePane) }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: determineExitX(activePane) }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="absolute inset-0 overflow-auto"
                >
                  {activePane === "payslip" ? (
                    <div className="h-full overflow-auto">
                      <PayslipPane
                        currentDate={currentDate}
                        handlePreviousMonth={handlePreviousMonth}
                        handleNextMonth={handleNextMonth}
                        zoomLevel={zoomLevel}
                        handleZoomIn={handleZoomIn}
                        handleZoomOut={handleZoomOut}
                        setCurrentDate={setCurrentDate}
                      />
                    </div>
                  ) : activePane === "insights" ? (
                    <div className="h-full overflow-auto p-4">
                      <PayslipInsights currentDate={currentDate} />
                    </div>
                  ) : (
                    <div className="h-full overflow-auto">
                      <ChatPane showHistory={showHistory} setShowHistory={setShowHistory} currentDate={currentDate} />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Fixed footer - only disclaimer links are hidden in chat view, copyright remains visible */}
            <div className="fixed bottom-0 left-0 right-0 z-20 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              {activePane === "payslip" ? (
                <Footer />
              ) : (
                <div className="py-2 px-4 text-xs text-center text-muted-foreground">
                  {t('footer.copyright').replace('{year}', new Date().getFullYear().toString())}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="w-1/2 overflow-hidden transition-colors duration-300 p-2">
              <div className="glass-card h-full rounded-2xl border-0 overflow-hidden">
                <PayslipPane
                  currentDate={currentDate}
                  handlePreviousMonth={handlePreviousMonth}
                  handleNextMonth={handleNextMonth}
                  zoomLevel={zoomLevel}
                  handleZoomIn={handleZoomIn}
                  handleZoomOut={handleZoomOut}
                  setCurrentDate={setCurrentDate}
                />
              </div>
            </div>
            <div className="w-1/2 overflow-hidden p-2">
              <div className="glass-card h-full rounded-2xl border-0 overflow-hidden">
                <ChatPane showHistory={showHistory} setShowHistory={setShowHistory} currentDate={currentDate} />
              </div>
            </div>
          </>
        )}
      </main>
      
      {!isMobile && <Footer />}
    </div>
  )
}

interface PayslipPaneProps {
  currentDate: { month: number; year: number }
  handlePreviousMonth: () => void
  handleNextMonth: () => void
  zoomLevel: number
  handleZoomIn: () => void
  handleZoomOut: () => void
  setCurrentDate: React.Dispatch<React.SetStateAction<{ month: number; year: number }>>
}

function PayslipPane({
  currentDate,
  handlePreviousMonth,
  handleNextMonth,
  zoomLevel,
  handleZoomIn,
  handleZoomOut,
  setCurrentDate,
}: PayslipPaneProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { t, direction } = useLanguage()
  const isMobile = useMobile()
  
  return (
    <div className="flex flex-col h-full w-full p-4 space-y-4">
      {/* Date Selector and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={direction === 'rtl' ? handleNextMonth : handlePreviousMonth}
            className="rounded-full h-8 w-8 p-0 flex items-center justify-center"
            aria-label={direction === 'rtl' ? t('monthYearPicker.nextMonth') : t('monthYearPicker.previousMonth')}
          >
            {direction === 'rtl' ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          <MonthYearPicker
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={direction === 'rtl' ? handlePreviousMonth : handleNextMonth}
            className="rounded-full h-8 w-8 p-0 flex items-center justify-center"
            aria-label={direction === 'rtl' ? t('monthYearPicker.previousMonth') : t('monthYearPicker.nextMonth')}
          >
            {direction === 'rtl' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            className="rounded-full h-8 w-8 p-0 flex items-center justify-center"
            disabled={zoomLevel <= 50}
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[40px] text-center">
            {zoomLevel}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            className="rounded-full h-8 w-8 p-0 flex items-center justify-center"
            disabled={zoomLevel >= 150}
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Payslip Summary Cards */}
      <PayslipSummary currentDate={currentDate} />
      
      {/* AI Insights - only shown in desktop mode */}
      {!isMobile && <PayslipInsights currentDate={currentDate} />}

      {/* Payslip Viewer */}
      <div className="flex-1 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 relative">
        <PayslipViewer currentDate={currentDate} zoomLevel={zoomLevel} />
        
        {/* Floating expand button */}
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setDialogOpen(true)}
          className="absolute bottom-4 right-4 h-10 w-10 rounded-full shadow-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label={t('payslip.expand')}
        >
          <Expand className="h-5 w-5 text-foreground" />
        </Button>
      </div>
      
      {/* Payslip Dialog */}
      <PayslipDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        currentDate={currentDate} 
        zoomLevel={zoomLevel} 
      />
    </div>
  )
}

interface ChatPaneProps {
  showHistory: boolean
  setShowHistory: React.Dispatch<React.SetStateAction<boolean>>
  currentDate: { month: number; year: number }
}

function ChatPane({ showHistory, setShowHistory, currentDate }: ChatPaneProps) {
  const isMobile = useMobile()
  const { t } = useLanguage()
  
  return (
    <div className="flex flex-col h-full">
      <div className={`glass-subtle border-0 shadow-sm transition-colors duration-300 ${isMobile ? "p-3 sticky top-0 z-10" : "p-4"} rounded-t-2xl`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-300 text-transparent bg-clip-text">
              {t('chat.assistant')}
            </h2>
          </div>
          <Button
            variant={showHistory ? "default" : "outline"}
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className={`rounded-full transition-all duration-300 ${
              showHistory
                ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md"
                : "glass-button-outline text-foreground"
            }`}
          >
            <History className="h-4 w-4 mr-2" />
            {showHistory ? t('chat.hideHistory') : t('chat.showHistory')}
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto transition-colors duration-300 rounded-b-2xl">
        <ChatInterface showHistory={showHistory} currentDate={currentDate} />
      </div>
    </div>
  )
}

// Helper function to determine the initial x value for animation
function determineInitialX(activePane: "payslip" | "insights" | "chat"): number {
  return activePane === "payslip" ? -20 : 20
}

// Helper function to determine the exit x value for animation
function determineExitX(activePane: "payslip" | "insights" | "chat"): number {
  return activePane === "payslip" ? 20 : -20
} 