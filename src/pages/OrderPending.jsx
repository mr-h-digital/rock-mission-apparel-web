import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { getOrderStatus } from '../lib/api.js'

const LAST_ORDER_ID_KEY = 'kingdomdrip.lastOrderId'

export default function OrderPending() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('PENDING')
  const [error, setError] = useState('')

  const orderId = useMemo(() => (
    searchParams.get('orderId') || sessionStorage.getItem(LAST_ORDER_ID_KEY) || ''
  ), [searchParams])

  useEffect(() => {
    let active = true

    async function pollStatus() {
      if (!orderId) {
        setError('Order reference is missing. Please check your order history or contact support.')
        return
      }

      try {
        const result = await getOrderStatus(orderId)
        if (!active) return

        setStatus(result.status || 'PENDING')
        if (result.status === 'PAID') {
          navigate(`/order/success?orderId=${orderId}`, { replace: true })
        }
      } catch (err) {
        if (!active) return
        setError(err.message || 'Unable to confirm payment status right now.')
      }
    }

    pollStatus()
    const intervalId = window.setInterval(pollStatus, 4000)

    return () => {
      active = false
      window.clearInterval(intervalId)
    }
  }, [navigate, orderId])

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <span className="font-display text-6xl text-apparel-teal">...</span>
      <h1 className="mt-4 font-display text-5xl tracking-wide">Processing Payment</h1>
      <p className="mt-4 text-apparel-muted">
        We are waiting for PayFast to confirm your payment. This usually takes a few seconds.
      </p>

      {orderId && (
        <p className="mt-4 rounded-xl border border-apparel-border bg-apparel-panel px-4 py-3 text-sm text-apparel-cream">
          Order reference: <span className="font-semibold text-apparel-teal">{orderId}</span>
        </p>
      )}

      <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-apparel-teal">
        Current status: {status}
      </p>

      {error && <p className="mt-3 text-sm font-semibold text-apparel-pink">{error}</p>}

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          to={orderId ? `/order/success?orderId=${orderId}` : '/order/success'}
          className="inline-block rounded-full border border-apparel-border px-6 py-3 text-sm font-bold uppercase tracking-widest text-apparel-cream hover:border-apparel-teal"
        >
          Refresh Status
        </Link>
        <Link
          to="/shop"
          className="inline-block rounded-full bg-grad-drop px-6 py-3 text-sm font-bold uppercase tracking-widest text-apparel-bg"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
