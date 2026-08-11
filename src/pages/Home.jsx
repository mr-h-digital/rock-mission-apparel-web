import { Link } from 'react-router-dom'
import { PRODUCTS } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Home() {
  const featured = PRODUCTS.slice(0, 4)

  return (
    <div>
      <section className="relative overflow-hidden border-b border-apparel-border bg-hero-radial">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-24 sm:px-6 sm:py-32">
          <span className="rounded-full border border-apparel-teal/40 bg-apparel-panel px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-apparel-teal">
            Cape Town · South Africa
          </span>
          <h1 className="font-display text-6xl leading-[0.95] tracking-wide sm:text-8xl">
            WEAR YOUR<br />
            <span className="bg-grad-drop bg-clip-text text-transparent">FAITH.</span><br />
            FUND THE<br />
            <span className="text-outline">MISSION.</span>
          </h1>
          <p className="max-w-xl text-lg text-apparel-muted">
            Bold, modern streetwear for a generation unashamed of the Gospel. Every hoodie, tee, cap and sticker
            you buy helps fund Rock Mission Ministries' outreach across the Cape Flats.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/shop"
              className="rounded-full bg-grad-drop px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-apparel-bg transition-transform hover:scale-105"
            >
              Shop The Drop →
            </Link>
            <a
              href="https://rockmission.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-apparel-border px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-apparel-cream hover:border-apparel-teal"
            >
              Meet The Ministry
            </a>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-b border-apparel-border bg-apparel-panel py-3">
        <div className="marquee-track font-display text-2xl tracking-wide text-apparel-cream/40">
          {Array(2).fill(0).map((_, i) => (
            <span key={i}>
              REDEEMED&nbsp;&nbsp;·&nbsp;&nbsp;BOLD&nbsp;&nbsp;·&nbsp;&nbsp;CHOSEN&nbsp;&nbsp;·&nbsp;&nbsp;FEARLESS&nbsp;&nbsp;·&nbsp;&nbsp;KINGDOM&nbsp;&nbsp;·&nbsp;&nbsp;RESTORED&nbsp;&nbsp;·&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-apparel-teal">This Week's Drop</span>
            <h2 className="mt-2 font-display text-4xl tracking-wide sm:text-5xl">Fresh Fits</h2>
          </div>
          <Link to="/shop" className="hidden text-sm font-bold uppercase tracking-widest text-apparel-teal sm:block">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="border-y border-apparel-border bg-apparel-panel">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-apparel-pink">Why It Matters</span>
            <h2 className="mt-2 font-display text-4xl tracking-wide sm:text-5xl">
              Every Purchase Is An Outreach Project.
            </h2>
            <p className="mt-4 text-apparel-muted">
              Rock Mission Apparel exists because clothes shouldn't be silent. We design faith-forward streetwear
              that's actually cool to wear — and every rand of profit goes straight back into Rock Mission
              Ministries' work on the Cape Flats: feeding families, mentoring youth, and sharing the Gospel where
              it's needed most.
            </p>
            <a
              href="https://rockmission.co.za/#projects"
              className="mt-6 inline-block text-sm font-bold uppercase tracking-widest text-apparel-teal hover:underline"
            >
              See Our Outreach Projects →
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-apparel-border bg-apparel-bg p-6">
              <div className="font-display text-5xl text-apparel-teal">100%</div>
              <div className="mt-1 text-sm text-apparel-muted">Of profit funds outreach</div>
            </div>
            <div className="rounded-2xl border border-apparel-border bg-apparel-bg p-6">
              <div className="font-display text-5xl text-apparel-pink">4</div>
              <div className="mt-1 text-sm text-apparel-muted">Product categories</div>
            </div>
            <div className="rounded-2xl border border-apparel-border bg-apparel-bg p-6">
              <div className="font-display text-5xl text-apparel-volt">SA</div>
              <div className="mt-1 text-sm text-apparel-muted">Designed in Cape Town</div>
            </div>
            <div className="rounded-2xl border border-apparel-border bg-apparel-bg p-6">
              <div className="font-display text-5xl text-apparel-teal">∞</div>
              <div className="mt-1 text-sm text-apparel-muted">Lives it could reach</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
        <h2 className="font-display text-4xl tracking-wide sm:text-5xl">Ready To Rep The Kingdom?</h2>
        <p className="mx-auto mt-4 max-w-xl text-apparel-muted">
          New drops monthly. Bold designs, real message, real impact.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-block rounded-full bg-grad-drop px-10 py-4 text-sm font-bold uppercase tracking-widest text-apparel-bg transition-transform hover:scale-105"
        >
          Shop All Products →
        </Link>
      </section>
    </div>
  )
}
