import { Link } from 'react-router-dom'
import { Img } from './ui/Img'
import { DifficultyBadge } from './ui/Badge'
import { Rating } from './ui/Rating'
import { getDestinationBySlug } from '../data/destinations'

function formatPrice(price) {
  return `₹${price.toLocaleString('en-IN')}`
}

export function TourCard({ tour, className = '' }) {
  const destination = getDestinationBySlug(tour.destinationSlug)
  return (
    <Link
      to={`/tours/${tour.slug}`}
      className={`group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_0_rgba(11,14,26,0.06)] ring-1 ring-navy-900/6 transition-shadow hover:shadow-lg ${className}`}
    >
      <div className="relative">
        <Img src={tour.heroImage} alt={tour.title} className="aspect-[4/3]" imgClassName="transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute left-3 top-3">
          <DifficultyBadge difficulty={tour.difficulty} />
        </div>
        <div className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ink-900">
          {tour.duration}D / {tour.nights}N
        </div>
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
  )
}
