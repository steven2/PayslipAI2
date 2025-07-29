import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/contexts/auth-context'
import { LanguageProvider } from '@/contexts/language-context'
import { SettingsProvider } from '@/contexts/settings-context'
import { PayslipCacheProvider } from '@/contexts/payslip-cache'
import { ChatCacheProvider } from '@/contexts/chat-cache'

// Import page components
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import AdminDashboard from '@/pages/AdminDashboard'
import AdminDocuments from '@/pages/AdminDocuments'
import AdminEmployees from '@/pages/AdminEmployees'
import AdminPayroll from '@/pages/AdminPayroll'
import AdminChatbot from '@/pages/AdminChatbot'
import AdminWageTypes from '@/pages/AdminWageTypes'
import AdminSettings from '@/pages/AdminSettings'
import AdminAccess from '@/pages/AdminAccess'
import AdminLayout from '@/components/AdminLayout'

// Admin wrapper component for better routing
function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="documents" element={<AdminDocuments />} />
        <Route path="employees" element={<AdminEmployees />} />
        <Route path="payroll" element={<AdminPayroll />} />
        <Route path="chatbot" element={<AdminChatbot />} />
        <Route path="wage-types" element={<AdminWageTypes />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="access" element={<AdminAccess />} />
      </Routes>
    </AdminLayout>
  )
}

function App() {
  return (
    <Router>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AuthProvider>
          <LanguageProvider>
            <SettingsProvider>
              <PayslipCacheProvider>
                <ChatCacheProvider>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/admin/*" element={<AdminRoutes />} />
                  </Routes>
                </ChatCacheProvider>
              </PayslipCacheProvider>
            </SettingsProvider>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App 