import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Account() {
  const { user, signOut } = useAuth()

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim()

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-5xl tracking-wide">My Account</h1>
      <p className="mt-3 text-apparel-muted">
        Signed in as <span className="font-semibold text-apparel-cream">{user?.email || 'your account'}</span>
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-apparel-border bg-apparel-panel p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-apparel-teal">Profile</h2>
          <div className="mt-4 space-y-2 text-sm text-apparel-muted">
            <p>
              <span className="text-apparel-cream">Name:</span>{' '}
              {displayName || 'Not provided'}
            </p>
            <p>
              <span className="text-apparel-cream">Email:</span>{' '}
              {user?.email || 'Not provided'}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-apparel-border bg-apparel-panel p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-apparel-teal">Orders</h2>
          <p className="mt-4 text-sm text-apparel-muted">
            Order history will appear here once the backend orders endpoint is connected to accounts.
          </p>
          <Link
            to="/shop"
            className="mt-4 inline-block text-sm font-bold uppercase tracking-widest text-apparel-teal hover:underline"
          >
            Keep Shopping &rarr;
          </Link>
        </section>
      </div>

      <button
        type="button"
        onClick={signOut}
        className="mt-8 rounded-full border border-apparel-border px-6 py-3 text-sm font-bold uppercase tracking-widest text-apparel-cream hover:border-apparel-pink"
      >
        Sign Out
      </button>
    </div>
  )
}
