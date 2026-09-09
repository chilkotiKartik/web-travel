import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Container, SkeletonGrid, ErrorState, EmptyState } from '../components/ui/States'
import { Stagger, staggerItem, Reveal } from '../components/ui/Reveal'
import { StoryCard } from '../components/StoryCard'
import { SearchInput, FilterChip } from '../components/FilterBar'
import { useAsync } from '../hooks/useAsync'
import { useDebounce } from '../hooks/useDebounce'
import { fetchStories } from '../lib/api'
import { storyCategories } from '../data/stories'

export default function Journal() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const debouncedQuery = useDebounce(query, 250)

  const { status, data, error, reload } = useAsync(fetchStories, [])

  const filtered = useMemo(() => {
    if (!data) return []
    let result = data
    if (category) result = result.filter((s) => s.category === category)
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase()
      result = result.filter((s) => s.title.toLowerCase().includes(q) || s.excerpt.toLowerCase().includes(q))
    }
    return result
  }, [data, category, debouncedQuery])

  const [featured, ...rest] = filtered

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-100/70 via-white to-white pb-12 pt-32">
        <div className="pointer-events-none absolute -left-16 top-0 size-72 rounded-full bg-blue-500/15 blur-3xl" />
        <Container className="relative">
          <p className="text-sm font-semibold uppercase tracking-wide text-green-600">The Journal</p>
          <h1 className="text-balance mt-2 max-w-2xl font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-6xl">
            Field notes from the trail
          </h1>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput value={query} onChange={setQuery} placeholder="Search stories…" className="sm:max-w-sm" />
          </div>
          <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
            <FilterChip active={!category} onClick={() => setCategory('')}>
              All
            </FilterChip>
            {storyCategories.map((cat) => (
              <FilterChip key={cat} active={category === cat} onClick={() => setCategory(category === cat ? '' : cat)}>
                {cat}
              </FilterChip>
            ))}
          </div>

          <div className="mt-10">
            {status === 'loading' && <SkeletonGrid count={6} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" />}
            {status === 'error' && <ErrorState message={error?.message} onRetry={reload} />}
            {status === 'success' && filtered.length === 0 && (
              <EmptyState title="No stories match" message="Try a different search or category." />
            )}

            {status === 'success' && filtered.length > 0 && (
              <div className="space-y-6">
                {featured && (
                  <Reveal>
                    <StoryCard story={featured} horizontal className="lg:h-72" />
                  </Reveal>
                )}
                {rest.length > 0 && (
                  <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((s) => (
                      <motion.div key={s.id} variants={staggerItem}>
                        <StoryCard story={s} />
                      </motion.div>
                    ))}
                  </Stagger>
                )}
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  )
}
