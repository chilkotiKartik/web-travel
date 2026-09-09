import { Link, useNavigate } from 'react-router-dom'
import { Container } from '../components/ui/States'
import { Img } from '../components/ui/Img'
import { Rating } from '../components/ui/Rating'
import { tours } from '../data/tours'
import { getDestinationBySlug } from '../data/destinations'
import { useCompare } from '../context/CompareContext'
import { useSeo } from '../components/Seo'

function formatPrice(price) {
  return `₹${price.toLocaleString('en-IN')}`
}

const ROWS = [
  { label: 'Price (per person)', get: (t) => formatPrice(t.price), highlight: (t) => t.price },
  { label: 'Duration', get: (t) => `${t.duration} days / ${t.nights} nights` },
  { label: 'Difficulty', get: (t) => t.difficulty },
  { label: 'Max altitude', get: (t) => t.maxAltitude },
  { label: 'Group size', get: (t) => t.groupSize },
  { label: 'Best season', get: (t) => t.bestSeason },
  { label: 'Rating', get: (t) => `${t.rating} (${t.reviewsCount} reviews)`, highlight: (t) => -t.rating },
]

export default function Compare() {
  useSeo({ title: 'Compare Trips', description: 'Compare Wayfare expeditions side by side on price, duration, difficulty, altitude and season.' })
  const { slugs, remove, clear } = useCompare()
  const navigate = useNavigate()
  const selected = slugs.map((s) => tours.find((t) => t.slug === s)).filter(Boolean)

  if (selected.length === 0) {
    return (
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-blue-100 text-2xl">⚖️</div>
        <h1 className="mt-6 font-display text-3xl font-bold text-ink-900">Nothing to compare yet</h1>
        <p className="mt-3 max-w-md text-ink-700">
          Browse expeditions and tap <span className="font-semibold">Compare</span> on any trip card to add it here — pick
          2 to 4 trips.
        </p>
        <Link to="/tours" className="mt-8 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-800">
          Browse Expeditions
        </Link>
      </Container>
    )
  }

  function bestValue(row) {
    if (!row.highlight) return null
    const values = selected.map(row.highlight)
    return Math.min(...values)
  }

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Compare Trips</p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              {selected.length} trips, side by side
            </h1>
          </div>
          <div className="flex gap-2">
            <button onClick={clear} className="rounded-full border border-navy-900/15 px-5 py-2.5 text-sm font-semibold text-ink-900 hover:bg-navy-900/5">
              Clear all
            </button>
            <Link to="/tours" className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800">
              Add more trips
            </Link>
          </div>
        </div>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="w-40 pb-4 text-left align-bottom text-xs font-semibold uppercase tracking-wide text-ink-500">Trip</th>
                {selected.map((t) => (
                  <th key={t.slug} className="min-w-52 px-3 pb-4 align-bottom text-left">
                    <div className="relative overflow-hidden rounded-2xl">
                      <Img src={t.heroImage} alt={t.title} className="aspect-[4/3]" />
                      <button
                        type="button"
                        onClick={() => remove(t.slug)}
                        aria-label={`Remove ${t.title}`}
                        className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-white/90 text-ink-900 shadow-sm"
                      >
                        <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-2.5 font-display text-base font-bold leading-snug text-ink-900">{t.title}</p>
                    <p className="text-xs text-ink-500">{getDestinationBySlug(t.destinationSlug)?.name}</p>
                    <Rating value={t.rating} count={t.reviewsCount} size={12} className="mt-1.5" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => {
                const best = bestValue(row)
                return (
                  <tr key={row.label} className={i % 2 === 0 ? 'bg-mist-100/50' : ''}>
                    <td className="rounded-l-xl px-0 py-3.5 pr-3 text-sm font-semibold text-ink-900">{row.label}</td>
                    {selected.map((t) => {
                      const isBest = row.highlight && best !== null && row.highlight(t) === best
                      return (
                        <td key={t.slug} className={`px-3 py-3.5 text-sm ${isBest ? 'font-bold text-green-600' : 'text-ink-700'}`}>
                          {row.get(t)}
                          {isBest && <span className="ml-1.5 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-700">Best</span>}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
              <tr>
                <td className="px-0 py-5"></td>
                {selected.map((t) => (
                  <td key={t.slug} className="px-3 py-5">
                    <button
                      type="button"
                      onClick={() => navigate(`/plan?tour=${t.slug}`)}
                      className="w-full rounded-full bg-green-500 px-5 py-2.5 text-sm font-bold text-ink-900 transition-colors hover:bg-green-600"
                    >
                      Choose This Trip
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  )
}
