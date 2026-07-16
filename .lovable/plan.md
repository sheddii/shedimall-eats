Update the Navbar so the nav links (Home, About, Menu, Contact) are always visible and centered in one row on desktop and tablet, while the hamburger (three parallel lines) only appears on mobile phones.

### What to change
1. **Lower the breakpoint** in `src/components/Navbar.tsx` so the nav list is visible from `sm` (640px) and up, and the mobile menu toggle only appears below `sm`.
2. **Adjust spacing** slightly so the logo, centered nav links, and right-side icons fit comfortably on a tablet without wrapping.
3. **Keep the mobile drawer unchanged** — it still houses the nav links on phones when the hamburger is tapped.

### Files touched
- `src/components/Navbar.tsx` only.

### Verification
- Open the preview on desktop, tablet, and mobile widths.
- Confirm: desktop and tablet show `Home About Menu Contact` centered in one line; mobile shows only the hamburger icon, with the nav links inside the drawer.

No other pages, logic, or assets are affected.