import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import {
  createAdminProduct,
  deleteAdminProduct,
  listAdminProducts,
  uploadAdminProductImage,
  updateAdminProduct,
} from '../lib/api.js'
import { formatBytes, optimizeImageForUpload } from '../lib/imageUpload.js'

const emptyForm = {
  id: '',
  name: '',
  category: 'Tees',
  price: '',
  imageUrl: '',
  blurb: '',
  art: 'grad-drop',
  word: '',
  sizes: 'S, M, L, XL',
  colors: 'Black',
  inventory: [],
  active: true,
}

function mapProductToForm(product) {
  return {
    id: product.id || '',
    name: product.name || '',
    category: product.category || 'Tees',
    price: product.price?.toString?.() || '',
    imageUrl: product.imageUrl || '',
    blurb: product.blurb || '',
    art: product.art || 'grad-drop',
    word: product.word || '',
    sizes: (product.sizes || []).join(', '),
    colors: (product.colors || []).join(', '),
    inventory: product.inventory || [],
    active: product.active !== false,
  }
}

function csvToArray(value) {
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}

function inventoryRows(form) {
  const sizes = csvToArray(form.sizes)
  const colors = csvToArray(form.colors)
  return sizes.flatMap((size) => colors.map((color) => {
    const existing = form.inventory.find((item) => item.size === size && item.color === color)
    return { size, color, quantity: existing?.quantity ?? 0, available: existing?.available ?? existing?.quantity ?? 0, reserved: existing?.reserved ?? 0 }
  }))
}

export default function AdminProducts() {
  const { token } = useAuth()
  const { refreshProducts } = useProducts()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingId, setEditingId] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [form, setForm] = useState(emptyForm)

  async function loadProducts() {
    if (!token) return
    setLoading(true)
    setError('')

    try {
      const data = await listAdminProducts(token)
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Unable to load admin products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => (a.name || '').localeCompare(b.name || '')),
    [products],
  )

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return sortedProducts
    return sortedProducts.filter((product) => (
      [product.name, product.id, product.category].some((value) => value?.toLowerCase().includes(query))
    ))
  }, [searchQuery, sortedProducts])

  function onChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function onInventoryChange(size, color, quantity) {
    setForm((prev) => {
      const next = prev.inventory.filter((item) => !(item.size === size && item.color === color))
      return { ...prev, inventory: [...next, { size, color, quantity: Math.max(0, Number(quantity) || 0) }] }
    })
  }

  async function onImageSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setUploadStatus('Optimizing image...')
    setError('')
    setSuccess('')

    try {
      const prepared = await optimizeImageForUpload(file)
      setUploadStatus('Uploading image...')
      const result = await uploadAdminProductImage(token, prepared.file)
      setForm((prev) => ({ ...prev, imageUrl: result.url || prev.imageUrl }))

      if (prepared.changed) {
        setSuccess(
          `Image optimized from ${formatBytes(prepared.originalBytes)} to ${formatBytes(prepared.optimizedBytes)} and uploaded. Save the product to apply the new image URL.`,
        )
      } else {
        setSuccess('Image uploaded. Save the product to apply the new image URL.')
      }
    } catch (err) {
      setError(err.message || 'Unable to upload image.')
    } finally {
      setUploadingImage(false)
      setUploadStatus('')
      e.target.value = ''
    }
  }

  function startCreate() {
    setEditingId('')
    setForm(emptyForm)
    setError('')
    setSuccess('')
  }

  function startEdit(product) {
    setEditingId(product.id)
    setForm(mapProductToForm(product))
    setError('')
    setSuccess('')
  }

  async function onSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const payload = {
        id: form.id.trim(),
        name: form.name.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        imageUrl: form.imageUrl.trim() || null,
        blurb: form.blurb.trim() || null,
        art: form.art.trim() || null,
        word: form.word.trim() || null,
        sizes: csvToArray(form.sizes),
        colors: csvToArray(form.colors),
        inventory: inventoryRows(form).map(({ size, color, quantity }) => ({ size, color, quantity })),
        active: Boolean(form.active),
      }

      if (editingId) {
        await updateAdminProduct(token, editingId, payload)
        setSuccess('Product updated successfully.')
      } else {
        await createAdminProduct(token, payload)
        setSuccess('Product created successfully.')
      }

      await loadProducts()
      await refreshProducts()
      if (!editingId) startCreate()
    } catch (err) {
      setError(err.message || 'Unable to save product right now.')
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(productId) {
    if (!window.confirm('Delete this product permanently?')) return

    setError('')
    setSuccess('')
    try {
      await deleteAdminProduct(token, productId)
      setSuccess('Product deleted successfully.')
      if (editingId === productId) startCreate()
      await loadProducts()
      await refreshProducts()
    } catch (err) {
      setError(err.message || 'Unable to delete product.')
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-apparel-teal">Store management</p>
          <h1 className="mt-2 font-display text-5xl tracking-wide">Admin Products</h1>
          <p className="mt-3 max-w-2xl text-apparel-muted">
            Keep your catalogue current, polished and ready for the next drop.
          </p>
        </div>
        <div className="flex gap-6 border-l border-apparel-border pl-5 text-sm sm:mb-1">
          <div>
            <p className="text-2xl font-bold text-apparel-cream">{products.length}</p>
            <p className="text-xs uppercase tracking-widest text-apparel-muted">Products</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-apparel-teal">{products.filter((product) => product.active !== false).length}</p>
            <p className="text-xs uppercase tracking-widest text-apparel-muted">Live</p>
          </div>
        </div>
      </div>

      {error && <p className="mt-5 rounded-xl border border-apparel-pink/40 bg-apparel-pink/10 p-3 text-sm font-semibold text-apparel-pink">{error}</p>}
      {success && <p className="mt-5 rounded-xl border border-apparel-teal/40 bg-apparel-teal/10 p-3 text-sm font-semibold text-apparel-teal">{success}</p>}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <section className="rounded-2xl border border-apparel-border bg-apparel-panel p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-apparel-teal">
              {editingId ? `Edit Product: ${editingId}` : 'Create Product'}
              </p>
              <p className="mt-1 text-xs text-apparel-muted">{editingId ? 'Update the details below.' : 'Add a new item to your storefront.'}</p>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={startCreate}
                className="text-xs font-bold uppercase tracking-widest text-apparel-muted hover:text-apparel-cream"
              >
                + New Product
              </button>
            )}
          </div>

          {form.imageUrl && (
            <div className="mb-5 overflow-hidden rounded-xl border border-apparel-border bg-apparel-bg">
              <img src={form.imageUrl} alt={`${form.name || 'Product'} preview`} className="h-48 w-full object-cover" />
              <p className="border-t border-apparel-border px-3 py-2 text-xs text-apparel-muted">Current image preview</p>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-apparel-muted">Product details</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-xs font-semibold text-apparel-muted">Product ID<input name="id" value={form.id} onChange={onChange} required className="input" placeholder="e.g. grace-tee" readOnly={Boolean(editingId)} /></label>
              <label className="space-y-2 text-xs font-semibold text-apparel-muted">Name<input name="name" value={form.name} onChange={onChange} required className="input" placeholder="Product name" /></label>
              <label className="space-y-2 text-xs font-semibold text-apparel-muted">Category<input name="category" value={form.category} onChange={onChange} required className="input" placeholder="Tees" /></label>
              <label className="space-y-2 text-xs font-semibold text-apparel-muted">Price (ZAR)<input name="price" value={form.price} onChange={onChange} required type="number" min="1" step="0.01" className="input" placeholder="850" /></label>
            </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-apparel-muted">Product image</p>
              <input name="imageUrl" value={form.imageUrl} onChange={onChange} className="input" placeholder="Paste an image URL or upload a file" />
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex cursor-pointer items-center rounded-full border border-apparel-border px-4 py-2 text-xs font-bold uppercase tracking-widest text-apparel-cream hover:border-apparel-teal">
                  <input type="file" accept="image/*" className="hidden" onChange={onImageSelect} />
                  {uploadingImage ? uploadStatus || 'Uploading...' : 'Upload Image'}
                </label>
                {form.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, imageUrl: '' }))}
                    className="text-xs font-bold uppercase tracking-widest text-apparel-muted hover:text-apparel-cream"
                  >
                    Clear image
                  </button>
                )}
              </div>
            </div>
            <label className="block space-y-2 text-xs font-semibold text-apparel-muted">Description<textarea name="blurb" value={form.blurb} onChange={onChange} className="input min-h-[90px]" placeholder="A short description for the product page" /></label>

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-apparel-muted">Storefront options</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-xs font-semibold text-apparel-muted">Art style<input name="art" value={form.art} onChange={onChange} className="input" placeholder="grad-drop" /></label>
                <label className="space-y-2 text-xs font-semibold text-apparel-muted">Fallback word<input name="word" value={form.word} onChange={onChange} className="input" placeholder="Grace" /></label>
                <label className="space-y-2 text-xs font-semibold text-apparel-muted">Sizes<input name="sizes" value={form.sizes} onChange={onChange} required className="input" placeholder="S, M, L, XL" /></label>
                <label className="space-y-2 text-xs font-semibold text-apparel-muted">Colors<input name="colors" value={form.colors} onChange={onChange} required className="input" placeholder="Black, White" /></label>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-apparel-muted">Inventory by variant</p>
                  <p className="mt-1 text-xs text-apparel-muted">Set available units for each size and colour combination.</p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-apparel-teal">{inventoryRows(form).length} variants</span>
              </div>
              <div className="overflow-hidden rounded-xl border border-apparel-border">
                <div className="grid grid-cols-[1fr_1fr_6rem] gap-3 bg-apparel-bg/70 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-apparel-muted">
                  <span>Size</span><span>Colour</span><span>Units</span>
                </div>
                {inventoryRows(form).map((item) => (
                  <div key={`${item.size}-${item.color}`} className="grid grid-cols-[1fr_1fr_6rem] items-center gap-3 border-t border-apparel-border px-3 py-2">
                    <span className="text-sm text-apparel-cream">{item.size}</span>
                    <span className="text-sm text-apparel-muted">{item.color}</span>
                    <input
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(event) => onInventoryChange(item.size, item.color, event.target.value)}
                      className="input px-2 py-2 text-center"
                      aria-label={`${item.size} ${item.color} stock quantity`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 border-t border-apparel-border pt-4">
              <label className="flex max-w-full items-start gap-3 text-sm text-apparel-muted">
                <input type="checkbox" name="active" checked={form.active} onChange={onChange} />
                <span className="min-w-0"><strong className="text-apparel-cream">Published</strong><span className="ml-2 text-xs">Visible in storefront</span></span>
              </label>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-full bg-grad-drop px-7 py-3 text-sm font-bold uppercase tracking-widest text-apparel-bg disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-apparel-border bg-apparel-panel p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-apparel-teal">Existing Products</h2>
              <p className="mt-1 text-xs text-apparel-muted">{filteredProducts.length} of {products.length} shown</p>
            </div>
            <button type="button" onClick={loadProducts} className="text-xs font-bold uppercase tracking-widest text-apparel-muted hover:text-apparel-cream">Refresh</button>
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="input mt-4"
            placeholder="Search name, ID or category"
            aria-label="Search products"
          />
          {loading ? (
            <p className="mt-4 text-sm text-apparel-muted">Loading products...</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {filteredProducts.map((product) => (
                <li key={product.id} className="rounded-xl border border-apparel-border bg-apparel-bg/70 p-3">
                  <div className="flex gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-apparel-border bg-apparel-panel2">
                      {product.imageUrl ? <img src={product.imageUrl} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center text-[10px] uppercase text-apparel-muted">No image</span>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-apparel-cream">{product.name}</p>
                        <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${product.active !== false ? 'bg-apparel-teal/10 text-apparel-teal' : 'bg-apparel-border text-apparel-muted'}`}>{product.active !== false ? 'Live' : 'Hidden'}</span>
                      </div>
                      <p className="mt-1 text-xs text-apparel-muted">{product.id} · {product.category} · R{product.price}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(product)}
                      className="rounded-full border border-apparel-border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-apparel-cream"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(product.id)}
                      className="rounded-full border border-apparel-pink/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-apparel-pink"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
              {sortedProducts.length === 0 && (
                <li className="text-sm text-apparel-muted">No products found.</li>
              )}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
