import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser, onAuthChange, logIn, signUp, logOut } from '../lib/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser())

  useEffect(() => onAuthChange(setUser), [])

  return <AuthContext.Provider value={{ user, logIn, signUp, logOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
