import { useState } from 'react'
import { subscribeNewsletter } from '../lib/api'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function NewsletterForm({ variant = 'light', className = '' }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [error, setError] = useState('')
  const [already, setAlready] = useState(false)

  const dark = variant === 'dark'

  async function handleSubmit(e) {
    e.preventDefault()
    if (!EMAIL_RE.test(email)) {
      setError('Enter a valid email address')
      setStatus('error')
      return
    }
    setStatus('loading')
    setError('')
    try {
      const res = await subscribeNewsletter(email)
      setAlready(Boolean(res.alreadySubscribed))
      setStatus('success')
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className={`text-sm ${dark ? 'text-green-500' : 'text-green-600'} ${className}`}>
        {already ? "You're already on the list — next trail notes drop soon." : "You're in. Watch your inbox for the next trail notes."}
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-2 ${className}`} noValidate>
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          placeholder="you@email.com"
          aria-label="Email address"
          className={`min-w-0 flex-1 rounded-full border px-4 py-2.5 text-sm outline-none transition-colors ${
            dark
              ? 'border-white/15 bg-white/5 text-white placeholder:text-white/40 focus:border-white/40'
              : 'border-navy-900/15 bg-white text-navy-950 placeholder:text-ink-500/60 focus:border-blue-600'
          }`}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="shrink-0 rounded-full bg-green-500 px-5 py-2.5 text-sm font-semibold text-navy-950 transition-colors hover:bg-green-600 disabled:opacity-60"
        >
          {status === 'loading' ? 'Joining…' : 'Join'}
        </button>
      </div>
      {status === 'error' && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
