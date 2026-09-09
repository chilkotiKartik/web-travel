/** Minimal, dependency-free horizontal bar chart for real admin data. */
export function BarChart({ data, valueFormat = (v) => v }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  return (
    <div className="space-y-2.5">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate text-xs font-medium text-ink-500" title={d.label}>
            {d.label}
          </span>
          <div className="h-6 flex-1 overflow-hidden rounded-full bg-mist-100">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(d.value / max) * 100}%`, background: d.color || 'linear-gradient(90deg, #1361e0, #52c93c)' }}
            />
          </div>
          <span className="w-14 shrink-0 text-right text-xs font-bold text-ink-900">{valueFormat(d.value)}</span>
        </div>
      ))}
    </div>
  )
}

/** Simple day-bucketed column chart (last N days) with pure CSS bars. */
export function TrendChart({ data }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  return (
    <div className="flex h-32 items-end gap-1.5">
      {data.map((d) => (
        <div key={d.label} className="group relative flex flex-1 flex-col items-center gap-1.5">
          <div className="pointer-events-none absolute -top-7 rounded-md bg-navy-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
            {d.value}
          </div>
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-500"
            style={{ height: `${Math.max(4, (d.value / max) * 100)}%` }}
          />
          <span className="text-[10px] text-ink-500">{d.label}</span>
        </div>
      ))}
    </div>
  )
}
