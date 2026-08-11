export default function Footer() {
  return (
    <footer className="border-t border-apparel-border bg-apparel-panel">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="font-display text-2xl tracking-wide">
              KINGDOM<span className="text-apparel-pink">.</span>DRIP
            </div>
            <p className="mt-3 max-w-sm text-sm text-apparel-muted">
              Bold, faith-based streetwear built for a generation unashamed of the Gospel. Kingdom Drip is run by
              Rock Mission Ministries, a registered non-profit — proceeds fund outreach across the Cape Flats,
              Cape Town.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-apparel-teal">Shop</h4>
            <ul className="mt-3 space-y-2 text-sm text-apparel-muted">
              <li><a href="/shop" className="hover:text-apparel-cream">All Products</a></li>
              <li><a href="/shop?category=Hoodies" className="hover:text-apparel-cream">Hoodies</a></li>
              <li><a href="/shop?category=Tees" className="hover:text-apparel-cream">Tees</a></li>
              <li><a href="/shop?category=Hats" className="hover:text-apparel-cream">Hats</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-apparel-teal">The Ministry</h4>
            <ul className="mt-3 space-y-2 text-sm text-apparel-muted">
              <li><a href="https://rockmission.co.za" className="hover:text-apparel-cream">About Rock Mission</a></li>
              <li><a href="https://rockmission.co.za/#donate" className="hover:text-apparel-cream">Donate Directly</a></li>
              <li><a href="https://rockmission.co.za/pages/contact.html" className="hover:text-apparel-cream">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-apparel-border pt-6 text-xs text-apparel-muted sm:flex-row">
          <span>© {new Date().getFullYear()} Kingdom Drip — a Rock Mission Ministries NPC project, Cape Town, South Africa</span>
        </div>
      </div>
    </footer>
  )
}
