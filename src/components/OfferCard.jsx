import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Countdown } from './Countdown'

export function OfferCard({ offer }) {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(offer.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
  }

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${offer.gradient} p-6 text-white shadow-[0_20px_40px_-16px_rgba(19,97,224,0.35)] sm:p-8`}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-14 -left-10 size-40 rounded-full bg-white/10 blur-2xl" />

      <div className="relative">
        <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm">
          {offer.badge}
        </span>
        <h3 className="mt-4 font-display text-2xl font-extrabold sm:text-3xl">{offer.title}</h3>
        <p className="mt-1 text-white/90">{offer.subtitle}</p>
        <p className="mt-3 max-w-sm text-sm text-white/75">{offer.description}</p>

        <div className="mt-5">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-white/60">Ends in</p>
          <Countdown target={offer.expiresAt} />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2.5 font-mono text-sm font-bold tracking-wide backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            {offer.code}
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              {copied ? (
                <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <>
                  <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M3 10V3.5A1.5 1.5 0 0 1 4.5 2H10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
          <button
            type="button"
            onClick={() => navigate(`/plan?code=${encodeURIComponent(offer.code)}`)}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-ink-900 transition-transform hover:scale-105"
          >
            Use this code
          </button>
          {copied && <span className="text-xs font-medium text-white/80">Copied!</span>}
        </div>
      </div>
    </motion.div>
  )
}
