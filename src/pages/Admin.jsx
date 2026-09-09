import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Container, ErrorState } from '../components/ui/States'
import { Reveal } from '../components/ui/Reveal'
import { useAuth } from '../context/AuthContext'
import { useAsync } from '../hooks/useAsync'
import { useDebounce } from '../hooks/useDebounce'
import { fetchAllBookings, fetchAllContactMessages, fetchAllNewsletterSubscribers, fetchAllEnquiries, updateEnquiryStatus } from '../lib/api'
import { downloadCSV } from '../lib/csv'
import { countNewSince, markSeen } from '../lib/adminActivity'
import { waLink } from '../lib/whatsapp'
import { BarChart, TrendChart } from '../components/admin/BarChart'

const dateFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
const dayFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' })

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

function WhatsAppButton({ phone, message }) {
  const link = waLink(phone, message)
  if (!link) return null
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-bold text-ink-900 transition-transform hover:scale-105"
      title="Message on WhatsApp"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.42 1.26 4.86L2 22l5.32-1.28a9.9 9.9 0 0 0 4.72 1.2h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm5.8 14.16c-.24.68-1.4 1.3-1.94 1.36-.5.06-1.12.08-1.8-.12a15.9 15.9 0 0 1-1.9-.7c-3.32-1.44-5.48-4.78-5.64-5-.16-.22-1.36-1.8-1.36-3.44s.86-2.44 1.16-2.78c.3-.34.66-.42.88-.42h.6c.2 0 .46-.04.7.54.24.6.84 2.06.92 2.2.08.16.14.34.02.56-.12.22-.18.34-.36.52-.18.2-.38.44-.54.6-.18.16-.36.34-.16.68.2.34.9 1.48 1.94 2.4 1.34 1.2 2.46 1.56 2.8 1.74.34.18.54.16.74-.08.2-.24.86-1 1.1-1.34.24-.34.46-.28.78-.16.32.12 2.04.96 2.4 1.14.36.18.6.26.68.42.08.16.08.9-.16 1.58Z" />
      </svg>
      WhatsApp
    </a>
  )
}

function SearchBox({ value, onChange, placeholder }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500">
        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-ink-900/15 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-600"
      />
    </div>
  )
}

function ExportButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ink-900/15 px-4 py-2 text-xs font-bold text-ink-900 transition-colors hover:bg-mist-100"
    >
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
        <path d="M8 1.5v9M8 10.5L4.5 7M8 10.5L11.5 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12.5v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      Export CSV
    </button>
  )
}

function Badge({ count }) {
  if (!count) return null
  return <span className="ml-1.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{count > 9 ? '9+' : count}</span>
}

const TABS = [
  { id: 'leads', label: 'Leads' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'messages', label: 'Messages' },
  { id: 'subscribers', label: 'Subscribers' },
]

export const LEAD_STATUSES = [
  { id: 'new_lead', label: 'New Lead', tone: 'bg-blue-100 text-blue-700', chart: '#1d4ed8' },
  { id: 'contacted', label: 'Contacted', tone: 'bg-sky-100 text-sky-700', chart: '#0369a1' },
  { id: 'quotation_sent', label: 'Quotation Sent', tone: 'bg-amber-100 text-amber-700', chart: '#b45309' },
  { id: 'follow_up', label: 'Follow-up', tone: 'bg-orange-100 text-orange-700', chart: '#c2410c' },
  { id: 'payment_pending', label: 'Payment Pending', tone: 'bg-rose-100 text-rose-700', chart: '#be123c' },
  { id: 'booked', label: 'Booked', tone: 'bg-green-100 text-green-700', chart: '#15803d' },
  { id: 'completed', label: 'Completed', tone: 'bg-emerald-100 text-emerald-700', chart: '#047857' },
  { id: 'review_requested', label: 'Review Requested', tone: 'bg-purple-100 text-purple-700', chart: '#7e22ce' },
  { id: 'repeat_referral', label: 'Repeat / Referral', tone: 'bg-teal-100 text-teal-700', chart: '#0f766e' },
]

function leadStatusMeta(id) {
  return LEAD_STATUSES.find((s) => s.id === id) || LEAD_STATUSES[0]
}

function last14Days() {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (13 - i))
    d.setHours(0, 0, 0, 0)
    return d
  })
}

function bucketByDay(items, dateField = 'createdAt') {
  const days = last14Days()
  return days.map((day) => {
    const next = new Date(day)
    next.setDate(next.getDate() + 1)
    const value = items.filter((item) => {
      const t = new Date(item[dateField]).getTime()
      return t >= day.getTime() && t < next.getTime()
    }).length
    return { label: dayFmt.format(day), value }
  })
}

export default function Admin() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('leads')
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 200)

  const bookingsQ = useAsync(fetchAllBookings, [user?.id])
  const messagesQ = useAsync(fetchAllContactMessages, [user?.id])
  const subscribersQ = useAsync(fetchAllNewsletterSubscribers, [user?.id])
  const enquiriesQ = useAsync(fetchAllEnquiries, [user?.id])

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) navigate('/', { replace: true })
  }, [authLoading, user, navigate])

  useEffect(() => {
    setQuery('')
    markSeen(tab)
  }, [tab])

  if (authLoading || !user || !user.isAdmin) return null

  const bookings = bookingsQ.data || []
  const revenue = bookings.reduce((sum, b) => sum + (b.total || 0), 0)
  const messages = messagesQ.data || []
  const subscribers = subscribersQ.data || []
  const enquiries = enquiriesQ.data || []
  const newLeads = enquiries.filter((e) => e.status === 'new_lead').length
  const conversionRate = enquiries.length > 0 ? Math.round((bookings.length / enquiries.length) * 100) : 0

  const newLeadsBadge = countNewSince(enquiries, 'leads')
  const newBookingsBadge = countNewSince(bookings, 'bookings')
  const newMessagesBadge = countNewSince(messages, 'messages')
  const newSubscribersBadge = countNewSince(subscribers, 'subscribers')

  const bookingsTrend = bucketByDay(bookings)
  const leadsByStatus = LEAD_STATUSES.map((s) => ({
    label: s.label,
    value: enquiries.filter((e) => e.status === s.id).length,
    color: s.chart,
  })).filter((s) => s.value > 0)

  return (
    <section className="bg-mist-100/40 py-16 sm:py-24">
      <Container>
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Admin</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-ink-900">Control Room</h1>
          <p className="mt-1 text-sm text-ink-500">Signed in as {user.name} ({user.email})</p>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Total leads" value={enquiries.length} icon="🧲" accent="bg-purple-100 text-purple-600" delay={0} />
          <StatCard label="New leads" value={newLeads} icon="✨" accent="bg-blue-100 text-blue-600" delay={0.03} />
          <StatCard label="Total bookings" value={bookings.length} icon="🧭" accent="bg-blue-100 text-blue-600" delay={0.06} />
          <StatCard label="Revenue booked" value={formatPrice(revenue)} icon="💰" accent="bg-green-100 text-green-600" delay={0.09} />
          <StatCard label="Lead → booking rate" value={`${conversionRate}%`} icon="📈" accent="bg-amber-100 text-amber-600" delay={0.12} />
          <StatCard label="Messages + subscribers" value={messages.length + subscribers.length} icon="✉️" accent="bg-teal-100 text-teal-600" delay={0.15} />
        </div>

        {(bookings.length > 0 || enquiries.length > 0) && (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {bookings.length > 0 && (
              <Reveal delay={0.15} className="rounded-2xl border border-ink-900/8 bg-white p-5">
                <p className="text-sm font-bold text-ink-900">Bookings, last 14 days</p>
                <div className="mt-4">
                  <TrendChart data={bookingsTrend} />
                </div>
              </Reveal>
            )}
            {leadsByStatus.length > 0 && (
              <Reveal delay={0.18} className="rounded-2xl border border-ink-900/8 bg-white p-5">
                <p className="text-sm font-bold text-ink-900">Leads by pipeline stage</p>
                <div className="mt-4">
                  <BarChart data={leadsByStatus} />
                </div>
              </Reveal>
            )}
          </div>
        )}

        <div className="mt-10 flex gap-2 rounded-full bg-white p-1.5 shadow-sm sm:inline-flex">
          {TABS.map((t) => {
            const badge = { leads: newLeadsBadge, bookings: newBookingsBadge, messages: newMessagesBadge, subscribers: newSubscribersBadge }[t.id]
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative flex items-center rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  tab === t.id ? 'text-white' : 'text-ink-700 hover:bg-mist-100'
                }`}
              >
                {tab === t.id && (
                  <motion.span layoutId="admin-tab" className="absolute inset-0 rounded-full bg-blue-600" transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />
                )}
                <span className="relative flex items-center">
                  {t.label}
                  {tab !== t.id && <Badge count={badge} />}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBox value={query} onChange={setQuery} placeholder={`Search ${TABS.find((t) => t.id === tab)?.label.toLowerCase()}…`} />
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-ink-900/8 bg-white">
          {tab === 'leads' && <LeadsTable query={enquiriesQ} search={debouncedQuery} />}
          {tab === 'bookings' && <BookingsTable query={bookingsQ} search={debouncedQuery} />}
          {tab === 'messages' && <MessagesTable query={messagesQ} search={debouncedQuery} />}
          {tab === 'subscribers' && <SubscribersTable query={subscribersQ} search={debouncedQuery} />}
        </div>
      </Container>
    </section>
  )
}

function LeadsTable({ query, search }) {
  const [updating, setUpdating] = useState(null)
  const [sort, setSort] = useState('newest')

  const filtered = useMemo(() => {
    if (query.status !== 'success') return []
    let rows = query.data
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter(
        (e) =>
          e.contact.name.toLowerCase().includes(q) ||
          e.contact.email.toLowerCase().includes(q) ||
          (e.contact.phone || '').includes(q) ||
          (e.destination || '').toLowerCase().includes(q) ||
          leadStatusMeta(e.status).label.toLowerCase().includes(q)
      )
    }
    const sorted = [...rows]
    if (sort === 'newest') sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    else if (sort === 'oldest') sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    else if (sort === 'name') sorted.sort((a, b) => a.contact.name.localeCompare(b.contact.name))
    return sorted
  }, [query.status, query.data, search, sort])

  if (query.status === 'loading') return <TableSkeleton cols={5} />
  if (query.status === 'error') return <div className="p-6"><ErrorState message={query.error?.message} onRetry={query.reload} /></div>
  if (query.data.length === 0) return <EmptyPanel text="No enquiries yet — they'll land here from the Custom Trip Planner." />

  async function handleStatusChange(id, status) {
    setUpdating(id)
    try {
      await updateEnquiryStatus(id, status)
      await query.reload()
    } finally {
      setUpdating(null)
    }
  }

  function exportCSV() {
    downloadCSV(
      'wayfare-leads.csv',
      [
        { key: 'createdAt', label: 'Created' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'destination', label: 'Destination' },
        { key: 'tripType', label: 'Trip Type' },
        { key: 'travelers', label: 'Travellers' },
        { key: 'budgetBand', label: 'Budget' },
        { key: 'status', label: 'Status' },
        { key: 'source', label: 'Source' },
      ],
      filtered.map((e) => ({
        createdAt: dateFmt.format(new Date(e.createdAt)),
        name: e.contact.name,
        email: e.contact.email,
        phone: e.contact.phone,
        destination: e.destination,
        tripType: e.tripType,
        travelers: e.travelers,
        budgetBand: e.budgetBand,
        status: leadStatusMeta(e.status).label,
        source: e.source,
      }))
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-900/6 p-4">
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border border-ink-900/15 bg-white px-3 py-1.5 text-xs font-semibold text-ink-900 outline-none">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="name">Name A–Z</option>
        </select>
        <ExportButton onClick={exportCSV} />
      </div>
      {filtered.length === 0 ? (
        <EmptyPanel text="No leads match your search." />
      ) : (
        <div className="divide-y divide-ink-900/6">
          {filtered.map((e) => {
            const meta = leadStatusMeta(e.status)
            const waMsg = `Hi ${e.contact.name}, this is Wayfare — following up on your ${e.destination || 'trip'} enquiry!`
            return (
              <div key={e.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-ink-900">{e.contact.name}</p>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${meta.tone}`}>{meta.label}</span>
                    <span className="rounded-full bg-ink-900/5 px-2.5 py-0.5 text-xs font-medium text-ink-500">via {e.source}</span>
                  </div>
                  <p className="mt-1 text-xs text-ink-500">
                    {e.contact.email} · {e.contact.phone || 'no phone'}
                  </p>
                  <p className="mt-1.5 text-sm text-ink-700">
                    {e.destination || 'Any destination'} · {e.tripType || 'Trip type TBD'} · {e.travelers} traveller{e.travelers === 1 ? '' : 's'} ·{' '}
                    {e.budgetBand || 'budget TBD'}
                  </p>
                  {e.specialNeeds && <p className="mt-1 text-xs italic text-ink-500">"{e.specialNeeds}"</p>}
                  <p className="mt-1 text-xs text-ink-400">{dateFmt.format(new Date(e.createdAt))}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <WhatsAppButton phone={e.contact.phone} message={waMsg} />
                  <select
                    value={e.status}
                    disabled={updating === e.id}
                    onChange={(ev) => handleStatusChange(e.id, ev.target.value)}
                    className="rounded-full border border-ink-900/15 bg-white px-3 py-2 text-xs font-semibold text-ink-900 outline-none focus:border-blue-600 disabled:opacity-50"
                  >
                    {LEAD_STATUSES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function useSortableRows(rows, search, searchFields, sortKey, sortDir, sortFns) {
  return useMemo(() => {
    let result = rows
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((row) => searchFields.some((f) => String(f(row) || '').toLowerCase().includes(q)))
    }
    if (sortKey && sortFns[sortKey]) {
      const sorted = [...result].sort(sortFns[sortKey])
      result = sortDir === 'desc' ? sorted.reverse() : sorted
    }
    return result
  }, [rows, search, searchFields, sortKey, sortDir, sortFns])
}

function SortHeader({ label, active, dir, onClick }) {
  return (
    <th className="px-5 py-3 font-semibold">
      <button type="button" onClick={onClick} className="inline-flex items-center gap-1 hover:text-ink-900">
        {label}
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className={`transition-transform ${active && dir === 'desc' ? 'rotate-180' : ''} ${active ? 'opacity-100' : 'opacity-30'}`}>
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </th>
  )
}

function BookingsTable({ query, search }) {
  const [sortKey, setSortKey] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')

  const sortFns = {
    createdAt: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    total: (a, b) => (a.total || 0) - (b.total || 0),
    traveller: (a, b) => a.contact.name.localeCompare(b.contact.name),
  }
  const rows = query.status === 'success' ? query.data : []
  const filtered = useSortableRows(
    rows,
    search,
    [(b) => b.tourTitle, (b) => b.contact.name, (b) => b.contact.email, (b) => b.destination],
    sortKey,
    sortDir,
    sortFns
  )

  if (query.status === 'loading') return <TableSkeleton cols={6} />
  if (query.status === 'error') return <div className="p-6"><ErrorState message={query.error?.message} onRetry={query.reload} /></div>
  if (query.data.length === 0) return <EmptyPanel text="No bookings yet." />

  function toggleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))
    else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  function exportCSV() {
    downloadCSV(
      'wayfare-bookings.csv',
      [
        { key: 'createdAt', label: 'Booked' },
        { key: 'tourTitle', label: 'Trip' },
        { key: 'destination', label: 'Destination' },
        { key: 'name', label: 'Traveller' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'date', label: 'Trip Date' },
        { key: 'travelers', label: 'Travellers' },
        { key: 'total', label: 'Total (INR)' },
      ],
      filtered.map((b) => ({
        createdAt: dateFmt.format(new Date(b.createdAt)),
        tourTitle: b.tourTitle,
        destination: b.destination,
        name: b.contact.name,
        email: b.contact.email,
        phone: b.contact.phone,
        date: b.date,
        travelers: b.travelers,
        total: b.total,
      }))
    )
  }

  return (
    <div>
      <div className="flex justify-end border-b border-ink-900/6 p-4">
        <ExportButton onClick={exportCSV} />
      </div>
      {filtered.length === 0 ? (
        <EmptyPanel text="No bookings match your search." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-mist-100/60 text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Trip</th>
                <SortHeader label="Traveller" active={sortKey === 'traveller'} dir={sortDir} onClick={() => toggleSort('traveller')} />
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Travellers</th>
                <SortHeader label="Total" active={sortKey === 'total'} dir={sortDir} onClick={() => toggleSort('total')} />
                <SortHeader label="Booked" active={sortKey === 'createdAt'} dir={sortDir} onClick={() => toggleSort('createdAt')} />
                <th className="px-5 py-3 font-semibold">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/6">
              {filtered.map((b) => (
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
                  <td className="px-5 py-3">
                    <WhatsAppButton phone={b.contact.phone} message={`Hi ${b.contact.name}, this is Wayfare confirming your ${b.tourTitle} booking!`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function MessagesTable({ query, search }) {
  const rows = query.status === 'success' ? query.data : []
  const filtered = useSortableRows(rows, search, [(m) => m.name, (m) => m.email, (m) => m.subject, (m) => m.message], 'createdAt', 'desc', {
    createdAt: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  })

  if (query.status === 'loading') return <TableSkeleton cols={4} />
  if (query.status === 'error') return <div className="p-6"><ErrorState message={query.error?.message} onRetry={query.reload} /></div>
  if (query.data.length === 0) return <EmptyPanel text="No messages yet." />

  function exportCSV() {
    downloadCSV(
      'wayfare-messages.csv',
      [
        { key: 'createdAt', label: 'Received' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'subject', label: 'Subject' },
        { key: 'message', label: 'Message' },
      ],
      filtered.map((m) => ({ createdAt: dateFmt.format(new Date(m.createdAt)), name: m.name, email: m.email, phone: m.phone, subject: m.subject, message: m.message }))
    )
  }

  return (
    <div>
      <div className="flex justify-end border-b border-ink-900/6 p-4">
        <ExportButton onClick={exportCSV} />
      </div>
      {filtered.length === 0 ? (
        <EmptyPanel text="No messages match your search." />
      ) : (
        <div className="divide-y divide-ink-900/6">
          {filtered.map((m) => (
            <div key={m.id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-ink-900">{m.name}</p>
                  <p className="text-xs text-ink-500">{m.email}{m.phone ? ` · ${m.phone}` : ''}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-600">{m.subject}</span>
                  <span className="text-xs text-ink-500">{dateFmt.format(new Date(m.createdAt))}</span>
                  <WhatsAppButton phone={m.phone} message={`Hi ${m.name}, this is Wayfare replying to your message!`} />
                </div>
              </div>
              <p className="mt-2 text-sm text-ink-700">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SubscribersTable({ query, search }) {
  const rows = query.status === 'success' ? query.data : []
  const filtered = useSortableRows(rows, search, [(s) => s.email], 'createdAt', 'desc', {
    createdAt: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  })

  if (query.status === 'loading') return <TableSkeleton cols={2} />
  if (query.status === 'error') return <div className="p-6"><ErrorState message={query.error?.message} onRetry={query.reload} /></div>
  if (query.data.length === 0) return <EmptyPanel text="No subscribers yet." />

  function exportCSV() {
    downloadCSV('wayfare-subscribers.csv', [{ key: 'email', label: 'Email' }, { key: 'createdAt', label: 'Subscribed' }], filtered.map((s) => ({ email: s.email, createdAt: dateFmt.format(new Date(s.createdAt)) })))
  }

  return (
    <div>
      <div className="flex justify-end border-b border-ink-900/6 p-4">
        <ExportButton onClick={exportCSV} />
      </div>
      {filtered.length === 0 ? (
        <EmptyPanel text="No subscribers match your search." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-mist-100/60 text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/6">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-mist-100/40">
                  <td className="px-5 py-3 text-ink-900">{s.email}</td>
                  <td className="px-5 py-3 text-xs text-ink-500">{dateFmt.format(new Date(s.createdAt))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
