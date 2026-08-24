import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { cancelAdminOrder, listAdminOrders, updateAdminOrderFulfillment } from '../lib/api.js'

const statusStyles = {
  PENDING: 'bg-apparel-volt/10 text-apparel-volt',
  PAID: 'bg-apparel-teal/10 text-apparel-teal',
  FULFILLING: 'bg-apparel-volt/10 text-apparel-volt',
  SHIPPED: 'bg-apparel-teal/10 text-apparel-teal',
  DELIVERED: 'bg-apparel-teal/10 text-apparel-teal',
  FAILED: 'bg-apparel-border text-apparel-muted',
  CANCELLED: 'bg-apparel-pink/10 text-apparel-pinkLight',
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-ZA', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

export default function AdminOrders() {
  const { token } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState('')
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [fulfillmentForms, setFulfillmentForms] = useState({})

  async function loadOrders() {
    setLoading(true)
    setError('')
    try {
      const data = await listAdminOrders(token)
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Unable to load orders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [token])

  const filteredOrders = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return orders
    return orders.filter((order) => [
      order.id,
      order.email,
      `${order.firstName} ${order.lastName}`,
      order.payfastPaymentId,
      order.status,
    ].some((value) => value?.toLowerCase().includes(normalized)))
  }, [orders, query])

  async function onCancel(order) {
    const message = order.status === 'PAID'
      ? 'Cancel this paid order and return its items to inventory? Process any customer refund in PayFast separately.'
      : 'Cancel this order and release any reserved stock?'
    if (!window.confirm(message)) return

    setBusyId(order.id)
    setError('')
    setSuccess('')
    try {
      const updated = await cancelAdminOrder(token, order.id)
      setOrders((current) => current.map((item) => item.id === updated.id ? updated : item))
      setSuccess(`Order ${order.id.slice(0, 8)} cancelled. Inventory was updated.`)
    } catch (err) {
      setError(err.message || 'Unable to cancel order.')
    } finally {
      setBusyId('')
    }
  }

  function nextFulfillmentStatus(status) {
    if (status === 'PAID') return 'FULFILLING'
    if (status === 'FULFILLING') return 'SHIPPED'
    if (status === 'SHIPPED') return 'DELIVERED'
    return ''
  }

  async function onUpdateFulfillment(order) {
    const status = nextFulfillmentStatus(order.status)
    if (!status) return

    setBusyId(order.id)
    setError('')
    setSuccess('')
    try {
      const details = fulfillmentForms[order.id] || {}
      const updated = await updateAdminOrderFulfillment(token, order.id, {
        status,
        trackingCarrier: details.trackingCarrier || order.trackingCarrier || '',
        trackingNumber: details.trackingNumber || order.trackingNumber || '',
      })
      setOrders((current) => current.map((item) => item.id === updated.id ? updated : item))
      setSuccess(`Order ${order.id.slice(0, 8)} marked ${status.toLowerCase()}.`)
    } catch (err) {
      setError(err.message || 'Unable to update fulfilment.')
    } finally {
      setBusyId('')
    }
  }

  function updateFulfillmentField(orderId, field, value) {
    setFulfillmentForms((current) => ({
      ...current,
      [orderId]: { ...current[orderId], [field]: value },
    }))
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-apparel-teal">Store operations</p>
          <h1 className="mt-2 font-display text-5xl tracking-wide">Orders</h1>
          <p className="mt-3 max-w-2xl text-apparel-muted">Review payments and keep inventory accurate when an order is cancelled.</p>
        </div>
        <button type="button" onClick={loadOrders} className="self-start rounded-full border border-apparel-border px-4 py-2 text-xs font-bold uppercase tracking-widest text-apparel-cream hover:border-apparel-teal sm:self-auto">Refresh</button>
      </div>

      {error && <p className="mt-6 rounded-xl border border-apparel-pink/40 bg-apparel-pink/10 p-3 text-sm font-semibold text-apparel-pink">{error}</p>}
      {success && <p className="mt-6 rounded-xl border border-apparel-teal/40 bg-apparel-teal/10 p-3 text-sm font-semibold text-apparel-teal">{success}</p>}

      <section className="mt-8 rounded-2xl border border-apparel-border bg-apparel-panel p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-apparel-teal">Order history</h2>
            <p className="mt-1 text-xs text-apparel-muted">{filteredOrders.length} of {orders.length} orders shown</p>
          </div>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} className="input sm:max-w-xs" placeholder="Search order or customer" aria-label="Search orders" />
        </div>

        {loading ? <p className="mt-6 text-sm text-apparel-muted">Loading orders...</p> : filteredOrders.length === 0 ? (
          <p className="mt-6 rounded-xl border border-apparel-border bg-apparel-bg/60 p-5 text-sm text-apparel-muted">No orders match this search.</p>
        ) : (
          <div className="mt-6 space-y-3">
            {filteredOrders.map((order) => (
              <article key={order.id} className="rounded-xl border border-apparel-border bg-apparel-bg/60 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-apparel-cream">#{order.id.slice(0, 8)}</h3>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${statusStyles[order.status] || statusStyles.FAILED}`}>{order.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-apparel-muted">{order.firstName} {order.lastName} · {order.email}</p>
                    <p className="mt-1 text-xs text-apparel-muted">{formatDate(order.createdAt)}{order.payfastPaymentId ? ` · PayFast ${order.payfastPaymentId}` : ''}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4 lg:justify-end">
                    <p className="text-lg font-bold text-apparel-teal">R{order.totalAmount}</p>
                    {(order.status === 'PAID' || order.status === 'PENDING') && (
                      <button type="button" onClick={() => onCancel(order)} disabled={busyId === order.id} className="rounded-full border border-apparel-pink/60 px-3 py-2 text-xs font-bold uppercase tracking-wider text-apparel-pink hover:bg-apparel-pink/10 disabled:opacity-50">
                        {busyId === order.id ? 'Updating...' : 'Cancel order'}
                      </button>
                    )}
                  </div>
                </div>
                <ul className="mt-4 grid gap-2 border-t border-apparel-border pt-3 text-xs text-apparel-muted sm:grid-cols-2">
                  {order.items.map((item) => <li key={`${order.id}-${item.productId}-${item.size}-${item.color}`}>{item.quantity}× {item.productName} · {item.size}/{item.color}</li>)}
                </ul>
                {nextFulfillmentStatus(order.status) && (
                  <div className="mt-4 flex flex-wrap items-end gap-2 border-t border-apparel-border pt-4">
                    {order.status === 'FULFILLING' && (
                      <>
                        <input
                          value={fulfillmentForms[order.id]?.trackingCarrier ?? order.trackingCarrier ?? ''}
                          onChange={(event) => updateFulfillmentField(order.id, 'trackingCarrier', event.target.value)}
                          className="input min-w-40 flex-1"
                          placeholder="Carrier"
                          aria-label="Tracking carrier"
                        />
                        <input
                          value={fulfillmentForms[order.id]?.trackingNumber ?? order.trackingNumber ?? ''}
                          onChange={(event) => updateFulfillmentField(order.id, 'trackingNumber', event.target.value)}
                          className="input min-w-48 flex-[1.5]"
                          placeholder="Tracking number"
                          aria-label="Tracking number"
                        />
                      </>
                    )}
                    <button type="button" onClick={() => onUpdateFulfillment(order)} disabled={busyId === order.id} className="rounded-full border border-apparel-teal px-3 py-2 text-xs font-bold uppercase tracking-wider text-apparel-teal hover:bg-apparel-teal hover:text-apparel-bg disabled:opacity-50">
                      {busyId === order.id ? 'Updating...' : order.status === 'PAID' ? 'Start fulfilment' : order.status === 'FULFILLING' ? 'Mark shipped' : 'Mark delivered'}
                    </button>
                  </div>
                )}
                {order.trackingNumber && (
                  <p className="mt-3 text-xs font-semibold text-apparel-teal">Tracking: {order.trackingCarrier ? `${order.trackingCarrier} · ` : ''}{order.trackingNumber}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
