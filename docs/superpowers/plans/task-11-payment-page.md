# Task 11: Wire payment page to orderStore

## Objective
Create a payment page that reads pending order data from localStorage, displays order summary, and creates the order in orderStore when payment is confirmed.

## Current State
- `checkout.astro` stores order data in `manggaku-pending-order` localStorage and redirects to `/pembayaran`
- `pembayaran/[orderId].astro` exists for showing payment status of existing orders
- No `pembayaran.astro` file exists yet

## Plan

### Step 1: Create `src/pages/pembayaran.astro`
Create a new payment page with:
- Order summary section showing items, subtotal, platform fee, and total
- Payment method selection (GoPay, Bank Transfer, COD)
- "Bayar Sekarang" button to confirm payment

### Step 2: Add required IDs to elements
- `id="payment-items"` for order items container
- `id="payment-subtotal"` for subtotal value
- `id="payment-fee"` for platform fee value
- `id="payment-total"` for total value
- `id="pay-btn"` for payment button

### Step 3: Add client-side script
- Read pending order from `manggaku-pending-order` localStorage
- Populate order summary with items and totals
- Handle "Bayar Sekarang" click:
  - Import orderStore
  - Create order with items and shipping address
  - Set payment method
  - Clear cart and pending order from localStorage
  - Update cart badge
  - Show success message and redirect to marketplace

### Step 4: Verify build
- Run `npm run build` to ensure no errors

## Files to Create/Modify
1. Create: `src/pages/pembayaran.astro`
2. No modifications needed to existing files

## Verification
- Check that the page loads and shows order summary from localStorage
- Verify that clicking "Bayar Sekarang" creates order in orderStore
- Confirm cart and pending order are cleared from localStorage
- Ensure successful redirect to marketplace