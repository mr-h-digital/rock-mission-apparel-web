import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function Cart() {
  const { items, subtotal, updateQty, removeItem } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-5xl tracking-wide">Your Cart Is Empty</h1>
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
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-5xl tracking-wide">Your Cart</h1>
      <div className="mt-8 divide-y divide-apparel-border rounded-2xl border border-apparel-border bg-apparel-panel">
        {items.map((item) => (
          <div key={item.key} className="flex items-center gap-4 p-4 sm:p-6">
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
            <span className="w-20 text-right font-bold text-apparel-teal">R{item.qty * item.product.price}</span>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-col items-end gap-4">
        <div className="text-lg">
          Subtotal: <span className="font-bold text-apparel-teal">R{subtotal}</span>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="rounded-full bg-grad-drop px-10 py-4 text-sm font-bold uppercase tracking-widest text-apparel-bg transition-transform hover:scale-105"
        >
          Proceed To Checkout →
        </button>
      </div>
    </div>
  )
}
