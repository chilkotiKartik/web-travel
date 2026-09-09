import { useState } from 'react'
import { ErrorState } from '../../components/ui/States'
import { useAdminData } from '../../context/AdminDataContext'
import { useDebounce } from '../../hooks/useDebounce'
import { downloadCSV } from '../../lib/csv'
import {
  EmptyPanel,
  ExportButton,
  PageHeading,
  SearchBox,
  SortHeader,
  StatCard,
  TableSkeleton,
  WhatsAppButton,
  dateFmt,
  formatPrice,
  formatPriceShort,
  useSortableRows,
} from '../../components/admin/ui'

const SEARCH_FIELDS = [(b) => b.tourTitle, (b) => b.contact.name, (b) => b.contact.email, (b) => b.contact.phone, (b) => b.destination, (b) => b.promoCode]

const SORT_FNS = {
  createdAt: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  total: (a, b) => (a.total || 0) - (b.total || 0),
  traveller: (a, b) => a.contact.name.localeCompare(b.contact.name),
  date: (a, b) => String(a.date || '').localeCompare(String(b.date || '')),
}

export default function Bookings() {
  const { bookings, reload } = useAdminData()
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')
  const debounced = useDebounce(search, 200)

  const rows = bookings.data
  const filtered = useSortableRows(rows, debounced, SEARCH_FIELDS, sortKey, sortDir, SORT_FNS)

  const shownRevenue = filtered.reduce((s, b) => s + (b.total || 0), 0)
  const discounts = filtered.reduce((s, b) => s + (b.discount || 0), 0)
  const travellers = filtered.reduce((s, b) => s + (b.travelers || 0), 0)

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
        { key: 'promoCode', label: 'Promo' },
        { key: 'discount', label: 'Discount (INR)' },
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
        promoCode: b.promoCode || '',
        discount: b.discount || 0,
        total: b.total,
      }))
    )
  }

  return (
    <div className="space-y-4">
      <PageHeading title="Bookings" subtitle="Confirmed trips, with promo codes and discounts applied.">
        <ExportButton onClick={exportCSV} />
      </PageHeading>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Bookings shown" value={filtered.length} icon="🧭" accent="bg-blue-100 text-blue-600" />
        <StatCard label="Revenue shown" value={formatPriceShort(shownRevenue)} hint={formatPrice(shownRevenue)} icon="💰" accent="bg-green-100 text-green-600" delay={0.03} />
        <StatCard label="Discounts given" value={formatPriceShort(discounts)} hint={formatPrice(discounts)} icon="🎟️" accent="bg-amber-100 text-amber-600" delay={0.06} />
        <StatCard label="Travellers" value={travellers} icon="👥" accent="bg-teal-100 text-teal-600" delay={0.09} />
      </div>

      <SearchBox value={search} onChange={setSearch} placeholder="Search trip, traveller, promo code…" />

      <div className="overflow-hidden rounded-2xl border border-ink-900/8 bg-white">
        {bookings.status === 'loading' && <TableSkeleton cols={6} />}
        {bookings.status === 'error' && (
          <div className="p-6">
            <ErrorState message={bookings.error?.message} onRetry={() => reload('bookings')} />
          </div>
        )}
        {bookings.status === 'success' && rows.length === 0 && <EmptyPanel text="No bookings yet." />}
        {bookings.status === 'success' && rows.length > 0 && filtered.length === 0 && <EmptyPanel text="No bookings match your search." />}
        {bookings.status === 'success' && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-mist-100/60 text-xs uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Trip</th>
                  <SortHeader label="Traveller" active={sortKey === 'traveller'} dir={sortDir} onClick={() => toggleSort('traveller')} />
                  <SortHeader label="Trip date" active={sortKey === 'date'} dir={sortDir} onClick={() => toggleSort('date')} />
                  <th className="px-5 py-3 font-semibold">Pax</th>
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
                    <td className="px-5 py-3">
                      <p className="font-semibold text-ink-900">{formatPrice(b.total)}</p>
                      {b.discount > 0 && (
                        <p className="text-xs font-medium text-green-600">
                          −{formatPrice(b.discount)} {b.promoCode ? `(${b.promoCode})` : ''}
                        </p>
                      )}
                    </td>
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
    </div>
  )
}
