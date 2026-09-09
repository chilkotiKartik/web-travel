import { Link } from 'react-router-dom'
import { useAdminData } from '../../context/AdminDataContext'
import { BarChart, TrendChart } from '../../components/admin/BarChart'
import {
  LEAD_STATUSES,
  Panel,
  PageHeading,
  StatCard,
  bucketByDay,
  dateFmt,
  formatPrice,
  formatPriceShort,
  leadStatusMeta,
} from '../../components/admin/ui'

const DAY = 24 * 60 * 60 * 1000

/** Leads sitting in an "owe them a reply" stage for more than 2 days. */
function stale(enquiries) {
  const cutoff = Date.now() - 2 * DAY
  return enquiries
    .filter((e) => ['new_lead', 'contacted', 'follow_up', 'quotation_sent'].includes(e.status))
    .filter((e) => new Date(e.createdAt).getTime() < cutoff)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
}

function activityFeed({ enquiries, bookings, messages, subscribers }) {
  const items = [
    ...enquiries.map((e) => ({ id: `l${e.id}`, at: e.createdAt, icon: '🧲', text: `${e.contact.name} enquired about ${e.destination || 'a trip'}`, to: '/admin/leads' })),
    ...bookings.map((b) => ({ id: `b${b.id}`, at: b.createdAt, icon: '🧭', text: `${b.contact.name} booked ${b.tourTitle} — ${formatPrice(b.total)}`, to: '/admin/bookings' })),
    ...messages.map((m) => ({ id: `m${m.id}`, at: m.createdAt, icon: '✉️', text: `${m.name} sent a message about ${m.subject}`, to: '/admin/messages' })),
    ...subscribers.map((s) => ({ id: `s${s.id}`, at: s.createdAt, icon: '📬', text: `${s.email} joined the newsletter`, to: '/admin/subscribers' })),
  ]
  return items.sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 10)
}

export default function Dashboard() {
  const { enquiries, bookings, messages, subscribers } = useAdminData()
  const leadRows = enquiries.data
  const bookingRows = bookings.data
  const messageRows = messages.data
  const subscriberRows = subscribers.data

  const revenue = bookingRows.reduce((sum, b) => sum + (b.total || 0), 0)
  const avgValue = bookingRows.length ? Math.round(revenue / bookingRows.length) : 0
  const newLeads = leadRows.filter((e) => e.status === 'new_lead').length
  const conversion = leadRows.length ? Math.round((leadRows.filter((e) => ['booked', 'completed', 'repeat_referral'].includes(e.status)).length / leadRows.length) * 100) : 0

  const last7 = Date.now() - 7 * DAY
  const revenue7 = bookingRows.filter((b) => new Date(b.createdAt).getTime() >= last7).reduce((s, b) => s + (b.total || 0), 0)
  const leads7 = leadRows.filter((e) => new Date(e.createdAt).getTime() >= last7).length

  const pipeline = LEAD_STATUSES.map((s) => ({
    label: s.label,
    value: leadRows.filter((e) => e.status === s.id).length,
    color: s.chart,
  })).filter((s) => s.value > 0)

  const needsAttention = stale(leadRows)
  const feed = activityFeed({ enquiries: leadRows, bookings: bookingRows, messages: messageRows, subscribers: subscriberRows })
  const anyError = [enquiries, bookings, messages, subscribers].find((q) => q.status === 'error')

  return (
    <div className="space-y-6">
      <PageHeading title="Dashboard" subtitle="Everything that happened across Wayfare, live from the database." />

      {anyError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Some data failed to load: {anyError.error?.message}. Try Refresh above.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total leads" value={leadRows.length} hint={`${leads7} in last 7 days`} icon="🧲" accent="bg-purple-100 text-purple-600" delay={0} />
        <StatCard label="New, untouched" value={newLeads} icon="✨" accent="bg-blue-100 text-blue-600" delay={0.03} />
        <StatCard label="Bookings" value={bookingRows.length} icon="🧭" accent="bg-sky-100 text-sky-600" delay={0.06} />
        <StatCard label="Revenue booked" value={formatPriceShort(revenue)} hint={formatPrice(revenue)} icon="💰" accent="bg-green-100 text-green-600" delay={0.09} />
        <StatCard label="Avg booking value" value={formatPriceShort(avgValue)} hint={`${formatPriceShort(revenue7)} last 7 days`} icon="📊" accent="bg-amber-100 text-amber-600" delay={0.12} />
        <StatCard label="Lead → booked" value={`${conversion}%`} hint={`${messageRows.length + subscriberRows.length} messages + subs`} icon="📈" accent="bg-teal-100 text-teal-600" delay={0.15} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Bookings, last 14 days" delay={0.05}>
          <TrendChart data={bucketByDay(bookingRows)} />
        </Panel>
        <Panel title="Leads, last 14 days" delay={0.08}>
          <TrendChart data={bucketByDay(leadRows)} />
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel
          title="Pipeline"
          delay={0.05}
          action={
            <Link to="/admin/leads" className="text-xs font-bold text-blue-600 hover:underline">
              Open leads →
            </Link>
          }
        >
          {pipeline.length > 0 ? <BarChart data={pipeline} /> : <p className="py-6 text-center text-sm text-ink-500">No leads yet.</p>}
        </Panel>

        <Panel title="Needs a reply" delay={0.08} action={<span className="text-xs font-semibold text-ink-500">{needsAttention.length} waiting 2+ days</span>}>
          {needsAttention.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-500">Nothing is waiting. Inbox zero.</p>
          ) : (
            <ul className="divide-y divide-ink-900/6">
              {needsAttention.slice(0, 5).map((e) => {
                const meta = leadStatusMeta(e.status)
                return (
                  <li key={e.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink-900">{e.contact.name}</p>
                      <p className="truncate text-xs text-ink-500">
                        {e.destination || 'Any destination'} · {dateFmt.format(new Date(e.createdAt))}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${meta.tone}`}>{meta.label}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </Panel>
      </div>

      <Panel title="Recent activity" delay={0.05}>
        {feed.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-500">No activity yet.</p>
        ) : (
          <ul className="divide-y divide-ink-900/6">
            {feed.map((item) => (
              <li key={item.id}>
                <Link to={item.to} className="flex items-center gap-3 py-2.5 transition-colors hover:text-blue-600">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-mist-100 text-sm">{item.icon}</span>
                  <span className="min-w-0 flex-1 truncate text-sm text-ink-700">{item.text}</span>
                  <span className="shrink-0 text-xs text-ink-500">{dateFmt.format(new Date(item.at))}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  )
}
