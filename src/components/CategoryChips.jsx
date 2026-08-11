export default function CategoryChips({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
          active === null
            ? 'border-apparel-teal bg-apparel-teal text-apparel-bg'
            : 'border-apparel-border text-apparel-muted hover:text-apparel-cream'
        }`}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
            active === c
              ? 'border-apparel-teal bg-apparel-teal text-apparel-bg'
              : 'border-apparel-border text-apparel-muted hover:text-apparel-cream'
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  )
}
