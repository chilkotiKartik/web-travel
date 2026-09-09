import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Container, ErrorState } from '../components/ui/States'
import { Reveal, Stagger, staggerItem } from '../components/ui/Reveal'
import { Button } from '../components/ui/Button'
import { DifficultyBadge, Badge } from '../components/ui/Badge'
import { Rating } from '../components/ui/Rating'
import { Img } from '../components/ui/Img'
import { Tabs } from '../components/ui/Tabs'
import { TourCard } from '../components/TourCard'
import { useAsync } from '../hooks/useAsync'
import { fetchTour, fetchToursForDestination } from '../lib/api'
import { getDestinationBySlug } from '../data/destinations'
import { useCompare } from '../context/CompareContext'
import { useSeo } from '../components/Seo'

function formatPrice(price) {
  return `₹${price.toLocaleString('en-IN')}`
}

const STAT_ICONS = {
  duration: '🗓️',
  difficulty: '⛰️',
  altitude: '🏔️',
  group: '👥',
  season: '☀️',
}

export default function TourDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { status, data: tour, error, reload } = useAsync(() => fetchTour(slug), [slug])
  useSeo({
    title: tour?.title,
    description: tour ? `${tour.title} — ${tour.duration} days, ${tour.difficulty} grade, from ₹${tour.price.toLocaleString('en-IN')}. ${tour.overview.slice(0, 110)}` : undefined,
    image: tour?.heroImage,
  })
  const relatedQuery = useAsync(
    () => (tour ? fetchToursForDestination(tour.destinationSlug) : Promise.resolve([])),
    [tour?.destinationSlug]
  )
  const { slugs: compareSlugs, toggle: toggleCompare, isFull } = useCompare()

  if (status === 'loading') {
    return (
      <Container className="py-32">
        <div className="h-8 w-64 animate-pulse rounded bg-mist-100" />
        <div className="mt-6 h-[420px] w-full animate-pulse rounded-2xl bg-mist-100" />
      </Container>
    )
  }

  if (status === 'error') {
    return (
      <Container className="py-32">
        <ErrorState title="Couldn't load this trip" message={error?.message} onRetry={reload} />
        <div className="mt-6 text-center">
          <Button to="/tours" variant="outline-dark">
            Back to Expeditions
          </Button>
        </div>
      </Container>
    )
  }

  const destination = getDestinationBySlug(tour.destinationSlug)
  const related = (relatedQuery.data || []).filter((t) => t.id !== tour.id).slice(0, 3)
  const inCompare = compareSlugs.includes(tour.slug)

  const overviewTab = (
    <div className="space-y-8">
      <p className="text-lg leading-relaxed text-ink-700">{tour.overview}</p>
      <div>
        <h3 className="font-display text-lg font-semibold text-ink-900">Highlights</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {tour.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-sm text-ink-700">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-green-500" />
              {h}
            </li>
          ))}
        </ul>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {tour.gallery.map((src, i) => (
          <Img key={i} src={src} alt={`${tour.title} ${i + 1}`} className="aspect-[4/3] rounded-xl" />
        ))}
      </div>
    </div>
  )

  const itineraryTab = (
    <ol className="relative space-y-8 border-l border-navy-900/10 pl-6">
      {tour.itinerary.map((day) => (
        <li key={day.day} className="relative">
          <span className="absolute -left-[31px] flex size-6 items-center justify-center rounded-full bg-navy-950 text-[11px] font-bold text-white">
            {day.day}
          </span>
          <h4 className="font-display text-base font-semibold text-ink-900">{day.title}</h4>
          <p className="mt-1 text-sm leading-relaxed text-ink-700">{day.description}</p>
        </li>
      ))}
    </ol>
  )

  const inclusionsTab = (
    <div className="grid gap-8 sm:grid-cols-2">
      <div>
        <h3 className="font-display text-base font-semibold text-green-600">Included</h3>
        <ul className="mt-3 space-y-2">
          {tour.inclusions.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-ink-700">
              <span className="mt-0.5 text-green-500">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-display text-base font-semibold text-ink-500">Not Included</h3>
        <ul className="mt-3 space-y-2">
          {tour.exclusions.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-ink-700">
              <span className="mt-0.5 text-ink-500">✕</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  const gearTab = (
    <ul className="grid gap-3 sm:grid-cols-2">
      {tour.thingsToCarry.map((item) => (
        <li key={item} className="flex items-start gap-2 rounded-xl border border-navy-900/8 bg-white px-4 py-3 text-sm text-ink-700">
          <span className="text-blue-600">•</span>
          {item}
        </li>
      ))}
    </ul>
  )

  return (
    <>
      <section className="relative flex h-[70vh] min-h-[480px] items-end overflow-hidden bg-navy-950">
        <img src={tour.heroImage} alt={tour.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-navy-950/10" />
        <Container className="relative pb-12 pt-32">
          <Link to="/tours" className="inline-flex items-center gap-1 text-sm font-medium text-white/70 hover:text-white">
            ← All Expeditions
          </Link>
          {destination && (
            <Link
              to={`/destinations/${destination.slug}`}
              className="mt-4 inline-block text-sm font-semibold uppercase tracking-wide text-green-500 hover:underline"
            >
              {destination.name}
            </Link>
          )}
          <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">{tour.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <DifficultyBadge difficulty={tour.difficulty} />
            <Badge tone="white">{tour.category}</Badge>
            <Rating value={tour.rating} count={tour.reviewsCount} className="text-white [&_span]:text-white" />
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <Reveal className="grid grid-cols-2 gap-4 rounded-2xl border border-navy-900/8 bg-white p-5 sm:grid-cols-5">
              {[
                { icon: STAT_ICONS.duration, label: 'Duration', value: `${tour.duration}D / ${tour.nights}N` },
                { icon: STAT_ICONS.difficulty, label: 'Difficulty', value: tour.difficulty },
                { icon: STAT_ICONS.altitude, label: 'Max Altitude', value: tour.maxAltitude },
                { icon: STAT_ICONS.group, label: 'Group Size', value: tour.groupSize },
                { icon: STAT_ICONS.season, label: 'Best Season', value: tour.bestSeason },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-lg">{stat.icon}</p>
                  <p className="mt-1 text-xs text-ink-500">{stat.label}</p>
                  <p className="text-sm font-semibold text-ink-900">{stat.value}</p>
                </div>
              ))}
            </Reveal>

            <Reveal delay={0.1} className="mt-10">
              <Tabs
                tabs={[
                  { id: 'overview', label: 'Overview', content: overviewTab },
                  { id: 'itinerary', label: 'Itinerary', content: itineraryTab },
                  { id: 'inclusions', label: 'Inclusions', content: inclusionsTab },
                  { id: 'gear', label: 'What to Carry', content: gearTab },
                ]}
              />
            </Reveal>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal className="rounded-2xl border border-navy-900/8 bg-white p-6 shadow-sm">
              <p className="text-xs text-ink-500">Starting from</p>
              <p className="font-display text-3xl font-bold text-ink-900">{formatPrice(tour.price)}</p>
              <p className="text-xs text-ink-500">per person, twin sharing</p>
              <Button onClick={() => navigate(`/plan?tour=${tour.slug}`)} className="mt-5 w-full" size="lg">
                Book This Trip
              </Button>
              <Button to="/contact" variant="outline-dark" className="mt-3 w-full">
                Ask a Question
              </Button>
              <button
                type="button"
                onClick={() => toggleCompare(tour.slug)}
                disabled={!inCompare && isFull}
                className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  inCompare ? 'border-green-500 bg-green-50 text-green-700' : 'border-navy-900/15 text-ink-900 hover:bg-navy-900/5'
                }`}
              >
                {inCompare ? '✓ Added to Compare' : '⚖️ Add to Compare'}
              </button>
              <ul className="mt-6 space-y-2 border-t border-navy-900/8 pt-5 text-sm text-ink-500">
                <li>✓ Free rescheduling up to 15 days out</li>
                <li>✓ Certified trek leaders on every departure</li>
                <li>✓ 24/7 support during your trip</li>
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="border-t border-navy-900/8 bg-mist-100/60 py-16 sm:py-20">
          <Container>
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">More like this</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
                Other trips in {destination?.name}
              </h2>
            </Reveal>
            <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((t) => (
                <motion.div key={t.id} variants={staggerItem}>
                  <TourCard tour={t} />
                </motion.div>
              ))}
            </Stagger>
          </Container>
        </section>
      )}
    </>
  )
}
