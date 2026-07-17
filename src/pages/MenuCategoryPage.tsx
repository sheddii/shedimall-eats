import { Hero } from "@/components/Hero";
import { MealCard } from "@/components/MealCard";
import { MENU, CATEGORIES, type Category } from "@/data/menu";

export function MenuCategoryPage({ category }: { category: Category }) {
  const meta = CATEGORIES.find((c) => c.id === category)!;
  const items = MENU.filter((m) => m.category === category);

  return (
    <>
      <Hero image={meta.image} eyebrow="Menu" title={meta.label} subtitle={meta.blurb} />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {items.map((it) => (
            <MealCard key={it.id} item={it} />
          ))}
        </div>
      </section>
    </>
  );
}
