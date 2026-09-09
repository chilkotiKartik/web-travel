import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Img } from './ui/Img'

const RINGS = [
  'from-blue-600 via-blue-400 to-green-500',
  'from-green-600 via-green-400 to-blue-500',
  'from-blue-500 via-green-400 to-green-600',
  'from-green-500 via-blue-400 to-blue-600',
]

export function CircularIconRow({ items }) {
  return (
    <div className="no-scrollbar flex gap-6 overflow-x-auto px-1 py-2 sm:justify-center">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06, duration: 0.4 }}
        >
          <Link to={item.to} className="group flex w-20 shrink-0 flex-col items-center gap-2 text-center sm:w-24">
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
              className={`relative flex size-16 items-center justify-center rounded-full bg-gradient-to-br p-[3px] shadow-[0_6px_16px_-6px_rgba(19,97,224,0.4)] transition-shadow group-hover:shadow-[0_10px_24px_-6px_rgba(19,97,224,0.55)] sm:size-20 ${RINGS[i % RINGS.length]}`}
            >
              <span className="flex size-full items-center justify-center overflow-hidden rounded-full border-2 border-white bg-mist-100">
                {item.image ? (
                  <Img src={item.image} alt="" className="size-full" />
                ) : (
                  <span className="text-2xl">{item.emoji}</span>
                )}
              </span>
              <motion.span
                className="absolute inset-0 rounded-full"
                animate={{ boxShadow: ['0 0 0 0 rgba(82,201,60,0.35)', '0 0 0 8px rgba(82,201,60,0)'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: i * 0.3 }}
              />
            </motion.div>
            <span className="text-xs font-semibold leading-tight text-ink-700 group-hover:text-blue-600 sm:text-sm">
              {item.label}
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
