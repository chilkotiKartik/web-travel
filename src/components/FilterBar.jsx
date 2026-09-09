export function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'border-navy-950 bg-navy-950 text-white'
          : 'border-navy-900/15 bg-white text-ink-700 hover:border-navy-900/30'
      }`}
    >
      {children}
    </button>
  )
}

export function SearchInput({ value, onChange, placeholder = 'Search…', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-500"
      >
        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-full border border-navy-900/15 bg-white py-3 pl-11 pr-4 text-sm text-navy-950 outline-none placeholder:text-ink-500/70 focus:border-blue-600"
      />
    </div>
  )
}
