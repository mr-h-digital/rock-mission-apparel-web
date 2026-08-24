const API_URL = import.meta.env.VITE_API_URL

const AUTH_REGISTER_PATH = import.meta.env.VITE_AUTH_REGISTER_PATH || '/api/auth/register'
const AUTH_LOGIN_PATH = import.meta.env.VITE_AUTH_LOGIN_PATH || '/api/auth/login'
const AUTH_ME_PATH = import.meta.env.VITE_AUTH_ME_PATH || '/api/auth/me'
const AUTH_UPDATE_PROFILE_PATH = import.meta.env.VITE_AUTH_UPDATE_PROFILE_PATH || '/api/auth/me'
const AUTH_FORGOT_PASSWORD_PATH = import.meta.env.VITE_AUTH_FORGOT_PASSWORD_PATH || '/api/auth/forgot-password'
const AUTH_RESET_PASSWORD_PATH = import.meta.env.VITE_AUTH_RESET_PASSWORD_PATH || '/api/auth/reset-password'
const AUTH_FORGOT_USERNAME_PATH = import.meta.env.VITE_AUTH_FORGOT_USERNAME_PATH || '/api/auth/forgot-username'
const ADMIN_PRODUCTS_PATH = import.meta.env.VITE_ADMIN_PRODUCTS_PATH || '/api/admin/products'
const WISHLIST_PATH = import.meta.env.VITE_WISHLIST_PATH || '/api/wishlist'

function getErrorMessage(status, fallback, bodyText) {
  if (bodyText) return bodyText
  return `${fallback} (${status})`
}

async function readErrorText(res) {
  return res.text().then((t) => t.trim()).catch(() => '')
}

function normalizeAuthPayload(data) {
  const token = data?.token || data?.accessToken || data?.jwt || null
  const user = data?.user || {
    id: data?.id,
    firstName: data?.firstName,
    lastName: data?.lastName,
    email: data?.email,
  }

  if (!token) {
    throw new Error('Authentication response did not include a token.')
  }

  return { token, user }
}

function normalizeImageUrl(value) {
  if (!value || typeof value !== 'string') return value

  const url = value.trim()
  if (!url) return url

  if (API_URL) {
    try {
      const parsed = new URL(url)
      const apiOrigin = new URL(API_URL).origin
      if (parsed.origin === apiOrigin && parsed.protocol === 'http:') {
        parsed.protocol = 'https:'
        return parsed.toString()
      }
      if (parsed.hostname.endsWith('storageapi.dev')) {
        const segments = parsed.pathname.split('/').filter(Boolean)
        const productsIndex = segments.indexOf('products')
        const filename = productsIndex >= 0 ? segments[productsIndex + 1] : ''
        if (filename) {
          return `${API_URL}/api/media/products/${filename}`
        }
      }
    } catch {
      // Continue with string-based normalization if URL parsing fails.
    }
  }

  // Repair malformed protocol strings such as https:/host/path.
  if (/^https?:\/[^/]/i.test(url)) {
    return url.replace(/^http:\//i, 'http://').replace(/^https:\//i, 'https://')
  }

  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith('//')) return `https:${url}`
  if (/^[a-z0-9.-]+\.[a-z]{2,}(\/|$)/i.test(url)) return `https://${url}`

  return url
}

function normalizeProductImage(product) {
  if (!product || typeof product !== 'object') return product
  return {
    ...product,
    imageUrl: normalizeImageUrl(product.imageUrl),
  }
}

export function isAuthConfigured() {
  return Boolean(API_URL)
}

export async function registerUser(payload) {
  if (!API_URL) {
    throw new Error('Sign up is not connected to a store backend yet.')
  }

  const res = await fetch(`${API_URL}${AUTH_REGISTER_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await readErrorText(res)
    throw new Error(getErrorMessage(res.status, 'Sign up failed', text))
  }

  const data = await res.json()
  return normalizeAuthPayload(data)
}

export async function loginUser(payload) {
  if (!API_URL) {
    throw new Error('Sign in is not connected to a store backend yet.')
  }

  const res = await fetch(`${API_URL}${AUTH_LOGIN_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await readErrorText(res)
    throw new Error(getErrorMessage(res.status, 'Sign in failed', text))
  }

  const data = await res.json()
  return normalizeAuthPayload(data)
}

export async function getCurrentUser(token) {
  if (!API_URL || !token) return null

  const res = await fetch(`${API_URL}${AUTH_ME_PATH}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    return null
  }

  return res.json()
}

export async function updateCurrentUser(token, payload) {
  if (!API_URL || !token) {
    throw new Error('Account settings are not connected to a store backend yet.')
  }

  const res = await fetch(`${API_URL}${AUTH_UPDATE_PROFILE_PATH}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await readErrorText(res)
    throw new Error(getErrorMessage(res.status, 'Profile update failed', text))
  }

  return res.json()
}

export async function mergeWishlist(token, productIds) {
  if (!API_URL || !token) {
    throw new Error('Wishlist syncing is not connected to a store backend yet.')
  }

  const res = await fetch(`${API_URL}${WISHLIST_PATH}/merge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productIds }),
  })

  if (!res.ok) {
    const text = await readErrorText(res)
    throw new Error(getErrorMessage(res.status, 'Unable to sync wishlist', text))
  }

  const data = await res.json()
  return Array.isArray(data) ? data : []
}

export async function addWishlistItem(token, productId) {
  if (!API_URL || !token) return null

  const res = await fetch(`${API_URL}${WISHLIST_PATH}/${encodeURIComponent(productId)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    const text = await readErrorText(res)
    throw new Error(getErrorMessage(res.status, 'Unable to save wishlist item', text))
  }

  const data = await res.json()
  return Array.isArray(data) ? data : []
}

export async function removeWishlistItem(token, productId) {
  if (!API_URL || !token) return

  const res = await fetch(`${API_URL}${WISHLIST_PATH}/${encodeURIComponent(productId)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    const text = await readErrorText(res)
    throw new Error(getErrorMessage(res.status, 'Unable to remove wishlist item', text))
  }
}

export async function requestPasswordReset(payload) {
  if (!API_URL) {
    throw new Error('Password recovery is not connected to a store backend yet.')
  }

  const res = await fetch(`${API_URL}${AUTH_FORGOT_PASSWORD_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await readErrorText(res)
    throw new Error(getErrorMessage(res.status, 'Password reset request failed', text))
  }

  return res.json()
}

export async function submitPasswordReset(payload) {
  if (!API_URL) {
    throw new Error('Password recovery is not connected to a store backend yet.')
  }

  const res = await fetch(`${API_URL}${AUTH_RESET_PASSWORD_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await readErrorText(res)
    throw new Error(getErrorMessage(res.status, 'Password reset failed', text))
  }

  return res.json()
}

export async function requestUsernameRecovery(payload) {
  if (!API_URL) {
    throw new Error('Username recovery is not connected to a store backend yet.')
  }

  const res = await fetch(`${API_URL}${AUTH_FORGOT_USERNAME_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    if (res.status === 404 || res.status === 405) {
      throw new Error('Username recovery is not enabled on this backend yet.')
    }
    const text = await readErrorText(res)
    throw new Error(getErrorMessage(res.status, 'Username recovery request failed', text))
  }

  return res.json()
}

export function isCheckoutConfigured() {
  return Boolean(API_URL)
}

// Creates an order on the backend and returns the PayFast redirect payload:
// { processUrl, fields } - the caller builds and auto-submits a POST form to
// processUrl with fields (see Checkout.jsx). Throws on any non-2xx response.
export async function createOrder(payload, token) {
  if (!API_URL) {
    throw new Error('Checkout is not connected to a store backend yet.')
  }

  const res = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Order creation failed (${res.status})`)
  }

  return res.json()
}

export async function listMyOrders(token) {
  if (!API_URL || !token) {
    throw new Error('Order history is not connected to a store backend yet.')
  }

  const res = await fetch(`${API_URL}/api/orders/mine`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    const text = await readErrorText(res)
    throw new Error(getErrorMessage(res.status, 'Unable to load order history', text))
  }

  const data = await res.json()
  return Array.isArray(data) ? data : []
}

export async function getOrderStatus(orderId) {
  if (!API_URL) {
    throw new Error('Order tracking is not connected to a store backend yet.')
  }

  const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
    method: 'GET',
  })

  if (!res.ok) {
    const text = await readErrorText(res)
    throw new Error(getErrorMessage(res.status, 'Unable to fetch order status', text))
  }

  return res.json()
}

export async function listProducts() {
  if (!API_URL) {
    throw new Error('Products are not connected to a store backend yet.')
  }

  const res = await fetch(`${API_URL}/api/products`, { method: 'GET' })
  if (!res.ok) {
    const text = await readErrorText(res)
    throw new Error(getErrorMessage(res.status, 'Unable to load products', text))
  }
  const data = await res.json()
  return Array.isArray(data) ? data.map(normalizeProductImage) : []
}

export async function getProduct(productId) {
  if (!API_URL) {
    throw new Error('Products are not connected to a store backend yet.')
  }

  const res = await fetch(`${API_URL}/api/products/${productId}`, { method: 'GET' })
  if (!res.ok) {
    const text = await readErrorText(res)
    throw new Error(getErrorMessage(res.status, 'Unable to load product', text))
  }
  const data = await res.json()
  return normalizeProductImage(data)
}

export async function listAdminProducts(token) {
  if (!API_URL || !token) {
    throw new Error('Admin products are not connected to a store backend yet.')
  }

  const res = await fetch(`${API_URL}${ADMIN_PRODUCTS_PATH}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    const text = await readErrorText(res)
    throw new Error(getErrorMessage(res.status, 'Unable to load admin products', text))
  }

  const data = await res.json()
  return Array.isArray(data) ? data.map(normalizeProductImage) : []
}

export async function listAdminOrders(token) {
  if (!API_URL || !token) {
    throw new Error('Admin orders are not connected to a store backend yet.')
  }

  const res = await fetch(`${API_URL}/api/admin/orders`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    const text = await readErrorText(res)
    throw new Error(getErrorMessage(res.status, 'Unable to load admin orders', text))
  }

  return res.json()
}

export async function cancelAdminOrder(token, orderId) {
  if (!API_URL || !token) {
    throw new Error('Admin orders are not connected to a store backend yet.')
  }

  const res = await fetch(`${API_URL}/api/admin/orders/${orderId}/cancel`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    const text = await readErrorText(res)
    throw new Error(getErrorMessage(res.status, 'Unable to cancel order', text))
  }

  return res.json()
}

export async function createAdminProduct(token, payload) {
  if (!API_URL || !token) {
    throw new Error('Admin products are not connected to a store backend yet.')
  }

  const res = await fetch(`${API_URL}${ADMIN_PRODUCTS_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await readErrorText(res)
    throw new Error(getErrorMessage(res.status, 'Unable to create product', text))
  }

  const data = await res.json()
  return normalizeProductImage(data)
}

export async function updateAdminProduct(token, productId, payload) {
  if (!API_URL || !token) {
    throw new Error('Admin products are not connected to a store backend yet.')
  }

  const res = await fetch(`${API_URL}${ADMIN_PRODUCTS_PATH}/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await readErrorText(res)
    throw new Error(getErrorMessage(res.status, 'Unable to update product', text))
  }

  const data = await res.json()
  return normalizeProductImage(data)
}

export async function deleteAdminProduct(token, productId) {
  if (!API_URL || !token) {
    throw new Error('Admin products are not connected to a store backend yet.')
  }

  const res = await fetch(`${API_URL}${ADMIN_PRODUCTS_PATH}/${productId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    const text = await readErrorText(res)
    throw new Error(getErrorMessage(res.status, 'Unable to delete product', text))
  }
}

export async function uploadAdminProductImage(token, file) {
  if (!API_URL || !token) {
    throw new Error('Image uploads are not connected to a store backend yet.')
  }

  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_URL}/api/admin/uploads/images`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!res.ok) {
    const text = await readErrorText(res)
    throw new Error(getErrorMessage(res.status, 'Unable to upload image', text))
  }

  return res.json()
}
