import { Link } from 'react-router-dom'
import { ART_CLASSES } from '../lib/artClasses.js'

export default function ProductCard({ product }) {
  const showImage = Boolean(product.imageUrl)

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-apparel-border bg-apparel-panel transition-transform hover:-translate-y-1"
    >
      <div className={`relative flex aspect-square items-center justify-center overflow-hidden ${ART_CLASSES[product.art] || 'bg-grad-drop'} p-6`}>
        {showImage ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
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
  )
}
