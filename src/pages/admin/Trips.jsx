import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminData } from '../../context/AdminDataContext'
import { useDebounce } from '../../hooks/useDebounce'
import { tours, categories, difficulties } from '../../data/tours'
import { getDestinationBySlug } from '../../data/destinations'
import { downloadCSV } from '../../lib/csv'
import {
  EmptyPanel,
  ExportButton,
  PageHeading,
  SearchBox,
  SortHeader,
  StatCard,
  formatPrice,
  formatPriceShort,
} from '../../components/admin/ui'

const SORTS = {
  bookings: (a, b) => a.bookings - b.bookings,
  revenue: (a, b) => a.revenue - b.revenue,
  price: (a, b) => a.price - b.price,
  rating: (a, b) => a.rating - b.rating,
  title: (a, b) => a.title.localeCompare(b.title),
}

export default function Trips() {
  const { bookings, enquiries } = useAdminData()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [difficulty, setDifficulty] = useState('All')
  const [sortKey, setSortKey] = useState('bookings')
  const [sortDir, setSortDir] = useState('desc')
  const debounced = useDebounce(search, 200)

  /** Catalogue rows: the published trip, enriched with what it has actually sold. */
  const rows = useMemo(() => {
    return tours.map((t) => {
      const booked = bookings.data.filter((b) => b.tourSlug === t.slug)
      const destination = getDestinationBySlug(t.destinationSlug)
      const leadInterest = enquiries.data.filter(
        (e) => (e.destination || '').toLowerCase() === (destination?.name || '').toLowerCase()
      ).length
      return {
        ...t,
        destinationName: destination?.name || t.destinationSlug,
        bookings: booked.length,
        revenue: booked.reduce((s, b) => s + (b.total || 0), 0),
        leadInterest,
      }
    })
  }, [bookings.data, enquiries.data])

  const filtered = useMemo(() => {
    let result = rows
    if (category !== 'All') result = result.filter((t) => t.category === category)
    if (difficulty !== 'All') result = result.filter((t) => t.difficulty === difficulty)
    const q = debounced.trim().toLowerCase()
    if (q) result = result.filter((t) => [t.title, t.destinationName, t.category, t.difficulty].some((f) => String(f).toLowerCase().includes(q)))
    const sorted = [...result].sort(SORTS[sortKey])
    return sortDir === 'desc' ? sorted.reverse() : sorted
  }, [rows, category, difficulty, debounced, sortKey, sortDir])

  function toggleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))
    else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const priced = rows.map((t) => t.price)
  const avgPrice = priced.length ? Math.round(priced.reduce((a, b) => a + b, 0) / priced.length) : 0
  const bestSeller = [...rows].sort((a, b) => b.bookings - a.bookings)[0]

  function exportCSV() {
    downloadCSV(
      'wayfare-trip-catalogue.csv',
      [
        { key: 'title', label: 'Trip' },
        { key: 'destinationName', label: 'Destination' },
        { key: 'category', label: 'Category' },
        { key: 'difficulty', label: 'Difficulty' },
        { key: 'duration', label: 'Days' },
        { key: 'price', label: 'Price (INR)' },
        { key: 'rating', label: 'Rating' },
        { key: 'bookings', label: 'Bookings' },
        { key: 'revenue', label: 'Revenue (INR)' },
      ],
      filtered.map((t) => ({
        title: t.title,
        destinationName: t.destinationName,
        category: t.category,
        difficulty: t.difficulty,
        duration: t.duration,
        price: t.price,
        rating: t.rating,
        bookings: t.bookings,
        revenue: t.revenue,
      }))
    )
  }

  return (
    <div className="space-y-4">
      <PageHeading title="Trip Catalogue" subtitle="Every published trip, with how it is actually selling.">
        <ExportButton onClick={exportCSV} />
      </PageHeading>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Published trips" value={tours.length} icon="🏔️" accent="bg-blue-100 text-blue-600" />
        <StatCard label="Categories" value={categories.length} icon="🗂️" accent="bg-purple-100 text-purple-600" delay={0.03} />
        <StatCard label="Average price" value={formatPriceShort(avgPrice)} hint={formatPrice(avgPrice)} icon="💰" accent="bg-green-100 text-green-600" delay={0.06} />
        <StatCard
          label="Best seller"
          value={bestSeller && bestSeller.bookings > 0 ? bestSeller.title : '—'}
          hint={bestSeller && bestSeller.bookings > 0 ? `${bestSeller.bookings} booking${bestSeller.bookings === 1 ? '' : 's'}` : 'No bookings yet'}
          icon="🏆"
          accent="bg-amber-100 text-amber-600"
          delay={0.09}
        />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <SearchBox value={search} onChange={setSearch} placeholder="Search trips…" />
        <div className="flex flex-wrap gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
            className="rounded-full border border-ink-900/15 bg-white px-4 py-2 text-xs font-semibold text-ink-900 outline-none"
          >
            {['All', ...categories].map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All categories' : c}
              </option>
            ))}
          </select>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            aria-label="Filter by difficulty"
            className="rounded-full border border-ink-900/15 bg-white px-4 py-2 text-xs font-semibold text-ink-900 outline-none"
          >
            {['All', ...difficulties].map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All grades' : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink-900/8 bg-white">
        {filtered.length === 0 ? (
          <EmptyPanel text="No trips match these filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-mist-100/60 text-xs uppercase tracking-wide text-ink-500">
                <tr>
                  <SortHeader label="Trip" active={sortKey === 'title'} dir={sortDir} onClick={() => toggleSort('title')} />
                  <th className="px-5 py-3 font-semibold">Grade</th>
                  <th className="px-5 py-3 font-semibold">Days</th>
                  <SortHeader label="Price" active={sortKey === 'price'} dir={sortDir} onClick={() => toggleSort('price')} />
                  <SortHeader label="Rating" active={sortKey === 'rating'} dir={sortDir} onClick={() => toggleSort('rating')} />
                  <SortHeader label="Bookings" active={sortKey === 'bookings'} dir={sortDir} onClick={() => toggleSort('bookings')} />
                  <SortHeader label="Revenue" active={sortKey === 'revenue'} dir={sortDir} onClick={() => toggleSort('revenue')} />
                  <th className="px-5 py-3 font-semibold">Live page</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/6">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-mist-100/40">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-ink-900">{t.title}</p>
                      <p className="text-xs text-ink-500">
                        {t.destinationName} · {t.category}
                        {t.leadInterest > 0 ? ` · ${t.leadInterest} lead${t.leadInterest === 1 ? '' : 's'} interested` : ''}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-ink-700">{t.difficulty}</td>
                    <td className="px-5 py-3 text-ink-700">{t.duration}</td>
                    <td className="px-5 py-3 font-semibold text-ink-900">{formatPrice(t.price)}</td>
                    <td className="px-5 py-3 text-ink-700">
                      {t.rating} <span className="text-xs text-ink-500">({t.reviewsCount})</span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-ink-900">{t.bookings}</td>
                    <td className="px-5 py-3 text-ink-700">{t.revenue > 0 ? formatPrice(t.revenue) : '—'}</td>
                    <td className="px-5 py-3">
                      <Link to={`/tours/${t.slug}`} className="text-xs font-bold text-blue-600 hover:underline">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-ink-500">
        Trips are published from the site's trip catalogue in code. Bookings, revenue and lead interest above are live from the database.
      </p>
    </div>
  )
}
