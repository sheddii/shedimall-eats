import hero from "@/assets/hero-menu.jpg";
import { Hero } from "@/components/Hero";
import { CategoryCard } from "@/components/CategoryCard";
import { CATEGORIES } from "@/data/menu";

export function MenuPage() {
  return (
    <>
      <Hero image={hero} eyebrow="Our menu" title="Pick a category, pick a favourite." />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="flex flex-col sm:flex-row gap-4">
          {CATEGORIES.map((c) => (
            <CategoryCard key={c.id} category={c.id} label={c.label} image={c.image} blurb={c.blurb} />
          ))}
        </div>
      </section>
    </>
  );
}
