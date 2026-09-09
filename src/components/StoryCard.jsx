import { Link } from 'react-router-dom'
import { Img } from './ui/Img'
import { Badge } from './ui/Badge'

const dateFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export function StoryCard({ story, className = '', horizontal = false }) {
  return (
    <Link
      to={`/journal/${story.slug}`}
      className={`group block overflow-hidden rounded-2xl bg-white ring-1 ring-navy-900/6 transition-shadow hover:shadow-lg ${
        horizontal ? 'flex flex-col sm:flex-row' : ''
      } ${className}`}
    >
      <Img
        src={story.heroImage}
        alt={story.title}
        className={horizontal ? 'aspect-[4/3] sm:aspect-auto sm:w-56 sm:shrink-0' : 'aspect-[16/10]'}
        imgClassName="transition-transform duration-700 group-hover:scale-105"
      />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <Badge tone="green">{story.category}</Badge>
          <span className="text-xs text-ink-500">{story.readTime}</span>
        </div>
        <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-navy-950 group-hover:text-blue-600">
          {story.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-ink-500">{story.excerpt}</p>
        <div className="mt-auto flex items-center gap-2 pt-4">
          <Img src={story.authorImage} alt="" className="size-7 rounded-full" />
          <span className="text-xs font-medium text-ink-700">{story.author}</span>
          <span className="text-xs text-ink-500">· {dateFmt.format(new Date(story.date))}</span>
        </div>
      </div>
    </Link>
  )
}
