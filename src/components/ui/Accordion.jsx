import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export function Accordion({ items, defaultOpen = 0 }) {
  const [openIndex, setOpenIndex] = useState(defaultOpen)

  return (
    <div className="divide-y divide-navy-900/8 rounded-2xl border border-navy-900/8 bg-white">
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div key={item.id || i}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-display text-base font-semibold text-navy-950">{item.title}</span>
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-full bg-navy-900/5 text-navy-950 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
              >
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 text-sm leading-relaxed text-ink-700">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
