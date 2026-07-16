import { Link } from "@tanstack/react-router";
import type { Category } from "@/data/menu";

type Props = { category: Category; label: string; image: string; blurb: string };

export function CategoryCard({ category, label, image, blurb }: Props) {
  return (
    <Link
      to="/menu/$category"
      params={{ category }}
      className="group relative flex-1 overflow-hidden rounded-2xl min-h-[240px] sm:min-h-[280px] shadow-sm hover:shadow-xl transition-shadow"
    >
      <img
        src={image}
        alt={label}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="relative z-10 h-full flex flex-col justify-end p-4 sm:p-6 text-white">
        <h3 className="font-display text-2xl sm:text-3xl font-semibold">{label}</h3>
        <p className="text-sm text-white/80 mt-1">{blurb}</p>
        <span className="mt-3 text-xs uppercase tracking-[0.2em] text-brand-foreground bg-brand w-fit px-2.5 py-1 rounded">
          Explore →
        </span>
      </div>
    </Link>
  );
}
