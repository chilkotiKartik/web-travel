import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  fetchAllBookings,
  fetchAllContactMessages,
  fetchAllNewsletterSubscribers,
  fetchAllEnquiries,
} from '../lib/api'

const AdminDataContext = createContext(null)

const SOURCES = {
  enquiries: fetchAllEnquiries,
  bookings: fetchAllBookings,
  messages: fetchAllContactMessages,
  subscribers: fetchAllNewsletterSubscribers,
}

const EMPTY = { status: 'loading', data: [], error: null }

/** Loads every admin dataset once for the whole admin section, so moving
 * between admin pages is instant instead of refetching four tables each time. */
export function AdminDataProvider({ children }) {
  const [state, setState] = useState({
    enquiries: EMPTY,
    bookings: EMPTY,
    messages: EMPTY,
    subscribers: EMPTY,
  })
  const [lastLoadedAt, setLastLoadedAt] = useState(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const load = useCallback(async (key) => {
    setState((prev) => ({ ...prev, [key]: { ...prev[key], status: prev[key].data.length ? prev[key].status : 'loading' } }))
    try {
      const data = await SOURCES[key]()
      if (!mounted.current) return
      setState((prev) => ({ ...prev, [key]: { status: 'success', data, error: null } }))
    } catch (error) {
      if (!mounted.current) return
      setState((prev) => ({ ...prev, [key]: { status: 'error', data: [], error } }))
    }
  }, [])

  const reloadAll = useCallback(async () => {
    await Promise.all(Object.keys(SOURCES).map((key) => load(key)))
    if (mounted.current) setLastLoadedAt(new Date())
  }, [load])

  useEffect(() => {
    reloadAll()
  }, [reloadAll])

  const value = useMemo(
    () => ({
      ...state,
      lastLoadedAt,
      reloadAll,
      reload: load,
    }),
    [state, lastLoadedAt, reloadAll, load]
  )

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext)
  if (!ctx) throw new Error('useAdminData must be used inside AdminDataProvider')
  return ctx
}
