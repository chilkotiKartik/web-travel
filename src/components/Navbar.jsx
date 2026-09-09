import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Container } from './ui/States'
import { Button } from './ui/Button'
import { useAuth } from '../context/AuthContext'
import { useAdminActivityCount } from '../hooks/useAdminActivity'

const LINKS = [
  { to: '/destinations', label: 'Destinations' },
  { to: '/experiences', label: 'Experiences' },
  { to: '/tours', label: 'Expeditions' },
  { to: '/atlas', label: 'Atlas' },
  { to: '/offers', label: 'Offers', badge: true },
  { to: '/journal', label: 'Journal' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

function AccountMenu() {
  const { user, logOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const ref = useRef(null)
  const adminActivity = useAdminActivityCount(user?.isAdmin)

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  if (!user) {
    return (
      <Link to="/login" className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-mist-100">
        Log In
      </Link>
    )
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Account menu"
        aria-expanded={menuOpen}
        className="relative flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-green-500 font-display text-sm font-extrabold text-white transition-transform hover:scale-105"
      >
        {user.name.charAt(0).toUpperCase()}
        {adminActivity > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-3.5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </button>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-48 overflow-hidden rounded-2xl border border-ink-900/8 bg-white py-2 shadow-[0_16px_40px_-12px_rgba(16,24,40,0.25)]"
          >
            <p className="truncate px-4 py-2 text-xs text-ink-500">{user.email}</p>
            <Link to="/account" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-mist-100">
              My Bookings
            </Link>
            {user.isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-mist-100"
              >
                Admin Panel
                {adminActivity > 0 && (
                  <span className="flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {adminActivity > 9 ? '9+' : adminActivity}
                  </span>
                )}
              </Link>
            )}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                logOut()
                navigate('/')
              }}
              className="block w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Log Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Navbar() {
  const { pathname } = useLocation()
  const { user, logOut } = useAuth()
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
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,height] duration-300 ${
        scrolled ? 'glass-surface h-[72px] shadow-[0_2px_24px_rgba(16,24,40,0.1)]' : 'h-20 bg-white shadow-[0_1px_0_rgba(16,24,40,0.06)]'
      }`}
    >
      <Container className="flex h-full items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2" aria-label="Wayfare home">
          <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-green-500 font-display text-lg font-extrabold text-white">
            W
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight text-ink-900">
            Way<span className="text-green-500">fare</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => {
            const isActive = pathname === link.to || pathname.startsWith(link.to + '/')
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive ? 'text-blue-600' : 'text-ink-700 hover:text-ink-900'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 rounded-full bg-blue-100"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {!isActive && (
                  <span className="absolute inset-0 rounded-full bg-mist-100 opacity-0 transition-opacity duration-200 hover:opacity-100" />
                )}
                <span className="relative inline-flex items-center gap-1.5">
                  {link.label}
                  {link.badge && <span className="size-1.5 rounded-full bg-green-500" />}
                </span>
              </NavLink>
            )
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <AccountMenu />
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
            {user ? (
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-mist-100 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-900">{user.name}</p>
                  <Link to="/account" className="text-xs font-medium text-blue-600">
                    My Bookings
                  </Link>
                </div>
                <button type="button" onClick={logOut} className="shrink-0 text-sm font-semibold text-red-600">
                  Log Out
                </button>
              </div>
            ) : (
              <div className="mt-4 flex gap-2">
                <Link to="/login" className="flex-1 rounded-full border border-ink-900/15 py-2.5 text-center text-sm font-semibold text-ink-900">
                  Log In
                </Link>
                <Link to="/signup" className="flex-1 rounded-full bg-mist-100 py-2.5 text-center text-sm font-semibold text-ink-900">
                  Sign Up
                </Link>
              </div>
            )}
            <Button to="/plan" className="mt-3 w-full">
              Plan a Trip
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
