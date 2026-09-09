import { useEffect, useState } from 'react'

function getParts(target) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now())
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return { days, hours, minutes, seconds, expired: diff <= 0 }
}

export function Countdown({ target, className = '' }) {
  const [parts, setParts] = useState(() => getParts(target))

  useEffect(() => {
    const id = setInterval(() => setParts(getParts(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  if (parts.expired) {
    return <span className={`text-sm font-semibold text-ink-500 ${className}`}>Offer ended</span>
  }

  const units = [
    { label: 'd', value: parts.days },
    { label: 'h', value: parts.hours },
    { label: 'm', value: parts.minutes },
    { label: 's', value: parts.seconds },
  ]

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {units.map((u) => (
        <div key={u.label} className="flex items-center gap-0.5 rounded-lg bg-black/20 px-2 py-1 backdrop-blur-sm">
          <span className="font-display text-sm font-bold tabular-nums text-white">{String(u.value).padStart(2, '0')}</span>
          <span className="text-[10px] font-medium uppercase text-white/70">{u.label}</span>
        </div>
      ))}
    </div>
  )
}
