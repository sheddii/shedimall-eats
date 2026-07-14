# Shedi-Mall — Frontend Plan

A React frontend for an eatery called **Shedi-Mall**, with "SM" logo/favicon, styled professionally with Tailwind. Frontend only — no backend/auth wiring, just UI (sign in/up buttons open placeholder pages, cart is client-side, contact form is a UI-only submit).

## Stack note
The project template uses **TanStack Start (file-based routing in `src/routes/`)**, not Vite + React Router as the handbook suggests. I'll keep TanStack routing (required by this template) but mirror the handbook's frontend folder layout underneath it. Route files stay thin and delegate to page components in `src/pages/`.

> If you'd rather I strip TanStack and rebuild on plain Vite + React Router exactly as the handbook lists, say so and I'll replan.

## Folder structure (per handbook §7.2)
```text
src/
  assets/            SM logo, hero & menu images (Lovable Assets pointers)
  components/        Navbar, Footer, Logo, MenuCategoryCard, MealCard, SearchBar, CartIcon
  contexts/          CartContext (cart state)
  hooks/             useCart
  layouts/           MainLayout (Navbar + Outlet + Footer)
  pages/             Home, About, Menu, MenuCategory, Contact, Cart, Settings, SignIn, SignUp
  routes/            TanStack route files — thin wrappers importing from pages/
  services/          (placeholder api.ts for future backend)
  utils/             formatPrice, cn helpers
```

## Pages & routes
- `/` **Home** — hero image, intro, three menu category cards (Dishes / Fries / Drinks) shown as **images with text overlays in a flex row**; each card links to its menu category page.
- `/about` — hero image + story of Shedi-Mall.
- `/menu` — hero image + all three category cards.
- `/menu/dishes`, `/menu/fries`, `/menu/drinks` — 3-column grid of food cards; each card is an image with dish name and price overlaid.
- `/contact` — hero image + form (Name, Email, Message, Submit). UI-only toast on submit.
- `/cart` — items added from menu, quantities, subtotal, checkout button (UI only).
- `/settings`, `/signin`, `/signup` — simple placeholder pages.
- `/*` — 404 (already handled in `__root.tsx`).

## Header
Sticky top bar:
- **Left**: "SM" mark (rounded square, brand color) + "Shedi-Mall" wordmark → links home.
- **Center**: Home, About, Menu, Contact (TanStack `<Link>` with active styling).
- **Right**: Search icon (opens inline search input filtering menu), Cart icon with item-count badge.
- Mobile: hamburger drawer.

## Footer
Three columns:
- **Left**: social links — Facebook, YouTube, X, Instagram (lucide icons).
- **Center**: same nav links (Home, About, Menu, Contact) — each routes to its page on click.
- **Right**: Settings link + Sign In / Sign Up buttons.
Bottom row: © Shedi-Mall 2026.

## Branding
- Logo: "SM" monogram in a rounded square, warm restaurant palette (deep terracotta primary, cream background, charcoal text) — replaces the current neutral shadcn defaults in `src/styles.css`.
- Favicon: generate a 512×512 "SM" PNG, upload via `lovable-assets`, save to `public/favicon.png`, wire in `__root.tsx` `head().links`, delete default `public/favicon.ico`.
- Meta: real title/description ("Shedi-Mall — Fresh dishes, fries & drinks") + og tags.

## Images
Generate with `imagegen` (fast tier, jpg):
- 4 hero images (home, about, menu, contact) — restaurant/food photography vibe.
- 3 category cover images (dishes / fries / drinks).
- ~4 sample food photos per category (12 total) with realistic Nigerian/West-African + international dishes; overlay name & price in the card component, not baked into the image.

## Data
Static `src/data/menu.ts` — array of items `{ id, name, price, category, image }`. No backend calls this iteration.

## Cart
`CartContext` with `items`, `addItem`, `removeItem`, `updateQty`, `clear`, persisted to `localStorage` (read inside `useEffect` to stay SSR-safe per template rules).

## Technical notes
- All route files created individually under `src/routes/` (TanStack requires one file per URL — no single `App.jsx` router table).
- Category route uses dynamic segment: `src/routes/menu.$category.tsx` → validates against `dishes|fries|drinks`, else `notFound()`.
- Each leaf route sets its own `head()` with unique title/description/og tags.
- Tailwind v4 tokens defined in `src/styles.css` under `@theme`/`:root` — no hardcoded hex in components.
- No business logic beyond cart state; Sign In / Sign Up are visual only.

Once approved I'll build it in one pass.