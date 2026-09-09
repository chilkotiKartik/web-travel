import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Img } from './ui/Img'
import { Reveal } from './ui/Reveal'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { images } from '../lib/images'

const FEATURES = [
  {
    id: 'trusted',
    title: 'Trusted Experience',
    text: "220+ departures a year for 11 years — we don't experiment on your trip, we run the route we've already run.",
    tone: 'light',
  },
  {
    id: 'safety',
    title: 'Safety First',
    text: 'Certified trek leaders, oximeter checks on every high-altitude route, and a first-aid kit that actually gets used.',
    tone: 'light',
  },
  {
    id: 'awarded',
    title: 'Award-Winning Excellence',
    text: '4.8/5 across 3,000+ reviews — the same trek leaders lead every departure, so the quality bar never slips.',
    tone: 'accent',
  },
  {
    id: 'community',
    title: 'More Than Just Travel',
    text: "80,000+ Wravelers deep, Wayfare is the group chat that outlives the trip — strangers on day one, return trekkers by day five.",
    tone: 'light',
  },
]

const FLOAT = [
  { y: [0, -10, 0], duration: 5.2 },
  { y: [0, 8, 0], duration: 6 },
  { y: [0, -9, 0], duration: 5.6 },
  { y: [0, 7, 0], duration: 4.8 },
]

function FeatureCard({ feature, floatIndex, delay }) {
  const reduced = useReducedMotion()
  const isAccent = feature.tone === 'accent'
  const float = FLOAT[floatIndex % FLOAT.length]

  return (
    <Reveal delay={delay} direction={isAccent ? 'left' : 'right'}>
      <motion.div
        animate={reduced ? undefined : { y: float.y }}
        transition={reduced ? undefined : { duration: float.duration, repeat: Infinity, ease: 'easeInOut' }}
        className={`rounded-2xl p-6 ring-1 transition-shadow duration-300 hover:shadow-lg ${
          isAccent
            ? 'bg-gradient-to-br from-blue-600 to-navy-800 text-white ring-transparent'
            : 'bg-white text-ink-900 ring-navy-900/8'
        }`}
      >
        <h3 className="font-display text-lg font-bold">{feature.title}</h3>
        <p className={`mt-2 text-sm leading-relaxed ${isAccent ? 'text-white/80' : 'text-ink-500'}`}>{feature.text}</p>
      </motion.div>
    </Reveal>
  )
}

export function WhyChooseSection() {
  const reduced = useReducedMotion()
  const [left1, left2] = FEATURES.filter((f) => f.tone === 'light').slice(0, 2)
  const right1 = FEATURES.find((f) => f.tone === 'accent')
  const right2 = FEATURES.filter((f) => f.tone === 'light')[2]

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Why Wayfare</p>
          <h2 className="text-balance mt-2 font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            Why 80,000+ Wravelers choose us
          </h2>
          <p className="mt-4 text-ink-500">
            Eleven years of getting the boring parts — permits, safety, sleep, logistics — right, so you can spend your
            energy on the part that actually matters.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-[1fr_1.5fr_1fr] lg:items-stretch">
          <div className="flex gap-5 lg:flex-col">
            <div className="flex-1"><FeatureCard feature={left1} floatIndex={0} delay={0} /></div>
            <div className="flex-1"><FeatureCard feature={left2} floatIndex={1} delay={0.08} /></div>
          </div>

          <Reveal delay={0.12} className="relative order-first lg:order-none">
            <motion.div
              animate={reduced ? undefined : { scale: [1, 1.03, 1] }}
              transition={reduced ? undefined : { duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="relative overflow-hidden rounded-3xl"
            >
              <Img
                src={images.hero('why-choose-group', 1400, 85)}
                alt="Wayfare travellers on a Himalayan trek"
                className="aspect-[4/3] sm:aspect-[16/11]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-transparent" />
            </motion.div>

            <motion.div
              animate={reduced ? undefined : { y: [0, -6, 0] }}
              transition={reduced ? undefined : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-x-4 bottom-4 flex flex-col gap-3 rounded-2xl bg-white/95 p-4 shadow-[0_16px_40px_-12px_rgba(16,24,40,0.35)] backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="font-display text-sm font-bold italic text-ink-900 sm:text-base">
                Recognised by India's leading trekking bodies
              </p>
              <Link
                to="/plan"
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-105 hover:bg-navy-800"
              >
                Make Your Plan Now →
              </Link>
            </motion.div>
          </Reveal>

          <div className="flex gap-5 lg:flex-col">
            <div className="flex-1"><FeatureCard feature={right1} floatIndex={2} delay={0.08} /></div>
            <div className="flex-1"><FeatureCard feature={right2} floatIndex={3} delay={0.16} /></div>
          </div>
        </div>
      </div>
    </section>
  )
}
