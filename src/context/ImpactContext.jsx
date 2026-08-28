import { createContext, useContext, useEffect, useState } from 'react'

const ImpactContext = createContext(null)

// Default impact data (fallback if API is not available)
const DEFAULT_IMPACT = {
  totalFundsRaised: 15240, // in ZAR
  totalOrdersProcessed: 124,
  youthMentored: 342,
  familiesFed: 87,
  communityProjects: 12,
  daysActive: 45,
}

export function ImpactProvider({ children }) {
  const [impact, setImpact] = useState(DEFAULT_IMPACT)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch real impact data from API (when backend is ready)
  useEffect(() => {
    const fetchImpact = async () => {
      const API_URL = import.meta.env.VITE_API_URL
      if (!API_URL) {
        // Gracefully fallback to default data if API not configured
        return
      }

      setLoading(true)
      try {
        const res = await fetch(`${API_URL}/api/impact/metrics`, { method: 'GET' })
        if (res.ok) {
          const data = await res.json()
          setImpact(data)
          setError(null)
        } else {
          setError('Unable to load impact metrics')
        }
      } catch (err) {
        console.error('Error fetching impact metrics:', err)
        setError('Connection error')
      } finally {
        setLoading(false)
      }
    }

    fetchImpact()
    // Refresh every 5 minutes for live updates
    const interval = setInterval(fetchImpact, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const value = { impact, loading, error }
  return <ImpactContext.Provider value={value}>{children}</ImpactContext.Provider>
}

export function useImpact() {
  const ctx = useContext(ImpactContext)
  if (!ctx) throw new Error('useImpact must be used within ImpactProvider')
  return ctx
}
