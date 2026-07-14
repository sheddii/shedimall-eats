import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <span
        aria-hidden
        className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-brand-foreground font-bold text-sm tracking-tight shadow-sm group-hover:scale-105 transition-transform"
      >
        SM
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-foreground">
        Shedi-Mall
      </span>
    </Link>
  );
}
