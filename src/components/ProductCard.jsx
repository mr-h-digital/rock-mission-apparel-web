import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ART_CLASSES } from '../lib/artClasses.js'
import { useWishlist } from '../context/WishlistContext.jsx'

export default function ProductCard({ product }) {
  const [imageFailed, setImageFailed] = useState(false)
  const { isWishlisted, toggleItem } = useWishlist()

  useEffect(() => {
    setImageFailed(false)
  }, [product.imageUrl])

  const showImage = Boolean(product.imageUrl) && !imageFailed

  const saved = isWishlisted(product.id)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-apparel-border bg-apparel-panel transition-transform hover:-translate-y-1">
      <button
        type="button"
        onClick={() => toggleItem(product.id)}
        aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        title={saved ? 'Remove from wishlist' : 'Add to wishlist'}
        className={`absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
          saved
            ? 'border-apparel-pink bg-apparel-pink text-apparel-bg'
            : 'border-apparel-border bg-apparel-bg/80 text-apparel-cream hover:border-apparel-pink hover:text-apparel-pink'
        }`}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current stroke-current" strokeWidth="1.8">
          <path d="M20.8 4.9a5.5 5.5 0 0 0-7.8 0L12 6l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.3a5.5 5.5 0 0 0 0-7.8Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <Link to={`/product/${product.id}`} className="flex flex-1 flex-col">
      <div className={`relative flex aspect-square items-center justify-center overflow-hidden ${ART_CLASSES[product.art] || 'bg-grad-drop'} p-6`}>
        {showImage ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="font-display text-4xl leading-none tracking-wide text-apparel-bg drop-shadow-sm sm:text-5xl">
            {product.word || product.name}
          </span>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-apparel-bg/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-apparel-cream">
          {product.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="text-sm font-semibold leading-snug text-apparel-cream group-hover:text-apparel-teal">
          {product.name}
        </h3>
        <span className="mt-auto text-base font-bold text-apparel-teal">R{product.price}</span>
      </div>
      </Link>
    </article>
  )
}
