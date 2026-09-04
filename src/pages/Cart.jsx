import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function Cart() {
  const { items, subtotal, updateQty, removeItem } = useCart()
  const navigate = useNavigate()
  const freeShippingThreshold = 850
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-4xl tracking-wide sm:text-5xl">Your Cart Is Empty</h1>
        <p className="mt-3 text-apparel-muted">Time to gear up and rep the Kingdom.</p>
        <Link
          to="/shop"
          className="mt-8 inline-block rounded-full bg-grad-drop px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-apparel-bg"
        >
          Shop Now →
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 pb-28 sm:px-6 md:pb-16">
      <h1 className="font-display text-4xl tracking-wide sm:text-5xl">Your Cart</h1>
      <div className="mt-8 divide-y divide-apparel-border rounded-2xl border border-apparel-border bg-apparel-panel">
        {items.map((item) => (
          <div key={item.key} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-6">
            <div className="flex-1">
              <Link to={`/product/${item.product.id}`} className="font-semibold hover:text-apparel-teal">
                {item.product.name}
              </Link>
              <div className="mt-1 text-sm text-apparel-muted">
                Size {item.size} · {item.color}
              </div>
              <button
                onClick={() => removeItem(item.key)}
                className="mt-2 text-xs font-semibold uppercase tracking-widest text-apparel-pink hover:underline"
              >
                Remove
              </button>
            </div>
            <div className="flex w-full min-w-0 items-center justify-between gap-3 sm:w-auto sm:justify-start">
              <div className="flex items-center rounded-lg border border-apparel-border">
                <button
                  onClick={() => updateQty(item.key, item.qty - 1)}
                  className="px-3 py-1.5 text-lg font-bold hover:text-apparel-teal"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold">{item.qty}</span>
                <button
                  onClick={() => updateQty(item.key, item.qty + 1)}
                  className="px-3 py-1.5 text-lg font-bold hover:text-apparel-teal"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <span className="min-w-[5rem] text-right font-bold text-apparel-teal sm:w-20">R{item.qty * item.product.price}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-2xl border border-apparel-border bg-apparel-panel p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-apparel-muted">
            {remainingForFreeShipping > 0 ? `Add R${remainingForFreeShipping.toFixed(2)} for free shipping.` : 'Free shipping unlocked.'}
          </div>
          <div className="text-lg">
            Subtotal: <span className="font-bold text-apparel-teal">R{subtotal}</span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
          <Link to="/shop" className="text-apparel-teal hover:underline">
            Continue shopping
          </Link>
          <Link to="/checkout" className="text-apparel-pink hover:underline">
            Review checkout
          </Link>
        </div>
        <div className="mt-4 flex flex-col items-end gap-4">
          <button
            onClick={() => navigate('/checkout')}
            className="rounded-full bg-grad-drop px-10 py-4 text-sm font-bold uppercase tracking-widest text-apparel-bg transition-transform hover:scale-105"
          >
            Proceed To Checkout →
          </button>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-apparel-border bg-apparel-bg/95 p-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-apparel-muted">Subtotal</p>
            <p className="text-lg font-bold text-apparel-teal">R{subtotal}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="rounded-full bg-grad-drop px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-apparel-bg"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  )
}
