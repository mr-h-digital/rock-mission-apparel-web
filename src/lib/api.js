const API_URL = import.meta.env.VITE_API_URL

const AUTH_REGISTER_PATH = import.meta.env.VITE_AUTH_REGISTER_PATH || '/api/auth/register'
const AUTH_LOGIN_PATH = import.meta.env.VITE_AUTH_LOGIN_PATH || '/api/auth/login'
const AUTH_ME_PATH = import.meta.env.VITE_AUTH_ME_PATH || '/api/auth/me'
const AUTH_UPDATE_PROFILE_PATH = import.meta.env.VITE_AUTH_UPDATE_PROFILE_PATH || '/api/auth/me'
const AUTH_FORGOT_PASSWORD_PATH = import.meta.env.VITE_AUTH_FORGOT_PASSWORD_PATH || '/api/auth/forgot-password'
const AUTH_RESET_PASSWORD_PATH = import.meta.env.VITE_AUTH_RESET_PASSWORD_PATH || '/api/auth/reset-password'
const AUTH_FORGOT_USERNAME_PATH = import.meta.env.VITE_AUTH_FORGOT_USERNAME_PATH || '/api/auth/forgot-username'

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
