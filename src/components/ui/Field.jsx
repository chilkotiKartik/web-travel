export function Field({ label, htmlFor, error, hint, children, className = '' }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-navy-950">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-sm text-ink-500">{hint}</p>
      ) : null}
    </div>
  )
}

const baseInput =
  'w-full rounded-xl border bg-white px-4 py-2.5 text-[15px] text-navy-950 placeholder:text-ink-500/60 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600/30'

export function Input({ error, className = '', ...rest }) {
  return (
    <input
      className={`${baseInput} ${error ? 'border-red-400 focus:border-red-500' : 'border-navy-900/15 focus:border-blue-600'} ${className}`}
      {...rest}
    />
  )
}

export function Textarea({ error, className = '', ...rest }) {
  return (
    <textarea
      className={`${baseInput} min-h-32 resize-y ${error ? 'border-red-400 focus:border-red-500' : 'border-navy-900/15 focus:border-blue-600'} ${className}`}
      {...rest}
    />
  )
}

export function Select({ error, className = '', children, ...rest }) {
  return (
    <select
      className={`${baseInput} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%230B0E1A%22><path d=%22M5.5 7.5l4.5 5 4.5-5z%22/></svg>')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10 ${error ? 'border-red-400 focus:border-red-500' : 'border-navy-900/15 focus:border-blue-600'} ${className}`}
      {...rest}
    >
      {children}
    </select>
  )
}
