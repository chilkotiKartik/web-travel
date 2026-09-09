import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser, onAuthChange, logIn, signUp, logOut } from '../lib/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u)
      setLoading(false)
    })
    return onAuthChange(setUser)
  }, [])

  return <AuthContext.Provider value={{ user, loading, logIn, signUp, logOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
