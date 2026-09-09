const TONES = {
  green: 'bg-green-100 text-green-600',
  blue: 'bg-blue-100 text-blue-600',
  navy: 'bg-ink-900/6 text-ink-900',
  white: 'bg-white/20 text-white backdrop-blur-sm',
}

export function Badge({ children, tone = 'navy', className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${TONES[tone]} ${className}`}>
      {children}
    </span>
  )
}

const DIFFICULTY_TONE = {
  Easy: 'green',
  Moderate: 'blue',
  Difficult: 'navy',
  Extreme: 'navy',
}

export function DifficultyBadge({ difficulty }) {
  return <Badge tone={DIFFICULTY_TONE[difficulty] || 'navy'}>{difficulty}</Badge>
}
