import { useParams, Link } from 'react-router-dom'
import { Container, ErrorState } from '../components/ui/States'
import { Reveal } from '../components/ui/Reveal'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Img } from '../components/ui/Img'
import { StoryCard } from '../components/StoryCard'
import { useAsync } from '../hooks/useAsync'
import { fetchStory, fetchStories } from '../lib/api'

const dateFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

export default function StoryDetail() {
  const { slug } = useParams()
  const { status, data: story, error, reload } = useAsync(() => fetchStory(slug), [slug])
  const allStories = useAsync(fetchStories, [])

  if (status === 'loading') {
    return (
      <Container className="py-32">
        <div className="mx-auto h-8 w-64 animate-pulse rounded bg-mist-100" />
        <div className="mx-auto mt-6 h-96 w-full max-w-3xl animate-pulse rounded-2xl bg-mist-100" />
      </Container>
    )
  }

  if (status === 'error') {
    return (
      <Container className="py-32">
        <ErrorState title="Couldn't load this story" message={error?.message} onRetry={reload} />
        <div className="mt-6 text-center">
          <Button to="/journal" variant="outline-dark">
            Back to Journal
          </Button>
        </div>
      </Container>
    )
  }

  const more = (allStories.data || []).filter((s) => s.id !== story.id).slice(0, 3)

  return (
    <>
      <section className="relative flex h-[60vh] min-h-96 items-end overflow-hidden bg-navy-950">
        <img src={story.heroImage} alt={story.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-navy-950/10" />
        <Container className="relative pb-14 pt-32">
          <Link to="/journal" className="inline-flex items-center gap-1 text-sm font-medium text-white/70 hover:text-white">
            ← Journal
          </Link>
          <Badge tone="green" className="mt-4">
            {story.category}
          </Badge>
          <h1 className="text-balance mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
            {story.title}
          </h1>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container className="max-w-3xl">
          <Reveal className="flex items-center gap-3 border-b border-navy-900/8 pb-8">
            <Img src={story.authorImage} alt="" className="size-12 rounded-full" />
            <div>
              <p className="text-sm font-semibold text-ink-900">{story.author}</p>
              <p className="text-xs text-ink-500">
                {story.authorRole} · {dateFmt.format(new Date(story.date))} · {story.readTime}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 space-y-6">
            {story.content.map((para, i) => (
              <p key={i} className="text-lg leading-relaxed text-ink-700">
                {para}
              </p>
            ))}
          </Reveal>

          <Reveal delay={0.15} className="mt-10 flex flex-wrap gap-2 border-t border-navy-900/8 pt-8">
            {story.tags.map((tag) => (
              <Badge key={tag} tone="navy">
                {tag}
              </Badge>
            ))}
          </Reveal>
        </Container>
      </section>

      {more.length > 0 && (
        <section className="border-t border-navy-900/8 bg-mist-100/60 py-16 sm:py-20">
          <Container>
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Keep reading</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">More from the journal</h2>
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((s) => (
                <StoryCard key={s.id} story={s} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  )
}
