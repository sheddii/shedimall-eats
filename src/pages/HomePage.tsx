import { Link } from "@tanstack/react-router";
import hero from "@/assets/hero-home.jpg";
import { Hero } from "@/components/Hero";
import { CategoryCard } from "@/components/CategoryCard";
import { CATEGORIES } from "@/data/menu";

export function HomePage() {
  return (
    <>
      <Hero
        image={hero}
        eyebrow="Shedi-Mall Eatery"
        title="Fresh dishes, fries & drinks — delivered fast."
        subtitle="Locally-sourced ingredients, cooked to order. Order online in seconds."
      />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand mb-2">Menu categories</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold">What's cooking today</h2>
          </div>
          <Link to="/menu" className="text-sm font-medium text-brand hover:underline hidden sm:block">
            See full menu →
          </Link>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          {CATEGORIES.map((c) => (
            <CategoryCard key={c.id} category={c.id} label={c.label} image={c.image} blurb={c.blurb} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { t: "Fast delivery", d: "Hot meals at your door in 30 minutes." },
            { t: "Fresh daily", d: "Ingredients sourced from local markets each morning." },
            { t: "Loved by regulars", d: "Rated 4.9 by 2,000+ happy customers." },
          ].map((f) => (
            <div key={f.t} className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-display text-xl font-semibold">{f.t}</h3>
              <p className="text-sm text-muted-foreground mt-2">{f.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
