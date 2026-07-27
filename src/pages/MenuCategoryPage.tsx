import { useEffect, useState } from "react";
import { Hero } from "@/components/Hero";
import { MealCard } from "@/components/MealCard";
import { CATEGORIES, type Category, type MenuItem } from "@/data/menu";
import { getMenuItems } from "@/lib/api";

export function MenuCategoryPage({ category }: { category: Category }) {
  const meta = CATEGORIES.find((c) => c.id === category) || {
    id: category,
    label: category.charAt(0).toUpperCase() + category.slice(1),
    image: "",
    blurb: "Delicious selections cooked fresh to order.",
  };

  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getMenuItems(category)
      .then((data) => {
        if (isMounted) {
          setItems(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [category]);

  return (
    <>
      <Hero image={meta.image} eyebrow="Menu" title={meta.label} subtitle={meta.blurb} />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        {loading ? (
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
