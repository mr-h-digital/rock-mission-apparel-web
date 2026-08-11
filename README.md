# Kingdom Drip — Storefront

Bold, faith-based streetwear storefront for **Rock Mission Ministries**. Hoodies, tees, hats and accessories for a
generation unashamed of the Gospel — every purchase funds the ministry's outreach on the Cape Flats, Cape Town.

Built with React + Vite + Tailwind CSS, mirroring the tooling used in
[`rock-mission-learn-web`](https://github.com/mr-h-digital/rock-mission-learn-web).

## Stack

- React 18 + React Router
- Vite
- Tailwind CSS (extends the Rock Mission brand palette with a bolder, Gen-Z streetwear accent — see
  `tailwind.config.js`)
- Cart state in React Context + `localStorage` (no login required to shop)
- Talks to [`rock-mission-apparel-api`](https://github.com/mr-h-digital/rock-mission-apparel-api) for order
  creation + PayFast checkout

## Getting started

```bash
npm install
cp .env.example .env.local   # set VITE_API_URL once the API is deployed
npm run dev
```

Without `VITE_API_URL` set, the storefront still works end-to-end for browsing/cart — checkout is disabled with an
inline notice until it's connected to a live API.

## Deploy

Hosted on **Netlify** (not GitHub Pages — GitHub's Pages terms prohibit using it for a site "primarily directed at
facilitating commercial transactions," which this is). Netlify's free tier explicitly permits commercial use.

Connect the repo in Netlify ("Add new site → Import from GitHub"); it auto-detects the Vite build via
`netlify.toml` (build command `npm run build`, publish directory `dist`), including the SPA redirect rule so
client-side routes like `/shop` or `/checkout` don't 404 on a direct visit or refresh. Every push to the connected
branch triggers a new deploy automatically — no manual deploy step needed.

Point the custom subdomain (`shop.rockmission.co.za`) at the site in Netlify's domain settings, then add the DNS
record Netlify gives you at wherever `rockmission.co.za`'s DNS is managed.

## Catalog

Product data lives in `src/data/products.js` as static launch data (no admin/CMS yet). The same catalog is seeded
server-side in the API (`db/migration/V2__seed_products.sql`) so order totals are validated against real prices —
**update both files together** when the catalog changes.

## What's still needed before this can take real payments

1. A live PayFast **merchant account** for Rock Mission Ministries (merchant ID + key + passphrase), configured on
   the API.
2. A **Printful** (or similar print-on-demand) account with the actual garment designs uploaded, so orders can be
   auto-submitted for fulfillment. See the API README for details.
3. Real product photography/artwork — the storefront currently ships with bold typographic placeholder art
   (gradient cards with the product's tagline) instead of photos, so it looks complete without needing assets yet.
4. DNS for the storefront subdomain once you're ready to go live.
