## Goal
Each menu category (Dishes, Fries, Drinks) already has 6 items — keep that. When a user opens a category, show the 6 items in a **3-per-row grid on tablet and desktop**, and fix the click that currently doesn't open the category page.

## Changes

**1. `/menu/$category` grid — 3 per row on tablet+**
File: `src/pages/MenuCategoryPage.tsx`
- Replace the current grid classes with `grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6`.
  - Mobile (<768px): 2 per row so cards stay tap-friendly on a 649px phone.
  - Tablet + desktop (≥768px): exactly 3 per row.
- If the user prefers strictly 3 across every breakpoint (including narrow phones), swap to `grid-cols-3` — noted below as an alternative.

**2. Fix "clicking a category doesn't open it"**
Root cause: `src/routes/menu.$category.tsx` runs a `beforeLoad` that, during SSR (`typeof window === "undefined"`), does nothing but on the first client render sees no `localStorage` session and redirects to `/signin`. For an unauthenticated visitor clicking a category on the Home page, this looks like "nothing happened" — the URL flips to `/signin?redirect=…`. Fixes:
- Home page category cards already link to `/menu/$category`. Keep the guard, but make the redirect visible and returnable:
  - Confirm `SimplePages.tsx` `useRedirectTarget()` returns to the originally-requested `/menu/$category` after sign-in (already implemented; verify `search.redirect` round-trips correctly and that `navigate({ to: target })` uses `to` typed against the router — switch to `navigate({ href: target })` if the string isn't a known route literal to avoid a silent no-op).
- For authenticated users, verify the `<Link to="/menu/$category" params={{ category }}>` in `CategoryCard` actually triggers navigation. If clicking still no-ops after sign-in, replace the `<Link>` in `CategoryCard.tsx` with a typed `useNavigate()` `onClick` fallback wrapped around the same anchor to rule out event bubbling from the gradient overlay swallowing the click on touch devices (`pointer-events-none` on the overlay div).

**3. Verify data**
File: `src/data/menu.ts` already has 6 items per category (18 total). No change needed.

## Non-goals
- No backend/auth changes.
- No new images.
- Home page category row layout stays as-is.

## Technical notes
- Tailwind v4 tokens only; no hardcoded colors.
- Keep the existing `beforeLoad` auth guard — after signing in the user lands on the originally-clicked category via the `redirect` search param.
- Alternative if you want literal 3-across on phones too: `grid grid-cols-3 gap-3 sm:gap-6` on `MenuCategoryPage`.
