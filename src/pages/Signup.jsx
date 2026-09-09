import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Container } from '../components/ui/States'
import { Field, Input } from '../components/ui/Field'
import { useAuth } from '../context/AuthContext'
import { AuthError } from '../lib/auth'
import { useSeo } from '../components/Seo'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Signup() {
  useSeo({ title: 'Create Account', description: 'Create a Wayfare account to book expeditions and track your trips.' })
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [values, setValues] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [formError, setFormError] = useState('')
  const [needsConfirmation, setNeedsConfirmation] = useState(false)

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = {}
    if (!values.name.trim()) nextErrors.name = 'Please tell us your name'
    if (!EMAIL_RE.test(values.email)) nextErrors.email = 'Enter a valid email address'
    if (values.password.length < 6) nextErrors.password = 'At least 6 characters'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('loading')
    setFormError('')
    try {
      const { needsEmailConfirmation } = await signUp(values)
      if (needsEmailConfirmation) {
        setNeedsConfirmation(true)
        setStatus('idle')
      } else {
        navigate('/account', { replace: true })
      }
    } catch (err) {
      setFormError(err instanceof AuthError ? err.message : 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (needsConfirmation) {
    return (
      <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-gradient-to-b from-blue-100/70 via-white to-white py-16">
        <Container className="relative max-w-md text-center">
          <div className="rounded-3xl border border-ink-900/8 bg-white p-8 shadow-[0_20px_50px_-20px_rgba(16,24,40,0.2)]">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-green-100 text-2xl">📧</div>
            <h1 className="mt-4 font-display text-2xl font-extrabold text-ink-900">Check your inbox</h1>
            <p className="mt-2 text-sm text-ink-500">
              We've sent a confirmation link to <span className="font-semibold text-ink-900">{values.email}</span>. Click it to
              activate your account, then come back and log in.
            </p>
            <Link to="/login" className="mt-6 inline-block rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white">
              Go to Log In
            </Link>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-gradient-to-b from-blue-100/70 via-white to-white py-16">
      <div className="pointer-events-none absolute -left-16 top-0 size-72 rounded-full bg-green-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 size-72 rounded-full bg-blue-500/15 blur-3xl" />
      <Container className="relative max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl border border-ink-900/8 bg-white p-8 shadow-[0_20px_50px_-20px_rgba(16,24,40,0.2)]"
        >
          <div className="flex justify-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-green-500 font-display text-xl font-extrabold text-white">
              W
            </span>
          </div>
          <h1 className="mt-4 text-center font-display text-2xl font-extrabold text-ink-900">Join Wayfare</h1>
          <p className="mt-1 text-center text-sm text-ink-500">Create an account to track your bookings across trips.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <Field label="Full name" htmlFor="name" error={errors.name}>
              <Input id="name" value={values.name} onChange={(e) => update('name', e.target.value)} error={errors.name} autoFocus />
            </Field>
            <Field label="Email" htmlFor="email" error={errors.email}>
              <Input id="email" type="email" value={values.email} onChange={(e) => update('email', e.target.value)} error={errors.email} />
            </Field>
            <Field label="Password" htmlFor="password" error={errors.password} hint={!errors.password ? 'At least 6 characters' : undefined}>
              <Input
                id="password"
                type="password"
                value={values.password}
                onChange={(e) => update('password', e.target.value)}
                error={errors.password}
              />
            </Field>
            {formError && (
              <p className="text-sm text-red-600" role="alert">
                {formError}
              </p>
            )}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-60"
            >
              {status === 'loading' ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </motion.div>
      </Container>
    </section>
  )
}
