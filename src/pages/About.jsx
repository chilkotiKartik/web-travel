import { Container } from '../components/ui/States'
import { Reveal, Stagger, staggerItem } from '../components/ui/Reveal'
import { Counter } from '../components/ui/Counter'
import { Button } from '../components/ui/Button'
import { Img } from '../components/ui/Img'
import { TestimonialsSection } from '../components/TestimonialsSection'
import { team, stats } from '../data/misc'
import { images } from '../lib/images'
import { motion } from 'framer-motion'

export default function About() {
  return (
    <>
      <section className="relative flex h-[60vh] min-h-96 items-end overflow-hidden bg-navy-950">
        <img src={images.hero('about-hero', 1800, 80)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
        <Container className="relative pb-14 pt-32">
          <p className="text-sm font-semibold uppercase tracking-wide text-green-500">About Wayfare</p>
          <h1 className="text-balance mt-2 max-w-2xl font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
            We started this because a spreadsheet trek changed our lives
          </h1>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Our story</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
              Built by trekkers, not tour operators
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="space-y-4 text-ink-700">
            <p>
              Wayfare started in 2015 after our founder, Ananya, organised a Roopkund trek for eleven friends using a
              shared spreadsheet, three phone calls a day, and a trek leader she found through a friend of a friend. It
              was chaotic, occasionally terrifying, and completely worth it — and it made clear that the gap in Indian
              adventure travel wasn't demand, it was reliable logistics.
            </p>
            <p>
              Eleven years later, we've taken over 42,000 travellers into the mountains, deserts and backwaters of India,
              across 220+ departures a year. Every trek leader on our roster has personally walked every route they lead —
              we don't outsource that judgment to a subcontractor we've never met.
            </p>
            <p>
              We still believe the best trip is the one that gets the boring parts — permits, safety, food, sleep — right,
              so you can spend your energy on the part that actually matters: being there.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-navy-950 py-16 text-white sm:py-20">
        <Container>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((s) => (
              <Reveal key={s.id}>
                <p className="font-display text-4xl font-bold sm:text-5xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-sm text-white/60">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">The team</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
              The people planning your next trip
            </h2>
          </Reveal>
          <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <motion.div key={member.id} variants={staggerItem} className="rounded-2xl bg-white p-5 ring-1 ring-navy-900/6">
                <Img src={member.image} alt={member.name} className="aspect-square rounded-xl" />
                <h3 className="mt-4 font-display text-lg font-semibold text-navy-950">{member.name}</h3>
                <p className="text-sm font-medium text-blue-600">{member.role}</p>
                <p className="mt-2 text-sm text-ink-500">{member.bio}</p>
              </motion.div>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="bg-mist-100/60 py-16 sm:py-20">
        <Container>
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Trail talk</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">In their words</h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <TestimonialsSection />
          </Reveal>
        </Container>
      </section>

      <section className="py-16 text-center sm:py-24">
        <Container>
          <Reveal>
            <h2 className="text-balance mx-auto max-w-xl font-display text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
              Ready to trade your commute for a mountain pass?
            </h2>
            <Button to="/plan" size="lg" className="mt-8">
              Plan Your Trip
            </Button>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
