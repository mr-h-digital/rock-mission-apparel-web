import { useState } from 'react'
import { Link } from 'react-router-dom'
import { isAuthConfigured, requestUsernameRecovery } from '../lib/api.js'

export default function RecoverUsername() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const configured = isAuthConfigured()

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const cleanEmail = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.')
      return
    }

    setSubmitting(true)
    try {
      const res = await requestUsernameRecovery({ email: cleanEmail })
      setSuccess(res?.message || 'If an account exists, username details have been sent to your email.')
    } catch (err) {
      setError(err.message || 'Unable to recover username right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-5xl tracking-wide">Recover Username</h1>
      <p className="mt-3 text-apparel-muted">
        Enter your account email and we will send your username details if this feature is enabled.
      </p>

      {!configured && (
        <div className="mt-6 rounded-xl border border-apparel-pink/40 bg-apparel-pink/10 p-4 text-sm text-apparel-pinkLight">
          Username recovery is not connected yet. Set{' '}
          <code className="rounded bg-apparel-bg px-1.5 py-0.5">VITE_API_URL</code> to enable it.
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-2xl border border-apparel-border bg-apparel-panel p-6">
        <div>
          <label htmlFor="recover-username-email" className="mb-2 block text-xs font-bold uppercase tracking-widest text-apparel-teal">Email</label>
          <input
            id="recover-username-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>

        {error && <p className="text-sm font-semibold text-apparel-pink">{error}</p>}
        {success && <p className="text-sm font-semibold text-apparel-teal">{success}</p>}

        <button
          type="submit"
          disabled={!configured || submitting}
          className="w-full rounded-full bg-grad-drop px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-apparel-bg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? 'Sending...' : 'Recover Username ->'}
        </button>

        <p className="text-sm text-apparel-muted">
          Want to reset your password instead?{' '}
          <Link to="/forgot-password" className="font-semibold text-apparel-teal hover:underline">
            Reset password
          </Link>
        </p>
      </form>
    </div>
  )
}
