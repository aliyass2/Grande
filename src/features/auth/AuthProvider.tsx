import React, { createContext, useContext } from 'react'
import { MOCK_USER, type MockUser } from './mock-user'

interface AuthContextValue {
  user: MockUser
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hasPermission = (permission: string) =>
    MOCK_USER.permissions.includes(permission) || MOCK_USER.role === 'admin'

  return (
    <AuthContext.Provider value={{ user: MOCK_USER, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
