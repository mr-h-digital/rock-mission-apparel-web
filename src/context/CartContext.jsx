import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getProductById } from '../data/products.js'

const CartContext = createContext(null)
const STORAGE_KEY = 'rm-apparel-cart'

function lineKey(productId, size, color) {
  return `${productId}__${size}__${color}`
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  }, [lines])

  function addItem(productId, size, color, qty = 1) {
    const key = lineKey(productId, size, color)
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key)
      if (existing) {
        return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l))
      }
      return [...prev, { key, productId, size, color, qty }]
    })
  }

  function updateQty(key, qty) {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty } : l)),
    )
  }

  function removeItem(key) {
    setLines((prev) => prev.filter((l) => l.key !== key))
  }

  function clearCart() {
    setLines([])
  }

  const items = useMemo(
    () =>
      lines
        .map((l) => {
          const product = getProductById(l.productId)
          if (!product) return null
          return { ...l, product }
        })
        .filter(Boolean),
    [lines],
  )

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items])
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.qty * i.product.price, 0), [items])

  const value = { items, itemCount, subtotal, addItem, updateQty, removeItem, clearCart }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
