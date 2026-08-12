import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { isAuthConfigured } from '../lib/api.js'

const emptyForm = {
  email: '',
  password: '',
}

export default function SignIn() {
  const { signIn } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const from = location.state?.from || '/account'
  const configured = isAuthConfigured()

  function onChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await signIn(form)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to sign in right now.')
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-5xl tracking-wide">Sign In</h1>
      <p className="mt-3 text-apparel-muted">
        Welcome back. Sign in to manage your profile and future order history.
      </p>

      {!configured && (
        <div className="mt-6 rounded-xl border border-apparel-pink/40 bg-apparel-pink/10 p-4 text-sm text-apparel-pinkLight">
          Auth is not connected to the store backend yet. Set{' '}
          <code className="rounded bg-apparel-bg px-1.5 py-0.5">VITE_API_URL</code> to enable sign in.
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-2xl border border-apparel-border bg-apparel-panel p-6">
        <div>
          <label htmlFor="sign-in-email" className="mb-2 block text-xs font-bold uppercase tracking-widest text-apparel-teal">Email</label>
          <input
            id="sign-in-email"
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

        <div>
          <label htmlFor="sign-in-password" className="mb-2 block text-xs font-bold uppercase tracking-widest text-apparel-teal">Password</label>
          <input
            id="sign-in-password"
            name="password"
            type="password"
            required
            value={form.password}
            onChange={onChange}
            className="input"
            autoComplete="current-password"
            placeholder="Enter your password"
          />
        </div>

        {error && <p className="text-sm font-semibold text-apparel-pink">{error}</p>}

        <button
          type="submit"
          disabled={!configured || submitting}
          className="w-full rounded-full bg-grad-drop px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-apparel-bg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? 'Signing In...' : 'Sign In ->'}
        </button>

        <p className="text-sm text-apparel-muted">
          New here?{' '}
          <Link to="/sign-up" className="font-semibold text-apparel-teal hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  )
}
