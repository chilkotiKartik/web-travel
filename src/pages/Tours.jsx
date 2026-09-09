import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Container, SkeletonGrid, ErrorState, EmptyState } from '../components/ui/States'
import { Stagger, staggerItem } from '../components/ui/Reveal'
import { TourCard } from '../components/TourCard'
import { SearchInput, FilterChip } from '../components/FilterBar'
import { Select } from '../components/ui/Field'
import { useAsync } from '../hooks/useAsync'
import { useDebounce } from '../hooks/useDebounce'
import { fetchTours } from '../lib/api'
import { categories, difficulties } from '../data/tours'
import { destinations } from '../data/destinations'
import { images } from '../lib/images'

const SORTS = [
  { id: 'popular', label: 'Most Popular' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'duration-asc', label: 'Duration: Shortest First' },
  { id: 'rating', label: 'Highest Rated' },
]

export default function Tours() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [category, setCategory] = useState(params.get('category') || '')
  const [difficulty, setDifficulty] = useState(params.get('difficulty') || '')
  const [destinationSlug, setDestinationSlug] = useState(params.get('destination') || '')
  const [sort, setSort] = useState('popular')
  const debouncedQuery = useDebounce(query, 250)

  const { status, data, error, reload } = useAsync(fetchTours, [])

  useEffect(() => {
    const next = {}
    if (debouncedQuery) next.q = debouncedQuery
    if (category) next.category = category
    if (difficulty) next.difficulty = difficulty
    if (destinationSlug) next.destination = destinationSlug
    setParams(next, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, category, difficulty, destinationSlug])

  const filtered = useMemo(() => {
    if (!data) return []
    let result = data
    if (category) result = result.filter((t) => t.category === category)
    if (difficulty) result = result.filter((t) => t.difficulty === difficulty)
    if (destinationSlug) result = result.filter((t) => t.destinationSlug === destinationSlug)
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          t.destinationSlug.replace(/-/g, ' ').includes(q)
      )
    }
    const sorted = [...result]
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    else if (sort === 'duration-asc') sorted.sort((a, b) => a.duration - b.duration)
    else if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating)
    else sorted.sort((a, b) => b.reviewsCount - a.reviewsCount)
    return sorted
  }, [data, category, difficulty, destinationSlug, debouncedQuery, sort])

  function clearAll() {
    setQuery('')
    setCategory('')
    setDifficulty('')
    setDestinationSlug('')
    setParams({}, { replace: true })
  }

  const activeDestination = destinations.find((d) => d.slug === destinationSlug)

  return (
    <>
      <section className="relative flex h-[46vh] min-h-80 items-end overflow-hidden bg-navy-950">
        <img src={images.hero('tours-hero', 1800, 80)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
        <Container className="relative pb-12 pt-32">
          <p className="text-sm font-semibold uppercase tracking-wide text-green-500">Expeditions</p>
          <h1 className="text-balance mt-2 max-w-2xl font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
            {activeDestination ? `Trips in ${activeDestination.name}` : 'Find your next trail'}
          </h1>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <SearchInput value={query} onChange={setQuery} placeholder="Search trips, tags, destinations…" className="lg:max-w-sm" />
            <div className="flex flex-wrap items-center gap-3">
              <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-auto! min-w-40">
                <option value="">Any Difficulty</option>
                {difficulties.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
              <Select value={destinationSlug} onChange={(e) => setDestinationSlug(e.target.value)} className="w-auto! min-w-40">
                <option value="">Any Destination</option>
                {destinations.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name}
                  </option>
                ))}
              </Select>
              <Select value={sort} onChange={(e) => setSort(e.target.value)} className="w-auto! min-w-44">
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
            <FilterChip active={!category} onClick={() => setCategory('')}>
              All
            </FilterChip>
            {categories.map((cat) => (
              <FilterChip key={cat} active={category === cat} onClick={() => setCategory(category === cat ? '' : cat)}>
                {cat}
              </FilterChip>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between text-sm text-ink-500">
            <span>{status === 'success' ? `${filtered.length} trip${filtered.length === 1 ? '' : 's'} found` : ' '}</span>
            {(query || category || difficulty || destinationSlug) && (
              <button onClick={clearAll} className="font-medium text-blue-600 hover:underline">
                Clear all filters
              </button>
            )}
          </div>

          <div className="mt-6">
            {status === 'loading' && <SkeletonGrid count={9} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" />}

            {status === 'error' && <ErrorState message={error?.message} onRetry={reload} />}

            {status === 'success' && filtered.length === 0 && (
              <EmptyState
                title="No trips match your filters"
                message="Try loosening a filter or search for something broader."
                action={
                  <button onClick={clearAll} className="mt-2 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-medium text-white">
                    Clear filters
                  </button>
                }
              />
            )}

            {status === 'success' && filtered.length > 0 && (
              <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((t) => (
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
