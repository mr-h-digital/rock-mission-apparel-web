import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getProductById } from '../data/products.js'
import { addWishlistItem, mergeWishlist, removeWishlistItem } from '../lib/api.js'
import { useAuth } from './AuthContext.jsx'
import { useProducts } from './ProductsContext.jsx'

const WishlistContext = createContext(null)
const STORAGE_KEY = 'rm-apparel-wishlist'

function readStoredProductIds() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(stored) ? [...new Set(stored.filter((id) => typeof id === 'string'))] : []
  } catch {
    return []
  }
}

export function WishlistProvider({ children }) {
  const { products } = useProducts()
  const { token } = useAuth()
  const [productIds, setProductIds] = useState(readStoredProductIds)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productIds))
  }, [productIds])

  useEffect(() => {
    if (!token) return

    let active = true

    async function syncWishlist() {
      try {
        const mergedProductIds = await mergeWishlist(token, productIds)
        if (active) setProductIds(mergedProductIds)
      } catch {
        // Keep the browser wishlist available if the account sync is temporarily unavailable.
      }
    }

    syncWishlist()
    return () => {
      active = false
    }
  }, [token])

  function toggleItem(productId) {
    const saved = productIds.includes(productId)
    setProductIds((previous) => saved ? previous.filter((id) => id !== productId) : [...previous, productId])

    if (token) {
      const request = saved ? removeWishlistItem(token, productId) : addWishlistItem(token, productId)
      request.then((serverProductIds) => {
        if (serverProductIds) setProductIds(serverProductIds)
      }).catch(() => {
        // Local storage remains the fallback when a request cannot be completed.
      })
    }
  }

  function removeItem(productId) {
    setProductIds((previous) => previous.filter((id) => id !== productId))
    if (token) {
      removeWishlistItem(token, productId).catch(() => {
        // Local storage remains the fallback when a request cannot be completed.
      })
    }
  }

  const items = useMemo(() => (
    productIds
      .map((productId) => products.find((product) => product.id === productId) || getProductById(productId))
      .filter(Boolean)
  ), [productIds, products])

  const value = useMemo(() => ({
    items,
    itemCount: items.length,
    isWishlisted: (productId) => productIds.includes(productId),
    toggleItem,
    removeItem,
  }), [items, productIds])

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used within WishlistProvider')
  return context
}