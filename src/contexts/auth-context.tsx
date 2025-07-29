

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Mock user interface to replace Supabase User type
interface MockUser {
  id: string
  email: string
  role?: string
  name?: string
  created_at: string
}

// Mock session interface to replace Supabase Session type
interface MockSession {
  user: MockUser
  access_token: string
  expires_at: number
}

interface AuthContextType {
  user: MockUser | null
  session: MockSession | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null)
  const [session, setSession] = useState<MockSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session in localStorage
    const getInitialSession = async () => {
      try {
        const savedSession = localStorage.getItem('mockSession')
        if (savedSession) {
          const sessionData = JSON.parse(savedSession)
          // Check if session is still valid (not expired)
          if (sessionData.expires_at > Date.now()) {
            setSession(sessionData)
            setUser(sessionData.user)
          } else {
            // Clear expired session
            localStorage.removeItem('mockSession')
          }
        }
      } catch (error) {
        console.error('Error loading session:', error)
        localStorage.removeItem('mockSession')
      }
      setLoading(false)
    }

    getInitialSession()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      // Mock authentication - in real app, this would validate credentials
      if (!email || !password) {
        return { error: { message: 'Email and password are required' } }
      }

      // Create mock user and session
      const mockUser: MockUser = {
        id: 'mock-user-' + Date.now(),
        email: email,
        role: email.includes('admin') ? 'admin' : 'user',
        name: email.split('@')[0],
        created_at: new Date().toISOString()
      }

      const mockSession: MockSession = {
        user: mockUser,
        access_token: 'mock-token-' + Date.now(),
        expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      }

      // Save session to localStorage
      localStorage.setItem('mockSession', JSON.stringify(mockSession))
      
      setSession(mockSession)
      setUser(mockUser)
      
      return { error: null }
    } catch (error) {
      return { error: { message: 'Authentication failed' } }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      // Mock sign up - automatically signs in the user
      if (!email || !password) {
        return { error: { message: 'Email and password are required' } }
      }

      if (password.length < 6) {
        return { error: { message: 'Password must be at least 6 characters' } }
      }

      // Use same logic as sign in for simplicity
      return await signIn(email, password)
    } catch (error) {
      return { error: { message: 'Sign up failed' } }
    }
  }

  const signOut = async () => {
    try {
      // Clear session from localStorage
      localStorage.removeItem('mockSession')
      setSession(null)
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      // Mock password reset - just return success
      if (!email) {
        return { error: { message: 'Email is required' } }
      }
      
      console.log('Mock password reset sent to:', email)
      return { error: null }
    } catch (error) {
      return { error: { message: 'Password reset failed' } }
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 