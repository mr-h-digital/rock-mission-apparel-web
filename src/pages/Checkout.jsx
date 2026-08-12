import { useEffect, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { createOrder, isCheckoutConfigured } from '../lib/api.js'

const LAST_ORDER_ID_KEY = 'kingdomdrip.lastOrderId'

const SA_PROVINCES = [
  'Western Cape', 'Eastern Cape', 'Northern Cape', 'Free State', 'Gauteng',
  'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'North West',
]

const emptyForm = {
  firstName: '', lastName: '', email: '', phone: '',
  addressLine1: '', addressLine2: '', city: '', province: SA_PROVINCES[0],
  postalCode: '', country: 'South Africa',
}

export default function Checkout() {
  const { items, subtotal } = useCart()
  const { user } = useAuth()
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  }))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const formRef = useRef(null)

  useEffect(() => {
    if (!user) return

    setForm((prev) => ({
      ...prev,
      firstName: user.firstName || prev.firstName,
      lastName: user.lastName || prev.lastName,
      email: user.email || prev.email,
      phone: user.phone || prev.phone,
      addressLine1: user.addressLine1 || prev.addressLine1,
      addressLine2: user.addressLine2 || prev.addressLine2,
      city: user.city || prev.city,
      province: user.province || prev.province,
      postalCode: user.postalCode || prev.postalCode,
      country: user.country || prev.country,
    }))
  }, [user])

  if (items.length === 0) {
    return <Navigate to="/cart" replace />
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const payload = {
        customer: form,
        items: items.map((i) => ({
          productId: i.product.id,
          size: i.size,
          color: i.color,
          qty: i.qty,
        })),
      }

      const { orderId, processUrl, fields } = await createOrder(payload)
      if (orderId) {
        sessionStorage.setItem(LAST_ORDER_ID_KEY, orderId)
      }

      const form_ = document.createElement('form')
      form_.method = 'POST'
      form_.action = processUrl
      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = value
        form_.appendChild(input)
      })
      document.body.appendChild(form_)
      form_.submit()
    } catch (err) {
      setError(err.message || 'Something went wrong placing your order.')
      setSubmitting(false)
    }
  }

  const configured = isCheckoutConfigured()

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-5xl tracking-wide">Checkout</h1>

      {!configured && (
        <div className="mt-6 rounded-xl border border-apparel-pink/40 bg-apparel-pink/10 p-4 text-sm text-apparel-pinkLight">
          The store backend isn't connected yet, so payment is disabled in this preview. Set{' '}
          <code className="rounded bg-apparel-bg px-1.5 py-0.5">VITE_API_URL</code> to enable checkout.
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="mt-8 grid gap-10 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <fieldset className="rounded-2xl border border-apparel-border bg-apparel-panel p-6">
            <legend className="px-2 text-xs font-bold uppercase tracking-widest text-apparel-teal">Contact</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="firstName" required placeholder="First name" value={form.firstName} onChange={handleChange} className="input" />
              <input name="lastName" required placeholder="Last name" value={form.lastName} onChange={handleChange} className="input" />
              <input name="email" type="email" required placeholder="Email address" value={form.email} onChange={handleChange} className="input" />
              <input name="phone" type="tel" required placeholder="Phone (+27...)" value={form.phone} onChange={handleChange} className="input" />
            </div>
          </fieldset>

          <fieldset className="rounded-2xl border border-apparel-border bg-apparel-panel p-6">
            <legend className="px-2 text-xs font-bold uppercase tracking-widest text-apparel-teal">Shipping Address</legend>
            <div className="grid gap-4">
              <input name="addressLine1" required placeholder="Address line 1" value={form.addressLine1} onChange={handleChange} className="input" />
              <input name="addressLine2" placeholder="Address line 2 (optional)" value={form.addressLine2} onChange={handleChange} className="input" />
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="city" required placeholder="City" value={form.city} onChange={handleChange} className="input" />
                <input name="postalCode" required placeholder="Postal code" value={form.postalCode} onChange={handleChange} className="input" />
              </div>
              <select name="province" value={form.province} onChange={handleChange} className="input">
                {SA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </fieldset>

          {error && <p className="text-sm font-semibold text-apparel-pink">{error}</p>}
        </div>

        <div className="h-fit rounded-2xl border border-apparel-border bg-apparel-panel p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-apparel-teal">Order Summary</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((i) => (
              <li key={i.key} className="flex justify-between gap-2">
                <span className="text-apparel-muted">
                  {i.qty}× {i.product.name} ({i.size}/{i.color})
                </span>
                <span className="whitespace-nowrap font-semibold">R{i.qty * i.product.price}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-apparel-border pt-4 text-base font-bold">
            <span>Total</span>
            <span className="text-apparel-teal">R{subtotal}</span>
          </div>
          <p className="mt-4 rounded-xl border border-apparel-border bg-apparel-bg/70 p-3 text-xs leading-relaxed text-apparel-muted">
            You will be redirected to PayFast to complete payment securely. We will then confirm your payment
            status and finalize your order reference back on Kingdom Drip.
          </p>
          <button
            type="submit"
            disabled={!configured || submitting}
            className="mt-6 w-full rounded-full bg-grad-drop px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-apparel-bg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? 'Redirecting to PayFast…' : 'Pay With PayFast →'}
          </button>
          <p className="mt-3 text-center text-xs text-apparel-muted">Secure payment via PayFast. ZAR only.</p>
        </div>
      </form>
    </div>
  )
}
