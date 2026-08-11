const API_URL = import.meta.env.VITE_API_URL

export function isCheckoutConfigured() {
  return Boolean(API_URL)
}

// Creates an order on the backend and returns the PayFast redirect payload:
// { processUrl, fields } - the caller builds and auto-submits a POST form to
// processUrl with fields (see Checkout.jsx). Throws on any non-2xx response.
export async function createOrder(payload) {
  if (!API_URL) {
    throw new Error('Checkout is not connected to a store backend yet.')
  }

  const res = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Order creation failed (${res.status})`)
  }

  return res.json()
}
