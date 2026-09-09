import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Container, SkeletonGrid, ErrorState, EmptyState } from '../components/ui/States'
import { Stagger, staggerItem } from '../components/ui/Reveal'
import { DestinationCard } from '../components/DestinationCard'
import { SearchInput, FilterChip } from '../components/FilterBar'
import { useAsync } from '../hooks/useAsync'
import { useDebounce } from '../hooks/useDebounce'
import { fetchDestinations } from '../lib/api'
import { images } from '../lib/images'

const ALL_TAGS = ['Mountains', 'Desert', 'Rivers', 'Beaches', 'Culture', 'Trekking', 'Snow', 'Offbeat', 'Beginner Friendly', 'Extreme']

export default function Destinations() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [activeTag, setActiveTag] = useState(params.get('tag') || '')
  const debouncedQuery = useDebounce(query, 250)

  const { status, data, error, reload } = useAsync(fetchDestinations, [])

  const filtered = useMemo(() => {
    if (!data) return []
    let result = data
    if (activeTag) result = result.filter((d) => d.tags.includes(activeTag))
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase()
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.region.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    return result
  }, [data, activeTag, debouncedQuery])

  function updateTag(tag) {
    const next = activeTag === tag ? '' : tag
    setActiveTag(next)
    setParams((p) => {
      if (next) p.set('tag', next)
      else p.delete('tag')
      return p
    }, { replace: true })
  }

  return (
    <>
      <section className="relative flex h-[52vh] min-h-96 items-end overflow-hidden bg-navy-950">
        <img src={images.hero('destinations-hero', 1800, 80)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
        <Container className="relative pb-14 pt-32">
          <p className="text-sm font-semibold uppercase tracking-wide text-green-500">Destinations</p>
          <h1 className="text-balance mt-2 max-w-2xl font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Ten regions. Every kind of landscape.
          </h1>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput value={query} onChange={setQuery} placeholder="Search by region, name or vibe…" className="sm:max-w-sm" />
            <p className="text-sm text-ink-500">
              {status === 'success' ? `${filtered.length} of ${data.length} destinations` : ' '}
            </p>
          </div>

          <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
            {ALL_TAGS.map((tag) => (
              <FilterChip key={tag} active={activeTag === tag} onClick={() => updateTag(tag)}>
                {tag}
              </FilterChip>
            ))}
          </div>

          <div className="mt-10">
            {status === 'loading' && (
              <SkeletonGrid count={9} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" />
            )}

            {status === 'error' && (
              <ErrorState message={error?.message} onRetry={reload} />
            )}

            {status === 'success' && filtered.length === 0 && (
              <EmptyState
                title="No destinations match that search"
                message="Try a different keyword or clear the filters."
                action={
                  <button
                    onClick={() => {
                      setQuery('')
                      setActiveTag('')
                      setParams({}, { replace: true })
                    }}
                    className="mt-2 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-medium text-white"
                  >
                    Clear filters
                  </button>
                }
              />
            )}

            {status === 'success' && filtered.length > 0 && (
              <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((d) => (
                  <motion.div key={d.id} variants={staggerItem}>
                    <DestinationCard destination={d} className="h-full" />
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
