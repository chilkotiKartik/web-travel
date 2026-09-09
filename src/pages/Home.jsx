import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Container } from '../components/ui/States'
import { Button } from '../components/ui/Button'
import { Reveal, Stagger, staggerItem } from '../components/ui/Reveal'
import { Counter } from '../components/ui/Counter'
import { DestinationCard } from '../components/DestinationCard'
import { TourCard } from '../components/TourCard'
import { StoryCard } from '../components/StoryCard'
import { TestimonialsSection } from '../components/TestimonialsSection'
import { NewsletterForm } from '../components/NewsletterForm'
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
      <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-navy-950">
        <img
          src={images.hero('home-hero', 2000, 85)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-70"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-navy-950/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/70 via-transparent to-transparent" />

        <Container className="relative z-10 pb-16 pt-40 sm:pb-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-sm font-semibold uppercase tracking-[0.2em] text-green-500"
          >
            Real Adventures, Real India
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-balance mt-4 max-w-4xl font-display text-5xl font-bold leading-[0.98] tracking-tight text-white sm:text-7xl lg:text-8xl"
          >
            Go where the road stops being a road.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-6 max-w-xl text-lg text-white/80"
          >
            220+ handpicked treks, road trips and expeditions across India, run by people who've walked every trail
            themselves. No influencer itineraries — just real logistics, done right.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            onSubmit={handleSearch}
            className="mt-9 flex max-w-xl flex-col gap-2 rounded-2xl bg-white/10 p-2 backdrop-blur-md sm:flex-row sm:items-center"
            role="search"
          >
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 'Ladakh', 'snow trek', 'Hampta Pass'…"
              aria-label="Search destinations and expeditions"
              className="w-full flex-1 rounded-xl bg-transparent px-4 py-3 text-white placeholder:text-white/50 outline-none"
            />
            <Button as="button" type="submit" className="w-full sm:w-auto">
              Search Trips
            </Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-14 grid grid-cols-2 gap-6 border-t border-white/15 pt-8 sm:grid-cols-4"
          >
            {stats.map((s) => (
              <div key={s.id}>
                <p className="font-display text-3xl font-bold text-white sm:text-4xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-xs text-white/60 sm:text-sm">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Featured destinations */}
      <section className="py-24 sm:py-28">
        <Container>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Where to next</p>
              <h2 className="text-balance mt-2 max-w-lg font-display text-4xl font-bold tracking-tight text-navy-950 sm:text-5xl">
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
      <section className="bg-navy-950 py-24 text-white sm:py-28">
        <Container>
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wide text-green-500">Pick your pace</p>
            <h2 className="text-balance mt-2 max-w-lg font-display text-4xl font-bold tracking-tight sm:text-5xl">
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
              <h2 className="text-balance mt-2 max-w-lg font-display text-4xl font-bold tracking-tight text-navy-950 sm:text-5xl">
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
            <h2 className="text-balance mt-2 max-w-lg font-display text-4xl font-bold tracking-tight text-navy-950 sm:text-5xl">
              From daydream to base camp
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-8 lg:grid-cols-5 lg:gap-4">
            {JOURNEY_STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.08} className="relative">
                <span className="font-display text-5xl font-bold text-navy-950/10">{step.n}</span>
                <h3 className="mt-3 font-display text-lg font-semibold text-navy-950">{step.title}</h3>
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
            <h2 className="text-balance mt-2 max-w-lg font-display text-4xl font-bold tracking-tight text-navy-950 sm:text-5xl">
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
              <h2 className="text-balance mt-2 max-w-lg font-display text-4xl font-bold tracking-tight text-navy-950 sm:text-5xl">
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
      <section className="relative overflow-hidden bg-navy-950 py-24 text-white sm:py-28">
        <img src={images.hero('cta-band', 1800, 70)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-navy-950/60" />
        <Container className="relative">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance font-display text-4xl font-bold tracking-tight sm:text-5xl">
              The mountains aren't going anywhere. Your excuses will.
            </h2>
            <p className="mt-4 text-white/70">Get new routes and departure dates before they fill up.</p>
            <NewsletterForm variant="dark" className="mx-auto mt-8 max-w-md" />
          </Reveal>
        </Container>
      </section>
    </>
  )
}
