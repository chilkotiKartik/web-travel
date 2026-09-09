import { useMemo } from 'react'
import { Reveal } from '../ui/Reveal'
import { waLink } from '../../lib/whatsapp'

export const dateFmt = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})
export const dayFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' })
export const monthFmt = new Intl.DateTimeFormat('en-IN', { month: 'short', year: '2-digit' })

export function formatPrice(price) {
  return `₹${(price || 0).toLocaleString('en-IN')}`
}

/** Compact money for stat cards, so six-figure revenue never overflows the tile. */
export function formatPriceShort(price) {
  const n = price || 0
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}k`
  return `₹${n}`
}

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

export function leadStatusMeta(id) {
  return LEAD_STATUSES.find((s) => s.id === id) || LEAD_STATUSES[0]
}

export function StatCard({ label, value, hint, icon, accent, delay = 0 }) {
  return (
    <Reveal delay={delay} className="rounded-2xl border border-ink-900/8 bg-white p-4 transition-shadow hover:shadow-[0_10px_30px_-18px_rgba(12,24,48,0.4)]">
      <div className="flex items-center gap-2">
        <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-base ${accent}`}>{icon}</span>
        <p className="min-w-0 flex-1 truncate text-[11px] font-semibold text-ink-500" title={label}>
          {label}
        </p>
      </div>
      <p className="mt-2 truncate font-display text-xl font-extrabold leading-tight text-ink-900" title={String(value)}>
        {value}
      </p>
      {hint && <p className="truncate text-[11px] text-ink-500" title={hint}>{hint}</p>}
    </Reveal>
  )
}

export function Panel({ title, action, children, delay = 0, className = '' }) {
  return (
    <Reveal delay={delay} className={`rounded-2xl border border-ink-900/8 bg-white p-5 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <p className="text-sm font-bold text-ink-900">{title}</p>}
          {action}
        </div>
      )}
      {children}
    </Reveal>
  )
}

export function WhatsAppButton({ phone, message }) {
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

export function MailButton({ email, subject, body }) {
  if (!email) return null
  const href = `mailto:${email}?subject=${encodeURIComponent(subject || '')}&body=${encodeURIComponent(body || '')}`
  return (
    <a
      href={href}
      onClick={(e) => e.stopPropagation()}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ink-900/15 px-3 py-1.5 text-xs font-bold text-ink-900 transition-colors hover:bg-mist-100"
      title={`Email ${email}`}
    >
      ✉️ Email
    </a>
  )
}

export function SearchBox({ value, onChange, placeholder }) {
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

export function ExportButton({ onClick, label = 'Export CSV' }) {
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
      {label}
    </button>
  )
}

export function Badge({ count }) {
  if (!count) return null
  return (
    <span className="ml-auto flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
      {count > 9 ? '9+' : count}
    </span>
  )
}

export function SortHeader({ label, active, dir, onClick }) {
  return (
    <th className="px-5 py-3 font-semibold">
      <button type="button" onClick={onClick} className="inline-flex items-center gap-1 hover:text-ink-900">
        {label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 16 16"
          fill="none"
          className={`transition-transform ${active && dir === 'desc' ? 'rotate-180' : ''} ${active ? 'opacity-100' : 'opacity-30'}`}
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </th>
  )
}

export function useSortableRows(rows, search, searchFields, sortKey, sortDir, sortFns) {
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

export function TableSkeleton({ cols = 4 }) {
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

export function EmptyPanel({ text }) {
  return <div className="p-10 text-center text-sm text-ink-500">{text}</div>
}

export function PageHeading({ title, subtitle, children }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  )
}

/** Buckets items into the last `days` calendar days, oldest first. */
export function bucketByDay(items, days = 14, dateField = 'createdAt') {
  const buckets = Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    d.setHours(0, 0, 0, 0)
    return d
  })
  return buckets.map((day) => {
    const next = new Date(day)
    next.setDate(next.getDate() + 1)
    const value = items.filter((item) => {
      const t = new Date(item[dateField]).getTime()
      return t >= day.getTime() && t < next.getTime()
    }).length
    return { label: dayFmt.format(day), value }
  })
}
