export function Rating({ value, count, size = 14, className = '' }) {
  const full = Math.round(value)
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className="flex" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill={i < full ? '#4EBE38' : '#E5E7EB'}
            className="shrink-0"
          >
            <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.2 1.3 6.1L10 15l-5.4 3 1.3-6.1L1.3 7.7l6.1-.6L10 1.5z" />
          </svg>
        ))}
      </span>
      <span className="text-sm font-medium text-ink-700">{value.toFixed(1)}</span>
      {typeof count === 'number' && <span className="text-sm text-ink-500">({count})</span>}
    </span>
  )
}
