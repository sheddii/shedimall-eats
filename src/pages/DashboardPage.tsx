import { CategoryCard } from "@/components/CategoryCard";
import { CATEGORIES } from "@/data/menu";
import { useAuth } from "@/contexts/AuthContext";

export function DashboardPage() {
  const { user, signOut } = useAuth();
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brand">Dashboard</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-1">
            Welcome{user ? `, ${user.name}` : ""} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Pick a category to start ordering.
          </p>
        </div>
        <button
          onClick={signOut}
          className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          Sign out
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((c) => (
          <CategoryCard key={c.id} category={c.id} label={c.label} image={c.image} blurb={c.blurb} />
        ))}
      </div>
    </section>
  );
}
