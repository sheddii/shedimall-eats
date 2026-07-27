import { useState } from "react";
import hero from "@/assets/hero-menu.jpg";
import { Hero } from "@/components/Hero";
import { CategoryCard } from "@/components/CategoryCard";
import { MealCard } from "@/components/MealCard";
import { CATEGORIES, type Category } from "@/data/menu";
import { useMenuItems } from "@/hooks/useMenuItems";

export function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");

  const { data: items = [], isLoading, isFetching } = useMenuItems(
    selectedCategory === "all" ? undefined : selectedCategory
  );

  return (
    <>
      <Hero image={hero} eyebrow="Our menu" title="Pick a category, pick a favourite." />
      
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          {CATEGORIES.map((c) => (
            <CategoryCard key={c.id} category={c.id} label={c.label} image={c.image} blurb={c.blurb} />
          ))}
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-8 flex-wrap gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold">Live Menu Catalog</h2>
            <p className="text-sm text-muted-foreground">
              {isFetching && !isLoading ? "⟳ Refreshing..." : "Updated in real-time from our kitchen inventory"}
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === "all"
                  ? "bg-brand text-brand-foreground shadow-sm"
                  : "bg-accent text-accent-foreground hover:bg-accent/80"
              }`}
            >
              All Items ({items.length})
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === c.id
                    ? "bg-brand text-brand-foreground shadow-sm"
                    : "bg-accent text-accent-foreground hover:bg-accent/80"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
            <span className="ml-3 text-sm font-medium text-muted-foreground">Syncing live menu items...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 rounded-xl border border-dashed p-8">
            <p className="text-lg font-medium text-muted-foreground">No menu items found in this section.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map((it) => (
              <MealCard key={it.id} item={it} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
