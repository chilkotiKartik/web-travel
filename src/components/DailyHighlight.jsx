import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { tours } from '../data/tours'
import { getDestinationBySlug } from '../data/destinations'
import { Img } from './ui/Img'
import { Rating } from './ui/Rating'
import { Countdown } from './Countdown'
import { Reveal } from './ui/Reveal'

function formatPrice(price) {
  return `₹${price.toLocaleString('en-IN')}`
}

// Deterministic pick that changes once every 24h (UTC), the same for every visitor —
// a real rotating "trip of the day", not a random reshuffle on every reload.
function getTodaysTour() {
  const dayIndex = Math.floor(Date.now() / 86400000)
  return tours[dayIndex % tours.length]
}

function nextMidnightUTC() {
  const ms = 86400000
  return new Date(Math.ceil(Date.now() / ms) * ms).toISOString()
}

export function DailyHighlight() {
  const tour = getTodaysTour()
  const destination = getDestinationBySlug(tour.destinationSlug)

  return (
    <Reveal>
      <div className="relative overflow-hidden rounded-3xl bg-navy-950">
        {/* animated glow border */}
        <motion.div
          className="pointer-events-none absolute -inset-[1px] rounded-3xl opacity-60"
          style={{
            background: 'conic-gradient(from 0deg, #1361e0, #52c93c, #1361e0)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        <div className="relative m-[2px] overflow-hidden rounded-[calc(1.5rem-2px)] bg-navy-950">
          <div className="grid gap-0 lg:grid-cols-[1fr_1.1fr]">
            <div className="relative min-h-64 lg:min-h-full">
              <Img src={tour.heroImage} alt={tour.title} className="absolute inset-0 h-full w-full" imgClassName="h-full w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent lg:bg-gradient-to-r" />
            </div>

            <div className="relative flex flex-col justify-center p-6 text-white sm:p-10">
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-green-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wide"
              >
                ✨ Today's Highlight
              </motion.span>

              <h3 className="text-balance mt-4 font-display text-2xl font-extrabold leading-tight sm:text-3xl">{tour.title}</h3>
              {destination && <p className="mt-1 text-sm text-white/70">{destination.name} · {destination.region}</p>}

              <Rating value={tour.rating} count={tour.reviewsCount} className="mt-3 [&_span]:text-white/80" size={13} />

              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75">{tour.overview.slice(0, 160)}…</p>

              <div className="mt-5 flex flex-wrap items-center gap-6">
                <div>
                  <p className="text-xs text-white/60">Starting from</p>
                  <p className="font-display text-2xl font-bold">{formatPrice(tour.price)}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-white/60">Next pick in</p>
                  <Countdown target={nextMidnightUTC()} />
                </div>
              </div>

              <Link
                to={`/tours/${tour.slug}`}
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-ink-900 transition-transform hover:scale-105"
              >
                View Today's Trip
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  )
}
