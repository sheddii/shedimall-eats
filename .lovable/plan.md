## Goal
Build a proper cart page and checkout flow for Shedi-Mall with manual Palmpay payment instructions and WhatsApp order confirmation. Checkout is gated behind sign-in.

## Changes

**1. Cart page polish — `src/pages/CartPage.tsx`**
- Keep current line-item list, qty controls, subtotal.
- Replace the non-functional "Checkout" button with a `<Link to="/checkout">Proceed to checkout</Link>`.
- Small tweak: show total item count in the summary.

**2. New checkout route (auth-gated)**
- `src/pages/CheckoutPage.tsx` — new page with three sections:
  1. **Order summary** — list of lines, qty × price, subtotal total.
  2. **Delivery details** form — full name (prefilled from `useAuth().user.name`), phone, delivery address, optional notes. Local `useState`; no backend.
  3. **Payment instructions card** — clearly displays:
     - Method: **Palmpay (manual transfer)**
     - Account number: **8165897193**
     - Account name: **Chukwuemeka Shedrack**
     - Amount: formatted subtotal
     - "Copy account number" button (uses `navigator.clipboard`).
     - Note asking user to transfer the exact amount before confirming.
  4. **"I have paid — send order via WhatsApp"** button. Disabled unless name, phone, address are filled and cart is non-empty. On click: builds a prefilled WhatsApp message and opens `https://wa.me/2348165897193?text=<encoded>` in a new tab. Does not clear cart (per user's choice).
- `src/routes/checkout.tsx` — new route at `/checkout` with `head()` meta and a `beforeLoad`/client-side guard mirroring the existing menu-category guard (redirect to `/signin?redirect=/checkout` for unauthenticated users). Renders `CheckoutPage`.

**3. WhatsApp message format**
Plaintext, URL-encoded, sent to `+2348165897193`:
```text
New Shedi-Mall order

Customer: <name>
Phone: <phone>
Address: <address>
Notes: <notes or "—">

Items:
- Jollof Rice & Chicken × 2 — ₦9,000
- Chapman × 1 — ₦1,800
...

Total: ₦10,800
Payment: Palmpay transfer to 8165897193 (Chukwuemeka Shedrack)
```
Utility `buildWhatsAppOrderUrl(lines, subtotal, details)` lives in `src/lib/whatsapp.ts` so it's unit-friendly and reusable.

**4. Cart → Checkout wiring**
- `CartPage` summary "Checkout" becomes the link to `/checkout`.
- `Navbar` cart icon behavior is unchanged.
- If cart is empty on `/checkout`, show an empty-state with a link back to `/menu`.

## Non-goals
- No real payment gateway, no backend, no order persistence.
- No cart-clearing after sending (user chose "open WhatsApp only").
- No changes to menu, auth, or dashboard logic.

## Technical notes
- Auth guard uses the same client-side pattern as `src/routes/menu.$category.tsx` (reads `shedimall.auth` from `localStorage` via `readStoredUser()` in `AuthContext`) with `redirect` search param round-trip already handled by `SimplePages`.
- All currency via `formatPrice` from `@/data/menu`.
- Tailwind v4 semantic tokens only (`bg-card`, `text-brand`, `border-border`, etc.); no hardcoded colors.
- WhatsApp link uses `window.open(url, "_blank", "noopener,noreferrer")`.
