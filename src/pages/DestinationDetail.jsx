import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Container, ErrorState } from '../components/ui/States'
import { Reveal, Stagger, staggerItem } from '../components/ui/Reveal'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Img } from '../components/ui/Img'
import { TourCard } from '../components/TourCard'
import { useAsync } from '../hooks/useAsync'
import { fetchDestination, fetchToursForDestination } from '../lib/api'

function RouteMap({ destination }) {
  return (
    <div className="rounded-2xl border border-navy-900/8 bg-navy-950 p-6 text-white">
      <p className="text-xs font-semibold uppercase tracking-wide text-green-500">Location</p>
      <svg viewBox="0 0 300 200" className="mt-4 w-full" role="img" aria-label={`Stylised map of ${destination.name}`}>
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,0.06)" />
          </pattern>
        </defs>
        <rect width="300" height="200" fill="url(#grid)" />
        <path d="M20 160 Q90 40 150 100 T280 40" fill="none" stroke="#4EBE38" strokeWidth="2" strokeDasharray="6 6" />
        <circle cx="20" cy="160" r="5" fill="#0140AC" stroke="white" strokeWidth="1.5" />
        <circle cx="280" cy="40" r="7" fill="#4EBE38" stroke="white" strokeWidth="1.5" />
      </svg>
      <div className="mt-2 flex items-center justify-between text-xs text-white/60">
        <span>{destination.coordinates.lat.toFixed(2)}°N, {destination.coordinates.lng.toFixed(2)}°E</span>
        <span>Illustrative route</span>
      </div>
    </div>
  )
}

export default function DestinationDetail() {
  const { slug } = useParams()
  const { status, data: destination, error, reload } = useAsync(() => fetchDestination(slug), [slug])
  const toursQuery = useAsync(() => fetchToursForDestination(slug), [slug])

  if (status === 'loading') {
    return (
      <Container className="py-32">
        <div className="mx-auto h-8 w-48 animate-pulse rounded bg-mist-100" />
        <div className="mx-auto mt-6 h-96 w-full animate-pulse rounded-2xl bg-mist-100" />
      </Container>
    )
  }

  if (status === 'error') {
    return (
      <Container className="py-32">
        <ErrorState title="Couldn't load this destination" message={error?.message} onRetry={reload} />
        <div className="mt-6 text-center">
          <Button to="/destinations" variant="outline-dark">
            Back to Destinations
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <>
      <section className="relative flex h-[70vh] min-h-[480px] items-end overflow-hidden bg-navy-950">
        <img src={destination.heroImage} alt={destination.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-navy-950/10" />
        <Container className="relative pb-14 pt-32">
          <Link to="/destinations" className="inline-flex items-center gap-1 text-sm font-medium text-white/70 hover:text-white">
            ← All Destinations
          </Link>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-green-500">{destination.region}</p>
          <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
            {destination.name}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/80">{destination.tagline}</p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <Reveal>
              <div className="flex flex-wrap gap-2">
                {destination.tags.map((tag) => (
                  <Badge key={tag} tone="navy">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="mt-6 text-lg leading-relaxed text-ink-700">{destination.description}</p>
            </Reveal>

            <Reveal delay={0.1} className="mt-10">
              <h2 className="font-display text-xl font-semibold text-ink-900">Highlights</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {destination.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-ink-700">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-green-500" />
                    {h}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.15} className="mt-10 grid grid-cols-3 gap-3 overflow-hidden rounded-2xl">
              {destination.gallery.map((src, i) => (
                <Img key={i} src={src} alt={`${destination.name} ${i + 1}`} className="aspect-square" />
              ))}
            </Reveal>
          </div>

          <div className="space-y-5">
            <Reveal className="rounded-2xl border border-navy-900/8 bg-white p-6">
              <dl className="space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-500">Best season</dt>
                  <dd className="font-medium text-ink-900">{destination.bestSeason}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-500">Climate</dt>
                  <dd className="text-right font-medium text-ink-900">{destination.climate}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-500">Trips available</dt>
                  <dd className="font-medium text-ink-900">{toursQuery.data?.length ?? '—'}</dd>
                </div>
              </dl>
              <Button to={`/tours?destination=${destination.slug}`} className="mt-5 w-full">
                View Trips Here
              </Button>
            </Reveal>

            <Reveal delay={0.1}>
              <RouteMap destination={destination} />
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-t border-navy-900/8 bg-mist-100/60 py-16 sm:py-20">
        <Container>
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Trips here</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Expeditions in {destination.name}
            </h2>
          </Reveal>

          <div className="mt-10">
            {toursQuery.status === 'loading' && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-80 animate-pulse rounded-2xl bg-white" />
                ))}
              </div>
            )}
            {toursQuery.status === 'success' && (
              <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {toursQuery.data.map((t) => (
                  <motion.div key={t.id} variants={staggerItem}>
                    <TourCard tour={t} />
                  </motion.div>
                ))}
              </Stagger>
            )}
          </div>
        </Container>
      </section>
    </>
  )
}
