import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Container } from './ui/States'
import { Button } from './ui/Button'

const LINKS = [
  { to: '/destinations', label: 'Destinations' },
  { to: '/experiences', label: 'Experiences' },
  { to: '/tours', label: 'Expeditions' },
  { to: '/journal', label: 'Journal' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export function Navbar() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const isHome = pathname === '/'
  const transparent = isHome && !scrolled && !open

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
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
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        transparent ? 'bg-transparent' : 'bg-sand-50/90 backdrop-blur-md shadow-[0_1px_0_rgba(11,14,26,0.08)]'
      }`}
    >
      <Container className="flex h-20 items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2" aria-label="Wayfare home">
          <span
            className={`flex size-9 items-center justify-center rounded-full font-display text-lg font-bold ${
              transparent ? 'bg-white text-navy-950' : 'bg-navy-950 text-white'
            }`}
          >
            W
          </span>
          <span className={`font-display text-lg font-bold tracking-tight ${transparent ? 'text-white' : 'text-navy-950'}`}>
            Wayfare
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  transparent
                    ? isActive
                      ? 'bg-white/15 text-white'
                      : 'text-white/85 hover:bg-white/10 hover:text-white'
                    : isActive
                      ? 'bg-navy-900/8 text-navy-950'
                      : 'text-ink-700 hover:bg-navy-900/5 hover:text-navy-950'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button to="/plan" size="sm" variant={transparent ? 'primary' : 'primary'}>
            Plan a Trip
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className={`relative z-10 flex size-10 items-center justify-center rounded-full lg:hidden ${
            transparent ? 'text-white' : 'text-navy-950'
          }`}
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
            className="border-t border-navy-900/10 bg-sand-50 px-5 pb-6 pt-2 lg:hidden"
          >
            <nav className="flex flex-col">
              {LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `border-b border-navy-900/8 py-3.5 text-base font-medium ${isActive ? 'text-navy-950' : 'text-ink-700'}`
                  }
                >
                  {link.label}
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
