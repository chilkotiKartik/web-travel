import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { Container } from '../components/ui/States'
import { Button } from '../components/ui/Button'
import { Reveal, Stagger, staggerItem } from '../components/ui/Reveal'
import { Counter } from '../components/ui/Counter'
import { DestinationCard } from '../components/DestinationCard'
import { TourCard } from '../components/TourCard'
import { StoryCard } from '../components/StoryCard'
import { TestimonialsSection } from '../components/TestimonialsSection'
import { NewsletterForm } from '../components/NewsletterForm'
import { CircularIconRow } from '../components/CircularIconRow'
import { DailyHighlight } from '../components/DailyHighlight'
import { destinations } from '../data/destinations'
import { tours, categories } from '../data/tours'
import { stories } from '../data/stories'
import { stats } from '../data/misc'
import { images } from '../lib/images'

const FEATURED_DESTINATIONS = destinations.slice(0, 6)
const FEATURED_TOURS = [...tours].sort((a, b) => b.rating - a.rating).slice(0, 6)
const LATEST_STORIES = stories.slice(0, 3)

const CATEGORY_META = {
  Trekking: { blurb: 'Ridgelines, passes and summit mornings', image: images.hero('cat-trekking', 900) },
  'Road Trip': { blurb: 'High passes and long horizons by road', image: images.hero('cat-road', 900) },
  Backpacking: { blurb: 'Slow travel, coasts and backwaters', image: images.hero('cat-backpack', 900) },
  Wildlife: { blurb: 'Forest trails and safari mornings', image: images.hero('cat-wildlife', 900) },
  'Snow Expedition': { blurb: 'Frozen rivers and winter summits', image: images.hero('cat-snow', 900) },
}

const ROTATING_DESTINATIONS = ['Ladakh', 'Spiti Valley', 'Meghalaya', 'Kashmir', 'Himachal', 'Sikkim', 'Goa']

function RotatingWord() {
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setIndex((i) => (i + 1) % ROTATING_DESTINATIONS.length), 2200)
    return () => clearInterval(id)
  }, [reduced])

  if (reduced) {
    return <span className="text-green-500">{ROTATING_DESTINATIONS[0]}</span>
  }

  return (
    <span className="relative inline-grid overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={ROTATING_DESTINATIONS[index]}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="col-start-1 row-start-1 whitespace-nowrap text-green-500"
        >
          {ROTATING_DESTINATIONS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

const MARQUEE_ITEMS = [
  '42,000+ travellers taken into the mountains',
  '96% would book with us again',
  '220+ departures every year',
  '11 years operating in the Himalayas',
  'Certified trek leaders on every trip',
  'Free rescheduling up to 15 days out',
]

const JOURNEY_STEPS = [
  { n: '01', title: 'Discover', text: 'Browse destinations by landscape, season, and how they actually feel on the ground.' },
  { n: '02', title: 'Explore', text: 'Go deep on a region — climate, best months, and the specific trails that run there.' },
  { n: '03', title: 'Compare', text: 'Filter expeditions by difficulty, duration and price to find your fit.' },
  { n: '04', title: 'Plan', text: 'Tell us your dates and group size. We build the logistics around you.' },
  { n: '05', title: 'Book', text: 'Confirm your spot, get your gear list, and start counting down.' },
]

export default function Home() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  function handleSearch(e) {
    e.preventDefault()
    navigate(query.trim() ? `/tours?q=${encodeURIComponent(query.trim())}` : '/tours')
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-100/70 via-white to-white pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-40 size-80 rounded-full bg-green-500/15 blur-3xl" />

        <Container className="relative grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-blue-600 shadow-[0_2px_10px_rgba(16,24,40,0.08)]"
            >
              🇮🇳 India's Social Travel Community
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-balance mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink-900 sm:text-6xl"
            >
              Book Your Trip
              <br />
              to <RotatingWord />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-6 max-w-lg text-lg text-ink-500"
            >
              220+ handpicked treks, road trips and expeditions across India. Real trek leaders, real logistics,
              80,000+ Wravelers who've already gone before you.
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              onSubmit={handleSearch}
              className="mt-8 flex max-w-lg flex-col gap-2 rounded-2xl bg-white p-2 shadow-[0_8px_30px_rgba(16,24,40,0.1)] sm:flex-row sm:items-center"
              role="search"
            >
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search 'Ladakh', 'snow trek', 'Hampta Pass'…"
                aria-label="Search destinations and expeditions"
                className="w-full flex-1 rounded-xl bg-transparent px-4 py-3 text-ink-900 placeholder:text-ink-500/60 outline-none"
              />
              <Button as="button" type="submit" className="w-full sm:w-auto">
                Search Trips
              </Button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4"
            >
              {stats.map((s) => (
                <div key={s.id}>
                  <p className="font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">
                    <Counter value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 text-xs text-ink-500 sm:text-sm">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-10">
                <img src={images.hero('hero-collage-1', 700, 85)} alt="" className="aspect-[3/4] w-full rounded-3xl object-cover shadow-xl" />
              </div>
              <div className="space-y-4">
                <img src={images.hero('hero-collage-2', 700, 85)} alt="" className="aspect-square w-full rounded-3xl object-cover shadow-xl" />
                <img src={images.hero('hero-collage-3', 700, 85)} alt="" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-xl" />
              </div>
            </div>
            <div className="absolute -left-6 bottom-6 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_10px_30px_rgba(16,24,40,0.15)]">
              <span className="flex size-9 items-center justify-center rounded-full bg-green-100 text-lg">⭐</span>
              <div>
                <p className="text-sm font-bold text-ink-900">4.8/5 rated</p>
                <p className="text-xs text-ink-500">by 3,000+ trekkers</p>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Daily highlight */}
      <section className="py-10 sm:py-14">
        <Container>
          <DailyHighlight />
        </Container>
      </section>

      {/* Circular quick links */}
      <section className="py-8">
        <Container>
          <CircularIconRow
            items={[
              { label: 'Offers', to: '/offers', emoji: '🔥' },
              ...destinations.slice(0, 4).map((d) => ({ label: d.name, to: `/destinations/${d.slug}`, image: d.heroImage })),
              { label: 'Journal', to: '/journal', emoji: '📔' },
            ]}
          />
        </Container>
      </section>

      {/* Trust marquee */}
      <div className="overflow-hidden border-y border-ink-900/8 bg-mist-100/60 py-3">
        <div className="flex w-max animate-marquee gap-10">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="flex shrink-0 items-center gap-2 text-sm font-semibold text-ink-700">
              <span className="text-green-500">●</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Offers teaser */}
      <section className="py-8">
        <Container>
          <Reveal>
            <Link
              to="/offers"
              className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 px-6 py-5 text-center text-white shadow-[0_10px_30px_-10px_rgba(19,97,224,0.5)] sm:flex-row sm:justify-between sm:text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="font-display text-lg font-extrabold">Winter Sale is live — up to 20% off</p>
                  <p className="text-sm text-white/85">Flash codes, group discounts and early-bird pricing, all working right now.</p>
                </div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-ink-900 transition-transform group-hover:scale-105">
                View Offers
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </Reveal>
        </Container>
      </section>

      {/* Featured destinations */}
      <section className="py-24 sm:py-28">
        <Container>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Where to next</p>
              <h2 className="text-balance mt-2 max-w-lg font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
                Ten landscapes, one country
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Button to="/destinations" variant="outline-dark">
                All Destinations
              </Button>
            </Reveal>
          </div>

          <Stagger className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {FEATURED_DESTINATIONS.map((d, i) => (
              <motion.div key={d.id} variants={staggerItem} className={i === 0 ? 'col-span-2 row-span-2' : ''}>
                <DestinationCard destination={d} priority={i === 0} className="h-full" />
              </motion.div>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Experiences by category */}
      <section className="bg-mist-100/70 py-24 sm:py-28">
        <Container>
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wide text-green-600">Pick your pace</p>
            <h2 className="text-balance mt-2 max-w-lg font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
              Every kind of adventure, one platform
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {categories.map((cat, i) => {
              const meta = CATEGORY_META[cat]
              return (
                <Reveal key={cat} delay={i * 0.06} className={i === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}>
                  <button
                    onClick={() => navigate(`/tours?category=${encodeURIComponent(cat)}`)}
                    className="group relative block h-full min-h-56 w-full overflow-hidden rounded-2xl text-left"
                  >
                    <img
                      src={meta.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent" />
                    <div className="relative flex h-full flex-col justify-end p-6">
                      <h3 className="font-display text-2xl font-semibold">{cat}</h3>
                      <p className="mt-1 text-sm text-white/70">{meta.blurb}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-green-500">
                        Explore trips
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-1">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </button>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Featured expeditions */}
      <section className="py-24 sm:py-28">
        <Container>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Top rated</p>
              <h2 className="text-balance mt-2 max-w-lg font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
                Expeditions people actually rebook
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Button to="/tours" variant="outline-dark">
                All Expeditions
              </Button>
            </Reveal>
          </div>

          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_TOURS.map((t) => (
              <motion.div key={t.id} variants={staggerItem}>
                <TourCard tour={t} />
              </motion.div>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Journey / process */}
      <section className="border-y border-navy-900/8 bg-mist-100/60 py-24 sm:py-28">
        <Container>
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">How it works</p>
            <h2 className="text-balance mt-2 max-w-lg font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
              From daydream to base camp
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-8 lg:grid-cols-5 lg:gap-4">
            {JOURNEY_STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.08} className="relative">
                <span className="font-display text-5xl font-bold text-ink-900/10">{step.n}</span>
                <h3 className="mt-3 font-display text-lg font-semibold text-ink-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{step.text}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3} className="mt-14 flex justify-center">
            <Button to="/plan" size="lg">
              Start Planning Your Trip
            </Button>
          </Reveal>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-24 sm:py-28">
        <Container>
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Trail talk</p>
            <h2 className="text-balance mt-2 max-w-lg font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
              What 42,000 travellers say
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="mt-12">
            <TestimonialsSection />
          </Reveal>
        </Container>
      </section>

      {/* Journal preview */}
      <section className="bg-mist-100/60 py-24 sm:py-28">
        <Container>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">The journal</p>
              <h2 className="text-balance mt-2 max-w-lg font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
                Field notes from the trail
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Button to="/journal" variant="outline-dark">
                Read the Journal
              </Button>
            </Reveal>
          </div>
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {LATEST_STORIES.map((s) => (
              <motion.div key={s.id} variants={staggerItem}>
                <StoryCard story={s} />
              </motion.div>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Newsletter CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-green-600 py-24 text-white sm:py-28">
        <div className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 size-72 rounded-full bg-white/10 blur-3xl" />
        <Container className="relative">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              The mountains aren't going anywhere. Your excuses will.
            </h2>
            <p className="mt-4 text-white/80">Get new routes and departure dates before they fill up.</p>
            <NewsletterForm variant="dark" className="mx-auto mt-8 max-w-md" />
          </Reveal>
        </Container>
      </section>
    </>
  )
}
