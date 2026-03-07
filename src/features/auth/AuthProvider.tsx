import React, { createContext, useContext, useState } from 'react'
import { MOCK_USER, type MockUser } from './mock-user'

const MOCK_CREDENTIALS = { username: 'admin', password: 'admin' }
const SESSION_KEY = 'grande_auth'

interface AuthContextValue {
  user: MockUser
  isAuthenticated: boolean
  hasPermission: (permission: string) => boolean
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === 'true'
  )

  const login = (username: string, password: string): boolean => {
    if (username === MOCK_CREDENTIALS.username && password === MOCK_CREDENTIALS.password) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setIsAuthenticated(false)
  }

  const hasPermission = (permission: string) =>
    MOCK_USER.permissions.includes(permission) || MOCK_USER.role === 'admin'

  return (
    <AuthContext.Provider value={{ user: MOCK_USER, isAuthenticated, hasPermission, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
