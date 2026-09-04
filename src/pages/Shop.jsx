import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import CategoryChips from '../components/CategoryChips.jsx'
import SeoHead from '../components/SeoHead.jsx'
import { useProducts } from '../context/ProductsContext.jsx'

export default function Shop() {
  const { products, categories, productCountsByCategory, loading, error } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const active = searchParams.get('category')
  const query = searchParams.get('q') || ''
  const size = searchParams.get('size') || ''
  const color = searchParams.get('color') || ''
  const inStockOnly = searchParams.get('inStock') === 'true'
  const sort = searchParams.get('sort') || 'featured'

  const sizes = useMemo(() => Array.from(new Set(products.flatMap((product) => product.sizes || []))).sort(), [products])
  const colors = useMemo(() => Array.from(new Set(products.flatMap((product) => product.colors || []))).sort(), [products])

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const matches = products.filter((product) => {
      const hasAvailableVariant = !Array.isArray(product.inventory) || product.inventory.length === 0
        || product.inventory.some((variant) => variant.available > 0)
      const searchableText = [product.name, product.category, product.blurb, product.word, product.colors?.join(' ')]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return (!active || product.category === active)
        && (!normalizedQuery || searchableText.includes(normalizedQuery))
        && (!size || product.sizes?.includes(size))
        && (!color || product.colors?.includes(color))
        && (!inStockOnly || hasAvailableVariant)
    })

    return matches.sort((first, second) => {
      if (sort === 'price-asc') return first.price - second.price
      if (sort === 'price-desc') return second.price - first.price
      if (sort === 'name') return first.name.localeCompare(second.name)
      return 0
    })
  }, [active, color, inStockOnly, products, query, size, sort])
  const resultCountLabel = `${filtered.length} ${filtered.length === 1 ? 'piece' : 'pieces'}`

  function updateFilter(key, value) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      if (value) next.set(key, value)
      else next.delete(key)
      return next
    })
  }

  function clearFilters() {
    setSearchParams({})
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
        <h1 className="mt-2 font-display text-4xl tracking-wide sm:text-6xl">Shop</h1>
      </div>
      <div className="mb-8">
        <CategoryChips
          categories={categories}
          counts={productCountsByCategory}
          active={active}
          onChange={(category) => updateFilter('category', category)}
        />
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-apparel-border bg-apparel-panel px-4 py-3 text-sm">
        <p className="text-apparel-muted">
          Showing <span className="font-semibold text-apparel-cream">{resultCountLabel}</span>
          {active ? ` in ${active}` : ''}{query ? ` for “${query}”` : ''}.
        </p>
        <p className="text-xs uppercase tracking-widest text-apparel-teal">
          Sort: {sort === 'featured' ? 'Featured' : sort === 'price-asc' ? 'Price low to high' : sort === 'price-desc' ? 'Price high to low' : 'Name A to Z'}
        </p>
      </div>
      <div className="mb-8 grid gap-3 border-y border-apparel-border py-5 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_repeat(4,minmax(0,1fr))_auto]">
        <input
          type="search"
          value={query}
          onChange={(event) => updateFilter('q', event.target.value)}
          className="input"
          placeholder="Search the collection"
          aria-label="Search products"
        />
        <select value={size} onChange={(event) => updateFilter('size', event.target.value)} className="input" aria-label="Filter by size">
          <option value="">All sizes</option>
          {sizes.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <select value={color} onChange={(event) => updateFilter('color', event.target.value)} className="input" aria-label="Filter by colour">
          <option value="">All colours</option>
          {colors.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <select value={sort} onChange={(event) => updateFilter('sort', event.target.value === 'featured' ? '' : event.target.value)} className="input" aria-label="Sort products">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="name">Name: A to Z</option>
        </select>
        <label className="flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-widest text-apparel-muted sm:col-span-1 lg:col-span-1">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(event) => updateFilter('inStock', event.target.checked ? 'true' : '')}
            className="h-4 w-4 accent-apparel-teal"
          />
          In stock
        </label>
        <button
          type="button"
          onClick={clearFilters}
          className="text-left text-xs font-bold uppercase tracking-widest text-apparel-teal hover:underline sm:text-right lg:text-left"
        >
          Clear
        </button>
      </div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="text-sm text-apparel-muted">{resultCountLabel} found</p>
      </div>
      {loading && <p className="mb-6 text-sm text-apparel-muted">Loading products...</p>}
      {error && <p className="mb-6 text-sm font-semibold text-apparel-pink">{error}</p>}
      <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-apparel-muted">No pieces match those filters.</p>
          <button type="button" onClick={clearFilters} className="mt-4 text-sm font-bold uppercase tracking-widest text-apparel-teal hover:underline">
            Reset filters
          </button>
        </div>
      )}
    </div>
  )
}
