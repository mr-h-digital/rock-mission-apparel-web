import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { isAuthConfigured, submitPasswordReset } from '../lib/api.js'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const tokenFromUrl = useMemo(() => searchParams.get('token') || '', [searchParams])

  const [token, setToken] = useState(tokenFromUrl)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const configured = isAuthConfigured()

  function validate() {
    if (!token.trim()) return 'Reset token is required.'
    if (newPassword.length < 8) return 'New password must be at least 8 characters.'
    if (newPassword !== confirmPassword) return 'Password confirmation does not match.'
    return null
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)
    try {
      const res = await submitPasswordReset({ token: token.trim(), newPassword })
      setSuccess(res?.message || 'Password reset successful. Please sign in.')
      setTimeout(() => navigate('/sign-in', { replace: true }), 1200)
    } catch (err) {
      setError(err.message || 'Unable to reset your password right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-5xl tracking-wide">Reset Password</h1>
      <p className="mt-3 text-apparel-muted">
        Enter your reset token and choose a new password.
      </p>

      {!configured && (
        <div className="mt-6 rounded-xl border border-apparel-pink/40 bg-apparel-pink/10 p-4 text-sm text-apparel-pinkLight">
          Password recovery is not connected yet. Set{' '}
          <code className="rounded bg-apparel-bg px-1.5 py-0.5">VITE_API_URL</code> to enable it.
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-2xl border border-apparel-border bg-apparel-panel p-6">
        <div>
          <label htmlFor="reset-password-token" className="mb-2 block text-xs font-bold uppercase tracking-widest text-apparel-teal">Reset Token</label>
          <input
            id="reset-password-token"
            type="text"
            required
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="input"
            autoComplete="off"
            placeholder="Paste your token"
          />
        </div>

        <div>
          <label htmlFor="reset-password-new" className="mb-2 block text-xs font-bold uppercase tracking-widest text-apparel-teal">New Password</label>
          <input
            id="reset-password-new"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input"
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
        </div>

        <div>
          <label htmlFor="reset-password-confirm" className="mb-2 block text-xs font-bold uppercase tracking-widest text-apparel-teal">Confirm Password</label>
          <input
            id="reset-password-confirm"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input"
            autoComplete="new-password"
            placeholder="Repeat password"
          />
        </div>

        {error && <p className="text-sm font-semibold text-apparel-pink">{error}</p>}
        {success && <p className="text-sm font-semibold text-apparel-teal">{success}</p>}

        <button
          type="submit"
          disabled={!configured || submitting}
          className="w-full rounded-full bg-grad-drop px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-apparel-bg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? 'Updating Password...' : 'Update Password ->'}
        </button>

        <p className="text-sm text-apparel-muted">
          Need a new token?{' '}
          <Link to="/forgot-password" className="font-semibold text-apparel-teal hover:underline">
            Request reset link
          </Link>
        </p>
      </form>
    </div>
  )
}
