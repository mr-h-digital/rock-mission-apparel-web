import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import logoWhiteText from '../assets/logos/kingdom-drip-logo-transparent-bg-white-text.png'

const linkClass = ({ isActive }) =>
  `text-sm font-semibold tracking-wide uppercase transition-colors ${
    isActive ? 'text-apparel-teal' : 'text-apparel-cream/80 hover:text-apparel-cream'
  }`

export default function Nav() {
  const { itemCount } = useCart()
  const { isAuthenticated, signOut } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const tickerItems = [
    'Free shipping over R850',
    '100% of profit funds Rock Mission outreach',
    'New drops monthly',
  ]

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
    isAuthenticated
      ? { to: '/account', label: 'Account' }
      : { to: '/sign-in', label: 'Sign In' },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-apparel-border bg-apparel-bg/90 backdrop-blur">
      <div className="marquee-bar overflow-hidden border-b border-apparel-border bg-apparel-panel/60 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-apparel-teal">
        <div className="marquee-track">
          {Array(4).fill(0).map((_, loopIndex) => (
            tickerItems.map((item, itemIndex) => (
              <span key={`${loopIndex}-${itemIndex}`} className="mr-12 shrink-0">{item}</span>
            ))
          ))}
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="inline-flex items-center" aria-label="Kingdom Drip Home">
          <img
            src={logoWhiteText}
            alt="Kingdom Drip"
            className="h-10 w-auto sm:h-12"
            loading="eager"
          />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/shop" className={linkClass}>Shop</NavLink>
          {isAuthenticated ? (
            <NavLink to="/account" className={linkClass}>Account</NavLink>
          ) : (
            <NavLink to="/sign-in" className={linkClass}>Sign In</NavLink>
          )}
          <a
            href="https://rockmission.co.za"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold uppercase tracking-wide text-apparel-cream/80 hover:text-apparel-cream"
          >
            The Mission
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-menu"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="relative z-[60] inline-flex h-11 w-11 items-center justify-center rounded-full border border-apparel-border bg-apparel-panel text-apparel-cream md:hidden"
          >
            <span className="sr-only">Toggle menu</span>
            <span
              className={`absolute h-0.5 w-5 bg-current transition-transform duration-300 ${
                isMobileMenuOpen ? 'translate-y-0 rotate-45' : '-translate-y-1.5 rotate-0'
              }`}
            />
            <span
              className={`absolute h-0.5 w-5 bg-current transition-opacity duration-200 ${
                isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute h-0.5 w-5 bg-current transition-transform duration-300 ${
                isMobileMenuOpen ? 'translate-y-0 -rotate-45' : 'translate-y-1.5 rotate-0'
              }`}
            />
          </button>
          <Link
            to="/cart"
            className="relative flex items-center gap-2 rounded-full border border-apparel-border bg-apparel-panel px-4 py-2 text-sm font-semibold uppercase tracking-wide hover:border-apparel-teal"
          >
            Cart
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

      <div
        id="mobile-nav-menu"
        className={`fixed inset-0 z-50 md:hidden ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        onClick={closeMobileMenu}
      >
        <div
          className={`absolute inset-0 bg-apparel-bg/95 backdrop-blur-lg transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`relative flex h-full flex-col px-6 pb-10 pt-24 transition-all duration-300 ${
            isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <nav className="flex flex-1 flex-col items-start justify-center gap-8">
            {mobileMenuLinks.map((link, index) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={`text-2xl font-semibold uppercase tracking-wide text-apparel-cream transition-all duration-300 ${
                  isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 70}ms` }}
                onClick={closeMobileMenu}
              >
                {link.label}
              </NavLink>
            ))}
            <a
              href="https://rockmission.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-2xl font-semibold uppercase tracking-wide text-apparel-cream transition-all duration-300 ${
                isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
              }`}
              style={{ transitionDelay: '210ms' }}
              onClick={closeMobileMenu}
            >
              The Mission
            </a>
          </nav>
          {isAuthenticated && (
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex w-full items-center justify-center rounded-full border border-apparel-border bg-apparel-panel px-4 py-3 text-sm font-semibold uppercase tracking-wide text-apparel-cream"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
