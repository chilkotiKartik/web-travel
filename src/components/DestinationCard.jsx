import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Img } from './ui/Img'
import { TiltCard } from './ui/TiltCard'

export function DestinationCard({ destination, className = '', priority = false, aspect = 'aspect-[4/5]' }) {
  return (
    <TiltCard className={className} maxTilt={4}>
    <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-r from-green-500 via-blue-500 to-green-500 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-40" />
    <Link to={`/destinations/${destination.slug}`} className="group relative block h-full">
      <motion.div whileHover="hover" className="relative overflow-hidden rounded-2xl ring-1 ring-ink-900/6 transition-all duration-300 group-hover:ring-2 group-hover:ring-white">
        <Img
          src={destination.heroImage}
          alt={destination.name}
          eager={priority}
          className={`${aspect} h-full`}
          imgClassName="transition-transform duration-700 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-500">{destination.region}</p>
          <h3 className="mt-1 font-display text-2xl font-semibold text-white">{destination.name}</h3>
          <p className="mt-1 line-clamp-1 text-sm text-white/75">{destination.tagline}</p>
        </div>
        <motion.span
          variants={{ hover: { opacity: 1, x: 0 }, initial: { opacity: 0, x: -6 } }}
          initial="initial"
          className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full bg-white/90 text-ink-900"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      </motion.div>
    </Link>
    </TiltCard>
  )
}
