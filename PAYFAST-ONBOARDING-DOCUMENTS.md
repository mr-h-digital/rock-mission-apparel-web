# PayFast onboarding checklist

Use this checklist to finish Kingdom Drip's PayFast setup.

## Already confirmed

- Merchant ID: `36646031`
- Merchant Key: `v9i18xviwsobf`

## Still required

1. Set a **passphrase** in PayFast **Developer Settings**.
2. Configure the API with live PayFast env vars:
   - `PAYFAST_MERCHANT_ID=36646031`
   - `PAYFAST_MERCHANT_KEY=v9i18xviwsobf`
   - `PAYFAST_PASSPHRASE=<your passphrase>`
   - `PAYFAST_SANDBOX=false`
3. Deploy the API publicly and set:
   - `PAYFAST_NOTIFY_URL=https://kingdomdrip-api.rockmission.co.za/api/payfast/notify`
4. Set the storefront return/cancel URLs in PayFast to match the deployed frontend:
   - Return URL: `https://shop.rockmission.co.za/order/success`
   - Cancel URL: `https://shop.rockmission.co.za/order/cancel`

## Button generator

The PayFast "Generate Pay Now Button" screen should use:

- Button type: **Standard Button**
- Item / service: **Kingdom Drip Order**
- Amount: set by the order total at checkout
- Return URL: storefront success page
- Cancel URL: storefront cancel page
- Notify URL: public API ITN endpoint

## Go-live sequence

1. Create the passphrase.
2. Deploy the API.
3. Test a sandbox payment end-to-end.
4. Switch sandbox off.
5. Test a live payment with a small order.
