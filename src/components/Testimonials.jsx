const TESTIMONIALS = [
  {
    id: 1,
    name: 'Amira',
    location: 'Cape Town',
    text: 'I\'m wearing Kingdom Drip because I want people to know I\'m unashamed of Jesus. The quality is insane, and knowing my money helps feed families on the Cape Flats? That\'s Kingdom.',
    role: 'Student',
    avatar: '👩‍🎓',
  },
  {
    id: 2,
    name: 'Thabo',
    location: 'Mitchells Plain',
    text: 'Repping my community AND my faith. Kingdom Drip isn\'t just drip—it\'s a movement. Every drop hits different when you know the why behind it.',
    role: 'Content Creator',
    avatar: '🎬',
  },
  {
    id: 3,
    name: 'Naledi',
    location: 'Johannesburg',
    text: 'The hoodies are fire. But honestly? The impact tracker blew my mind. I can see exactly how my purchase is changing lives. That\'s real.',
    role: 'Young Professional',
    avatar: '💼',
  },
  {
    id: 4,
    name: 'Sipho',
    location: 'Khayelitsha',
    text: 'Rock Mission literally changed my life growing up. Now I\'m buying the gear because these youth need to know there\'s hope. Kingdom Drip is hope you can wear.',
    role: 'Youth Mentor',
    avatar: '🙌',
  },
]

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="mb-12 text-center">
        <span className="inline-flex items-center rounded-full border border-apparel-pink/40 bg-apparel-pink/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-apparel-pink">
          💬 Real Kingdom Warriors
        </span>
        <h2 className="mt-4 font-display text-4xl tracking-wide sm:text-5xl">
          Why People Rep Kingdom Drip
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-apparel-muted">
          Not just customers—community members who get it. Here's what they're saying.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {TESTIMONIALS.map((testimonial) => (
          <div
            key={testimonial.id}
            className="group rounded-2xl border border-apparel-border bg-apparel-bg/50 p-6 backdrop-blur-sm transition-all hover:border-apparel-teal hover:bg-apparel-bg/70"
          >
            {/* Avatar + Name */}
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">{testimonial.avatar}</div>
              <div>
                <div className="font-bold text-apparel-cream">{testimonial.name}</div>
                <div className="text-xs text-apparel-muted">{testimonial.role}</div>
                <div className="text-xs text-apparel-muted/60">{testimonial.location}</div>
              </div>
            </div>

            {/* Quote */}
            <p className="text-sm leading-relaxed text-apparel-cream/90">
              "{testimonial.text}"
            </p>

            {/* Star rating */}
            <div className="mt-4 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-apparel-volt">
                  ⭐
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Social proof CTA */}
      <div className="mt-12 rounded-2xl border border-apparel-border bg-apparel-panel p-8 text-center">
        <h3 className="font-display text-2xl">Join the Kingdom Drip Movement</h3>
        <p className="mt-2 text-apparel-muted">
          Share your story. Tag <span className="font-bold text-apparel-teal">#KingdomDrip</span> on
          Instagram and we'll feature you here.
        </p>
        <a
          href="https://instagram.com/kingdomdrip"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-full bg-grad-drop px-8 py-3 text-sm font-bold uppercase tracking-widest text-apparel-bg transition-transform hover:scale-105"
        >
          Follow @KingdomDrip →
        </a>
      </div>
    </section>
  )
}
