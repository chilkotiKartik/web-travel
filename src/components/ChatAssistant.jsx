import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { getBotReply, suggestedPrompts } from '../lib/chatbot'
import { useReducedMotion } from '../hooks/useReducedMotion'

const WELCOME = {
  id: 'welcome',
  from: 'bot',
  text: "Hi, I'm the Wayfare trip assistant. Ask me about a destination, a specific trek, pricing, or how booking works.",
  actions: [],
}

function Message({ msg }) {
  const isBot = msg.from === 'bot'
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isBot ? 'rounded-bl-sm bg-mist-100 text-ink-900' : 'rounded-br-sm bg-blue-600 text-white'
        }`}
      >
        <p>{msg.text}</p>
        {msg.actions?.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {msg.actions.map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 shadow-sm transition-colors hover:bg-blue-100"
              >
                {a.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-mist-100 px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-1.5 rounded-full bg-ink-500/60"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  )
}

export function ChatAssistant() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [unread, setUnread] = useState(false)
  const listRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, typing, open])

  useEffect(() => {
    const isMobile = window.innerWidth < 640
    if (!isMobile) return
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  function send(text) {
    const value = text.trim()
    if (!value) return
    const userMsg = { id: `u_${Date.now()}`, from: 'user', text: value }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setTyping(true)

    const delay = 500 + Math.random() * 500
    setTimeout(() => {
      const reply = getBotReply(value)
      setMessages((m) => [...m, { id: `b_${Date.now()}`, from: 'bot', ...reply }])
      setTyping(false)
      if (!open) setUnread(true)
    }, delay)
  }

  function handleSubmit(e) {
    e.preventDefault()
    send(input)
  }

  if (pathname === '/plan') return null

  return (
    <>
      <motion.button
        type="button"
        onClick={() => {
          setOpen((o) => !o)
          setUnread(false)
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: 'spring', bounce: 0.4 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? 'Close trip assistant' : 'Open trip assistant'}
        className="fixed bottom-24 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_8px_24px_rgba(19,97,224,0.45)] sm:bottom-28 sm:right-8"
      >
        {unread && !open && <span className="absolute right-1 top-1 size-3 rounded-full bg-green-500 ring-2 ring-white" />}
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 12a8 8 0 1 1 3.2 6.4L4 20l1.2-3.6A7.96 7.96 0 0 1 4 12Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <circle cx="8.5" cy="12" r="1" fill="currentColor" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
            <circle cx="15.5" cy="12" r="1" fill="currentColor" />
          </svg>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 bottom-40 top-auto z-40 flex h-[70vh] max-h-[560px] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_-12px_rgba(16,24,40,0.35)] sm:inset-auto sm:bottom-[184px] sm:right-8 sm:h-[520px] sm:w-96"
          >
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-4 text-white">
              <div className="flex size-10 items-center justify-center rounded-full bg-white/20 text-lg">🧭</div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold">Trip Assistant</p>
                <p className="flex items-center gap-1.5 text-xs text-white/80">
                  <span className="size-1.5 rounded-full bg-green-400" /> Online now
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex size-8 items-center justify-center rounded-full text-white/80 hover:bg-white/10"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <Message key={m.id} msg={m} />
              ))}
              {typing && <TypingDots />}
            </div>

            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-2">
                {suggestedPrompts().map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => send(p)}
                    className="rounded-full border border-ink-900/10 px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-mist-100"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-ink-900/8 p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a trip, price, or booking…"
                aria-label="Message the trip assistant"
                className="min-w-0 flex-1 rounded-full bg-mist-100 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-500/60 outline-none focus:ring-2 focus:ring-blue-600/30"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-navy-800 disabled:opacity-40"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
