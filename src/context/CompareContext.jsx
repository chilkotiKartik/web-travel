import { createContext, useContext, useEffect, useState } from 'react'

const CompareContext = createContext(null)
const STORAGE_KEY = 'wayfare_compare_slugs'
const MAX_COMPARE = 4

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CompareProvider({ children }) {
  const [slugs, setSlugs] = useState(readStored)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs))
    } catch {
      // ignore write failures (private mode, quota, etc.)
    }
  }, [slugs])

  function toggle(slug) {
    setSlugs((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug)
      if (prev.length >= MAX_COMPARE) return prev
      return [...prev, slug]
    })
  }

  function remove(slug) {
    setSlugs((prev) => prev.filter((s) => s !== slug))
  }

  function clear() {
    setSlugs([])
  }

  return (
    <CompareContext.Provider value={{ slugs, toggle, remove, clear, max: MAX_COMPARE, isFull: slugs.length >= MAX_COMPARE }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used within CompareProvider')
  return ctx
}
