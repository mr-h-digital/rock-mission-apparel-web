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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordCapsLockOn, setPasswordCapsLockOn] = useState(false)
  const [confirmCapsLockOn, setConfirmCapsLockOn] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const configured = isAuthConfigured()

  function onChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function updateCapsLock(setter) {
    return (e) => {
      setter(e.getModifierState('CapsLock'))
    }
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
            <div className="relative">
              <input
                id="sign-up-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={form.password}
                onChange={onChange}
                onKeyUp={updateCapsLock(setPasswordCapsLockOn)}
                onFocus={updateCapsLock(setPasswordCapsLockOn)}
                onBlur={() => setPasswordCapsLockOn(false)}
                className="input pr-20"
                autoComplete="new-password"
                placeholder="At least 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-apparel-teal transition-colors hover:text-apparel-cream"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                {showPassword ? (
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
                    <path d="M3 3l18 18" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.6 10.7a2 2 0 102.8 2.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9.9 5.2A10.9 10.9 0 0112 5c5.2 0 9.3 4.4 10 7-.3 1.2-1.4 3-3.1 4.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6.2 6.3C3.8 8 2.3 10.4 2 12c.7 2.6 4.8 7 10 7 1.8 0 3.5-.5 5-1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>
            {passwordCapsLockOn && (
              <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-apparel-pinkLight">
                Caps Lock is on
              </p>
            )}
          </div>
          <div>
            <label htmlFor="sign-up-confirm-password" className="mb-2 block text-xs font-bold uppercase tracking-widest text-apparel-teal">Confirm Password</label>
            <div className="relative">
              <input
                id="sign-up-confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={form.confirmPassword}
                onChange={onChange}
                onKeyUp={updateCapsLock(setConfirmCapsLockOn)}
                onFocus={updateCapsLock(setConfirmCapsLockOn)}
                onBlur={() => setConfirmCapsLockOn(false)}
                className="input pr-20"
                autoComplete="new-password"
                placeholder="Repeat password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-apparel-teal transition-colors hover:text-apparel-cream"
                aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
                aria-pressed={showConfirmPassword}
              >
                <span className="sr-only">{showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}</span>
                {showConfirmPassword ? (
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
                    <path d="M3 3l18 18" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.6 10.7a2 2 0 102.8 2.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9.9 5.2A10.9 10.9 0 0112 5c5.2 0 9.3 4.4 10 7-.3 1.2-1.4 3-3.1 4.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6.2 6.3C3.8 8 2.3 10.4 2 12c.7 2.6 4.8 7 10 7 1.8 0 3.5-.5 5-1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>
            {confirmCapsLockOn && (
              <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-apparel-pinkLight">
                Caps Lock is on
              </p>
            )}
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
