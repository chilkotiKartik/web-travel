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

/** Day/period-bucketed column chart with pure CSS bars.
 * Each column is full-height so the bar's percentage height has a definite
 * parent to resolve against — otherwise the bars collapse to nothing. */
export function TrendChart({ data, valueFormat = (v) => v }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  // Thin out the axis labels so 14 dates never overlap in a narrow panel.
  const labelStep = Math.ceil(data.length / 7)
  return (
    <div className="flex h-40 gap-1.5">
      {data.map((d, i) => (
        <div key={d.label} className="group flex h-full flex-1 flex-col items-center gap-1.5">
          <div className="relative flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-blue-400 transition-[height] duration-500 group-hover:from-blue-700 group-hover:to-blue-500"
              style={{ height: `${d.value === 0 ? 3 : Math.max(8, (d.value / max) * 100)}%` }}
            />
            <div className="pointer-events-none absolute inset-x-0 -top-1 z-10 flex justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <span className="whitespace-nowrap rounded-md bg-navy-900 px-2 py-1 text-[10px] font-bold text-white">
                {valueFormat(d.value)}
              </span>
            </div>
          </div>
          <span className="h-3.5 whitespace-nowrap text-[10px] text-ink-500">
            {i % labelStep === 0 ? d.label : ''}
          </span>
        </div>
      ))}
    </div>
  )
}

/** Donut breakdown drawn with a conic gradient — no chart library needed. */
export function DonutChart({ data, centerLabel }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  if (total === 0) return <p className="py-6 text-center text-sm text-ink-500">Nothing to chart yet.</p>

  const segments = data.reduce((acc, d) => {
    const start = acc.length ? acc[acc.length - 1].end : 0
    const end = start + (d.value / total) * 100
    return [...acc, { color: d.color, start, end }]
  }, [])
  const stops = segments.map((s) => `${s.color} ${s.start}% ${s.end}%`).join(', ')

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="relative size-32 shrink-0">
        <div className="size-full rounded-full" style={{ background: `conic-gradient(${stops})` }} />
        <div className="absolute inset-[18%] flex flex-col items-center justify-center rounded-full bg-white">
          <span className="font-display text-xl font-extrabold text-ink-900">{total}</span>
          {centerLabel && <span className="text-[10px] text-ink-500">{centerLabel}</span>}
        </div>
      </div>
      <ul className="min-w-0 flex-1 space-y-2">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2 text-xs">
            <span className="size-2.5 shrink-0 rounded-full" style={{ background: d.color }} />
            <span className="min-w-0 flex-1 truncate text-ink-700">{d.label}</span>
            <span className="font-bold text-ink-900">{d.value}</span>
            <span className="w-10 text-right text-ink-500">{Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
