import { useState } from 'react'
import { submitRegistration } from '../lib/submitRegistration.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate({ name, email, phone }) {
  const errors = {}
  if (!name.trim()) errors.name = 'Name is required.'
  if (!email.trim()) errors.email = 'Email is required.'
  else if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.'
  if (!phone.trim()) errors.phone = 'Phone number is required.'
  return errors
}

export default function RegisterForm() {
  const [values, setValues] = useState({ name: '', email: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [serverError, setServerError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const fieldErrors = validate(values)
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length > 0) return

    setStatus('submitting')
    setServerError('')
    try {
      await submitRegistration(values)
      setStatus('success')
      setValues({ name: '', email: '', phone: '' })
    } catch (err) {
      setStatus('error')
      setServerError(err.message)
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-brand-secondary/20 bg-brand-secondary/5 p-6 text-brand-secondary">
        <p className="font-semibold">You're registered.</p>
        <p className="mt-1 text-sm">We'll be in touch. Thanks for your interest.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={handleChange}
          className="w-full rounded-md border border-neutral-black/20 bg-white px-3 py-2 focus:border-brand-secondary focus:outline-none"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          className="w-full rounded-md border border-neutral-black/20 bg-white px-3 py-2 focus:border-brand-secondary focus:outline-none"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium">
          Phone number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={handleChange}
          className="w-full rounded-md border border-neutral-black/20 bg-white px-3 py-2 focus:border-brand-secondary focus:outline-none"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
        />
        {errors.phone && (
          <p id="phone-error" className="mt-1 text-sm text-red-600">
            {errors.phone}
          </p>
        )}
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600" role="alert">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-2 rounded-full bg-brand-secondary px-6 py-3 font-semibold text-neutral-white transition hover:bg-neutral-black disabled:opacity-60"
      >
        {status === 'submitting' ? 'Submitting…' : 'Register'}
      </button>
    </form>
  )
}
