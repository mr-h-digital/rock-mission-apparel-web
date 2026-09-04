import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import logoWhiteText from '../assets/logos/kingdom-drip-logo-transparent-bg-white-text.png'

const linkClass = ({ isActive }) =>
  `text-sm font-semibold tracking-wide uppercase transition-colors ${
    isActive ? 'text-apparel-teal' : 'text-apparel-cream/80 hover:text-apparel-cream'
  }`

export default function Nav() {
  const { itemCount } = useCart()
  const { itemCount: wishlistCount } = useWishlist()
  const { isAuthenticated, signOut, user } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const tickerItems = [
    'Free shipping over R850',
    '100% of profit funds Rock Mission outreach',
    'New drops monthly',
  ]
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim()

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isMobileMenuOpen])

  const closeMobileMenu = () => setIsMobileMenuOpen(false)
  const handleSignOut = () => {
    signOut()
    closeMobileMenu()
  }

  const mobileMenuLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/shop', label: 'Shop' },
    { to: '/wishlist', label: 'Wishlist' },
    isAuthenticated
      ? { to: '/account', label: 'Account' }
      : { to: '/sign-in', label: 'Sign In' },
    ...(isAuthenticated ? [{ to: '/admin', label: 'Admin' }] : []),
    ...(isAuthenticated ? [{ to: '/admin/products', label: 'Products' }] : []),
    ...(isAuthenticated ? [{ to: '/admin/orders', label: 'Orders' }] : []),
  ]

  return (
    <>
      <header className={`sticky top-0 border-b border-apparel-border bg-apparel-bg/90 backdrop-blur ${isMobileMenuOpen ? 'z-[75]' : 'z-40'}`}>
        <div className="marquee-bar overflow-hidden border-b border-apparel-border bg-apparel-panel/60 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-apparel-teal">
          <div className="marquee-track">
            {Array(4).fill(0).map((_, loopIndex) => (
              tickerItems.map((item, itemIndex) => (
                <span key={`${loopIndex}-${itemIndex}`} className="mr-12 shrink-0 whitespace-nowrap">{item}</span>
              ))
            ))}
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-6">
        <Link to="/" className="inline-flex items-center" aria-label="Kingdom Drip Home">
          <img
            src={logoWhiteText}
            alt="Kingdom Drip"
            className="h-10 w-auto sm:h-12"
            loading="eager"
          />
        </Link>
        <nav className="hidden items-center gap-6 lg:gap-8 md:flex">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/shop" className={linkClass}>Shop</NavLink>
          <NavLink to="/wishlist" className={linkClass}>Wishlist</NavLink>
          {isAuthenticated ? (
            <NavLink to="/account" className={linkClass}>Account</NavLink>
          ) : (
            <NavLink to="/sign-in" className={linkClass}>Sign In</NavLink>
          )}
          {isAuthenticated && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
          {isAuthenticated && <NavLink to="/admin/products" className={linkClass}>Products</NavLink>}
          {isAuthenticated && <NavLink to="/admin/orders" className={linkClass}>Orders</NavLink>}
          <a
            href="https://rockmission.co.za"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold uppercase tracking-wide text-apparel-cream/80 hover:text-apparel-cream"
          >
            The Mission
          </a>
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          {isAuthenticated && displayName && (
            <p className="hidden text-right text-xs font-semibold uppercase tracking-wide text-apparel-teal lg:block">
              Welcome back, {displayName}
            </p>
          )}
          <button
            type="button"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-menu"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-apparel-border bg-apparel-panel text-apparel-cream md:hidden ${
              isMobileMenuOpen ? 'fixed right-4 top-4 z-[80]' : 'relative z-[60]'
            }`}
          >
            <span className="sr-only">Toggle menu</span>
            <span
              className={`absolute h-0.5 w-5 bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isMobileMenuOpen ? 'translate-y-0 rotate-45' : '-translate-y-1.5 rotate-0'
              }`}
            />
            <span
              className={`absolute h-0.5 w-5 bg-current transition-opacity duration-250 ease-out ${
                isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute h-0.5 w-5 bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isMobileMenuOpen ? 'translate-y-0 -rotate-45' : 'translate-y-1.5 rotate-0'
              }`}
            />
          </button>
          <Link
            to="/wishlist"
            aria-label="Open wishlist"
            title="Open wishlist"
            className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-apparel-border bg-apparel-panel text-apparel-cream hover:border-apparel-pink hover:text-apparel-pink ${
              isMobileMenuOpen ? 'hidden md:inline-flex' : 'inline-flex'
            }`}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
              <path d="M20.8 4.9a5.5 5.5 0 0 0-7.8 0L12 6l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.3a5.5 5.5 0 0 0 0-7.8Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-apparel-pink px-1 text-xs font-bold text-apparel-bg">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            aria-label="Open cart"
            title="Open cart"
            className={`relative items-center justify-center gap-2 rounded-full border border-apparel-border bg-apparel-panel px-3 py-2 text-sm font-semibold uppercase tracking-wide hover:border-apparel-teal md:px-4 ${
              isMobileMenuOpen ? 'hidden md:flex' : 'flex'
            }`}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M2.5 3h2.2l2.2 11h10.6l2-8.2H6.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden md:inline">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-apparel-pink px-1 text-xs font-bold text-apparel-bg">
                {itemCount}
              </span>
            )}
          </Link>
          {isAuthenticated && (
            <button
              type="button"
              onClick={signOut}
              className="hidden rounded-full border border-apparel-border px-4 py-2 text-xs font-semibold uppercase tracking-wide text-apparel-cream/80 hover:border-apparel-pink hover:text-apparel-cream md:inline-flex"
            >
              Sign Out
            </button>
          )}
        </div>
        </div>

      </header>

      <div
        id="mobile-nav-menu"
        className={`fixed inset-0 z-[70] md:hidden ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        onClick={closeMobileMenu}
      >
        <div
          className={`absolute inset-0 bg-apparel-bg transition-opacity duration-400 ease-out ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`relative flex h-full w-full max-w-full flex-col overflow-y-auto px-6 pb-8 pt-32 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          {isAuthenticated && displayName && (
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-apparel-teal">
              Welcome back, {displayName}
            </p>
          )}
          <nav className="flex w-full flex-1 flex-col items-start justify-center gap-6">
            {mobileMenuLinks.map((link, index) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={`w-full border-b border-apparel-border pb-5 text-3xl font-semibold uppercase tracking-wide text-apparel-cream transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
                }`}
                style={{ transitionDelay: isMobileMenuOpen ? `${index * 85}ms` : '0ms' }}
                onClick={closeMobileMenu}
              >
                {link.label}
              </NavLink>
            ))}
            <a
              href="https://rockmission.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full border-b border-apparel-border pb-5 text-3xl font-semibold uppercase tracking-wide text-apparel-cream transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
              }`}
              style={{ transitionDelay: isMobileMenuOpen ? '255ms' : '0ms' }}
              onClick={closeMobileMenu}
            >
              The Mission
            </a>
            <div className="mt-auto w-full pt-6">
              <Link
                to="/cart"
                className="inline-flex w-full items-center justify-center rounded-full border border-apparel-border bg-apparel-panel px-5 py-3 text-sm font-semibold uppercase tracking-wide text-apparel-cream"
                onClick={closeMobileMenu}
              >
                View Cart
              </Link>
            </div>
          </nav>
          {isAuthenticated && (
            <button
              type="button"
              onClick={handleSignOut}
              className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-apparel-border bg-apparel-panel px-4 py-3 text-sm font-semibold uppercase tracking-wide text-apparel-cream"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </>
  )
}
