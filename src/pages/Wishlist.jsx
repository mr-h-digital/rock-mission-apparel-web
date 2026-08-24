import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import SeoHead from '../components/SeoHead.jsx'

export default function Wishlist() {
  const { items } = useWishlist()
  const { addItem } = useCart()

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <SeoHead title="Wishlist - Kingdom Drip" description="Your saved Kingdom Drip apparel." path="/wishlist" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-apparel-teal">Saved for later</p>
          <h1 className="mt-2 font-display text-5xl tracking-wide">Wishlist</h1>
        </div>
        {items.length > 0 && <span className="text-sm font-semibold text-apparel-muted">{items.length} saved {items.length === 1 ? 'item' : 'items'}</span>}
      </div>

      {items.length === 0 ? (
        <div className="mt-10 border-y border-apparel-border py-16 text-center">
          <p className="font-display text-3xl tracking-wide text-apparel-cream">Nothing saved yet.</p>
          <p className="mt-3 text-apparel-muted">Save pieces you love and come back to them anytime on this device.</p>
          <Link to="/shop" className="mt-6 inline-block rounded-full bg-grad-drop px-6 py-3 text-sm font-bold uppercase tracking-widest text-apparel-bg">
            Explore the shop
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product) => (
            <div key={product.id} className="flex flex-col gap-3">
              <ProductCard product={product} />
              <button
                type="button"
                onClick={() => addItem(product.id, product.sizes[0], product.colors[0])}
                className="w-full rounded-full border border-apparel-teal px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-apparel-teal hover:bg-apparel-teal hover:text-apparel-bg"
              >
                Move to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}