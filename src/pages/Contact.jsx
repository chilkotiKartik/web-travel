import { useState } from 'react'
import { Container } from '../components/ui/States'
import { Reveal } from '../components/ui/Reveal'
import { Field, Input, Textarea, Select } from '../components/ui/Field'
import { Accordion } from '../components/ui/Accordion'
import { submitContactMessage } from '../lib/api'
import { faqs } from '../data/misc'
import { useSeo } from '../components/Seo'

const SUBJECTS = ['General enquiry', 'Trip customisation', 'Group booking', 'Partnership / press', 'Something else']

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Please tell us your name'
  if (!EMAIL_RE.test(values.email)) errors.email = 'Enter a valid email address'
  if (!values.subject) errors.subject = 'Pick a subject'
  if (values.message.trim().length < 20) errors.message = 'Give us a bit more detail (20+ characters)'
  return errors
}

export default function Contact() {
  useSeo({ title: 'Contact', description: 'Talk to the Wayfare team about a trek, a custom itinerary or a group departure. We reply within one business day.' })
  const [values, setValues] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [submitError, setSubmitError] = useState('')

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('loading')
    setSubmitError('')
    try {
      await submitContactMessage(values)
      setStatus('success')
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-100/70 via-white to-white pb-12 pt-32">
        <div className="pointer-events-none absolute -left-16 top-0 size-72 rounded-full bg-blue-500/15 blur-3xl" />
        <Container className="relative">
          <p className="text-sm font-semibold uppercase tracking-wide text-green-600">Contact</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-6xl">Talk to a human</h1>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold text-ink-900">Reach us directly</h2>
            <div className="mt-6 space-y-6">
              <div>
                <p className="text-sm font-semibold text-ink-500">Email</p>
                <p className="mt-1 text-ink-900">hello@wayfare.example</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-500">Phone</p>
                <p className="mt-1 text-ink-900">+91 98765 43210</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-500">Studio</p>
                <p className="mt-1 text-ink-900">
                  4th Floor, Basecamp House
                  <br />
                  Sector 29, Gurugram, Haryana
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-500">Response time</p>
                <p className="mt-1 text-ink-900">Within one business day, always.</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-green-600/20 bg-green-100 px-8 py-16 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-green-500 text-2xl text-white">✓</div>
                <h3 className="mt-4 font-display text-2xl font-semibold text-ink-900">Message sent</h3>
                <p className="mt-2 max-w-sm text-ink-700">
                  Thanks, {values.name.split(' ')[0]}. We'll reply to {values.email} within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-2xl border border-navy-900/8 bg-white p-6 sm:p-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" htmlFor="name" error={errors.name}>
                    <Input id="name" value={values.name} onChange={(e) => update('name', e.target.value)} error={errors.name} />
                  </Field>
                  <Field label="Email" htmlFor="email" error={errors.email}>
                    <Input id="email" type="email" value={values.email} onChange={(e) => update('email', e.target.value)} error={errors.email} />
                  </Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Phone (optional)" htmlFor="phone">
                    <Input id="phone" type="tel" value={values.phone} onChange={(e) => update('phone', e.target.value)} />
                  </Field>
                  <Field label="Subject" htmlFor="subject" error={errors.subject}>
                    <Select id="subject" value={values.subject} onChange={(e) => update('subject', e.target.value)} error={errors.subject}>
                      <option value="">Choose one…</option>
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
                <Field label="Message" htmlFor="message" error={errors.message}>
                  <Textarea
                    id="message"
                    value={values.message}
                    onChange={(e) => update('message', e.target.value)}
                    error={errors.message}
                    placeholder="Tell us what you're planning…"
                  />
                </Field>
                {status === 'error' && (
                  <p className="text-sm text-red-600" role="alert">
                    {submitError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-60 sm:w-auto"
                >
                  {status === 'loading' ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </Reveal>
        </Container>
      </section>

      <section id="faq" className="scroll-mt-24 border-t border-navy-900/8 bg-mist-100/60 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">FAQ</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">Common questions</h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <Accordion items={faqs.map((f) => ({ id: f.id, title: f.question, content: f.answer }))} defaultOpen={0} />
          </Reveal>
        </Container>
      </section>
    </>
  )
}
