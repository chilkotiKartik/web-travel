import { useMemo, useState } from 'react'
import { useAdminData } from '../../context/AdminDataContext'
import { BarChart, DonutChart, TrendChart } from '../../components/admin/BarChart'
import { downloadCSV } from '../../lib/csv'
import {
  ExportButton,
  LEAD_STATUSES,
  PageHeading,
  Panel,
  StatCard,
  formatPrice,
  formatPriceShort,
  monthFmt,
} from '../../components/admin/ui'

const DAY = 24 * 60 * 60 * 1000
const RANGES = [
  { id: 30, label: 'Last 30 days' },
  { id: 90, label: 'Last 90 days' },
  { id: 365, label: 'Last year' },
  { id: 0, label: 'All time' },
]
const SOURCE_COLORS = ['#1361e0', '#52c93c', '#b45309', '#7e22ce', '#0f766e', '#be123c']

function monthlyRevenue(bookings, months = 6) {
  const buckets = Array.from({ length: months }, (_, i) => {
    const d = new Date()
    d.setDate(1)
    d.setHours(0, 0, 0, 0)
    d.setMonth(d.getMonth() - (months - 1 - i))
    return d
  })
  return buckets.map((start) => {
    const end = new Date(start)
    end.setMonth(end.getMonth() + 1)
    const value = bookings
      .filter((b) => {
        const t = new Date(b.createdAt).getTime()
        return t >= start.getTime() && t < end.getTime()
      })
      .reduce((s, b) => s + (b.total || 0), 0)
    return { label: monthFmt.format(start), value }
  })
}

function groupBy(rows, keyFn, valueFn = () => 1) {
  const map = new Map()
  rows.forEach((row) => {
    const key = keyFn(row) || 'Unknown'
    map.set(key, (map.get(key) || 0) + valueFn(row))
  })
  return [...map.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value)
}

export default function Reports() {
  const { bookings, enquiries, messages, subscribers } = useAdminData()
  const [range, setRange] = useState(90)

  const bookingRows = useMemo(
    () => (range === 0 ? bookings.data : bookings.data.filter((b) => new Date(b.createdAt).getTime() >= Date.now() - range * DAY)),
    [bookings.data, range]
  )
  const leadRows = useMemo(
    () => (range === 0 ? enquiries.data : enquiries.data.filter((e) => new Date(e.createdAt).getTime() >= Date.now() - range * DAY)),
    [enquiries.data, range]
  )

  const revenue = bookingRows.reduce((s, b) => s + (b.total || 0), 0)
  const discounts = bookingRows.reduce((s, b) => s + (b.discount || 0), 0)
  const travellers = bookingRows.reduce((s, b) => s + (b.travelers || 0), 0)
  const avgValue = bookingRows.length ? Math.round(revenue / bookingRows.length) : 0
  const won = leadRows.filter((e) => ['booked', 'completed', 'repeat_referral'].includes(e.status)).length
  const conversion = leadRows.length ? Math.round((won / leadRows.length) * 100) : 0

  const byDestination = groupBy(bookingRows, (b) => b.destination, (b) => b.total || 0).slice(0, 8)
  const topTrips = groupBy(bookingRows, (b) => b.tourTitle).slice(0, 8)
  const bySource = groupBy(leadRows, (e) => e.source).map((row, i) => ({ ...row, color: SOURCE_COLORS[i % SOURCE_COLORS.length] }))
  const byBudget = groupBy(leadRows, (e) => e.budgetBand)
  const promos = groupBy(bookingRows.filter((b) => b.promoCode), (b) => b.promoCode, (b) => b.discount || 0)

  const funnel = LEAD_STATUSES.map((s) => ({
    label: s.label,
    value: leadRows.filter((e) => e.status === s.id).length,
    color: s.chart,
  })).filter((s) => s.value > 0)

  function exportSummary() {
    downloadCSV(
      'wayfare-report.csv',
      [
        { key: 'metric', label: 'Metric' },
        { key: 'value', label: 'Value' },
      ],
      [
        { metric: 'Range', value: RANGES.find((r) => r.id === range)?.label },
        { metric: 'Bookings', value: bookingRows.length },
        { metric: 'Revenue (INR)', value: revenue },
        { metric: 'Discounts given (INR)', value: discounts },
        { metric: 'Average booking value (INR)', value: avgValue },
        { metric: 'Travellers', value: travellers },
        { metric: 'Leads', value: leadRows.length },
        { metric: 'Leads won', value: won },
        { metric: 'Conversion rate (%)', value: conversion },
        { metric: 'Contact messages (all time)', value: messages.data.length },
        { metric: 'Newsletter subscribers (all time)', value: subscribers.data.length },
        ...byDestination.map((d) => ({ metric: `Revenue — ${d.label} (INR)`, value: d.value })),
        ...topTrips.map((t) => ({ metric: `Bookings — ${t.label}`, value: t.value })),
      ]
    )
  }

  return (
    <div className="space-y-4">
      <PageHeading title="Reports" subtitle="Revenue, conversion and demand — computed from live bookings and leads.">
        <select
          value={range}
          onChange={(e) => setRange(Number(e.target.value))}
          aria-label="Reporting range"
          className="rounded-full border border-ink-900/15 bg-white px-4 py-2 text-xs font-semibold text-ink-900 outline-none"
        >
          {RANGES.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
        <ExportButton onClick={exportSummary} label="Export report" />
      </PageHeading>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Revenue" value={formatPriceShort(revenue)} hint={formatPrice(revenue)} icon="💰" accent="bg-green-100 text-green-600" />
        <StatCard label="Bookings" value={bookingRows.length} icon="🧭" accent="bg-blue-100 text-blue-600" delay={0.03} />
        <StatCard label="Avg value" value={formatPriceShort(avgValue)} hint={formatPrice(avgValue)} icon="📊" accent="bg-sky-100 text-sky-600" delay={0.06} />
        <StatCard label="Discounts" value={formatPriceShort(discounts)} hint={formatPrice(discounts)} icon="🎟️" accent="bg-amber-100 text-amber-600" delay={0.09} />
        <StatCard label="Leads" value={leadRows.length} hint={`${won} won`} icon="🧲" accent="bg-purple-100 text-purple-600" delay={0.12} />
        <StatCard label="Conversion" value={`${conversion}%`} hint={`${travellers} travellers`} icon="📈" accent="bg-teal-100 text-teal-600" delay={0.15} />
      </div>

      <Panel title="Revenue by month (last 6 months)" delay={0.05}>
        <TrendChart data={monthlyRevenue(bookings.data)} valueFormat={formatPriceShort} />
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Revenue by destination" delay={0.05}>
          {byDestination.length > 0 ? <BarChart data={byDestination} valueFormat={formatPriceShort} /> : <p className="py-6 text-center text-sm text-ink-500">No bookings in this range.</p>}
        </Panel>
        <Panel title="Top trips by bookings" delay={0.08}>
          {topTrips.length > 0 ? <BarChart data={topTrips} /> : <p className="py-6 text-center text-sm text-ink-500">No bookings in this range.</p>}
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Where leads come from" delay={0.05}>
          <DonutChart data={bySource} centerLabel="leads" />
        </Panel>
        <Panel title="Pipeline stages" delay={0.08}>
          {funnel.length > 0 ? <BarChart data={funnel} /> : <p className="py-6 text-center text-sm text-ink-500">No leads in this range.</p>}
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Budget bands requested" delay={0.05}>
          {byBudget.length > 0 ? <BarChart data={byBudget} /> : <p className="py-6 text-center text-sm text-ink-500">No leads in this range.</p>}
        </Panel>
        <Panel title="Discount given per promo code" delay={0.08}>
          {promos.length > 0 ? <BarChart data={promos} valueFormat={formatPriceShort} /> : <p className="py-6 text-center text-sm text-ink-500">No promo codes used in this range.</p>}
        </Panel>
      </div>
    </div>
  )
}
