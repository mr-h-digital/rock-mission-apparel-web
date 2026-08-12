import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function OrderSuccess() {
  const { clearCart } = useCart()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    clearCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <span className="font-display text-6xl text-apparel-teal">✓</span>
      <h1 className="mt-4 font-display text-5xl tracking-wide">Order Confirmed</h1>
      <p className="mt-4 text-apparel-muted">
        Thank you! Your payment went through and your gear is on its way. A confirmation has been sent to your
        email — and you've just helped fund Rock Mission Ministries' outreach across the Cape Flats. 🙏
      </p>
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
