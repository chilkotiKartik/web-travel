import { Link } from 'react-router-dom'
import { Container } from '../components/ui/States'
import { Reveal } from '../components/ui/Reveal'
import { Img } from '../components/ui/Img'
import { tours, categories } from '../data/tours'
import { images } from '../lib/images'

const CATEGORY_DETAIL = {
  Trekking: {
    tagline: 'On foot, at altitude',
    description:
      'Ridgelines, alpine meadows and mountain passes — our core programme, run by trek leaders who\'ve walked every route themselves.',
    image: images.hero('exp-trekking', 1400, 85),
  },
  'Road Trip': {
    tagline: 'Long roads, higher passes',
    description: 'Convoy-style journeys across the highest motorable roads on the planet, from Ladakh to Spiti.',
    image: images.hero('exp-roadtrip', 1400, 85),
  },
  Backpacking: {
    tagline: 'Slow travel, low stress',
    description: 'Coastlines, backwaters and desert towns — lower altitude, easier pace, still built with real logistics.',
    image: images.hero('exp-backpacking', 1400, 85),
  },
  Wildlife: {
    tagline: 'Forest trails and safaris',
    description: 'Guided walks and safari mornings through some of India\'s richest biodiversity corridors.',
    image: images.hero('exp-wildlife', 1400, 85),
  },
  'Snow Expedition': {
    tagline: 'Winter-only, specialist gear',
    description: 'From a first snow summit to walking on a frozen river — our most extreme seasonal programme.',
    image: images.hero('exp-snow', 1400, 85),
  },
}

export default function Experiences() {
  return (
    <>
      <section className="relative flex h-[52vh] min-h-96 items-end overflow-hidden bg-navy-950">
        <img src={images.hero('experiences-hero', 1800, 80)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
        <Container className="relative pb-14 pt-32">
          <p className="text-sm font-semibold uppercase tracking-wide text-green-500">Experiences</p>
          <h1 className="text-balance mt-2 max-w-2xl font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Five ways to move through India
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/80">
            Every trip we run falls into one of five categories. Pick the pace that matches your fitness, time, and appetite
            for discomfort.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="space-y-20">
          {categories.map((cat, i) => {
            const meta = CATEGORY_DETAIL[cat]
            const count = tours.filter((t) => t.category === cat).length
            const reversed = i % 2 === 1
            return (
              <Reveal
                key={cat}
                className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${reversed ? 'lg:[direction:rtl]' : ''}`}
              >
                <div className={reversed ? '[direction:ltr]' : ''}>
                  <Img src={meta.image} alt={cat} className="aspect-[4/3] rounded-2xl" />
                </div>
                <div className={reversed ? '[direction:ltr]' : ''}>
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{meta.tagline}</p>
                  <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">{cat}</h2>
                  <p className="mt-4 max-w-md text-ink-700">{meta.description}</p>
                  <p className="mt-4 text-sm text-ink-500">{count} trip{count === 1 ? '' : 's'} currently running</p>
                  <Link
                    to={`/tours?category=${encodeURIComponent(cat)}`}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-navy-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
                  >
                    Browse {cat} trips
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </Reveal>
            )
          })}
        </Container>
      </section>
    </>
  )
}
