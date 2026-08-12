import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getOrderStatus } from '../lib/api.js'

const LAST_ORDER_ID_KEY = 'kingdomdrip.lastOrderId'

export default function OrderSuccess() {
  const { clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('')
  const [statusError, setStatusError] = useState('')

  const orderId = useMemo(() => (
    searchParams.get('orderId') || sessionStorage.getItem(LAST_ORDER_ID_KEY) || ''
  ), [searchParams])

  useEffect(() => {
    clearCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let active = true

    async function checkStatus() {
      if (!orderId) return

      try {
        const result = await getOrderStatus(orderId)
        if (!active) return

        setStatus(result.status || '')
        if (result.status === 'PENDING') {
          navigate(`/order/pending?orderId=${orderId}`, { replace: true })
        }
      } catch (err) {
        if (!active) return
        setStatusError(err.message || 'Unable to confirm payment status right now.')
      }
    }

    checkStatus()
    return () => {
      active = false
    }
  }, [navigate, orderId])

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <span className="font-display text-6xl text-apparel-teal">✓</span>
      <h1 className="mt-4 font-display text-5xl tracking-wide">Order Confirmed</h1>
      <p className="mt-4 text-apparel-muted">Thank you for supporting Kingdom Drip and Rock Mission outreach.</p>

      {orderId && (
        <p className="mt-4 rounded-xl border border-apparel-border bg-apparel-panel px-4 py-3 text-sm text-apparel-cream">
          Order reference: <span className="font-semibold text-apparel-teal">{orderId}</span>
        </p>
      )}

      {status && (
        <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-apparel-teal">
          Payment status: {status}
        </p>
      )}

      {statusError && <p className="mt-3 text-sm font-semibold text-apparel-pink">{statusError}</p>}

      <div className="mt-6 rounded-2xl border border-apparel-border bg-apparel-panel p-5 text-left text-sm text-apparel-muted">
        <p className="font-semibold uppercase tracking-wide text-apparel-teal">What happens next</p>
        <p className="mt-3">1. We verify payment confirmation from PayFast.</p>
        <p className="mt-1">2. Your order is prepared for fulfillment.</p>
        <p className="mt-1">3. You will receive updates on the email used at checkout.</p>
      </div>

      <Link
        to="/shop"
        className="mt-8 inline-block rounded-full bg-grad-drop px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-apparel-bg"
      >
        Keep Shopping →
      </Link>
      {!isAuthenticated && (
        <p className="mt-5 text-sm text-apparel-muted">
          Want faster checkout next time?{' '}
          <Link to="/sign-up" className="font-semibold text-apparel-teal hover:underline">
            Create your account
          </Link>
          .
        </p>
      )}
    </div>
  )
}
