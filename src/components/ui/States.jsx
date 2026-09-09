export function Container({ children, className = '' }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>
}

function Shimmer({ className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-mist-100 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
    </div>
  )
}

export function CardSkeleton({ className = '' }) {
  return (
    <div className={`overflow-hidden rounded-2xl bg-white ring-1 ring-ink-900/6 ${className}`}>
      <Shimmer className="aspect-[4/5] w-full" />
      <div className="space-y-2.5 p-4">
        <Shimmer className="h-3 w-1/3 rounded-full" />
        <Shimmer className="h-4 w-5/6 rounded-full" />
        <Shimmer className="h-3 w-2/3 rounded-full" />
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
    <div className="relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-navy-900/10 bg-white px-6 py-16 text-center shadow-[0_1px_0_rgba(11,14,26,0.04)]">
      <div className="pointer-events-none absolute -top-10 size-40 rounded-full bg-red-500/5 blur-3xl" />
      <div className="relative flex size-14 items-center justify-center rounded-full bg-red-50 text-2xl ring-1 ring-red-500/10">⚠️</div>
      <h3 className="relative font-display text-xl font-semibold text-ink-900">{title}</h3>
      {message && <p className="relative max-w-sm text-sm text-ink-500">{message}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="relative mt-2 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105 hover:bg-navy-800"
        >
          Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title = 'Nothing here yet', message, action }) {
  return (
    <div className="relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-dashed border-navy-900/15 bg-white/60 px-6 py-16 text-center">
      <div className="pointer-events-none absolute -bottom-10 size-40 rounded-full bg-green-500/8 blur-3xl" />
      <div className="relative flex size-14 items-center justify-center rounded-full bg-green-100 text-2xl ring-1 ring-green-500/10">🧭</div>
      <h3 className="relative font-display text-xl font-semibold text-ink-900">{title}</h3>
      {message && <p className="relative max-w-sm text-sm text-ink-500">{message}</p>}
      {action && <div className="relative">{action}</div>}
    </div>
  )
}
