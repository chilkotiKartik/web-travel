import { Link } from 'react-router-dom'
import { Img } from './ui/Img'
import { DifficultyBadge } from './ui/Badge'
import { Rating } from './ui/Rating'
import { TiltCard } from './ui/TiltCard'
import { getDestinationBySlug } from '../data/destinations'
import { useCompare } from '../context/CompareContext'

function formatPrice(price) {
  return `₹${price.toLocaleString('en-IN')}`
}

export function TourCard({ tour, className = '' }) {
  const destination = getDestinationBySlug(tour.destinationSlug)
  const { slugs, toggle, isFull } = useCompare()
  const inCompare = slugs.includes(tour.slug)

  return (
    <TiltCard className={className} maxTilt={4}>
    <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 via-green-500 to-blue-500 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-40" />
    <Link
      to={`/tours/${tour.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_0_rgba(11,14,26,0.06)] ring-1 ring-navy-900/6 transition-shadow duration-300 hover:shadow-xl"
    >
      <div className="relative">
        <Img src={tour.heroImage} alt={tour.title} className="aspect-[4/3]" imgClassName="transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute left-3 top-3">
          <DifficultyBadge difficulty={tour.difficulty} />
        </div>
        <div className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ink-900">
          {tour.duration}D / {tour.nights}N
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggle(tour.slug)
          }}
          disabled={!inCompare && isFull}
          aria-pressed={inCompare}
          title={inCompare ? 'Remove from compare' : 'Add to compare'}
          className={`absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
            inCompare ? 'bg-green-500 text-ink-900' : 'bg-white/95 text-ink-700 hover:bg-white'
          }`}
        >
          <span className={`flex size-3.5 items-center justify-center rounded-full border ${inCompare ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-500/50'}`}>
            {inCompare && (
              <svg width="8" height="8" viewBox="0 0 16 16" fill="none">
                <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          Compare
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        {destination && <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">{destination.name}</p>}
        <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-ink-900">{tour.title}</h3>
        <Rating value={tour.rating} count={tour.reviewsCount} className="mt-2" size={13} />
        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            <p className="text-xs text-ink-500">Starting from</p>
            <p className="font-display text-lg font-bold text-ink-900">{formatPrice(tour.price)}</p>
          </div>
          <span className="rounded-full bg-navy-900/5 px-3 py-1.5 text-xs font-semibold text-ink-900 transition-colors group-hover:bg-green-500 group-hover:text-ink-900">
            View Details
          </span>
        </div>
      </div>
    </Link>
    </TiltCard>
  )
}
