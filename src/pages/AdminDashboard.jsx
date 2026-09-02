import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function thirtyDaysAgoIso() {
  const date = new Date()
  date.setDate(date.getDate() - 30)
  return date.toISOString().slice(0, 10)
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(Number(value || 0))
}

function percent(value, total) {
  if (!total) return '0%'
  return `${Math.round((Number(value) / Number(total)) * 100)}%`
}

export default function AdminDashboard() {
  const { token } = useAuth()
  const [from, setFrom] = useState(thirtyDaysAgoIso())
  const [to, setTo] = useState(todayIso())
  const [summary, setSummary] = useState(null)
  const [trends, setTrends] = useState(null)
  const [behavior, setBehavior] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_API_URL
  const query = useMemo(() => new URLSearchParams({ from, to }).toString(), [from, to])
  const summaryUrl = `${baseUrl}/api/admin/reports/summary?${query}`
  const csvUrl = `${baseUrl}/api/admin/reports/summary.csv?${query}`
  const pdfUrl = `${baseUrl}/api/admin/reports/summary.pdf?${query}`
  const trendsUrl = `${baseUrl}/api/admin/reports/trends?${query}`
  const behaviorUrl = `${baseUrl}/api/admin/reports/behavior?${query}`

  useEffect(() => {
    if (!token || !baseUrl) return

    const controller = new AbortController()
    async function load() {
      setLoading(true)
      setError('')
      try {
        const [summaryRes, trendsRes, behaviorRes] = await Promise.all([
          fetch(summaryUrl, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal }),
          fetch(trendsUrl, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal }),
          fetch(behaviorUrl, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal }),
        ])
        if (!summaryRes.ok || !trendsRes.ok || !behaviorRes.ok) {
          setError('Unable to load dashboard analytics.')
          return
        }
        setSummary(await summaryRes.json())
        setTrends(await trendsRes.json())
        setBehavior(await behaviorRes.json())
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [baseUrl, behaviorUrl, query, summaryUrl, token, trendsUrl])

  const maxRevenue = Math.max(...((trends?.points || []).map((point) => Number(point.revenue || 0))), 1)
  const totalStatuses = behavior
    ? behavior.statusBreakdown.pending + behavior.statusBreakdown.paid + behavior.statusBreakdown.fulfilling + behavior.statusBreakdown.shipped + behavior.statusBreakdown.delivered + behavior.statusBreakdown.cancelled
    : 0

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-apparel-teal">Admin reporting</p>
      <h1 className="mt-2 font-display text-4xl tracking-wide sm:text-5xl">Dashboard</h1>
      <p className="mt-3 max-w-2xl text-apparel-muted">
        Finance, purchase, and customer reporting live here. Use date filters to narrow the reporting window.
      </p>

      <section className="mt-8 rounded-2xl border border-apparel-border bg-apparel-panel p-4 sm:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2 text-sm">
            <span className="text-apparel-muted">From</span>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="input" />
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-apparel-muted">To</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="input" />
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <a href={summaryUrl} target="_blank" rel="noreferrer" className="rounded-full border border-apparel-teal px-4 py-3 text-xs font-bold uppercase tracking-widest text-apparel-teal">
              View JSON
            </a>
            <a href={csvUrl} target="_blank" rel="noreferrer" className="rounded-full bg-grad-drop px-4 py-3 text-xs font-bold uppercase tracking-widest text-apparel-bg">
              Download CSV
            </a>
            <a href={pdfUrl} target="_blank" rel="noreferrer" className="rounded-full border border-apparel-border px-4 py-3 text-xs font-bold uppercase tracking-widest text-apparel-cream">
              Download PDF
            </a>
          </div>
        </div>

        {!token && <p className="mt-4 text-sm text-apparel-muted">Sign in as an admin to access the report endpoints.</p>}
        {loading && <p className="mt-4 text-sm text-apparel-muted">Loading report data...</p>}
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </section>

      {summary && (
        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['Revenue', formatCurrency(summary.revenue)],
            ['Paid orders', summary.orders],
            ['Customers', summary.customers],
            ['Cancelled', summary.cancelledOrders],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-apparel-border bg-apparel-panel p-5">
              <p className="text-xs uppercase tracking-widest text-apparel-muted">{label}</p>
              <p className="mt-2 text-2xl font-bold text-apparel-cream">{value}</p>
            </div>
          ))}
        </section>
      )}

      {trends?.points?.length > 0 && (
        <section className="mt-8 rounded-2xl border border-apparel-border bg-apparel-panel p-4 sm:p-6">
          <h2 className="text-xl font-bold">Revenue trend</h2>
          <div className="mt-6 grid gap-3">
            {trends.points.slice(-14).map((point) => (
              <div key={point.date} className="grid grid-cols-[86px_1fr_72px] items-center gap-3 text-xs sm:grid-cols-[110px_1fr_80px] sm:text-sm">
                <span className="text-apparel-muted">{point.date}</span>
                <div className="h-3 overflow-hidden rounded-full bg-apparel-border">
                  <div className="h-full rounded-full bg-grad-drop" style={{ width: `${(Number(point.revenue || 0) / maxRevenue) * 100}%` }} />
                </div>
                <span className="text-right text-apparel-cream">{formatCurrency(point.revenue)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {behavior && (
        <>
          <section className="mt-8 grid gap-4 rounded-2xl border border-apparel-border bg-apparel-panel p-4 sm:p-6 lg:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold">Order status mix</h2>
              <div className="mt-5 space-y-3">
                {[
                  ['Pending', behavior.statusBreakdown.pending],
                  ['Paid', behavior.statusBreakdown.paid],
                  ['Fulfilling', behavior.statusBreakdown.fulfilling],
                  ['Shipped', behavior.statusBreakdown.shipped],
                  ['Delivered', behavior.statusBreakdown.delivered],
                  ['Cancelled', behavior.statusBreakdown.cancelled],
                ].map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[72px_1fr_44px] items-center gap-3 text-xs sm:grid-cols-[90px_1fr_60px] sm:text-sm">
                    <span className="text-apparel-muted">{label}</span>
                    <div className="h-3 overflow-hidden rounded-full bg-apparel-border">
                      <div className="h-full rounded-full bg-apparel-teal" style={{ width: percent(value, totalStatuses) }} />
                    </div>
                    <span className="text-right text-apparel-cream">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold">Recent customer activity</h2>
              <div className="mt-5 space-y-3">
                {behavior.recentCustomers.map((customer) => (
                  <div key={customer.email} className="rounded-xl border border-apparel-border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-apparel-cream">{customer.name || customer.email}</p>
                        <p className="text-xs text-apparel-muted">{customer.email}</p>
                      </div>
                      <p className="text-right text-sm text-apparel-cream">
                        {customer.orders} orders
                        <br />
                        {formatCurrency(customer.revenue)}
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-apparel-muted">Last order: {customer.lastOrderDate}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-apparel-border bg-apparel-panel p-4 sm:p-6">
            <h2 className="text-xl font-bold">Top products</h2>
            <div className="mt-5 grid gap-3">
              {behavior.topProducts.map((product, index) => (
                <div key={`${product.productId}-${index}`} className="grid gap-2 rounded-xl border border-apparel-border p-4 md:grid-cols-[1fr_140px_120px] md:items-center">
                  <div>
                    <p className="font-semibold text-apparel-cream">{product.productName || product.productId}</p>
                    <p className="text-xs text-apparel-muted">{product.productId}</p>
                  </div>
                  <p className="text-sm text-apparel-muted">Qty {product.quantity}</p>
                  <p className="text-sm font-semibold text-apparel-cream">{formatCurrency(product.revenue)}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
