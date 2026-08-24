import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getProductById } from '../data/products.js'
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
  const [productIds, setProductIds] = useState(readStoredProductIds)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productIds))
  }, [productIds])

  function toggleItem(productId) {
    setProductIds((previous) => (
      previous.includes(productId)
        ? previous.filter((id) => id !== productId)
        : [...previous, productId]
    ))
  }

  function removeItem(productId) {
    setProductIds((previous) => previous.filter((id) => id !== productId))
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