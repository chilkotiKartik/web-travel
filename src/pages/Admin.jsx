import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Container, ErrorState } from '../components/ui/States'
import { Reveal } from '../components/ui/Reveal'
import { useAuth } from '../context/AuthContext'
import { useAsync } from '../hooks/useAsync'
import { fetchAllBookings, fetchAllContactMessages, fetchAllNewsletterSubscribers } from '../lib/api'

const dateFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

function formatPrice(price) {
  return `₹${(price || 0).toLocaleString('en-IN')}`
}

function StatCard({ label, value, icon, accent, delay = 0 }) {
  return (
    <Reveal delay={delay} className={`rounded-2xl border border-ink-900/8 bg-white p-5`}>
      <div className="flex items-center gap-3">
        <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-xl ${accent}`}>{icon}</span>
        <div>
          <p className="font-display text-2xl font-extrabold text-ink-900">{value}</p>
          <p className="text-xs font-medium text-ink-500">{label}</p>
        </div>
      </div>
    </Reveal>
  )
}

const TABS = [
  { id: 'bookings', label: 'Bookings' },
  { id: 'messages', label: 'Messages' },
  { id: 'subscribers', label: 'Subscribers' },
]

export default function Admin() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('bookings')

  const bookingsQ = useAsync(fetchAllBookings, [user?.id])
  const messagesQ = useAsync(fetchAllContactMessages, [user?.id])
  const subscribersQ = useAsync(fetchAllNewsletterSubscribers, [user?.id])

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) navigate('/', { replace: true })
  }, [authLoading, user, navigate])

  if (authLoading || !user || !user.isAdmin) return null

  const bookings = bookingsQ.data || []
  const revenue = bookings.reduce((sum, b) => sum + (b.total || 0), 0)
  const messages = messagesQ.data || []
  const subscribers = subscribersQ.data || []

  return (
    <section className="bg-mist-100/40 py-16 sm:py-24">
      <Container>
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Admin</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-ink-900">Control Room</h1>
          <p className="mt-1 text-sm text-ink-500">Signed in as {user.name} ({user.email})</p>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total bookings" value={bookings.length} icon="🧭" accent="bg-blue-100 text-blue-600" delay={0} />
          <StatCard label="Revenue booked" value={formatPrice(revenue)} icon="💰" accent="bg-green-100 text-green-600" delay={0.05} />
          <StatCard label="Contact messages" value={messages.length} icon="✉️" accent="bg-blue-100 text-blue-600" delay={0.1} />
          <StatCard label="Newsletter subscribers" value={subscribers.length} icon="📬" accent="bg-green-100 text-green-600" delay={0.15} />
        </div>

        <div className="mt-10 flex gap-2 rounded-full bg-white p-1.5 shadow-sm sm:inline-flex">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                tab === t.id ? 'text-white' : 'text-ink-700 hover:bg-mist-100'
              }`}
            >
              {tab === t.id && (
                <motion.span layoutId="admin-tab" className="absolute inset-0 rounded-full bg-blue-600" transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />
              )}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-ink-900/8 bg-white">
          {tab === 'bookings' && (
            <BookingsTable query={bookingsQ} />
          )}
          {tab === 'messages' && (
            <MessagesTable query={messagesQ} />
          )}
          {tab === 'subscribers' && (
            <SubscribersTable query={subscribersQ} />
          )}
        </div>
      </Container>
    </section>
  )
}

function BookingsTable({ query }) {
  if (query.status === 'loading') return <TableSkeleton cols={6} />
  if (query.status === 'error') return <div className="p-6"><ErrorState message={query.error?.message} onRetry={query.reload} /></div>
  if (query.data.length === 0) return <EmptyPanel text="No bookings yet." />
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-mist-100/60 text-xs uppercase tracking-wide text-ink-500">
          <tr>
            <th className="px-5 py-3 font-semibold">Trip</th>
            <th className="px-5 py-3 font-semibold">Traveller</th>
            <th className="px-5 py-3 font-semibold">Date</th>
            <th className="px-5 py-3 font-semibold">Travellers</th>
            <th className="px-5 py-3 font-semibold">Total</th>
            <th className="px-5 py-3 font-semibold">Booked</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-900/6">
          {query.data.map((b) => (
            <tr key={b.id} className="hover:bg-mist-100/40">
              <td className="px-5 py-3">
                <p className="font-semibold text-ink-900">{b.tourTitle}</p>
                <p className="text-xs text-ink-500">{b.destination}</p>
              </td>
              <td className="px-5 py-3">
                <p className="text-ink-900">{b.contact.name}</p>
                <p className="text-xs text-ink-500">{b.contact.email}</p>
              </td>
              <td className="px-5 py-3 text-ink-700">{b.date || '—'}</td>
              <td className="px-5 py-3 text-ink-700">{b.travelers}</td>
              <td className="px-5 py-3 font-semibold text-ink-900">{formatPrice(b.total)}</td>
              <td className="px-5 py-3 text-xs text-ink-500">{dateFmt.format(new Date(b.createdAt))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function MessagesTable({ query }) {
  if (query.status === 'loading') return <TableSkeleton cols={4} />
  if (query.status === 'error') return <div className="p-6"><ErrorState message={query.error?.message} onRetry={query.reload} /></div>
  if (query.data.length === 0) return <EmptyPanel text="No messages yet." />
  return (
    <div className="divide-y divide-ink-900/6">
      {query.data.map((m) => (
        <div key={m.id} className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-ink-900">{m.name}</p>
              <p className="text-xs text-ink-500">{m.email}{m.phone ? ` · ${m.phone}` : ''}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-600">{m.subject}</span>
              <span className="text-xs text-ink-500">{dateFmt.format(new Date(m.createdAt))}</span>
            </div>
          </div>
          <p className="mt-2 text-sm text-ink-700">{m.message}</p>
        </div>
      ))}
    </div>
  )
}

function SubscribersTable({ query }) {
  if (query.status === 'loading') return <TableSkeleton cols={2} />
  if (query.status === 'error') return <div className="p-6"><ErrorState message={query.error?.message} onRetry={query.reload} /></div>
  if (query.data.length === 0) return <EmptyPanel text="No subscribers yet." />
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-mist-100/60 text-xs uppercase tracking-wide text-ink-500">
          <tr>
            <th className="px-5 py-3 font-semibold">Email</th>
            <th className="px-5 py-3 font-semibold">Subscribed</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-900/6">
          {query.data.map((s) => (
            <tr key={s.id} className="hover:bg-mist-100/40">
              <td className="px-5 py-3 text-ink-900">{s.email}</td>
              <td className="px-5 py-3 text-xs text-ink-500">{dateFmt.format(new Date(s.createdAt))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TableSkeleton({ cols }) {
  return (
    <div className="animate-pulse space-y-3 p-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-4 flex-1 rounded bg-mist-100" />
          ))}
        </div>
      ))}
    </div>
  )
}

function EmptyPanel({ text }) {
  return <div className="p-10 text-center text-sm text-ink-500">{text}</div>
}
