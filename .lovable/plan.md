## Goal
Add mock frontend auth, gate `/menu` and `/menu/$category` behind sign-in, expand each category to 6+ items, and add a `/dashboard` page users land on after auth.

## Changes

**1. Mock auth context** — `src/contexts/AuthContext.tsx` (new)
- `AuthProvider` with `user`, `signIn(email, password)`, `signUp(name, email, password)`, `signOut()`.
- Persist a fake session in `localStorage` (`shedimall.auth`). Any non-empty email+password succeeds.
- Wrap app in `__root.tsx` inside `CartProvider`.

**2. Sign-in / Sign-up wiring** — `src/pages/SimplePages.tsx`
- Convert forms to controlled inputs, call `signIn`/`signUp`, then `navigate({ to: "/dashboard" })`.
- If already authed, redirect to `/dashboard` on mount.
- Cross-links preserved.

**3. Route guard** — `src/routes/menu.tsx` and `src/routes/menu.$category.tsx`
- Add `beforeLoad` reading `localStorage` session; if missing, `throw redirect({ to: "/signin", search: { redirect: location.href } })`.
- Sign-in page reads `redirect` search param and returns there (fallback `/dashboard`).

**4. Dashboard route** — `src/routes/dashboard.tsx` + `src/pages/DashboardPage.tsx` (new)
- Also gated. Shows welcome (user name/email) and the three categories in a responsive **grid** (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) using existing `CategoryCard`.
- Sign-out button.

**5. Expanded menu data** — `src/data/menu.ts`
- Grow each category to 6 items (dishes, fries, drinks = 18 total). Reuse existing images where sensible; add 6 new image assets for the extra items via the image generator (one per new dish/fries/drink).

**6. Navbar** — `src/components/Navbar.tsx`
- When authenticated: show user avatar/initial menu with "Dashboard" and "Sign out"; when not: keep current Sign in link.

## Non-goals
- No real backend, no password hashing, no email verification.
- Home / About / Contact / Cart remain public.

## Technical notes
- Guard runs client-side only (`typeof window` check inside `beforeLoad`) — mock session lives in localStorage, so SSR treats users as signed-out and the client re-checks on hydration. Acceptable for a mock.
- `useNavigate` from `@tanstack/react-router`; keep type-safe `<Link>` params.
