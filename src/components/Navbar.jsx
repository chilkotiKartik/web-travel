import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Container } from './ui/States'
import { Button } from './ui/Button'

const LINKS = [
  { to: '/destinations', label: 'Destinations' },
  { to: '/experiences', label: 'Experiences' },
  { to: '/tours', label: 'Expeditions' },
  { to: '/offers', label: 'Offers', badge: true },
  { to: '/journal', label: 'Journal' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export function Navbar() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_2px_16px_rgba(16,24,40,0.08)]' : 'shadow-[0_1px_0_rgba(16,24,40,0.06)]'
      }`}
    >
      <Container className="flex h-20 items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2" aria-label="Wayfare home">
          <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-green-500 font-display text-lg font-extrabold text-white">
            W
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight text-ink-900">
            Way<span className="text-green-500">fare</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive ? 'bg-blue-100 text-blue-600' : 'text-ink-700 hover:bg-mist-100 hover:text-ink-900'
                }`
              }
            >
              <span className="inline-flex items-center gap-1.5">
                {link.label}
                {link.badge && <span className="size-1.5 rounded-full bg-green-500" />}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button to="/plan" size="sm">
            Plan a Trip
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="relative z-10 flex size-10 items-center justify-center rounded-full text-ink-900 lg:hidden"
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${open ? 'top-2 rotate-45' : 'top-0'}`}
            />
            <span
              className={`absolute left-0 top-2 h-0.5 w-5 rounded-full bg-current transition-opacity duration-200 ${open ? 'opacity-0' : 'opacity-100'}`}
            />
            <span
              className={`absolute left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${open ? 'top-2 -rotate-45' : 'top-4'}`}
            />
          </span>
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-ink-900/8 bg-white px-5 pb-6 pt-2 lg:hidden"
          >
            <nav className="flex flex-col">
              {LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `border-b border-ink-900/8 py-3.5 text-base font-semibold ${isActive ? 'text-blue-600' : 'text-ink-700'}`
                  }
                >
                  <span className="inline-flex items-center gap-2">
                    {link.label}
                    {link.badge && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-600">Sale</span>
                    )}
                  </span>
                </NavLink>
              ))}
            </nav>
            <Button to="/plan" className="mt-5 w-full">
              Plan a Trip
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
