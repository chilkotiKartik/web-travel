import { motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function PageTransition({ children }) {
  const reduced = useReducedMotion()
  if (reduced) return children
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
