import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import SeoHead from '../components/SeoHead.jsx'
import { useProducts } from '../context/ProductsContext.jsx'

export default function Home() {
  const { products, loading, error } = useProducts()
  const featured = products.slice(0, 4)
  const identityWords = ['REDEEMED', 'BOLD', 'CHOSEN', 'FEARLESS', 'KINGDOM', 'RESTORED']

  return (
    <div>
      <SeoHead
        title="Kingdom Drip — Bold Christian Streetwear"
        description="Faith-based streetwear by Kingdom Drip. Every purchase helps fund Rock Mission Ministries outreach across the Cape Flats."
        path="/"
        image="/brand/kingdom-drip-store-hero-bg.png"
      />
      <section
        className="relative overflow-hidden border-b border-apparel-border bg-apparel-bg"
        style={{
          backgroundImage:
            "linear-gradient(115deg, rgba(12,14,22,0.94) 0%, rgba(12,14,22,0.72) 42%, rgba(12,14,22,0.5) 100%), url('/brand/kingdom-drip-store-hero-bg.png')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-y-0 left-0 w-full max-w-3xl bg-gradient-to-r from-apparel-bg/92 via-apparel-bg/82 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(32,227,207,0.18),transparent_34%),radial-gradient(circle_at_80%_24%,rgba(255,47,165,0.14),transparent_30%)]" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col items-start justify-center gap-6 px-4 py-24 sm:px-6 sm:py-32 lg:min-h-[84vh]">
          <div className="max-w-2xl">
            <img
              src="/brand/kingdom-drip-logo-transparent-bg-white-text.png"
              alt="Kingdom Drip"
              className="h-auto w-52 rounded-xl border border-apparel-border/70 bg-apparel-bg/35 p-3.5 shadow-lg shadow-black/35 backdrop-blur-sm sm:w-56 lg:w-60"
              loading="eager"
            />
            <span className="mt-4 inline-flex w-52 justify-center rounded-full border border-apparel-teal/40 bg-apparel-panel/85 px-4 py-1.5 text-center text-xs font-bold uppercase tracking-widest text-apparel-teal backdrop-blur-sm sm:w-56 lg:w-60">
              Cape Town · South Africa
            </span>
            <h1 className="mt-4 font-display text-6xl leading-[0.95] tracking-wide drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)] sm:text-8xl">
              GOT THAT<br />
              <span className="bg-grad-drop bg-clip-text text-transparent">KINGDOM</span><br />
              <span className="text-outline">DRIP.</span>
            </h1>
            <p className="mt-4 max-w-xl rounded-2xl border border-white/10 bg-apparel-bg/38 px-4 py-3 text-lg text-apparel-cream/90 drop-shadow-[0_1px_10px_rgba(0,0,0,0.55)] backdrop-blur-sm">
              Bold, modern streetwear for a generation unashamed of the Gospel. Every hoodie, tee, cap and sticker
              you buy helps fund Rock Mission Ministries' outreach across the Cape Flats.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
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
        </div>
      </section>

      <div className="overflow-hidden border-b border-apparel-border bg-apparel-panel py-3">
        <div className="marquee-track font-display text-2xl tracking-wide text-apparel-cream/40">
          {Array(4).fill(0).map((_, loopIndex) => (
            identityWords.map((word, wordIndex) => (
              <span key={`${loopIndex}-${wordIndex}`} className="mr-8 shrink-0">
                {word}
                <span className="ml-8 text-apparel-cream/25">·</span>
              </span>
            ))
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
        {loading && <p className="mt-4 text-sm text-apparel-muted">Loading products...</p>}
        {error && <p className="mt-4 text-sm font-semibold text-apparel-pink">{error}</p>}
      </section>

      <section className="border-y border-apparel-border bg-apparel-panel">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-apparel-pink">Why It Matters</span>
            <h2 className="mt-2 font-display text-4xl tracking-wide sm:text-5xl">
              Every Purchase Is An Outreach Project.
            </h2>
            <p className="mt-4 text-apparel-muted">
              Kingdom Drip exists because clothes shouldn't be silent. We design faith-forward streetwear
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
