import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { tours } from '../data/tours'
import { useCompare } from '../context/CompareContext'
import { Img } from './ui/Img'

export function CompareBar() {
  const { slugs, remove, clear, max } = useCompare()
  const navigate = useNavigate()
  const selected = slugs.map((s) => tours.find((t) => t.slug === s)).filter(Boolean)

  return (
    <AnimatePresence>
      {selected.length > 0 && (
        <motion.div
          initial={{ y: 96, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 96, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-900/8 bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(16,24,40,0.12)] backdrop-blur-sm sm:px-6"
        >
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3">
            <div className="flex flex-1 items-center gap-2 overflow-x-auto">
              {selected.map((t) => (
                <div key={t.slug} className="relative shrink-0">
                  <Img src={t.heroImage} alt={t.title} className="size-12 rounded-lg" />
                  <button
                    type="button"
                    onClick={() => remove(t.slug)}
                    aria-label={`Remove ${t.title} from compare`}
                    className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-navy-900 text-white shadow-sm"
                  >
                    <svg width="9" height="9" viewBox="0 0 16 16" fill="none">
                      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}
              <span className="shrink-0 text-xs text-ink-500">
                {selected.length}/{max} trips selected
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button type="button" onClick={clear} className="rounded-full px-3 py-2 text-xs font-semibold text-ink-500 hover:text-ink-900">
                Clear
              </button>
              <button
                type="button"
                onClick={() => navigate('/compare')}
                disabled={selected.length < 2}
                className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Compare {selected.length >= 2 ? `(${selected.length})` : ''}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
