import { Link } from 'react-router-dom'

export default function OrderCancel() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 overflow-x-clip">
      <h1 className="font-display text-4xl tracking-wide sm:text-5xl">Payment Cancelled</h1>
      <p className="mt-4 break-words text-apparel-muted">
        No worries — your cart is still saved. You can pick up checkout again whenever you're ready.
      </p>
      <Link
        to="/cart"
        className="mt-8 inline-block rounded-full bg-grad-drop px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-apparel-bg"
      >
        Back To Cart →
      </Link>
    </div>
  )
}
