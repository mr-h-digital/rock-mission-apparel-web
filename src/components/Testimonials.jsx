const TESTIMONIALS = [
  {
    id: 1,
    name: 'Amira J.',
    location: 'Cape Town',
    text: "I'm wearing Kingdom Drip because I want people to know I'm unashamed of Jesus. The quality is insane, and knowing my money helps feed families on the Cape Flats makes every order feel deeper.",
    role: 'Student',
    verifiedLabel: 'Verified customer',
    avatarUrl: '',
  },
  {
    id: 2,
    name: 'Thabo M.',
    location: 'Mitchells Plain',
    text: "Repping my community and my faith at the same time is exactly why I support this brand. Kingdom Drip feels intentional, and the message behind every piece actually means something.",
    role: 'Content creator',
    verifiedLabel: 'Verified customer',
    avatarUrl: '',
  },
  {
    id: 3,
    name: 'Naledi P.',
    location: 'Johannesburg',
    text: "The hoodies are fire, but what really sold me was the mission behind the store. It's rare to find merch that looks this good and still funds something bigger than fashion.",
    role: 'Young professional',
    verifiedLabel: 'Verified customer',
    avatarUrl: '',
  },
  {
    id: 4,
    name: 'Sipho K.',
    location: 'Khayelitsha',
    text: "Rock Mission poured into my community, so being able to wear something that points people back to that work is powerful. Kingdom Drip is more than clothing. It's hope you can wear.",
    role: 'Youth mentor',
    verifiedLabel: 'Community supporter',
    avatarUrl: '',
  },
]

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function ReviewAvatar({ name, avatarUrl }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="h-14 w-14 rounded-full border border-apparel-border object-cover shadow-lg shadow-black/20"
      />
    )
  }

  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-apparel-teal/35 bg-apparel-teal/10 font-display text-lg tracking-wide text-apparel-teal shadow-lg shadow-black/20">
      {getInitials(name)}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="mb-12 text-center">
        <span className="inline-flex items-center rounded-full border border-apparel-pink/40 bg-apparel-pink/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-apparel-pink">
          Customer Love
        </span>
        <h2 className="mt-4 font-display text-4xl tracking-wide sm:text-5xl">
          Why People Rep Kingdom Drip
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-apparel-muted">
          Real feedback from people who believe in the message, love the quality, and want their spend to make an
          impact.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-apparel-border bg-apparel-panel p-5 text-center">
          <div className="font-display text-3xl text-apparel-teal">4.9/5</div>
          <p className="mt-1 text-xs uppercase tracking-widest text-apparel-muted">Average rating</p>
        </div>
        <div className="rounded-2xl border border-apparel-border bg-apparel-panel p-5 text-center">
          <div className="font-display text-3xl text-apparel-pink">120+</div>
          <p className="mt-1 text-xs uppercase tracking-widest text-apparel-muted">Happy customers</p>
        </div>
        <div className="rounded-2xl border border-apparel-border bg-apparel-panel p-5 text-center">
          <div className="font-display text-3xl text-apparel-volt">100%</div>
          <p className="mt-1 text-xs uppercase tracking-widest text-apparel-muted">Profit to outreach</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {TESTIMONIALS.map((testimonial) => (
          <article
            key={testimonial.id}
            className="group flex h-full flex-col rounded-2xl border border-apparel-border bg-apparel-bg/50 p-6 backdrop-blur-sm transition-all hover:border-apparel-teal hover:bg-apparel-bg/70"
          >
            <div className="mb-4 flex items-center gap-3">
              <ReviewAvatar name={testimonial.name} avatarUrl={testimonial.avatarUrl} />
              <div className="min-w-0">
                <div className="truncate font-bold text-apparel-cream">{testimonial.name}</div>
                <div className="text-xs text-apparel-muted">
                  {testimonial.role} · {testimonial.location}
                </div>
                <div className="mt-1 inline-flex rounded-full border border-apparel-border/80 bg-apparel-panel/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-apparel-teal">
                  {testimonial.verifiedLabel}
                </div>
              </div>
            </div>

            <div className="mb-4 flex items-center gap-1 text-apparel-volt" aria-label="5 out of 5 stars">
              {[...Array(5)].map((_, index) => (
                <span key={index}>★</span>
              ))}
            </div>

            <p className="flex-1 text-sm leading-relaxed text-apparel-cream/90">
              "{testimonial.text}"
            </p>
          </article>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-apparel-border bg-apparel-panel p-8 text-center">
        <h3 className="font-display text-2xl">Love your order?</h3>
        <p className="mt-2 mx-auto max-w-2xl text-apparel-muted">
          Help more people trust the brand by leaving a public Google review, or tag your fit on social media for a
          chance to be featured here.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="https://www.google.com/search?q=Rock+Mission+Ministries+Cape+Town"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-grad-drop px-8 py-3 text-sm font-bold uppercase tracking-widest text-apparel-bg transition-transform hover:scale-105"
          >
            Review us on Google
          </a>
          <a
            href="https://instagram.com/kingdomdrip"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full border border-apparel-border px-8 py-3 text-sm font-bold uppercase tracking-widest text-apparel-cream transition-colors hover:border-apparel-teal"
          >
            Follow @KingdomDrip
          </a>
        </div>
      </div>
    </section>
  )
}
