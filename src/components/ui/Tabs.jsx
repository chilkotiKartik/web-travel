import { useId, useState } from 'react'
import { motion } from 'framer-motion'

export function Tabs({ tabs, defaultTab, className = '' }) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id)
  const layoutId = useId()
  const activeTab = tabs.find((t) => t.id === active) || tabs[0]

  return (
    <div className={className}>
      <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-navy-900/5 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className="relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors"
          >
            {active === tab.id && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-white shadow-sm"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className={`relative ${active === tab.id ? 'text-ink-900' : 'text-ink-500'}`}>{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-6">{activeTab?.content}</div>
    </div>
  )
}
