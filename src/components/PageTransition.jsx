import { motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function PageTransition({ children }) {
  const reduced = useReducedMotion()
  if (reduced) return children
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.99, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -10, scale: 0.99, filter: 'blur(4px)' }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
