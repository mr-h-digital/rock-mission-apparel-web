import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { listMyOrders } from '../lib/api.js'

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  province: '',
  postalCode: '',
  country: 'South Africa',
}

export default function Account() {
  const { user, token, saveProfile, signOut } = useAuth()
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [orders, setOrders] = useState([])
  const [ordersError, setOrdersError] = useState('')
  const [ordersLoading, setOrdersLoading] = useState(true)

  useEffect(() => {
    setForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      addressLine1: user?.addressLine1 || '',
      addressLine2: user?.addressLine2 || '',
      city: user?.city || '',
      province: user?.province || '',
      postalCode: user?.postalCode || '',
      country: user?.country || 'South Africa',
    })
  }, [user])

  useEffect(() => {
    let active = true

    async function loadOrders() {
      if (!token) return
      setOrdersLoading(true)
      setOrdersError('')

      try {
        const accountOrders = await listMyOrders(token)
        if (active) setOrders(accountOrders)
      } catch (err) {
        if (active) setOrdersError(err.message || 'Unable to load your order history right now.')
      } finally {
        if (active) setOrdersLoading(false)
      }
    }

    loadOrders()
    return () => {
      active = false
    }
  }, [token])

  function onChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      await saveProfile(form)
      setSuccess('Your account settings have been updated.')
    } catch (err) {
      setError(err.message || 'Unable to update your account settings right now.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-5xl tracking-wide">My Account</h1>
      <p className="mt-3 text-apparel-muted">
        Signed in as <span className="font-semibold text-apparel-cream">{user?.email || 'your account'}</span>
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-apparel-border bg-apparel-panel p-6 md:col-span-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-apparel-teal">Profile & Delivery Details</h2>
          <p className="mt-3 text-sm text-apparel-muted">
            Keep this up to date so checkout can prefill your details faster.
          </p>

          <form onSubmit={onSubmit} className="mt-5 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="firstName" required value={form.firstName} onChange={onChange} className="input" placeholder="First name" />
              <input name="lastName" required value={form.lastName} onChange={onChange} className="input" placeholder="Last name" />
              <input name="email" type="email" required value={form.email} onChange={onChange} className="input" placeholder="Email" />
              <input name="phone" value={form.phone} onChange={onChange} className="input" placeholder="Phone" />
            </div>

            <div className="grid gap-4">
              <input name="addressLine1" value={form.addressLine1} onChange={onChange} className="input" placeholder="Address line 1" />
              <input name="addressLine2" value={form.addressLine2} onChange={onChange} className="input" placeholder="Address line 2 (optional)" />
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="city" value={form.city} onChange={onChange} className="input" placeholder="City" />
                <input name="province" value={form.province} onChange={onChange} className="input" placeholder="Province" />
                <input name="postalCode" value={form.postalCode} onChange={onChange} className="input" placeholder="Postal code" />
                <input name="country" value={form.country} onChange={onChange} className="input" placeholder="Country" />
              </div>
            </div>

            {error && <p className="text-sm font-semibold text-apparel-pink">{error}</p>}
            {success && <p className="text-sm font-semibold text-apparel-teal">{success}</p>}

            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-grad-drop px-6 py-3 text-sm font-bold uppercase tracking-widest text-apparel-bg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings ->'}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-apparel-border bg-apparel-panel p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-apparel-teal">Orders</h2>
          {ordersLoading ? (
            <p className="mt-4 text-sm text-apparel-muted">Loading your orders...</p>
          ) : ordersError ? (
            <p className="mt-4 text-sm font-semibold text-apparel-pink">{ordersError}</p>
          ) : orders.length === 0 ? (
            <>
              <p className="mt-4 text-sm text-apparel-muted">Your account orders will appear here after checkout.</p>
              <Link
                to="/shop"
                className="mt-4 inline-block text-sm font-bold uppercase tracking-widest text-apparel-teal hover:underline"
              >
                Keep Shopping &rarr;
              </Link>
            </>
          ) : (
            <ul className="mt-4 divide-y divide-apparel-border">
              {orders.map((order) => (
                <li key={order.id} className="py-4 first:pt-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-apparel-cream">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="mt-1 text-xs text-apparel-muted">{new Date(order.createdAt).toLocaleDateString('en-ZA', { dateStyle: 'medium' })}</p>
                    </div>
                    <span className="rounded-full border border-apparel-teal/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-apparel-teal">
                      {order.status}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-1 text-xs text-apparel-muted">
                    {order.items.map((item) => <li key={`${order.id}-${item.productId}-${item.size}-${item.color}`}>{item.qty}x {item.productName} ({item.size}/{item.color})</li>)}
                  </ul>
                  <p className="mt-3 text-sm font-bold text-apparel-cream">R{Number(order.totalAmount).toFixed(2)}</p>
                </li>
              ))}
            </ul>
          )}
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
