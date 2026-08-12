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
  const tickerItems = [
    'Free shipping over R850',
    '100% of profit funds Rock Mission outreach',
    'New drops monthly',
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
          <Link
            to={isAuthenticated ? '/account' : '/sign-in'}
            className="rounded-full border border-apparel-border bg-apparel-panel px-3 py-2 text-xs font-semibold uppercase tracking-wide text-apparel-cream/80 hover:border-apparel-teal hover:text-apparel-cream md:hidden"
          >
            {isAuthenticated ? 'Account' : 'Sign In'}
          </Link>
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
    </header>
  )
}
