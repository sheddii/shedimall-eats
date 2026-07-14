import { Plus } from "lucide-react";
import { formatPrice, type MenuItem } from "@/data/menu";
import { useCart } from "@/contexts/CartContext";

export function MealCard({ item }: { item: MenuItem }) {
  const { add } = useCart();
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-card border border-border shadow-sm hover:shadow-lg transition-shadow">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <h3 className="font-display text-xl font-semibold leading-tight">{item.name}</h3>
          <p className="mt-1 text-sm font-medium">{formatPrice(item.price)}</p>
        </div>
        <button
          onClick={() => add(item)}
          aria-label={`Add ${item.name} to cart`}
          className="absolute top-3 right-3 h-10 w-10 grid place-items-center rounded-full bg-brand text-brand-foreground shadow-md hover:scale-110 transition-transform"
        >
          <Plus size={18} />
        </button>
      </div>
    </article>
  );
}
