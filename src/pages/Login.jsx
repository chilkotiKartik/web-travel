import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Container } from '../components/ui/States'
import { Field, Input } from '../components/ui/Field'
import { useAuth } from '../context/AuthContext'
import { AuthError } from '../lib/auth'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const { logIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/account'

  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [formError, setFormError] = useState('')

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = {}
    if (!EMAIL_RE.test(values.email)) nextErrors.email = 'Enter a valid email address'
    if (!values.password) nextErrors.password = 'Enter your password'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('loading')
    setFormError('')
    try {
      await logIn(values)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setFormError(err instanceof AuthError ? err.message : 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-gradient-to-b from-blue-100/70 via-white to-white py-16">
      <div className="pointer-events-none absolute -left-16 top-0 size-72 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 size-72 rounded-full bg-green-500/15 blur-3xl" />
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
          <h1 className="mt-4 text-center font-display text-2xl font-extrabold text-ink-900">Welcome back</h1>
          <p className="mt-1 text-center text-sm text-ink-500">Log in to see your bookings and pick up where you left off.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <Field label="Email" htmlFor="email" error={errors.email}>
              <Input id="email" type="email" value={values.email} onChange={(e) => update('email', e.target.value)} error={errors.email} autoFocus />
            </Field>
            <Field label="Password" htmlFor="password" error={errors.password}>
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
              {status === 'loading' ? 'Logging in…' : 'Log In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            New to Wayfare?{' '}
            <Link to="/signup" className="font-semibold text-blue-600 hover:underline">
              Create an account
            </Link>
          </p>
        </motion.div>
      </Container>
    </section>
  )
}
