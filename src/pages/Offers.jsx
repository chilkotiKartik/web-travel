import { Container } from '../components/ui/States'
import { Reveal, Stagger, staggerItem } from '../components/ui/Reveal'
import { OfferCard } from '../components/OfferCard'
import { Accordion } from '../components/ui/Accordion'
import { offers } from '../data/offers'
import { motion } from 'framer-motion'
import { useSeo } from '../components/Seo'

const TERMS = [
  {
    id: 't1',
    title: 'How do I apply a code?',
    content:
      'Copy any code above, or hit "Use this code" to jump straight into the booking flow with it pre-filled. Enter it at the review step and the discount is applied to your total instantly.',
  },
  {
    id: 't2',
    title: 'Can I combine multiple offers?',
    content: 'Only one promo code can be applied per booking. We automatically show you the best-value code if more than one would apply.',
  },
  {
    id: 't3',
    title: 'Do codes apply to add-ons and gear rental?',
    content: 'Discounts apply to the base trip price only, not optional gear rental or single-occupancy upgrades.',
  },
]

export default function Offers() {
  useSeo({ title: 'Offers & Discount Codes', description: 'Live Wayfare discount codes that actually work in our booking flow — festive sales, group discounts and early-bird pricing.' })
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 pb-20 pt-32 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <Container className="relative">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm"
          >
            🔥 Live deals, updated weekly
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-balance mt-4 max-w-2xl font-display text-4xl font-extrabold tracking-tight sm:text-6xl"
          >
            Real discount codes. No fine-print traps.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-4 max-w-xl text-lg text-white/85"
          >
            Every code below works right now inside our actual booking flow — copy it, or jump straight in and we'll fill it in for
            you.
          </motion.p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <Stagger className="grid gap-6 sm:grid-cols-2">
            {offers.map((offer) => (
              <motion.div key={offer.id} variants={staggerItem}>
                <OfferCard offer={offer} />
              </motion.div>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="border-t border-ink-900/8 bg-mist-100/60 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Good to know</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              How discount codes work
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <Accordion items={TERMS} defaultOpen={0} />
          </Reveal>
        </Container>
      </section>
    </>
  )
}
