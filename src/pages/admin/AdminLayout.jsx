import { Suspense, useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Container } from '../../components/ui/States'
import { useAuth } from '../../context/AuthContext'
import { AdminDataProvider, useAdminData } from '../../context/AdminDataContext'
import { countNewSince, markSeen } from '../../lib/adminActivity'
import { Badge } from '../../components/admin/ui'
import { useSeo } from '../../components/Seo'

const NAV = [
  { to: '/admin', end: true, label: 'Dashboard', icon: '📊', badgeKey: null },
  { to: '/admin/leads', label: 'Leads', icon: '🧲', badgeKey: 'leads' },
  { to: '/admin/bookings', label: 'Bookings', icon: '🧭', badgeKey: 'bookings' },
  { to: '/admin/messages', label: 'Messages', icon: '✉️', badgeKey: 'messages' },
  { to: '/admin/subscribers', label: 'Subscribers', icon: '📬', badgeKey: 'subscribers' },
  { to: '/admin/trips', label: 'Trip Catalogue', icon: '🏔️', badgeKey: null },
  { to: '/admin/reports', label: 'Reports', icon: '📈', badgeKey: null },
]

/** Marks the section as seen once its data has actually loaded, so the badge
 * clears against rows the admin has really had a chance to look at. */
function useMarkSectionSeen() {
  const { pathname } = useLocation()
  const { enquiries, bookings, messages, subscribers } = useAdminData()
  const loaded = {
    leads: enquiries.status === 'success',
    bookings: bookings.status === 'success',
    messages: messages.status === 'success',
    subscribers: subscribers.status === 'success',
  }
  const section = NAV.find((n) => n.to === pathname)?.badgeKey
  const ready = section ? loaded[section] : false

  useEffect(() => {
    if (section && ready) markSeen(section)
  }, [section, ready])
}

function Sidebar() {
  const { enquiries, bookings, messages, subscribers } = useAdminData()
  const counts = {
    leads: countNewSince(enquiries.data, 'leads'),
    bookings: countNewSince(bookings.data, 'bookings'),
    messages: countNewSince(messages.data, 'messages'),
    subscribers: countNewSince(subscribers.data, 'subscribers'),
  }

  return (
    <nav className="flex gap-1.5 overflow-x-auto pb-2 lg:sticky lg:top-28 lg:flex-col lg:overflow-visible lg:pb-0">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `group relative flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors lg:w-full ${
              isActive ? 'text-white' : 'text-ink-700 hover:bg-white'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId="admin-nav-pill"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 shadow-[0_10px_24px_-14px_rgba(19,97,224,0.9)]"
                  transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
                />
              )}
              <span className="relative text-base">{item.icon}</span>
              <span className="relative whitespace-nowrap">{item.label}</span>
              {!isActive && item.badgeKey && <Badge count={counts[item.badgeKey]} />}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function RefreshBar() {
  const { reloadAll, lastLoadedAt, enquiries, bookings, messages, subscribers } = useAdminData()
  const loading = [enquiries, bookings, messages, subscribers].some((q) => q.status === 'loading')

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-xs text-ink-500 sm:inline">
        {loading ? 'Syncing…' : lastLoadedAt ? `Updated ${lastLoadedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}` : ''}
      </span>
      <button
        type="button"
        onClick={reloadAll}
        disabled={loading}
        className="inline-flex items-center gap-1.5 rounded-full border border-ink-900/15 bg-white px-4 py-2 text-xs font-bold text-ink-900 transition-colors hover:bg-mist-100 disabled:opacity-50"
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className={loading ? 'animate-spin' : ''}>
          <path d="M14 8a6 6 0 1 1-1.8-4.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M13.5 1.5V5H10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Refresh
      </button>
    </div>
  )
}

function AdminShell() {
  const { user } = useAuth()
  useMarkSectionSeen()

  return (
    <section className="min-h-[70vh] bg-mist-100/50 pb-16 pt-24 sm:pt-28">
      <Container>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Wayfare Admin</p>
            <p className="mt-0.5 font-display text-lg font-bold text-ink-900">Control Room</p>
            <p className="text-xs text-ink-500">
              {user.name} · {user.email}
            </p>
          </div>
          <RefreshBar />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
          <Sidebar />
          <div className="min-w-0">
            <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-white" />}>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default function AdminLayout() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  useSeo({ title: 'Admin', description: 'Wayfare internal control room.' })

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) navigate('/', { replace: true })
  }, [loading, user, navigate])

  if (loading || !user || !user.isAdmin) return null

  return (
    <AdminDataProvider>
      <AdminShell />
    </AdminDataProvider>
  )
}
