import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProductById } from '../data/products.js'
import { useCart } from '../context/CartContext.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { ART_CLASSES } from '../lib/artClasses.js'
import SeoHead from '../components/SeoHead.jsx'

const SITE_URL = 'https://shop.rockmission.co.za'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products } = useProducts()
  const product = products.find((p) => p.id === id) || getProductById(id)
  const { addItem } = useCart()
  const { isWishlisted, toggleItem } = useWishlist()

  const [size, setSize] = useState(product?.sizes[0] ?? '')
  const [color, setColor] = useState(product?.colors[0] ?? '')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)

  const productPath = product ? `/product/${product.id}` : '/shop'
  const productTitle = product
    ? `${product.name} — Kingdom Drip`
    : 'Product Not Found — Kingdom Drip'
  const productDescription = product
    ? `${product.blurb} Shop Kingdom Drip apparel and help fund Rock Mission Ministries outreach.`
    : 'This product was not found. Explore Kingdom Drip apparel in the shop.'
  const selectedInventory = product?.inventory?.find((item) => item.size === size && item.color === color)
  const inventoryTracked = Array.isArray(product?.inventory) && product.inventory.length > 0
  const availableQuantity = inventoryTracked ? (selectedInventory?.available ?? 0) : null
  const soldOut = inventoryTracked && availableQuantity < 1
  const saved = product ? isWishlisted(product.id) : false

  const productSchema = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.blurb,
        category: product.category,
        image: product.imageUrl || `${SITE_URL}/brand/kingdom-drip-logo-only.png`,
        sku: product.id,
        brand: {
          '@type': 'Brand',
          name: 'Kingdom Drip',
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'ZAR',
          price: product.price,
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}/product/${product.id}`,
        },
      }
    : null

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <SeoHead
          title={productTitle}
          description={productDescription}
          path={productPath}
        />
        <h1 className="font-display text-4xl">Product Not Found</h1>
        <Link to="/shop" className="mt-4 inline-block text-apparel-teal hover:underline">← Back to Shop</Link>
      </div>
    )
  }

  function handleAddToCart() {
    if (soldOut || (inventoryTracked && qty > availableQuantity)) return
    addItem(product.id, size, color, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  function handleBuyNow() {
    if (soldOut || (inventoryTracked && qty > availableQuantity)) return
    addItem(product.id, size, color, qty)
    navigate('/cart')
  }

  const showImage = Boolean(product.imageUrl) && !imageFailed

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <SeoHead
        title={productTitle}
        description={productDescription}
        path={productPath}
        image="/brand/kingdom-drip-logo-only.png"
        type="product"
        jsonLd={productSchema}
      />
      <Link to="/shop" className="text-sm font-semibold uppercase tracking-widest text-apparel-muted hover:text-apparel-teal">
        ← Back to Shop
      </Link>
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        {showImage ? (
          <div className="overflow-hidden rounded-3xl border border-apparel-border bg-apparel-panel">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
              onError={() => setImageFailed(true)}
            />
          </div>
        ) : (
          <div className={`flex aspect-square items-center justify-center rounded-3xl ${ART_CLASSES[product.art] || 'bg-grad-drop'} p-10`}>
            <span className="text-center font-display text-6xl leading-none tracking-wide text-apparel-bg drop-shadow-sm">
              {product.word}
            </span>
          </div>
        )}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-apparel-teal">{product.category}</span>
          <h1 className="mt-2 font-display text-4xl tracking-wide sm:text-5xl">{product.name}</h1>
          <p className="mt-3 text-2xl font-bold text-apparel-cream">R{product.price}</p>
          <p className="mt-4 text-apparel-muted">{product.blurb}</p>
          {inventoryTracked && (
            <p className={`mt-4 text-sm font-semibold ${soldOut ? 'text-apparel-pink' : 'text-apparel-teal'}`}>
              {soldOut ? 'Sold out for this size and colour.' : availableQuantity <= 5 ? `Only ${availableQuantity} left in this variant.` : 'In stock'}
            </p>
          )}

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
                onClick={() => setQty((q) => Math.min(q + 1, inventoryTracked ? availableQuantity : q + 1))}
                disabled={inventoryTracked && qty >= availableQuantity}
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
              disabled={soldOut}
              className="rounded-full border border-apparel-teal px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-apparel-teal hover:bg-apparel-teal hover:text-apparel-bg disabled:cursor-not-allowed disabled:border-apparel-border disabled:text-apparel-muted"
            >
              {added ? 'Added ✓' : 'Add To Cart'}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={soldOut}
              className="rounded-full bg-grad-drop px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-apparel-bg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Buy Now
            </button>
            <button
              type="button"
              onClick={() => toggleItem(product.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-6 py-3.5 text-sm font-bold uppercase tracking-widest transition-colors ${
                saved
                  ? 'border-apparel-pink bg-apparel-pink text-apparel-bg'
                  : 'border-apparel-border text-apparel-cream hover:border-apparel-pink hover:text-apparel-pink'
              }`}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current stroke-current" strokeWidth="1.8">
                <path d="M20.8 4.9a5.5 5.5 0 0 0-7.8 0L12 6l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.3a5.5 5.5 0 0 0 0-7.8Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {saved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
