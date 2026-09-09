import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Container } from '../components/ui/States'
import { Field, Input, Select, Textarea } from '../components/ui/Field'
import { Img } from '../components/ui/Img'
import { submitBooking } from '../lib/api'
import { tours } from '../data/tours'
import { getDestinationBySlug } from '../data/destinations'

const STEPS = ['Trip', 'Details', 'You', 'Review']

function formatPrice(price) {
  return `₹${price.toLocaleString('en-IN')}`
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const today = new Date().toISOString().split('T')[0]

export default function Plan() {
  const [params] = useSearchParams()
  const preselectedSlug = params.get('tour')

  const [step, setStep] = useState(0)
  const [tourSlug, setTourSlug] = useState(preselectedSlug || '')
  const [tourSearch, setTourSearch] = useState('')
  const [travelers, setTravelers] = useState(2)
  const [date, setDate] = useState('')
  const [sharing, setSharing] = useState('twin')
  const [contact, setContact] = useState({ name: '', email: '', phone: '', notes: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [submitError, setSubmitError] = useState('')
  const [booking, setBooking] = useState(null)

  useEffect(() => {
    if (preselectedSlug) window.scrollTo({ top: 0 })
  }, [preselectedSlug])

  const selectedTour = tours.find((t) => t.slug === tourSlug)
  const selectedDestination = selectedTour ? getDestinationBySlug(selectedTour.destinationSlug) : null

  const visibleTours = useMemo(() => {
    if (!tourSearch.trim()) return tours.slice(0, 8)
    const q = tourSearch.toLowerCase()
    return tours.filter((t) => t.title.toLowerCase().includes(q) || t.destinationSlug.includes(q)).slice(0, 8)
  }, [tourSearch])

  const total = selectedTour ? selectedTour.price * travelers : 0

  function validateStep(current) {
    const errs = {}
    if (current === 0 && !tourSlug) errs.tour = 'Pick a trip to continue'
    if (current === 1) {
      if (!date) errs.date = 'Choose a preferred departure date'
      if (travelers < 1 || travelers > 20) errs.travelers = 'Enter between 1 and 20 travellers'
    }
    if (current === 2) {
      if (!contact.name.trim()) errs.name = 'Please tell us your name'
      if (!EMAIL_RE.test(contact.email)) errs.email = 'Enter a valid email address'
      if (!/^[\d+\-\s]{7,15}$/.test(contact.phone)) errs.phone = 'Enter a valid phone number'
    }
    return errs
  }

  function goNext() {
    const errs = validateStep(step)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleConfirm() {
    setStatus('loading')
    setSubmitError('')
    try {
      const record = await submitBooking({
        tourSlug,
        tourTitle: selectedTour.title,
        destination: selectedDestination?.name,
        date,
        travelers,
        sharing,
        pricePerPerson: selectedTour.price,
        total,
        contact,
      })
      setBooking(record)
      setStatus('success')
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success' && booking) {
    return (
      <Container className="flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-green-500 text-3xl text-white">✓</div>
        <h1 className="mt-6 font-display text-3xl font-bold text-navy-950 sm:text-4xl">Your spot is booked</h1>
        <p className="mt-3 max-w-md text-ink-700">
          Booking <span className="font-semibold text-navy-950">#{booking.id}</span> confirmed for {selectedTour.title}. A
          confirmation has been logged to your account — our team will email {contact.email} with payment and gear details
          within one business day.
        </p>
        <div className="mt-8 grid w-full max-w-sm gap-3 rounded-2xl border border-navy-900/8 bg-white p-6 text-left text-sm">
          <div className="flex justify-between">
            <span className="text-ink-500">Trip</span>
            <span className="font-medium text-navy-950">{selectedTour.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-500">Preferred date</span>
            <span className="font-medium text-navy-950">{date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-500">Travellers</span>
            <span className="font-medium text-navy-950">{travelers}</span>
          </div>
          <div className="flex justify-between border-t border-navy-900/8 pt-3">
            <span className="text-ink-500">Total (est.)</span>
            <span className="font-semibold text-navy-950">{formatPrice(total)}</span>
          </div>
        </div>
        <div className="mt-8 flex gap-3">
          <Link to="/tours" className="rounded-full bg-navy-950 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-800">
            Browse More Trips
          </Link>
          <Link to="/" className="rounded-full border border-navy-900/15 px-6 py-3 text-sm font-semibold text-navy-950 hover:bg-navy-900/5">
            Back to Home
          </Link>
        </div>
      </Container>
    )
  }

  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Plan a Trip</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
          Four short steps to your next departure
        </h1>

        {/* Stepper */}
        <div className="mt-10 flex items-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  i < step ? 'bg-green-500 text-navy-950' : i === step ? 'bg-navy-950 text-white' : 'bg-navy-900/10 text-ink-500'
                }`}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`hidden text-sm font-medium sm:inline ${i === step ? 'text-navy-950' : 'text-ink-500'}`}>{label}</span>
              {i < STEPS.length - 1 && <div className={`h-px flex-1 ${i < step ? 'bg-green-500' : 'bg-navy-900/10'}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10"
          >
            {step === 0 && (
              <div>
                <Field label="Search a trip" htmlFor="tourSearch">
                  <Input id="tourSearch" value={tourSearch} onChange={(e) => setTourSearch(e.target.value)} placeholder="e.g. Hampta, Ladakh, snow…" />
                </Field>
                {errors.tour && <p className="mt-2 text-sm text-red-600">{errors.tour}</p>}
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {visibleTours.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTourSlug(t.slug)}
                      className={`flex gap-3 rounded-xl border p-3 text-left transition-colors ${
                        tourSlug === t.slug ? 'border-blue-600 bg-blue-100/60' : 'border-navy-900/10 bg-white hover:border-navy-900/25'
                      }`}
                    >
                      <Img src={t.heroImage} alt="" className="size-16 shrink-0 rounded-lg" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-navy-950">{t.title}</p>
                        <p className="text-xs text-ink-500">
                          {t.duration}D/{t.nights}N · {t.difficulty}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-blue-600">{formatPrice(t.price)}</p>
                      </div>
                    </button>
                  ))}
                  {visibleTours.length === 0 && <p className="text-sm text-ink-500">No trips match that search.</p>}
                </div>
              </div>
            )}

            {step === 1 && selectedTour && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 rounded-xl border border-navy-900/8 bg-white p-3">
                  <Img src={selectedTour.heroImage} alt="" className="size-14 rounded-lg" />
                  <div>
                    <p className="text-sm font-semibold text-navy-950">{selectedTour.title}</p>
                    <button type="button" onClick={() => setStep(0)} className="text-xs font-medium text-blue-600 hover:underline">
                      Change trip
                    </button>
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Preferred departure date" htmlFor="date" error={errors.date}>
                    <Input id="date" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} error={errors.date} />
                  </Field>
                  <Field label="Number of travellers" htmlFor="travelers" error={errors.travelers}>
                    <Input
                      id="travelers"
                      type="number"
                      min={1}
                      max={20}
                      value={travelers}
                      onChange={(e) => setTravelers(Number(e.target.value))}
                      error={errors.travelers}
                    />
                  </Field>
                </div>
                <Field label="Room / tent sharing preference" htmlFor="sharing">
                  <Select id="sharing" value={sharing} onChange={(e) => setSharing(e.target.value)}>
                    <option value="twin">Twin sharing</option>
                    <option value="same-gender">Same-gender group sharing</option>
                    <option value="single">Single occupancy (+cost)</option>
                  </Select>
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" htmlFor="cname" error={errors.name}>
                    <Input
                      id="cname"
                      value={contact.name}
                      onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                      error={errors.name}
                    />
                  </Field>
                  <Field label="Email" htmlFor="cemail" error={errors.email}>
                    <Input
                      id="cemail"
                      type="email"
                      value={contact.email}
                      onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                      error={errors.email}
                    />
                  </Field>
                </div>
                <Field label="Phone" htmlFor="cphone" error={errors.phone}>
                  <Input
                    id="cphone"
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                    error={errors.phone}
                  />
                </Field>
                <Field label="Anything we should know? (optional)" htmlFor="cnotes">
                  <Textarea
                    id="cnotes"
                    value={contact.notes}
                    onChange={(e) => setContact((c) => ({ ...c, notes: e.target.value }))}
                    placeholder="Medical conditions, dietary needs, prior trekking experience…"
                  />
                </Field>
              </div>
            )}

            {step === 3 && selectedTour && (
              <div className="space-y-5">
                <div className="rounded-2xl border border-navy-900/8 bg-white p-6">
                  <div className="flex gap-4">
                    <Img src={selectedTour.heroImage} alt="" className="size-20 shrink-0 rounded-xl" />
                    <div>
                      <p className="font-display text-lg font-semibold text-navy-950">{selectedTour.title}</p>
                      <p className="text-sm text-ink-500">{selectedDestination?.name}</p>
                    </div>
                  </div>
                  <dl className="mt-5 space-y-3 border-t border-navy-900/8 pt-5 text-sm">
                    {[
                      ['Departure date', date],
                      ['Travellers', travelers],
                      ['Sharing', sharing.replace('-', ' ')],
                      ['Contact', `${contact.name} · ${contact.email}`],
                      ['Phone', contact.phone],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-4">
                        <dt className="text-ink-500">{label}</dt>
                        <dd className="text-right font-medium capitalize text-navy-950">{value}</dd>
                      </div>
                    ))}
                    <div className="flex justify-between border-t border-navy-900/8 pt-3">
                      <dt className="font-semibold text-navy-950">Total (est.)</dt>
                      <dd className="font-display text-lg font-bold text-navy-950">{formatPrice(total)}</dd>
                    </div>
                  </dl>
                </div>
                {status === 'error' && (
                  <p className="text-sm text-red-600" role="alert">
                    {submitError}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="rounded-full border border-navy-900/15 px-6 py-3 text-sm font-semibold text-navy-950 transition-colors hover:bg-navy-900/5 disabled:opacity-0"
          >
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="rounded-full bg-navy-950 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={status === 'loading'}
              className="rounded-full bg-green-500 px-7 py-3 text-sm font-semibold text-navy-950 transition-colors hover:bg-green-600 disabled:opacity-60"
            >
              {status === 'loading' ? 'Confirming…' : 'Confirm Booking'}
            </button>
          )}
        </div>
      </Container>
    </section>
  )
}
