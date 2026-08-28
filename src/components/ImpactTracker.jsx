import { useEffect, useState } from 'react'
import { useImpact } from '../context/ImpactContext.jsx'

// Animated counter component
function AnimatedCounter({ target, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime = null
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = (timestamp - startTime) / duration
      if (progress < 1) {
        setCount(Math.floor(target * progress))
        requestAnimationFrame(animate)
      } else {
        setCount(target)
      }
    }
    requestAnimationFrame(animate)
  }, [target, duration])

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export default function ImpactTracker() {
  const { impact, loading } = useImpact()

  return (
    <section className="relative overflow-hidden border-y border-apparel-border bg-gradient-to-r from-apparel-panel to-apparel-bg py-16 sm:py-20">
      {/* Animated background accent */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(32,227,207,0.06),transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center rounded-full border border-apparel-teal/40 bg-apparel-teal/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-apparel-teal">
            🎯 Real-Time Impact
          </span>
          <h2 className="mt-4 font-display text-4xl tracking-wide sm:text-5xl">
            Your Kingdom Drip = Real Change
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-apparel-muted">
            Every purchase funds Rock Mission Ministries' outreach on the Cape Flats. Here's the proof.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {/* Funds Raised */}
          <div className="group rounded-2xl border border-apparel-border bg-apparel-bg/40 p-5 backdrop-blur-sm transition-all hover:border-apparel-teal hover:bg-apparel-bg/60 sm:p-6">
            <div className="mb-2 text-2xl sm:text-3xl">💰</div>
            <div className="font-display text-2xl text-apparel-teal sm:text-3xl">
              {loading ? '...' : <AnimatedCounter target={impact.totalFundsRaised} suffix=" ZAR" />}
            </div>
            <div className="mt-2 text-xs font-semibold uppercase tracking-widest text-apparel-muted">
              Raised
            </div>
          </div>

          {/* Orders Processed */}
          <div className="group rounded-2xl border border-apparel-border bg-apparel-bg/40 p-5 backdrop-blur-sm transition-all hover:border-apparel-pink hover:bg-apparel-bg/60 sm:p-6">
            <div className="mb-2 text-2xl sm:text-3xl">📦</div>
            <div className="font-display text-2xl text-apparel-pink sm:text-3xl">
              {loading ? '...' : <AnimatedCounter target={impact.totalOrdersProcessed} />}
            </div>
            <div className="mt-2 text-xs font-semibold uppercase tracking-widest text-apparel-muted">
              Orders
            </div>
          </div>

          {/* Youth Mentored */}
          <div className="group rounded-2xl border border-apparel-border bg-apparel-bg/40 p-5 backdrop-blur-sm transition-all hover:border-apparel-volt hover:bg-apparel-bg/60 sm:p-6">
            <div className="mb-2 text-2xl sm:text-3xl">👥</div>
            <div className="font-display text-2xl text-apparel-volt sm:text-3xl">
              {loading ? '...' : <AnimatedCounter target={impact.youthMentored} />}
            </div>
            <div className="mt-2 text-xs font-semibold uppercase tracking-widest text-apparel-muted">
              Youth Reached
            </div>
          </div>

          {/* Families Fed */}
          <div className="group rounded-2xl border border-apparel-border bg-apparel-bg/40 p-5 backdrop-blur-sm transition-all hover:border-apparel-teal hover:bg-apparel-bg/60 sm:p-6">
            <div className="mb-2 text-2xl sm:text-3xl">🍽️</div>
            <div className="font-display text-2xl text-apparel-teal sm:text-3xl">
              {loading ? '...' : <AnimatedCounter target={impact.familiesFed} />}
            </div>
            <div className="mt-2 text-xs font-semibold uppercase tracking-widest text-apparel-muted">
              Families Fed
            </div>
          </div>

          {/* Community Projects */}
          <div className="group rounded-2xl border border-apparel-border bg-apparel-bg/40 p-5 backdrop-blur-sm transition-all hover:border-apparel-pink hover:bg-apparel-bg/60 sm:p-6">
            <div className="mb-2 text-2xl sm:text-3xl">🏘️</div>
            <div className="font-display text-2xl text-apparel-pink sm:text-3xl">
              {loading ? '...' : <AnimatedCounter target={impact.communityProjects} />}
            </div>
            <div className="mt-2 text-xs font-semibold uppercase tracking-widest text-apparel-muted">
              Projects
            </div>
          </div>

          {/* Days Active */}
          <div className="group rounded-2xl border border-apparel-border bg-apparel-bg/40 p-5 backdrop-blur-sm transition-all hover:border-apparel-volt hover:bg-apparel-bg/60 sm:p-6">
            <div className="mb-2 text-2xl sm:text-3xl">⏰</div>
            <div className="font-display text-2xl text-apparel-volt sm:text-3xl">
              {loading ? '...' : <AnimatedCounter target={impact.daysActive} />}
            </div>
            <div className="mt-2 text-xs font-semibold uppercase tracking-widest text-apparel-muted">
              Days Active
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="https://rockmission.co.za/#projects"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full border border-apparel-teal bg-apparel-teal/10 px-8 py-3 text-sm font-bold uppercase tracking-widest text-apparel-teal transition-all hover:bg-apparel-teal hover:text-apparel-bg"
          >
            See Full Impact Report →
          </a>
        </div>
      </div>
    </section>
  )
}
