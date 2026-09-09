import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { images } from '../lib/images'
import { useReducedMotion } from '../hooks/useReducedMotion'

const EASE = [0.16, 1, 0.3, 1]

function pad(n) {
  return String(n + 1).padStart(2, '0')
}

/** Editorial, magazine-style destination selector — one dominant featured visual
 * with the rest of the set as a layered, numbered index rather than a card grid. */
export function DestinationShowcase({ destinations }) {
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['-4%', '4%'])

  const current = destinations[active]

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-navy-950 py-24 sm:py-32">
      {/* ambient atmosphere, shifts subtly with selection */}
      <div className="pointer-events-none absolute inset-0 opacity-40 transition-colors duration-700" aria-hidden>
        <div className="absolute -left-40 top-0 size-[32rem] rounded-full bg-blue-600/20 blur-[100px]" />
        <div className="absolute -right-40 bottom-0 size-[32rem] rounded-full bg-green-600/15 blur-[100px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* editorial heading */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 24 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-2xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-green-400">Where to next · 01–06</p>
          <h2 className="text-balance mt-4 font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-7xl">
            Explore the
            <br />
            <span className="text-transparent [-webkit-text-stroke:1.5px_white] sm:[-webkit-text-stroke:2px_white]">
              unknown
            </span>
          </h2>
          <p className="mt-5 max-w-md text-base text-white/60">
            Ten regions, each with its own weather, altitude and rhythm. Pick one — the rest of the country will still
            be here.
          </p>
        </motion.div>

        {/* desktop / tablet: editorial split composition */}
        <div className="mt-16 hidden gap-6 lg:grid lg:grid-cols-[1.55fr_1fr]">
          {/* featured visual */}
          <div className="relative aspect-[16/11] overflow-hidden rounded-[28px]">
            <motion.div style={reduced ? undefined : { y: parallaxY }} className="absolute inset-[-6%]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={current.slug}
                  src={images.destination(current.slug, 1600)}
                  alt={current.name}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.03 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/10 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950/50 via-transparent to-transparent" />

            {/* number, floating top-left */}
            <AnimatePresence mode="wait">
              <motion.span
                key={current.slug + '-num'}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="absolute left-7 top-7 font-display text-sm font-bold tracking-widest text-white/70"
              >
                {pad(active)} / {pad(destinations.length - 1)}
              </motion.span>
            </AnimatePresence>

            {/* copy, bottom-left */}
            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.slug + '-copy'}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-400">{current.region}</p>
                  <h3 className="mt-2 font-display text-4xl font-extrabold leading-none tracking-tight text-white sm:text-5xl">
                    {current.name}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">{current.tagline}</p>
                  <Link
                    to={`/destinations/${current.slug}`}
                    className="group mt-6 inline-flex items-center gap-2 text-sm font-bold text-white"
                  >
                    Explore
                    <span className="flex size-8 items-center justify-center rounded-full bg-white text-ink-900 transition-transform duration-300 group-hover:translate-x-1">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* layered index of the rest — offset rows, not cards */}
          <ul className="flex flex-col justify-between py-1">
            {destinations.map((d, i) => {
              const isActive = i === active
              return (
                <li
                  key={d.slug}
                  style={{ marginLeft: i % 2 === 1 ? '1.5rem' : 0 }}
                  className="border-b border-white/8 last:border-b-0"
                >
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className="group flex w-full items-center gap-4 py-3.5 text-left"
                  >
                    <span
                      className={`font-display text-xs font-bold tabular-nums transition-colors ${
                        isActive ? 'text-green-400' : 'text-white/30'
                      }`}
                    >
                      {pad(i)}
                    </span>
                    <span
                      className={`flex-1 truncate font-display text-lg font-bold tracking-tight transition-all duration-300 ${
                        isActive ? 'text-white translate-x-1' : 'text-white/45 group-hover:text-white/75'
                      }`}
                    >
                      {d.name}
                    </span>
                    <span
                      className={`relative size-11 shrink-0 overflow-hidden rounded-full ring-2 transition-all duration-300 ${
                        isActive ? 'ring-green-400 opacity-100' : 'ring-white/10 opacity-50'
                      }`}
                    >
                      <img src={images.destination(d.slug, 200)} alt="" className="h-full w-full object-cover" loading="lazy" />
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* mobile: horizontal swipe selector, not a squeezed grid */}
        <div className="no-scrollbar mt-12 -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 lg:hidden">
          {destinations.map((d, i) => (
            <Link
              key={d.slug}
              to={`/destinations/${d.slug}`}
              className="relative aspect-[3/4] w-[78vw] shrink-0 snap-center overflow-hidden rounded-3xl"
            >
              <img
                src={images.destination(d.slug, 1000)}
                alt={d.name}
                loading={i === 0 ? 'eager' : 'lazy'}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/15 to-transparent" />
              <span className="absolute left-5 top-5 font-display text-xs font-bold tracking-widest text-white/70">{pad(i)}</span>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-400">{d.region}</p>
                <h3 className="mt-1.5 font-display text-2xl font-extrabold leading-none text-white">{d.name}</h3>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/70">{d.tagline}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-white">
                  Explore
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-white/35 lg:hidden">Swipe to browse →</p>
      </div>

      {/* bridge into the next (light) section instead of a hard color cut */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-mist-100" />
    </section>
  )
}
