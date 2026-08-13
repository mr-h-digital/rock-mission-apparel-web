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
    active: product.active !== false,
  }
}

function csvToArray(value) {
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
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

  function onChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
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
      <h1 className="font-display text-5xl tracking-wide">Admin Products</h1>
      <p className="mt-3 text-apparel-muted">
        Create, edit and delete products. Image URL can point to Netlify files, Cloudinary, or other CDN assets.
      </p>

      {error && <p className="mt-5 rounded-xl border border-apparel-pink/40 bg-apparel-pink/10 p-3 text-sm font-semibold text-apparel-pink">{error}</p>}
      {success && <p className="mt-5 rounded-xl border border-apparel-teal/40 bg-apparel-teal/10 p-3 text-sm font-semibold text-apparel-teal">{success}</p>}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <section className="rounded-2xl border border-apparel-border bg-apparel-panel p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-apparel-teal">
              {editingId ? `Edit Product: ${editingId}` : 'Create Product'}
            </h2>
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

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="id" value={form.id} onChange={onChange} required className="input" placeholder="id (e.g. grace-tee)" readOnly={Boolean(editingId)} />
              <input name="name" value={form.name} onChange={onChange} required className="input" placeholder="Product name" />
              <input name="category" value={form.category} onChange={onChange} required className="input" placeholder="Category" />
              <input name="price" value={form.price} onChange={onChange} required type="number" min="1" step="0.01" className="input" placeholder="Price" />
            </div>

            <div className="space-y-2">
              <input name="imageUrl" value={form.imageUrl} onChange={onChange} className="input" placeholder="Image URL (https://...)" />
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
            <textarea name="blurb" value={form.blurb} onChange={onChange} className="input min-h-[90px]" placeholder="Product blurb" />

            <div className="grid gap-4 sm:grid-cols-2">
              <input name="art" value={form.art} onChange={onChange} className="input" placeholder="Art class (grad-drop, grad-volt, grad-fire)" />
              <input name="word" value={form.word} onChange={onChange} className="input" placeholder="Fallback display word" />
              <input name="sizes" value={form.sizes} onChange={onChange} required className="input" placeholder="Sizes CSV (S, M, L)" />
              <input name="colors" value={form.colors} onChange={onChange} required className="input" placeholder="Colors CSV (Black, White)" />
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-apparel-muted">
              <input type="checkbox" name="active" checked={form.active} onChange={onChange} />
              Active (visible in storefront)
            </label>

            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-grad-drop px-7 py-3 text-sm font-bold uppercase tracking-widest text-apparel-bg disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-apparel-border bg-apparel-panel p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-apparel-teal">Existing Products</h2>
          {loading ? (
            <p className="mt-4 text-sm text-apparel-muted">Loading products...</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {sortedProducts.map((product) => (
                <li key={product.id} className="rounded-xl border border-apparel-border bg-apparel-bg/70 p-3">
                  <p className="text-sm font-semibold text-apparel-cream">{product.name}</p>
                  <p className="text-xs text-apparel-muted">{product.id} · {product.category} · R{product.price}</p>
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
