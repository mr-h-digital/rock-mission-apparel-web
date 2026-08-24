import { useState } from 'react'
import { Link } from 'react-router-dom'
import { isAuthConfigured, requestUsernameRecovery } from '../lib/api.js'

export default function RecoverUsername() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submittedEmail, setSubmittedEmail] = useState('')

  const configured = isAuthConfigured()

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmittedEmail('')

    const cleanEmail = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.')
      return
    }

    setSubmitting(true)
    try {
      const res = await requestUsernameRecovery({ email: cleanEmail })
      setSubmittedEmail(cleanEmail)
      setSuccess(res?.message || 'If an account exists, your sign-in details have been sent to your email.')
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
        Enter your account email. For this store, your sign-in ID is your email address.
      </p>

      {!configured && (
        <div className="mt-6 rounded-xl border border-apparel-pink/40 bg-apparel-pink/10 p-4 text-sm text-apparel-pinkLight">
          Sign-in detail recovery is not connected yet. Set{' '}
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

        {error && (
          <div className="rounded-xl border border-apparel-pink/40 bg-apparel-pink/10 p-4 text-sm text-apparel-pink" role="status" aria-live="polite">
            <p className="font-semibold">{error}</p>
            <p className="mt-2 text-apparel-pinkLight/90">
              Please try again in a moment. If this keeps happening, contact support.
            </p>
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-apparel-teal/40 bg-apparel-teal/10 p-4 text-sm text-apparel-teal" role="status" aria-live="polite">
            <p className="font-semibold">Request received.</p>
            <p className="mt-2 text-apparel-tealLight">{success}</p>
            {submittedEmail && (
              <p className="mt-2 text-apparel-tealLight/90">
                Submitted for: <span className="font-semibold">{submittedEmail}</span>
              </p>
            )}
            <p className="mt-2 text-apparel-tealLight/90">
              For account security, we cannot confirm whether this email exists in our records.
            </p>
            <p className="mt-1 text-apparel-tealLight/90">
              If the account exists, check inbox and spam for the recovery email.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={!configured || submitting}
          className="w-full rounded-full bg-grad-drop px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-apparel-bg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? 'Sending...' : 'Send Recovery Email ->'}
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
