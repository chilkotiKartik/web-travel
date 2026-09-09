import { Suspense, lazy, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Container } from '../components/ui/States'
import { Reveal, Stagger, staggerItem } from '../components/ui/Reveal'
import { useSeo } from '../components/Seo'
import { useDebounce } from '../hooks/useDebounce'
import { journeyKinds, journeys, regions } from '../data/journeys'

// three.js + the coastline data are a heavy chunk — keep them off every other route.
const Globe = lazy(() => import('../components/Globe').then((m) => ({ default: m.Globe })))

const KIND_TO_TRIP_TYPE = {
  Trek: 'Trekking',
  Backpacking: 'Backpacking',
  'Bike Trip': 'Road Trip',
  Wildlife: 'Wildlife',
  Yatra: '',
  'City & Culture': '',
}

const GRADE_TONE = {
  Easy: 'bg-green-100 text-green-700',
  Moderate: 'bg-amber-100 text-amber-700',
  Difficult: 'bg-orange-100 text-orange-700',
  Extreme: 'bg-rose-100 text-rose-700',
}

function regionOf(id) {
  return regions.find((r) => r.id === id)
}

function plannerLink(journey) {
  const params = new URLSearchParams({ destination: journey.name })
  const tripType = KIND_TO_TRIP_TYPE[journey.kind]
  if (tripType) params.set('tripType', tripType)
  return `/custom-trip?${params.toString()}`
}

function GlobeFallback() {
  return (
    <div className="flex aspect-square w-full items-center justify-center rounded-full">
      <div className="size-2/3 animate-pulse rounded-full bg-blue-500/10" />
    </div>
  )
}

function JourneyCard({ journey, selected, onSelect }) {
  const region = regionOf(journey.region)
  return (
    <motion.article
      variants={staggerItem}
      id={`journey-${journey.id}`}
      onMouseEnter={() => onSelect(journey.id)}
      onFocus={() => onSelect(journey.id)}
      className={`flex h-full flex-col rounded-2xl border bg-white p-5 transition-all duration-300 ${
        selected
          ? 'border-blue-600 shadow-[0_16px_40px_-24px_rgba(19,97,224,0.8)]'
          : 'border-ink-900/8 hover:border-blue-600/40 hover:shadow-[0_12px_30px_-22px_rgba(12,24,48,0.7)]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-base font-bold leading-snug text-ink-900">{journey.name}</h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-ink-500">
            <span className="size-2 rounded-full" style={{ background: region?.accent }} />
            {region?.name}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-ink-900/5 px-2.5 py-1 text-[11px] font-bold text-ink-700">{journey.kind}</span>
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-700">{journey.note}</p>

      <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
        {journey.grade && (
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Grade</dt>
            <dd className={`rounded-full px-2 py-0.5 font-bold ${GRADE_TONE[journey.grade] || 'bg-ink-900/5 text-ink-700'}`}>
              {journey.grade}
            </dd>
          </div>
        )}
        {journey.altitude && (
          <div className="flex items-center gap-1">
            <dt className="text-ink-500">Max altitude</dt>
            <dd className="font-semibold text-ink-900">{journey.altitude}</dd>
          </div>
        )}
        {journey.season && (
          <div className="flex items-center gap-1">
            <dt className="text-ink-500">Season</dt>
            <dd className="font-semibold text-ink-900">{journey.season}</dd>
          </div>
        )}
      </dl>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-ink-900/6 pt-4">
        <span className="text-xs font-medium text-ink-500">Dates &amp; price on request</span>
        <Link
          to={plannerLink(journey)}
          className="rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-navy-800"
        >
          Enquire
        </Link>
      </div>
    </motion.article>
  )
}

export default function Atlas() {
  useSeo({
    title: 'Trip Atlas',
    description: `Every Wayfare departure on one interactive globe — ${journeys.length} treks, yatras, backpacking routes and expeditions across the Himalaya, the Sahyadris, Nepal and beyond.`,
  })

  const [selectedId, setSelectedId] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [region, setRegion] = useState('all')
  const [kind, setKind] = useState('all')
  const [search, setSearch] = useState('')
  const debounced = useDebounce(search, 200)
  const listRef = useRef(null)

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase()
    return journeys.filter((j) => {
      if (region !== 'all' && j.region !== region) return false
      if (kind !== 'all' && j.kind !== kind) return false
      if (q && ![j.name, j.note, j.kind, regionOf(j.region)?.name].some((f) => String(f || '').toLowerCase().includes(q)))
        return false
      return true
    })
  }, [region, kind, debounced])

  // Markers mirror the filter, so the globe and the list always agree.
  const points = useMemo(
    () => filtered.map((j) => ({ id: j.id, name: j.name, lat: j.lat, lng: j.lng, color: regionOf(j.region)?.accent || '#1361e0', kind: j.kind })),
    [filtered]
  )

  const grouped = useMemo(() => {
    return regions
      .map((r) => ({ region: r, items: filtered.filter((j) => j.region === r.id) }))
      .filter((g) => g.items.length > 0)
  }, [filtered])

  const active = hovered || journeys.find((j) => j.id === selectedId) || null
  const activeRegion = active ? regionOf(active.region) : null
  const countries = new Set(regions.map((r) => r.country)).size

  function selectFromGlobe(point) {
    setSelectedId(point.id)
    const el = document.getElementById(`journey-${point.id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <>
      {/* Globe */}
      <section className="relative overflow-hidden bg-navy-950 pb-16 pt-28 text-white sm:pb-20 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(19,97,224,0.35),transparent_70%)]" />
        <Container className="relative">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-500">Trip Atlas</p>
              <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
                Every departure,
                <br />
                <span className="text-blue-400">on one globe.</span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">
                Spin it, or tap any marker. {journeys.length} journeys across {regions.length} regions and {countries}{' '}
                countries — Himalayan treks, pilgrim yatras, Sahyadri forts, backpacking routes and expeditions.
              </p>

              <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
                {[
                  ['Journeys', journeys.length],
                  ['Regions', regions.length],
                  ['Showing', filtered.length],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-white/50">{label}</dt>
                    <dd className="font-display text-3xl font-extrabold">{value}</dd>
                  </div>
                ))}
              </dl>

              {/* Live read-out of whatever the pointer or selection is on */}
              {/* Fixed height on purpose: if this panel grew when a marker was
                  hovered it would shift the globe under the pointer and cancel
                  the hover it just gained. */}
              <div className="mt-8 h-[124px] overflow-hidden rounded-2xl border border-white/12 bg-white/5 p-4 backdrop-blur-sm sm:h-[112px]">
                {active ? (
                  <>
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/60">
                      <span className="size-2 rounded-full" style={{ background: activeRegion?.accent }} />
                      {activeRegion?.name} · {active.kind}
                    </p>
                    <p className="mt-1.5 font-display text-lg font-bold">{active.name}</p>
                    <p className="mt-0.5 line-clamp-2 text-sm text-white/65">{active.note}</p>
                  </>
                ) : (
                  <p className="text-sm text-white/55">
                    Drag the globe to spin it. Hover or tap a marker to see the journey it belongs to.
                  </p>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.1} className="relative">
              <div className="mx-auto aspect-square w-full max-w-[520px]">
                <Suspense fallback={<GlobeFallback />}>
                  <Globe
                    points={points}
                    selectedId={selectedId}
                    onSelect={selectFromGlobe}
                    onHover={(point) => setHovered(point ? journeys.find((j) => j.id === point.id) : null)}
                    zoom={region === 'all' ? 3.15 : 2.75}
                    className="h-full w-full"
                  />
                </Suspense>
              </div>
            </Reveal>
          </div>

          {/* Region legend — doubles as the region filter */}
          <Reveal delay={0.15} className="mt-10 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setRegion('all')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                region === 'all' ? 'bg-white text-navy-950' : 'bg-white/10 text-white/75 hover:bg-white/20'
              }`}
            >
              All regions
            </button>
            {regions.map((r) => {
              const count = journeys.filter((j) => j.region === r.id).length
              const on = region === r.id
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRegion(on ? 'all' : r.id)}
                  className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                    on ? 'bg-white text-navy-950' : 'bg-white/10 text-white/75 hover:bg-white/20'
                  }`}
                >
                  <span className="size-2 rounded-full" style={{ background: r.accent }} />
                  {r.name}
                  <span className={on ? 'text-navy-950/50' : 'text-white/45'}>{count}</span>
                </button>
              )
            })}
          </Reveal>
        </Container>
      </section>

      {/* Catalogue */}
      <section className="py-14 sm:py-20" ref={listRef}>
        <Container>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-500">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search journeys — Roopkund, Spiti, waterfall…"
                aria-label="Search journeys"
                className="w-full rounded-full border border-ink-900/15 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {['all', ...journeyKinds].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKind(k)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                    kind === k ? 'bg-navy-950 text-white' : 'bg-mist-100 text-ink-700 hover:bg-mist-100/60'
                  }`}
                >
                  {k === 'all' ? 'All types' : k}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-16 text-center">
              <p className="font-display text-xl font-bold text-ink-900">Nothing matches that yet</p>
              <p className="mt-2 text-sm text-ink-500">Try a different region, type or search term.</p>
              <button
                type="button"
                onClick={() => {
                  setRegion('all')
                  setKind('all')
                  setSearch('')
                }}
                className="mt-6 rounded-full border border-ink-900/15 px-5 py-2.5 text-sm font-semibold text-ink-900 hover:bg-mist-100"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="mt-12 space-y-14">
              {grouped.map(({ region: r, items }) => (
                <div key={r.id}>
                  <Reveal className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <h2 className="flex items-center gap-2.5 font-display text-2xl font-extrabold tracking-tight text-ink-900">
                        <span className="size-3 rounded-full" style={{ background: r.accent }} />
                        {r.name}
                      </h2>
                      <p className="mt-1 max-w-2xl text-sm text-ink-500">{r.blurb}</p>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wide text-ink-500">
                      {items.length} {items.length === 1 ? 'journey' : 'journeys'}
                    </span>
                  </Reveal>

                  <Stagger className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((j) => (
                      <JourneyCard key={j.id} journey={j} selected={selectedId === j.id} onSelect={setSelectedId} />
                    ))}
                  </Stagger>
                </div>
              ))}
            </div>
          )}

          <Reveal className="mt-16 rounded-2xl border border-ink-900/8 bg-mist-100/60 p-6 text-center sm:p-8">
            <h2 className="font-display text-xl font-extrabold text-ink-900 sm:text-2xl">Want one of these on your dates?</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-ink-700">
              Departure dates and pricing are set per group and season. Tell us the journey and when you want to go, and
              our trip designers come back with an itinerary and a quote.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/custom-trip" className="rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-navy-800">
                Plan a Custom Trip
              </Link>
              <Link to="/tours" className="rounded-full border border-ink-900/15 px-6 py-3 text-sm font-bold text-ink-900 hover:bg-white">
                See Fixed Departures
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
