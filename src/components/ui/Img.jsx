import { useState } from 'react'

/** Lazy-loaded image with a soft loading shimmer and graceful fallback on error. */
export function Img({ src, alt, className = '', imgClassName = '', eager = false, ...rest }) {
  const [state, setState] = useState('loading')

  return (
    <div className={`relative overflow-hidden bg-mist-100 ${className}`}>
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setState('loaded')}
        onError={() => setState('error')}
        className={`h-full w-full object-cover transition-opacity duration-700 ${state === 'loaded' ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        {...rest}
      />
      {state === 'loading' && <div className="absolute inset-0 animate-pulse bg-mist-100" aria-hidden="true" />}
      {state === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-navy-900/5 text-sm text-ink-500">
          Image unavailable
        </div>
      )}
    </div>
  )
}
