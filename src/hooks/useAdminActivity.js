import { useEffect, useState } from 'react'
import { fetchAllEnquiries, fetchAllBookings } from '../lib/api'
import { countNewSince } from '../lib/adminActivity'

/** Total unseen leads + bookings, for a small badge on the Admin Panel nav link.
 * Only fetches for admins (RLS returns empty arrays to everyone else anyway,
 * but there's no reason to query at all for non-admin sessions). */
export function useAdminActivityCount(isAdmin) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isAdmin) return
    let cancelled = false
    Promise.all([fetchAllEnquiries(), fetchAllBookings()])
      .then(([enquiries, bookings]) => {
        if (cancelled) return
        setCount(countNewSince(enquiries, 'leads') + countNewSince(bookings, 'bookings'))
      })
      .catch(() => {
        if (!cancelled) setCount(0)
      })
    return () => {
      cancelled = true
    }
  }, [isAdmin])

  return count
}
