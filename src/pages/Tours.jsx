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

const SORTS = [
  { id: 'popular', label: 'Most Popular' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'duration-asc', label: 'Duration: Shortest First' },
  { id: 'rating', label: 'Highest Rated' },
]

const BUDGETS = [
  { id: '', label: 'Any Budget' },
  { id: '0-10000', label: 'Under ₹10,000' },
  { id: '10000-20000', label: '₹10,000 – ₹20,000' },
  { id: '20000-30000', label: '₹20,000 – ₹30,000' },
  { id: '30000-999999', label: '₹30,000+' },
]

const DURATIONS = [
  { id: '', label: 'Any Duration' },
  { id: '0-4', label: 'Up to 4 days' },
  { id: '5-7', label: '5–7 days' },
  { id: '8-10', label: '8–10 days' },
  { id: '11-99', label: '11+ days' },
]

export default function Tours() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [category, setCategory] = useState(params.get('category') || '')
  const [difficulty, setDifficulty] = useState(params.get('difficulty') || '')
  const [destinationSlug, setDestinationSlug] = useState(params.get('destination') || '')
  const [budget, setBudget] = useState(params.get('budget') || '')
  const [duration, setDuration] = useState(params.get('duration') || '')
  const [sort, setSort] = useState('popular')
  const debouncedQuery = useDebounce(query, 250)

  const { status, data, error, reload } = useAsync(fetchTours, [])

  useEffect(() => {
    const next = {}
    if (debouncedQuery) next.q = debouncedQuery
    if (category) next.category = category
    if (difficulty) next.difficulty = difficulty
    if (destinationSlug) next.destination = destinationSlug
    if (budget) next.budget = budget
    if (duration) next.duration = duration
    setParams(next, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, category, difficulty, destinationSlug, budget, duration])

  const filtered = useMemo(() => {
    if (!data) return []
    let result = data
    if (category) result = result.filter((t) => t.category === category)
    if (difficulty) result = result.filter((t) => t.difficulty === difficulty)
    if (destinationSlug) result = result.filter((t) => t.destinationSlug === destinationSlug)
    if (budget) {
      const [min, max] = budget.split('-').map(Number)
      result = result.filter((t) => t.price >= min && t.price <= max)
    }
    if (duration) {
      const [min, max] = duration.split('-').map(Number)
      result = result.filter((t) => t.duration >= min && t.duration <= max)
    }
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
  }, [data, category, difficulty, destinationSlug, budget, duration, debouncedQuery, sort])

  function clearAll() {
    setQuery('')
    setCategory('')
    setDifficulty('')
    setDestinationSlug('')
    setBudget('')
    setDuration('')
    setParams({}, { replace: true })
  }

  const activeDestination = destinations.find((d) => d.slug === destinationSlug)

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-100/70 via-white to-white pb-12 pt-32">
        <div className="pointer-events-none absolute -left-16 top-0 size-72 rounded-full bg-blue-500/15 blur-3xl" />
        <Container className="relative">
          <p className="text-sm font-semibold uppercase tracking-wide text-green-600">Expeditions</p>
          <h1 className="text-balance mt-2 max-w-2xl font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-6xl">
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
              <Select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-auto! min-w-40">
                {BUDGETS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </Select>
              <Select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-auto! min-w-40">
                {DURATIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
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
            {(query || category || difficulty || destinationSlug || budget || duration) && (
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
