import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getCurrentUser, loginUser, registerUser } from '../lib/api.js'

const STORAGE_KEY = 'kingdomdrip.auth'

const AuthContext = createContext(null)

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { token: null, user: null }
    const parsed = JSON.parse(raw)
    return {
      token: parsed?.token || null,
      user: parsed?.user || null,
    }
  } catch {
    return { token: null, user: null }
  }
}

function persistAuth(auth) {
  if (!auth?.token) {
    localStorage.removeItem(STORAGE_KEY)
    return
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
}

export function AuthProvider({ children }) {
  const [{ token, user }, setAuth] = useState(() => readStoredAuth())
  const [loading, setLoading] = useState(Boolean(token))

  useEffect(() => {
    let active = true

    async function refreshUser() {
      if (!token) {
        setLoading(false)
        return
      }

      const latestUser = await getCurrentUser(token)
      if (!active) return

      if (!latestUser) {
        setAuth({ token: null, user: null })
        persistAuth(null)
        setLoading(false)
        return
      }

      setAuth((prev) => {
        const next = { token: prev.token, user: latestUser }
        persistAuth(next)
        return next
      })
      setLoading(false)
    }

    refreshUser()

    return () => {
      active = false
    }
  }, [token])

  async function signUp(payload) {
    const result = await registerUser(payload)
    const next = { token: result.token, user: result.user || null }
    setAuth(next)
    persistAuth(next)
    return next
  }

  async function signIn(payload) {
    const result = await loginUser(payload)
    const next = { token: result.token, user: result.user || null }
    setAuth(next)
    persistAuth(next)
    return next
  }

  function signOut() {
    setAuth({ token: null, user: null })
    persistAuth(null)
  }

  const value = useMemo(() => ({
    token,
    user,
    loading,
    isAuthenticated: Boolean(token),
    signUp,
    signIn,
    signOut,
  }), [token, user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
