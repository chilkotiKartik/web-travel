import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Container, SkeletonGrid, ErrorState, EmptyState } from '../components/ui/States'
import { Reveal } from '../components/ui/Reveal'
import { useAuth } from '../context/AuthContext'
import { useAsync } from '../hooks/useAsync'
import { fetchBookings } from '../lib/api'
import { Img } from '../components/ui/Img'
import { getTourBySlug } from '../data/tours'

const dateFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

function formatPrice(price) {
  return `₹${(price || 0).toLocaleString('en-IN')}`
}

export default function Account() {
  const { user, logOut } = useAuth()
  const navigate = useNavigate()
  const { status, data, error, reload } = useAsync(fetchBookings, [])

  useEffect(() => {
    if (!user) navigate('/login', { replace: true, state: { from: '/account' } })
  }, [user, navigate])

  if (!user) return null

  const myBookings = (data || [])
    .filter((b) => b.contact?.email?.toLowerCase() === user.email)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  function handleLogout() {
    logOut()
    navigate('/')
  }

  return (
    <section className="bg-mist-100/40 py-16 sm:py-24">
      <Container className="max-w-3xl">
        <Reveal className="flex items-center justify-between gap-4 rounded-3xl border border-ink-900/8 bg-white p-6">
          <div className="flex items-center gap-4">
            <span className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-green-500 font-display text-xl font-extrabold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <div>
              <h1 className="font-display text-xl font-extrabold text-ink-900">{user.name}</h1>
              <p className="text-sm text-ink-500">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="shrink-0 rounded-full border border-ink-900/15 px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:bg-mist-100"
          >
            Log Out
          </button>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">My Bookings</p>
          <h2 className="mt-1 font-display text-2xl font-extrabold text-ink-900">
            {status === 'success' ? `${myBookings.length} trip${myBookings.length === 1 ? '' : 's'} booked` : 'Loading your trips…'}
          </h2>
        </Reveal>

        <div className="mt-6">
          {status === 'loading' && <SkeletonGrid count={2} className="grid gap-4" />}
          {status === 'error' && <ErrorState message={error?.message} onRetry={reload} />}
          {status === 'success' && myBookings.length === 0 && (
            <EmptyState
              title="No bookings yet"
              message="Once you book a trip, it'll show up here."
              action={
                <Link to="/tours" className="mt-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white">
                  Browse Expeditions
                </Link>
              }
            />
          )}
          {status === 'success' && myBookings.length > 0 && (
            <div className="space-y-4">
              {myBookings.map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 rounded-2xl border border-ink-900/8 bg-white p-4"
                >
                  {getTourBySlug(b.tourSlug) && (
                    <Img
                      src={getTourBySlug(b.tourSlug).heroImage}
                      alt=""
                      className="hidden size-16 shrink-0 rounded-xl sm:block"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-display text-base font-semibold text-ink-900">{b.tourTitle}</p>
                      <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold uppercase text-green-600">
                        {b.status}
                      </span>
                    </div>
                    <p className="text-sm text-ink-500">
                      {b.destination} · {b.date ? dateFmt.format(new Date(b.date)) : '—'} · {b.travelers} traveller{b.travelers === 1 ? '' : 's'}
                    </p>
                    <p className="mt-1 text-xs text-ink-500">Booking #{b.id}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-display text-lg font-bold text-ink-900">{formatPrice(b.total)}</p>
                    <Link to={`/tours/${b.tourSlug}`} className="text-xs font-semibold text-blue-600 hover:underline">
                      View trip
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
