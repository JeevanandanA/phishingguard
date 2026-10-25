import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AppContext = createContext(null)

const STORAGE_KEYS = {
  theme: 'phishguard-theme',
  reports: 'phishguard-reports',
  auth: 'phishguard-auth',
}

const DEFAULT_ADMIN = {
  id: 1,
  username: 'Admin',
  email: 'admin@phishguard.com',
}

const DEFAULT_ADMIN_PASSWORD = 'admin123'

const fallbackReports = [
  {
    id: 1,
    createdAt: new Date().toISOString(),
    source: 'Workspace',
    title: 'URL Scanner',
    result: 'PHISHING',
    score: 95,
    summary: 'Threat cluster detected in a phishing simulation sample.',
  },
  {
    id: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    source: 'Email Analyzer',
    title: 'Email Analyzer',
    result: 'SUSPICIOUS',
    score: 71,
    summary: 'Urgency cues and impersonation markers surfaced.',
  },
  {
    id: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    source: 'SMS Scanner',
    title: 'SMS Scanner',
    result: 'SAFE',
    score: 24,
    summary: 'The message was classified as low-risk without known indicators.',
  },
]

function readStoredValue(key, fallback) {
  if (typeof window === 'undefined') return fallback

  try {
    const value = window.localStorage.getItem(key)
    if (!value) return fallback
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => readStoredValue(STORAGE_KEYS.theme, 'dark'))
  const [scanReports, setScanReports] = useState(() => {
    const storedReports = readStoredValue(STORAGE_KEYS.reports, [])
    return storedReports.length ? storedReports : fallbackReports
  })
  const [authUser, setAuthUser] = useState(() => readStoredValue(STORAGE_KEYS.auth, null))
  const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(theme))
  }, [theme])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.reports, JSON.stringify(scanReports))
  }, [scanReports])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.auth, JSON.stringify(authUser))
  }, [authUser])

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  const addScanReport = (report) => {
    setScanReports((current) => [
      {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        ...report,
      },
      ...current,
    ].slice(0, 12))
  }

  const login = async (email, password) => {
    setAuthLoading(true)
    try {
      const isDefaultAdmin = email?.trim().toLowerCase() === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN_PASSWORD

      if (isDefaultAdmin) {
        setAuthUser(DEFAULT_ADMIN)
        return DEFAULT_ADMIN
      }

      try {
        const response = await fetch('http://localhost:5001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        const data = await response.json()
        if (!response.ok || !data?.ok) throw new Error(data?.error || 'Login failed')
        setAuthUser(data.user)
        return data.user
      } catch {
        if (email?.trim().toLowerCase() === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN_PASSWORD) {
          setAuthUser(DEFAULT_ADMIN)
          return DEFAULT_ADMIN
        }
        throw new Error('Invalid email or password')
      }
    } finally {
      setAuthLoading(false)
    }
  }

  const register = async (username, email, password) => {
    setAuthLoading(true)
    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      })
      const data = await response.json()
      if (!response.ok || !data?.ok) throw new Error(data?.error || 'Registration failed')
      setAuthUser(data.user)
      return data.user
    } finally {
      setAuthLoading(false)
    }
  }

  const logout = () => {
    setAuthUser(null)
  }

  const value = useMemo(() => ({
    theme,
    toggleTheme,
    scanReports,
    addScanReport,
    authUser,
    authLoading,
    login,
    register,
    logout,
  }), [theme, scanReports, authUser, authLoading])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider')
  }

  return context
}
