import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Container, SkeletonGrid, ErrorState, EmptyState } from '../components/ui/States'
import { Stagger, staggerItem, Reveal } from '../components/ui/Reveal'
import { StoryCard } from '../components/StoryCard'
import { SearchInput, FilterChip } from '../components/FilterBar'
import { PageHero } from '../components/PageHero'
import { images } from '../lib/images'
import { useAsync } from '../hooks/useAsync'
import { useDebounce } from '../hooks/useDebounce'
import { fetchStories } from '../lib/api'
import { storyCategories } from '../data/stories'
import { useSeo } from '../components/Seo'

export default function Journal() {
  useSeo({ title: 'The Journal', description: 'Field notes from the trail — trek guides, gear lists, altitude advice and honest trip diaries written by the leaders who ran them.' })
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
      <PageHero
        eyebrow="The Journal"
        tone="green"
        title="Field notes from the trail"
        subtitle="Gear that survived, altitude that didn't go to plan, and the honest version of what a Himalayan week actually feels like — written by the people who led the trip."
        image={images.destination('kashmir', 1000)}
        imageAlt="A Himalayan alpine lake and meadow"
        facts={[
          { value: '6', label: 'Long reads' },
          { value: '4', label: 'Categories' },
        ]}
      />

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
