import { useRef } from 'react'
import { Img } from './ui/Img'
import { Rating } from './ui/Rating'
import { testimonials } from '../data/misc'

export function TestimonialsSection() {
  const railRef = useRef(null)

  function scrollBy(delta) {
    railRef.current?.scrollBy({ left: delta, behavior: 'smooth' })
  }

  return (
    <div>
      <div
        ref={railRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
      >
        {testimonials.map((t) => (
          <figure
            key={t.id}
            className="w-[280px] shrink-0 snap-start rounded-2xl border border-navy-900/8 bg-white p-6 sm:w-[340px]"
          >
            <Rating value={t.rating} size={14} />
            <blockquote className="mt-4 text-[15px] leading-relaxed text-ink-700">"{t.quote}"</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <Img src={t.image} alt="" className="size-10 rounded-full" />
              <div>
                <p className="text-sm font-semibold text-navy-950">{t.name}</p>
                <p className="text-xs text-ink-500">{t.trip}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollBy(-360)}
          aria-label="Previous testimonials"
          className="flex size-10 items-center justify-center rounded-full border border-navy-900/15 text-navy-950 transition-colors hover:bg-navy-900/5"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => scrollBy(360)}
          aria-label="Next testimonials"
          className="flex size-10 items-center justify-center rounded-full border border-navy-900/15 text-navy-950 transition-colors hover:bg-navy-900/5"
        >
          →
        </button>
      </div>
    </div>
  )
}
