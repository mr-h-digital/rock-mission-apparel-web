import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminPrintful() {
  const { token } = useAuth()
  const [variants, setVariants] = useState([])
  const [mappings, setMappings] = useState({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const baseUrl = import.meta.env.VITE_API_URL

  useEffect(() => {
    let active = true
    async function load() {
      if (!token || !baseUrl) return
      setLoading(true)
      setError('')
      try {
        const [variantsRes, mappingsRes] = await Promise.all([
          fetch(`${baseUrl}/api/admin/printful/variants`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${baseUrl}/api/admin/printful/mappings`, { headers: { Authorization: `Bearer ${token}` } }),
        ])
        if (!variantsRes.ok || !mappingsRes.ok) {
          setError('Unable to load Printful mapping data.')
          return
        }
        const variantsData = await variantsRes.json()
        const mappingsData = await mappingsRes.json()
        if (!active) return
        setVariants(Array.isArray(variantsData) ? variantsData : [])
        setMappings(mappingsData && typeof mappingsData === 'object' ? mappingsData : {})
      } catch (err) {
        if (active) setError(err.message || 'Unable to load Printful mapping data.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [baseUrl, token])

  const generatedJson = useMemo(() => JSON.stringify(mappings, null, 2), [mappings])
  const missing = variants.filter((variant) => !mappings[variant.key]).length

  function updateVariant(key, value) {
    setMappings((prev) => ({ ...prev, [key]: value }))
  }

  async function saveMappings() {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const entries = Object.entries(mappings)
        .filter(([, value]) => value && value.trim())
        .map(([key, printfulVariantId]) => ({ key, printfulVariantId: printfulVariantId.trim() }))
      const res = await fetch(`${baseUrl}/api/admin/printful/mappings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mappings: entries }),
      })
      if (!res.ok) {
        setError('Unable to save Printful mappings.')
        return
      }
      const data = await res.json()
      setMappings(data || {})
      setSuccess('Printful mappings saved successfully.')
    } catch (err) {
      setError(err.message || 'Unable to save Printful mappings.')
    } finally {
      setSaving(false)
    }
  }

  async function copyJson() {
    await navigator.clipboard.writeText(generatedJson)
    setSuccess('JSON copied to clipboard.')
  }

  async function downloadJson() {
    const blob = new Blob([generatedJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'printful-variant-mappings.json'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16 overflow-x-clip">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-apparel-teal">Store management</p>
      <h1 className="mt-2 font-display text-4xl tracking-wide sm:text-5xl">Printful Mapping</h1>
      <p className="mt-3 max-w-2xl text-sm text-apparel-muted sm:text-base">
        Save Printful sync IDs per variant, then export the JSON for Railway.
      </p>

      {!token && <p className="mt-4 text-sm text-apparel-muted">Sign in as an admin to manage Printful mappings.</p>}
      {loading && <p className="mt-4 text-sm text-apparel-muted">Loading variants...</p>}
      {error && <p className="mt-4 text-sm text-apparel-pink">{error}</p>}
      {success && <p className="mt-4 text-sm font-semibold text-apparel-teal">{success}</p>}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="min-w-0 rounded-2xl border border-apparel-border bg-apparel-panel p-4 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-apparel-teal">Variant mappings</h2>
              <p className="mt-1 text-xs text-apparel-muted">Enter the Printful sync variant ID for each live variant.</p>
            </div>
            <p className="text-xs font-semibold text-apparel-muted">{missing} missing</p>
          </div>

          <div className="mt-5 space-y-3">
            {variants.map((variant) => (
              <div key={variant.key} className="rounded-xl border border-apparel-border bg-apparel-bg/70 p-3">
                <div className="grid gap-3 sm:grid-cols-[1.2fr_0.7fr_0.7fr] sm:items-center">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-apparel-cream">{variant.productName}</p>
                    <p className="truncate text-xs text-apparel-muted">{variant.productId}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-apparel-muted sm:grid-cols-1">
                    <p>{variant.size}</p>
                    <p>{variant.color}</p>
                  </div>
                  <label className="block">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-apparel-muted sm:hidden">Printful ID</span>
                    <input
                      value={mappings[variant.key] || ''}
                      onChange={(event) => updateVariant(variant.key, event.target.value)}
                      className="input w-full"
                      placeholder="Printful sync variant ID"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-apparel-border bg-apparel-panel p-4 sm:p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-apparel-teal">Generated JSON</h2>
          <p className="mt-2 text-xs text-apparel-muted">Copy or download the mapping file for Railway.</p>
          <textarea readOnly value={generatedJson} className="input mt-4 min-h-[320px] w-full max-w-full font-mono text-xs" />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={copyJson} className="rounded-full bg-grad-drop px-4 py-3 text-xs font-bold uppercase tracking-widest text-apparel-bg">
              Copy JSON
            </button>
            <button type="button" onClick={downloadJson} className="rounded-full border border-apparel-border px-4 py-3 text-xs font-bold uppercase tracking-widest text-apparel-cream">
              Download
            </button>
            <button type="button" onClick={saveMappings} disabled={saving} className="rounded-full border border-apparel-teal px-4 py-3 text-xs font-bold uppercase tracking-widest text-apparel-teal disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-apparel-muted">
            Paste the JSON into <code className="rounded bg-apparel-bg px-1.5 py-0.5">PRINTFUL_PRODUCT_VARIANT_MAP_JSON</code> and then enable <code className="rounded bg-apparel-bg px-1.5 py-0.5">PRINTFUL_ENABLED=true</code>.
          </p>
        </section>
      </div>
    </div>
  )
}
