import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { isAuthConfigured } from '../lib/api.js'

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export default function SignUp() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const configured = isAuthConfigured()

  function onChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password.length < 8) {
      setError('Please use a password with at least 8 characters.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Password confirmation does not match.')
      return
    }

    setSubmitting(true)

    try {
      await signUp({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      })
      navigate('/account', { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to create your account right now.')
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-5xl tracking-wide">Create Account</h1>
      <p className="mt-3 text-apparel-muted">
        Join Kingdom Drip for faster checkout, saved details, and future order tracking.
      </p>

      {!configured && (
        <div className="mt-6 rounded-xl border border-apparel-pink/40 bg-apparel-pink/10 p-4 text-sm text-apparel-pinkLight">
          Auth is not connected to the store backend yet. Set{' '}
          <code className="rounded bg-apparel-bg px-1.5 py-0.5">VITE_API_URL</code> to enable sign up.
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-2xl border border-apparel-border bg-apparel-panel p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="sign-up-first-name" className="mb-2 block text-xs font-bold uppercase tracking-widest text-apparel-teal">First Name</label>
            <input
              id="sign-up-first-name"
              name="firstName"
              type="text"
              required
              value={form.firstName}
              onChange={onChange}
              className="input"
              autoComplete="given-name"
              placeholder="First name"
            />
          </div>
          <div>
            <label htmlFor="sign-up-last-name" className="mb-2 block text-xs font-bold uppercase tracking-widest text-apparel-teal">Last Name</label>
            <input
              id="sign-up-last-name"
              name="lastName"
              type="text"
              required
              value={form.lastName}
              onChange={onChange}
              className="input"
              autoComplete="family-name"
              placeholder="Last name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="sign-up-email" className="mb-2 block text-xs font-bold uppercase tracking-widest text-apparel-teal">Email</label>
          <input
            id="sign-up-email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={onChange}
            className="input"
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="sign-up-password" className="mb-2 block text-xs font-bold uppercase tracking-widest text-apparel-teal">Password</label>
            <input
              id="sign-up-password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={onChange}
              className="input"
              autoComplete="new-password"
              placeholder="At least 8 characters"
            />
          </div>
          <div>
            <label htmlFor="sign-up-confirm-password" className="mb-2 block text-xs font-bold uppercase tracking-widest text-apparel-teal">Confirm Password</label>
            <input
              id="sign-up-confirm-password"
              name="confirmPassword"
              type="password"
              required
              value={form.confirmPassword}
              onChange={onChange}
              className="input"
              autoComplete="new-password"
              placeholder="Repeat password"
            />
          </div>
        </div>

        {error && <p className="text-sm font-semibold text-apparel-pink">{error}</p>}

        <button
          type="submit"
          disabled={!configured || submitting}
          className="w-full rounded-full bg-grad-drop px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-apparel-bg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? 'Creating Account...' : 'Create Account ->'}
        </button>

        <p className="text-sm text-apparel-muted">
          Already have an account?{' '}
          <Link to="/sign-in" className="font-semibold text-apparel-teal hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
