export function Container({ children, className = '' }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>
}

export function CardSkeleton({ className = '' }) {
  return (
    <div className={`animate-pulse overflow-hidden rounded-2xl bg-white ${className}`}>
      <div className="aspect-[4/5] w-full bg-mist-100" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/3 rounded bg-mist-100" />
        <div className="h-4 w-5/6 rounded bg-mist-100" />
        <div className="h-3 w-2/3 rounded bg-mist-100" />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 6, className = '' }) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-navy-900/10 bg-white px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-navy-900/5 text-2xl">⚠️</div>
      <h3 className="font-display text-xl font-semibold text-navy-950">{title}</h3>
      {message && <p className="max-w-sm text-sm text-ink-500">{message}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-navy-800"
        >
          Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title = 'Nothing here yet', message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-navy-900/15 bg-white/60 px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-green-100 text-2xl">🧭</div>
      <h3 className="font-display text-xl font-semibold text-navy-950">{title}</h3>
      {message && <p className="max-w-sm text-sm text-ink-500">{message}</p>}
      {action}
    </div>
  )
}
