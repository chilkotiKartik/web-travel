import { motion } from 'framer-motion'
import { Img } from './ui/Img'
import { useReducedMotion } from '../hooks/useReducedMotion'

const EASE = [0.16, 1, 0.3, 1]

/** Editorial hero band for interior pages: copy on the left, a real image panel
 * on the right so the band never reads as empty, plus optional fact chips. */
export function PageHero({ eyebrow, title, subtitle, image, imageAlt = '', facts = [], tone = 'blue' }) {
  const reduced = useReducedMotion()
  const accent = tone === 'green' ? 'text-green-600' : 'text-blue-600'

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-100/70 via-white to-white pb-14 pt-28 sm:pt-32">
      <div className="pointer-events-none absolute -left-24 -top-10 size-80 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 size-72 rounded-full bg-green-500/12 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <motion.p
              initial={reduced ? undefined : { opacity: 0, y: 14 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`text-sm font-semibold uppercase tracking-[0.18em] ${accent}`}
            >
              {eyebrow}
            </motion.p>

            <motion.h1
              initial={reduced ? undefined : { opacity: 0, y: 22 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
              className="text-balance mt-3 max-w-2xl font-display text-4xl font-extrabold leading-[1.03] tracking-tight text-ink-900 sm:text-6xl"
            >
              {title}
            </motion.h1>

            {subtitle && (
              <motion.p
                initial={reduced ? undefined : { opacity: 0, y: 16 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
                className="mt-5 max-w-lg text-lg leading-relaxed text-ink-500"
              >
                {subtitle}
              </motion.p>
            )}

            {facts.length > 0 && (
              <motion.div
                initial={reduced ? undefined : { opacity: 0 }}
                animate={reduced ? undefined : { opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 flex flex-wrap gap-x-8 gap-y-4"
              >
                {facts.map((f) => (
                  <div key={f.label}>
                    <p className="font-display text-2xl font-extrabold text-ink-900">{f.value}</p>
                    <p className="mt-0.5 text-xs font-medium text-ink-500">{f.label}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {image && (
            <motion.div
              initial={reduced ? undefined : { opacity: 0, scale: 0.94, y: 18 }}
              animate={reduced ? undefined : { opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
              className="relative hidden lg:block"
            >
              <motion.div
                animate={reduced ? undefined : { y: [0, -10, 0] }}
                transition={reduced ? undefined : { duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="overflow-hidden rounded-[28px] shadow-[0_24px_60px_-24px_rgba(16,24,40,0.45)]"
              >
                <Img src={image} alt={imageAlt} className="aspect-[5/4] w-full" />
              </motion.div>
              <div className="pointer-events-none absolute -bottom-5 -left-5 size-28 rounded-3xl bg-gradient-to-br from-blue-600 to-green-500 opacity-90" />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
