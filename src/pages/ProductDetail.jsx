import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProductById, PRODUCTS } from '../data/products.js'
import { useCart } from '../context/CartContext.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { ART_CLASSES } from '../lib/artClasses.js'
import SeoHead from '../components/SeoHead.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { requestBackInStockNotification } from '../lib/api.js'

const SITE_URL = 'https://shop.rockmission.co.za'
const RECENTLY_VIEWED_KEY = 'rm-apparel-recently-viewed'
const FIT_GUIDANCE = {
  Hoodies: 'Designed with a relaxed, oversized shape. Choose your usual size for an easy fit, or size down for a closer fit.',
  Tees: 'Cut for a relaxed everyday fit. Choose your usual size; size up for a looser streetwear silhouette.',
  Hats: 'One-size caps and beanies use adjustable or flexible fits where stated in the product description.',
  Accessories: 'Accessory dimensions and fit details are included in each product description.',
}

function readRecentlyViewed() {
  try {
    const stored = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY))
    return Array.isArray(stored) ? stored.filter((productId) => typeof productId === 'string') : []
  } catch {
    return []
  }
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products } = useProducts()
  const catalogProducts = products.length > 0 ? products : PRODUCTS
  const product = products.find((p) => p.id === id) || getProductById(id)
  const { addItem } = useCart()
  const { isWishlisted, toggleItem } = useWishlist()

  const [size, setSize] = useState(product?.sizes[0] ?? '')
  const [color, setColor] = useState(product?.colors[0] ?? '')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const [recentlyViewedIds, setRecentlyViewedIds] = useState(readRecentlyViewed)
  const [notificationEmail, setNotificationEmail] = useState('')
  const [notificationState, setNotificationState] = useState('')
  const [notificationError, setNotificationError] = useState('')

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

  useEffect(() => {
    if (!product) return

    setRecentlyViewedIds((previous) => {
      const next = [product.id, ...previous.filter((productId) => productId !== product.id)].slice(0, 6)
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next))
      return next
    })
  }, [product])

  const relatedProducts = useMemo(() => (
    product
      ? catalogProducts.filter((candidate) => candidate.id !== product.id && candidate.category === product.category).slice(0, 4)
      : []
  ), [catalogProducts, product])

  const recentlyViewedProducts = useMemo(() => (
    recentlyViewedIds
      .filter((productId) => productId !== product?.id)
      .map((productId) => catalogProducts.find((candidate) => candidate.id === productId) || getProductById(productId))
      .filter(Boolean)
      .slice(0, 4)
  ), [catalogProducts, product?.id, recentlyViewedIds])

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

  async function handleBackInStockRequest(event) {
    event.preventDefault()
    setNotificationError('')
    setNotificationState('saving')

    try {
      await requestBackInStockNotification({ productId: product.id, size, color, email: notificationEmail })
      setNotificationState('saved')
    } catch (err) {
      setNotificationState('')
      setNotificationError(err.message || 'Unable to save your request right now.')
    }
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

          {soldOut && (
            <form onSubmit={handleBackInStockRequest} className="mt-5 border-y border-apparel-border py-5">
              <p className="text-sm font-semibold text-apparel-cream">Get notified when this {size}/{color} variant returns.</p>
              {notificationState === 'saved' ? (
                <p className="mt-2 text-sm font-semibold text-apparel-teal">You are on the list. We will email you when it is back.</p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  <input
                    type="email"
                    required
                    value={notificationEmail}
                    onChange={(event) => setNotificationEmail(event.target.value)}
                    className="input min-w-[220px] flex-1"
                    placeholder="Email address"
                  />
                  <button
                    type="submit"
                    disabled={notificationState === 'saving'}
                    className="rounded-full border border-apparel-teal px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-apparel-teal hover:bg-apparel-teal hover:text-apparel-bg disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {notificationState === 'saving' ? 'Saving...' : 'Notify me'}
                  </button>
                </div>
              )}
              {notificationError && <p className="mt-2 text-sm font-semibold text-apparel-pink">{notificationError}</p>}
            </form>
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

          <details className="mt-6 border-y border-apparel-border py-4">
            <summary className="cursor-pointer text-xs font-bold uppercase tracking-widest text-apparel-teal">
              Fit and sizing
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-apparel-muted">
              {FIT_GUIDANCE[product.category] || 'Choose the size and colour that best match your preferred fit.'}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-apparel-muted">
              Measurements can vary by garment. Use the product description and your preferred fit as your guide.
            </p>
          </details>

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
      {relatedProducts.length > 0 && (
        <section className="mt-20 border-t border-apparel-border pt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-apparel-teal">Keep exploring</p>
              <h2 className="mt-2 font-display text-3xl tracking-wide">More {product.category}</h2>
            </div>
            <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="text-sm font-bold uppercase tracking-widest text-apparel-teal hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct) => <ProductCard key={relatedProduct.id} product={relatedProduct} />)}
          </div>
        </section>
      )}
      {recentlyViewedProducts.length > 0 && (
        <section className="mt-16 border-t border-apparel-border pt-10">
          <p className="text-xs font-bold uppercase tracking-widest text-apparel-teal">Your browsing</p>
          <h2 className="mt-2 font-display text-3xl tracking-wide">Recently viewed</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {recentlyViewedProducts.map((viewedProduct) => <ProductCard key={viewedProduct.id} product={viewedProduct} />)}
          </div>
        </section>
      )}
    </div>
  )
}
