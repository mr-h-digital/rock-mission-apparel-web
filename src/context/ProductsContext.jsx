import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { listProducts } from '../lib/api.js'

const ProductsContext = createContext(null)

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProducts = useCallback(async (activeGuard = () => true) => {
    setError('')
    setLoading(true)
    try {
      const data = await listProducts()
      if (!activeGuard()) return
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      if (!activeGuard()) return
      setError(err.message || 'Unable to load products right now.')
    } finally {
      if (activeGuard()) setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true

    function isActive() {
      return active
    }

    loadProducts(isActive)
    return () => {
      active = false
    }
  }, [loadProducts])

  const refreshProducts = useCallback(async () => {
    await loadProducts(() => true)
  }, [loadProducts])

  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category).filter(Boolean))
    return Array.from(unique).sort((a, b) => a.localeCompare(b))
  }, [products])
  const productCountsByCategory = useMemo(() => {
    const counts = {}
    products.forEach((product) => {
      if (!product.category) return
      counts[product.category] = (counts[product.category] || 0) + 1
    })
    return counts
  }, [products])

  const value = useMemo(() => ({
    products,
    categories,
    productCountsByCategory,
    loading,
    error,
    refreshProducts,
  }), [products, categories, productCountsByCategory, loading, error, refreshProducts])

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProducts must be used within ProductsProvider')
  }
  return context
}
