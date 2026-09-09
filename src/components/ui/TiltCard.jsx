import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/** Subtle 3D hover tilt, desktop pointer only. No-ops on touch and reduced-motion. */
export function TiltCard({ children, className = '', maxTilt = 6 }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  const springX = useSpring(x, { stiffness: 200, damping: 20 })
  const springY = useSpring(y, { stiffness: 200, damping: 20 })
  const rotateX = useTransform(springY, [0, 1], [maxTilt, -maxTilt])
  const rotateY = useTransform(springX, [0, 1], [-maxTilt, maxTilt])
  const spotlightX = useTransform(springX, [0, 1], ['0%', '100%'])
  const spotlightY = useTransform(springY, [0, 1], ['0%', '100%'])
  const spotlightBg = useTransform(
    [spotlightX, spotlightY],
    ([sx, sy]) => `radial-gradient(280px circle at ${sx} ${sy}, rgba(255,255,255,0.16), transparent 70%)`
  )

  if (reduced) {
    return <div className={`group relative ${className}`}>{children}</div>
  }

  function handleMove(e) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left) / rect.width)
    y.set((e.clientY - rect.top) / rect.height)
  }

  function handleLeave() {
    x.set(0.5)
    y.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={`group relative ${className}`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlightBg }}
      />
      {children}
    </motion.div>
  )
}
