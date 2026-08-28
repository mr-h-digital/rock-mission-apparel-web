import { useState } from 'react'

// Placeholder drop schedule (will be data-driven later)
const UPCOMING_DROPS = [
  {
    id: 1,
    name: 'Back-to-School Kingdom',
    tagline: 'Bold prints. Real purpose. New year energy.',
    date: 'September 2026',
    type: 'Limited Drop',
    colors: ['Black', 'Navy', 'Teal'],
    emoji: '📚',
  },
  {
    id: 2,
    name: '"Unashamed" Collection',
    tagline: 'A collab with Cape Town faith leaders.',
    date: 'October 2026',
    type: 'Collab Edition',
    colors: ['Black', 'White', 'Charcoal'],
    emoji: '🤝',
  },
  {
    id: 3,
    name: 'Winter Layers Vol. II',
    tagline: 'Oversized hoodies meet streetwear elegance.',
    date: 'November 2026',
    type: 'Seasonal',
    colors: ['Black', 'Charcoal', 'Grey'],
    emoji: '❄️',
  },
]

function DropCard({ drop }) {
  return (
    <div className="group rounded-2xl border border-apparel-border bg-apparel-bg/40 p-6 backdrop-blur-sm transition-all hover:border-apparel-teal hover:bg-apparel-bg/60">
      {/* Emoji badge */}
      <div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-full bg-apparel-panel/60 text-2xl">
        {drop.emoji}
      </div>

      {/* Drop type badge */}
      <div className="inline-block mb-4 rounded-full bg-apparel-teal/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-apparel-teal">
        {drop.type}
      </div>

      {/* Drop name */}
      <h3 className="font-display text-xl font-bold text-apparel-cream">{drop.name}</h3>

      {/* Tagline */}
      <p className="mt-2 text-sm text-apparel-muted">{drop.tagline}</p>

      {/* Date countdown */}
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-apparel-panel/40 px-3 py-2">
        <span className="text-sm font-bold text-apparel-volt">📅</span>
        <span className="text-sm font-semibold text-apparel-cream">{drop.date}</span>
      </div>

      {/* Color preview */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-apparel-muted">Colors:</span>
        <div className="flex gap-2">
          {drop.colors.map((color, i) => {
            const colorMap = {
              Black: '#0a0a0a',
              White: '#ffffff',
              Navy: '#001f3f',
              Teal: '#20e3cf',
              Charcoal: '#36454f',
              Grey: '#808080',
            }
            return (
              <div
                key={i}
                className="h-5 w-5 rounded-full border border-apparel-border/50"
                style={{ backgroundColor: colorMap[color] || '#333' }}
                title={color}
              />
            )
          })}
        </div>
      </div>

      {/* Notify button */}
      <button className="mt-6 w-full rounded-full border border-apparel-teal bg-apparel-teal/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-apparel-teal transition-all hover:bg-apparel-teal hover:text-apparel-bg">
        Notify Me
      </button>
    </div>
  )
}

export default function DropCalendar() {
  const [selectedFilter, setSelectedFilter] = useState('all')

  const filteredDrops =
    selectedFilter === 'all'
      ? UPCOMING_DROPS
      : UPCOMING_DROPS.filter((d) =>
          d.type.toLowerCase().includes(selectedFilter.toLowerCase()),
        )

  return (
    <section className="border-y border-apparel-border bg-apparel-panel py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12">
          <span className="inline-flex items-center rounded-full border border-apparel-volt/40 bg-apparel-volt/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-apparel-volt">
            🚀 Upcoming Drops
          </span>
          <h2 className="mt-4 font-display text-4xl tracking-wide sm:text-5xl">
            What's Coming Next
          </h2>
          <p className="mt-4 max-w-2xl text-apparel-muted">
            Limited drops. Bold collabs. Real impact. Mark your calendars—new Kingdom Drip heat every month.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="mb-8 flex flex-wrap gap-2">
          {['All', 'Limited Drop', 'Collab Edition', 'Seasonal'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter === 'All' ? 'all' : filter)}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                selectedFilter === (filter === 'All' ? 'all' : filter)
                  ? 'bg-grad-drop text-apparel-bg'
                  : 'border border-apparel-border bg-apparel-bg/40 text-apparel-cream hover:border-apparel-teal'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Drops grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDrops.map((drop) => (
            <DropCard key={drop.id} drop={drop} />
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-12 rounded-2xl border border-apparel-border bg-apparel-bg p-8 text-center">
          <h3 className="font-display text-2xl">Never Miss A Drop</h3>
          <p className="mt-2 text-apparel-muted">
            Get SMS + email alerts when new Kingdom Drip gear hits the store.
          </p>
          <div className="mt-6 flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 rounded-full bg-apparel-panel px-4 py-3 text-sm text-apparel-cream placeholder-apparel-muted/50 focus:outline-none focus:ring-2 focus:ring-apparel-teal"
            />
            <button className="rounded-full bg-grad-drop px-6 py-3 text-sm font-bold uppercase tracking-widest text-apparel-bg transition-transform hover:scale-105">
              Notify
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
