import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CATEGORIES, PRODUCTS } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'
import CategoryChips from '../components/CategoryChips.jsx'
import SeoHead from '../components/SeoHead.jsx'

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlCategory = searchParams.get('category')
  const [active, setActive] = useState(CATEGORIES.includes(urlCategory) ? urlCategory : null)

  const filtered = useMemo(
    () => (active ? PRODUCTS.filter((p) => p.category === active) : PRODUCTS),
    [active],
  )

  function handleChange(category) {
    setActive(category)
    setSearchParams(category ? { category } : {})
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SeoHead
        title="Shop Christian Apparel — Kingdom Drip"
        description="Browse Kingdom Drip hoodies, tees, hats and accessories. Streetwear that helps fund Rock Mission Ministries outreach."
        path="/shop"
        image="/brand/kingdom-drip-store-hero-bg.png"
      />
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-apparel-teal">The Full Range</span>
        <h1 className="mt-2 font-display text-5xl tracking-wide sm:text-6xl">Shop</h1>
      </div>
      <div className="mb-8">
        <CategoryChips categories={CATEGORIES} active={active} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="py-20 text-center text-apparel-muted">No products in this category yet — check back soon.</p>
      )}
    </div>
  )
}
