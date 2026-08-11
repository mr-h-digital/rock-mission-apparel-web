import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProductById } from '../data/products.js'
import { useCart } from '../context/CartContext.jsx'
import { ART_CLASSES } from '../lib/artClasses.js'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = getProductById(id)
  const { addItem } = useCart()

  const [size, setSize] = useState(product?.sizes[0] ?? '')
  const [color, setColor] = useState(product?.colors[0] ?? '')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-4xl">Product Not Found</h1>
        <Link to="/shop" className="mt-4 inline-block text-apparel-teal hover:underline">← Back to Shop</Link>
      </div>
    )
  }

  function handleAddToCart() {
    addItem(product.id, size, color, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  function handleBuyNow() {
    addItem(product.id, size, color, qty)
    navigate('/cart')
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link to="/shop" className="text-sm font-semibold uppercase tracking-widest text-apparel-muted hover:text-apparel-teal">
        ← Back to Shop
      </Link>
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className={`flex aspect-square items-center justify-center rounded-3xl ${ART_CLASSES[product.art]} p-10`}>
          <span className="text-center font-display text-6xl leading-none tracking-wide text-apparel-bg drop-shadow-sm">
            {product.word}
          </span>
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-apparel-teal">{product.category}</span>
          <h1 className="mt-2 font-display text-4xl tracking-wide sm:text-5xl">{product.name}</h1>
          <p className="mt-3 text-2xl font-bold text-apparel-cream">R{product.price}</p>
          <p className="mt-4 text-apparel-muted">{product.blurb}</p>

          <div className="mt-8">
            <label className="text-xs font-bold uppercase tracking-widest text-apparel-muted">Size</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                    size === s
                      ? 'border-apparel-teal bg-apparel-teal text-apparel-bg'
                      : 'border-apparel-border text-apparel-cream hover:border-apparel-teal'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="text-xs font-bold uppercase tracking-widest text-apparel-muted">Colour</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                    color === c
                      ? 'border-apparel-teal bg-apparel-teal text-apparel-bg'
                      : 'border-apparel-border text-apparel-cream hover:border-apparel-teal'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <label className="text-xs font-bold uppercase tracking-widest text-apparel-muted">Qty</label>
            <div className="flex items-center rounded-lg border border-apparel-border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-lg font-bold hover:text-apparel-teal"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-2 text-lg font-bold hover:text-apparel-teal"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={handleAddToCart}
              className="rounded-full border border-apparel-teal px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-apparel-teal hover:bg-apparel-teal hover:text-apparel-bg"
            >
              {added ? 'Added ✓' : 'Add To Cart'}
            </button>
            <button
              onClick={handleBuyNow}
              className="rounded-full bg-grad-drop px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-apparel-bg transition-transform hover:scale-105"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
