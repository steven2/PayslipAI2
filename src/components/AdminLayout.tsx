import type React from "react"

import { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import {
  FileText,
  Users,
  Database,
  Calculator,
  MessageSquare,
  Shield,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Globe,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { useMobile } from "@/hooks/use-mobile"
import { useLanguage } from "@/contexts/language-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useMobile()
  const { t, direction, language, setLanguage } = useLanguage()

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Language flags - simple emoji flags
  const languages = [
    { code: 'en' as const, name: t('languages.en'), flag: '🇺🇸' },
    { code: 'fr' as const, name: t('languages.fr'), flag: '🇫🇷' },
    { code: 'he' as const, name: t('languages.he'), flag: '🇮🇱' },
  ]

  // Get current language flag
  const currentLanguage = languages.find(lang => lang.code === language) || languages[0]

  const navigation = [
    { name: t('navigation.dashboard') || "Dashboard", href: "/admin", icon: Home },
    { name: t('navigation.documents') || "Documents", href: "/admin/documents", icon: FileText },
    { name: t('navigation.employees') || "Employees", href: "/admin/employees", icon: Users },
    { name: t('navigation.payroll') || "Payroll", href: "/admin/payroll", icon: Database },
    { name: t('navigation.wageTypes') || "Wage Types", href: "/admin/wage-types", icon: Calculator },
    { name: t('navigation.chatbot') || "Chatbot", href: "/admin/chatbot", icon: MessageSquare },
    { name: t('navigation.access') || "Access", href: "/admin/access", icon: Shield },
    { name: t('navigation.settings') || "Settings", href: "/admin/settings", icon: Settings },
  ]

  return (
    <div className="flex h-screen" dir={direction}>
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 glass bg-opacity-50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`glass-card ${isMobile ? "fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out" : "w-64 flex-shrink-0"} ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 border-0 rounded-none lg:rounded-r-2xl lg:m-2 lg:mr-0 shadow-xl`}>
        <div className="flex flex-col flex-grow overflow-y-auto">
          <div className="flex items-center h-16 flex-shrink-0 px-4 glass-subtle border-0 rounded-t-2xl lg:rounded-tr-none">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-300 text-transparent bg-clip-text">
                Admin
              </h1>
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                    location.pathname === item.href
                      ? "glass-button text-purple-600 dark:text-purple-400 font-semibold"
                      : "text-foreground hover:glass-button-ghost"
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      location.pathname === item.href
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">AD</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Admin User</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">admin@example.com</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <LogOut className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className={`fixed inset-0 z-40 flex ${mobileMenuOpen ? "" : "pointer-events-none"}`}>
          <div
            className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-in-out duration-300 ${
              mobileMenuOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          <div
            className={`relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 transition ease-in-out duration-300 transform ${
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <h1 className="ml-2 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-300 text-transparent bg-clip-text">
                  {t('admin.title') || "Admin"}
                </h1>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md transition-all duration-300 ${
                      location.pathname === item.href
                        ? "glass-button text-purple-600 dark:text-purple-400 font-semibold"
                        : "text-foreground hover:glass-button-ghost"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon
                      className={`mr-4 h-6 w-6 ${
                        location.pathname === item.href
                          ? "text-purple-600 dark:text-purple-400"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">AD</span>
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-foreground">{t('admin.userTitle') || "Admin User"}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">admin@example.com</p>
                </div>
              </div>
              
              {/* Mobile language selector */}
              <div className="flex items-center ml-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <span className="mr-1 text-base">{currentLanguage.flag}</span>
                      <ChevronDown className="h-3 w-3 text-gray-500 dark:text-gray-400" />
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden p-2 pl-0 lg:pl-2">
        <div className="glass-card flex flex-col h-full border-0 rounded-2xl shadow-xl overflow-hidden">
          <header className="glass-subtle shadow-sm z-10 border-0 rounded-t-2xl">
            <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <button
                  className="md:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <span className="sr-only">Open sidebar</span>
                  <Menu className="h-6 w-6" />
                </button>
                <div className="md:hidden ml-2 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-300 text-transparent bg-clip-text">
                  {t('admin.title') || "Admin"}
                </div>
              </div>
              <div className="flex items-center">
                <Link to="/" className="ml-4">
                  <Button variant="outline" size="sm" className="rounded-full glass-button-outline">
                    <Home className="h-4 w-4 mr-2" />
                    {t('navigation.backToApp') || "Back to App"}
                  </Button>
                </Link>
                
                {/* Language Selector */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full ml-2 glass-button-ghost flex items-center"
                    >
                      <span className="mr-1 text-base">{currentLanguage.flag}</span>
                      <ChevronDown className="h-3 w-3 text-gray-500 dark:text-gray-400" />
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
                
                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-full glass-button-ghost ml-2"
                >
                  {theme === "dark" ? (
                    <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  )}
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto rounded-b-2xl">{children}</main>
        </div>
      </div>
    </div>
  )
} 