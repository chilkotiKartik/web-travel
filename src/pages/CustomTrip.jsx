import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Container } from '../components/ui/States'
import { Field, Input, Select, Textarea } from '../components/ui/Field'
import { submitEnquiry } from '../lib/api'
import { destinations } from '../data/destinations'
import { useSeo } from '../components/Seo'

const STEPS = [
  'Destination',
  'Dates',
  'Travellers',
  'Trip Type',
  'Hotel',
  'Transport',
  'Budget',
  'Special Needs',
  'Contact',
]

const TRIP_TYPES = ['Trekking', 'Road Trip', 'Backpacking', 'Wildlife', 'Snow Expedition', 'Leisure / Relaxation']
const HOTEL_PREFS = ['No preference', 'Budget / homestay', 'Standard 3-star', 'Premium / boutique', 'Luxury']
const TRANSPORT_PREFS = ['No preference', 'Shared group transport', 'Private vehicle', 'Self-drive / own vehicle']
const BUDGET_BANDS = ['Under ₹15,000', '₹15,000 – ₹30,000', '₹30,000 – ₹60,000', '₹60,000+', 'Not sure yet']

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const today = new Date().toISOString().split('T')[0]

export default function CustomTrip() {
  useSeo({ title: 'Custom Trip Planner', description: 'Build a fully personalised Himalayan itinerary — tell us your destination, dates, budget and style, and our trip designers take it from there.' })
  const [step, setStep] = useState(0)
  const [destination, setDestination] = useState('')
  const [tripStart, setTripStart] = useState('')
  const [tripEnd, setTripEnd] = useState('')
  const [travelers, setTravelers] = useState(2)
  const [tripType, setTripType] = useState('')
  const [hotelPreference, setHotelPreference] = useState(HOTEL_PREFS[0])
  const [transportPreference, setTransportPreference] = useState(TRANSPORT_PREFS[0])
  const [budgetBand, setBudgetBand] = useState('')
  const [specialNeeds, setSpecialNeeds] = useState('')
  const [contact, setContact] = useState({ name: '', email: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [submitError, setSubmitError] = useState('')
  const [enquiry, setEnquiry] = useState(null)

  function validateStep(current) {
    const errs = {}
    if (current === 0 && !destination) errs.destination = 'Pick where you want to go'
    if (current === 1 && tripStart && tripEnd && tripEnd < tripStart) errs.tripEnd = 'End date must be after the start date'
    if (current === 2 && (travelers < 1 || travelers > 30)) errs.travelers = 'Enter between 1 and 30 travellers'
    if (current === 3 && !tripType) errs.tripType = 'Pick the kind of trip you want'
    if (current === 6 && !budgetBand) errs.budgetBand = 'Pick an approximate budget'
    if (current === 8) {
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

  async function handleSubmit() {
    const errs = validateStep(8)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setStatus('loading')
    setSubmitError('')
    try {
      const record = await submitEnquiry({
        destination,
        tripStart,
        tripEnd,
        travelers,
        tripType,
        hotelPreference,
        transportPreference,
        budgetBand,
        specialNeeds,
        contact,
      })
      setEnquiry(record)
      setStatus('success')
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success' && enquiry) {
    return (
      <Container className="flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-green-500 text-3xl text-white">✓</div>
        <h1 className="mt-6 font-display text-3xl font-bold text-ink-900 sm:text-4xl">Your enquiry is in</h1>
        <p className="mt-3 max-w-md text-ink-700">
          Enquiry <span className="font-semibold text-ink-900">#{enquiry.id.slice(0, 8)}</span> is with our trip
          designers. Expect a personalised itinerary and quote at {contact.email} within one business day.
        </p>
        <div className="mt-8 flex gap-3">
          <Link to="/tours" className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-800">
            Browse Fixed Departures
          </Link>
          <Link to="/" className="rounded-full border border-navy-900/15 px-6 py-3 text-sm font-semibold text-ink-900 hover:bg-navy-900/5">
            Back to Home
          </Link>
        </div>
      </Container>
    )
  }

  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Custom Trip Planner</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
          Tell us what you want. We'll design the rest.
        </h1>
        <p className="mt-3 max-w-xl text-ink-500">
          No fixed departure fits? Build a fully personalised itinerary in a few short steps — our trip designers pick it
          up from here.
        </p>

        {/* Stepper */}
        <div className="no-scrollbar mt-10 flex items-center gap-1.5 overflow-x-auto pb-1">
          {STEPS.map((label, i) => (
            <div key={label} className="flex shrink-0 items-center gap-1.5">
              <div
                className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                  i < step ? 'bg-green-500 text-ink-900' : i === step ? 'bg-blue-600 text-white' : 'bg-navy-900/10 text-ink-500'
                }`}
              >
                {i < step ? '✓' : i + 1}
              </div>
              {i < STEPS.length - 1 && <div className={`h-px w-6 ${i < step ? 'bg-green-500' : 'bg-navy-900/10'}`} />}
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-ink-500">{STEPS[step]}</p>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6"
          >
            {step === 0 && (
              <div>
                <Field label="Where do you want to go?" htmlFor="destination" error={errors.destination}>
                  <Select id="destination" value={destination} onChange={(e) => setDestination(e.target.value)}>
                    <option value="">Select a destination</option>
                    {destinations.map((d) => (
                      <option key={d.slug} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                    <option value="Not sure yet / open to suggestions">Not sure yet / open to suggestions</option>
                  </Select>
                </Field>
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Preferred start date (optional)" htmlFor="tripStart">
                  <Input id="tripStart" type="date" min={today} value={tripStart} onChange={(e) => setTripStart(e.target.value)} />
                </Field>
                <Field label="Preferred end date (optional)" htmlFor="tripEnd" error={errors.tripEnd}>
                  <Input
                    id="tripEnd"
                    type="date"
                    min={tripStart || today}
                    value={tripEnd}
                    onChange={(e) => setTripEnd(e.target.value)}
                    error={errors.tripEnd}
                  />
                </Field>
              </div>
            )}

            {step === 2 && (
              <Field label="Number of travellers" htmlFor="travelers" error={errors.travelers}>
                <Input
                  id="travelers"
                  type="number"
                  min={1}
                  max={30}
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  error={errors.travelers}
                  className="max-w-40"
                />
              </Field>
            )}

            {step === 3 && (
              <div>
                <p className="mb-3 text-sm font-medium text-ink-900">What kind of trip are you after?</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {TRIP_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTripType(type)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${
                        tripType === type ? 'border-blue-600 bg-blue-100/60 text-blue-700' : 'border-navy-900/10 bg-white text-ink-900 hover:border-navy-900/25'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {errors.tripType && <p className="mt-2 text-sm text-red-600">{errors.tripType}</p>}
              </div>
            )}

            {step === 4 && (
              <Field label="Hotel / stay preference" htmlFor="hotel">
                <Select id="hotel" value={hotelPreference} onChange={(e) => setHotelPreference(e.target.value)}>
                  {HOTEL_PREFS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </Select>
              </Field>
            )}

            {step === 5 && (
              <Field label="Transport preference" htmlFor="transport">
                <Select id="transport" value={transportPreference} onChange={(e) => setTransportPreference(e.target.value)}>
                  {TRANSPORT_PREFS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </Field>
            )}

            {step === 6 && (
              <div>
                <p className="mb-3 text-sm font-medium text-ink-900">Approximate budget per person</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {BUDGET_BANDS.map((band) => (
                    <button
                      key={band}
                      type="button"
                      onClick={() => setBudgetBand(band)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${
                        budgetBand === band ? 'border-blue-600 bg-blue-100/60 text-blue-700' : 'border-navy-900/10 bg-white text-ink-900 hover:border-navy-900/25'
                      }`}
                    >
                      {band}
                    </button>
                  ))}
                </div>
                {errors.budgetBand && <p className="mt-2 text-sm text-red-600">{errors.budgetBand}</p>}
              </div>
            )}

            {step === 7 && (
              <Field label="Any special needs or requests? (optional)" htmlFor="specialNeeds">
                <Textarea
                  id="specialNeeds"
                  value={specialNeeds}
                  onChange={(e) => setSpecialNeeds(e.target.value)}
                  placeholder="Dietary needs, mobility considerations, celebrating an occasion, travelling with kids/seniors…"
                />
              </Field>
            )}

            {step === 8 && (
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" htmlFor="cname" error={errors.name}>
                    <Input id="cname" value={contact.name} onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))} error={errors.name} />
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
                  <Input id="cphone" type="tel" value={contact.phone} onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))} error={errors.phone} />
                </Field>

                <div className="rounded-2xl border border-navy-900/8 bg-mist-100/60 p-5 text-sm">
                  <p className="font-semibold text-ink-900">Quick summary</p>
                  <dl className="mt-3 space-y-1.5 text-ink-700">
                    <div className="flex justify-between gap-4"><dt className="text-ink-500">Destination</dt><dd className="text-right font-medium">{destination || '—'}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-ink-500">Dates</dt><dd className="text-right font-medium">{tripStart || '—'} {tripEnd ? `→ ${tripEnd}` : ''}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-ink-500">Travellers</dt><dd className="text-right font-medium">{travelers}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-ink-500">Trip type</dt><dd className="text-right font-medium">{tripType || '—'}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-ink-500">Budget</dt><dd className="text-right font-medium">{budgetBand || '—'}</dd></div>
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
            className="rounded-full border border-navy-900/15 px-6 py-3 text-sm font-semibold text-ink-900 transition-colors hover:bg-navy-900/5 disabled:opacity-0"
          >
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={status === 'loading'}
              className="rounded-full bg-green-500 px-7 py-3 text-sm font-semibold text-ink-900 transition-colors hover:bg-green-600 disabled:opacity-60"
            >
              {status === 'loading' ? 'Submitting…' : 'Submit Enquiry'}
            </button>
          )}
        </div>
      </Container>
    </section>
  )
}
