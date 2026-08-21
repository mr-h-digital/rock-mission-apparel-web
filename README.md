# Kingdom Drip — Storefront

Bold, faith-based streetwear storefront for **Rock Mission Ministries**, trading as **Kingdom Drip**. Hoodies,
tees, hats and accessories for a generation unashamed of the Gospel — every purchase funds the ministry's
outreach on the Cape Flats, Cape Town.

Built with React + Vite + Tailwind CSS, mirroring the tooling used in
[`rock-mission-learn-web`](https://github.com/mr-h-digital/rock-mission-learn-web).

## Stack

- React 18 + React Router
- Vite
- Tailwind CSS (extends the Rock Mission brand palette with a bolder, Gen-Z streetwear accent — see
  `tailwind.config.js`)
- Cart state in React Context + `localStorage` (no login required to shop)
- Optional customer accounts (sign up/sign in) backed by API auth endpoints
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

## Auth API contract (optional accounts)

The frontend now supports optional accounts while preserving guest checkout. By default it expects these endpoints
under `VITE_API_URL`:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token)
- `PUT /api/auth/me` (update profile + default delivery details)
- `POST /api/auth/forgot-password` (request reset link/token)
- `POST /api/auth/reset-password` (set a new password)
- `POST /api/auth/forgot-username` (optional: recover username/login ID)

Expected auth response shape from register/login:

```json
{
   "token": "jwt-or-access-token",
   "user": {
      "id": "...",
      "firstName": "...",
      "lastName": "...",
      "email": "..."
   }
}
```

If your Railway API uses different paths, set:

- `VITE_AUTH_REGISTER_PATH`
- `VITE_AUTH_LOGIN_PATH`
- `VITE_AUTH_ME_PATH`
- `VITE_AUTH_UPDATE_PROFILE_PATH`
- `VITE_AUTH_FORGOT_PASSWORD_PATH`
- `VITE_AUTH_RESET_PASSWORD_PATH`
- `VITE_AUTH_FORGOT_USERNAME_PATH`

## Deploy

The storefront can be hosted as static files on Afrihost cPanel while the Spring Boot API remains on Railway.

### Afrihost cPanel Git deployment

The repository includes `.cpanel.yml` and `public/.htaccess`. Before deploying:

1. Replace `CPANEL_USERNAME` in `.cpanel.yml` with the cPanel account username shown in Afrihost File Manager.
2. Set the `VITE_API_URL` value in `.cpanel.yml` to `https://store-api.rockmission.co.za`, the Railway custom domain
   configured for the API.
3. Ensure Node.js/npm is enabled for the cPanel account. The deployment task runs `npm ci`, builds the Vite app, and
   copies `dist` into `public_html`.
4. Add the storefront domain or subdomain to the cPanel repository's deployment path if it is not the primary domain.

The `.htaccess` file is copied into `dist` by Vite and makes direct visits to React Router routes such as `/shop` and
`/checkout` resolve to `index.html`.

If Node.js is not available in the cPanel account, run `npm ci && npm run build` locally and upload the contents of
`dist` to `public_html` instead. The API must still be deployed separately on Railway.

For Railway, set `FRONTEND_URL` to the exact public storefront origin, such as `https://shop.rockmission.co.za`.
Also set the production database, JWT secret, PayFast credentials, `PAYFAST_RETURN_URL`, `PAYFAST_CANCEL_URL`, and
public `PAYFAST_NOTIFY_URL` in Railway variables. Never put those secrets in the frontend environment.

## Catalog

Product data lives in `src/data/products.js` as static launch data (no admin/CMS yet). The same catalog is seeded
server-side in the API (`db/migration/V2__seed_products.sql`) so order totals are validated against real prices —
**update both files together** when the catalog changes.

## What's still needed before this can take real payments

See [`PAYFAST-ONBOARDING-DOCUMENTS.md`](PAYFAST-ONBOARDING-DOCUMENTS.md) for the PayFast document checklist and
submission notes.

1. A live PayFast **merchant account** for Rock Mission Ministries (merchant ID + key + passphrase), configured on
   the API.
2. A **Printful** (or similar print-on-demand) account with the actual garment designs uploaded, so orders can be
   auto-submitted for fulfillment. See the API README for details.
3. Real product photography/artwork — the storefront currently ships with bold typographic placeholder art
   (gradient cards with the product's tagline) instead of photos, so it looks complete without needing assets yet.
4. DNS for the storefront subdomain once you're ready to go live.
