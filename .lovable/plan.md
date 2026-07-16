Update the menu category cards so all three categories (Dishes, Fries, Drinks) sit in a single row on desktop and tablet, while keeping the current stacked vertical layout on mobile phones only.

### What to change
1. **Lower the breakpoint** in the category list containers from `md:flex-row` to `sm:flex-row` in both:
   - `src/pages/HomePage.tsx`
   - `src/pages/MenuPage.tsx`
2. **Tighten card spacing** slightly on small tablets so the three cards still fit comfortably in one row at `sm` (640px) and up — adjust the category card padding/font sizes responsively if needed.
3. **Keep mobile behavior unchanged** — below `sm`, cards remain stacked vertically.

### Files touched
- `src/pages/HomePage.tsx`
- `src/pages/MenuPage.tsx`
- Possibly `src/components/CategoryCard.tsx` for minor responsive spacing tweaks.

### Verification
- Open the preview on desktop, tablet, and mobile widths.
- Confirm: desktop and tablet show the three category cards in a single row; mobile shows them stacked vertically.

No other pages, logic, or assets are affected.