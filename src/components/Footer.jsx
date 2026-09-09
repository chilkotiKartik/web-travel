import { Link } from 'react-router-dom'
import { NewsletterForm } from './NewsletterForm'
import { Container } from './ui/States'

const COLUMNS = [
  {
    title: 'Explore',
    links: [
      { to: '/destinations', label: 'Destinations' },
      { to: '/experiences', label: 'Experiences' },
      { to: '/tours', label: 'Expeditions' },
      { to: '/journal', label: 'Journal' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About Us' },
      { to: '/contact', label: 'Contact' },
      { to: '/plan', label: 'Plan a Trip' },
      { to: '/contact#faq', label: 'FAQs' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-navy-950 text-white/70">
      <Container className="pt-16 pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-full bg-white font-display text-lg font-bold text-navy-950">
                W
              </span>
              <span className="font-display text-lg font-bold text-white">Wayfare</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              India's premium adventure travel company — handpicked treks, expeditions and journeys, run by people who've
              walked every trail themselves.
            </p>
            <div className="mt-6 flex gap-3">
              {['Instagram', 'YouTube', 'X'].map((s) => (
                <a
                  key={s}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex size-9 items-center justify-center rounded-full border border-white/15 text-xs font-medium text-white/70 transition-colors hover:border-white/40 hover:text-white"
                  aria-label={s}
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-white">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-white">Trail notes</h4>
            <p className="mt-4 text-sm">New routes, gear guides and departure dates — once or twice a month, never more.</p>
            <NewsletterForm variant="dark" className="mt-4" />
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Wayfare Travel Co. All rights reserved.</p>
          <div className="flex gap-5">
            <span className="cursor-default">Privacy Policy</span>
            <span className="cursor-default">Terms of Service</span>
          </div>
        </div>
      </Container>
    </footer>
  )
}
