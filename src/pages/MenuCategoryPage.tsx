import { Hero } from "@/components/Hero";
import { MealCard } from "@/components/MealCard";
import { CATEGORIES, type Category } from "@/data/menu";
import { useMenuItems } from "@/hooks/useMenuItems";

export function MenuCategoryPage({ category }: { category: Category }) {
  const meta = CATEGORIES.find((c) => c.id === category) || {
    id: category,
    label: category.charAt(0).toUpperCase() + category.slice(1),
    image: "",
    blurb: "Delicious selections cooked fresh to order.",
  };

  const { data: items = [], isLoading, isFetching } = useMenuItems(category);
  // suppress unused warning — isFetching used in subtitle
  void isFetching;


  return (
    <>
      <Hero image={meta.image} eyebrow="Menu" title={meta.label} subtitle={meta.blurb} />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
            <span className="ml-3 text-sm font-medium text-muted-foreground">Loading delicious items...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg font-medium text-muted-foreground">No menu items found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {items.map((it) => (
              <MealCard key={it.id} item={it} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
