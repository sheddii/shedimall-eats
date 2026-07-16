import { Link, useNavigate } from "@tanstack/react-router";
import { Search, ShoppingCart, Menu as MenuIcon, X, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/menu", label: "Menu" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const { count } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Logo />

        <nav className="hidden sm:flex items-center gap-1">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: "text-brand" }}
              inactiveProps={{ className: "text-foreground/70 hover:text-foreground" }}
              className="px-2 sm:px-3 py-2 text-sm font-medium transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen((s) => !s)}
            className="h-9 w-9 grid place-items-center rounded-md hover:bg-accent transition-colors"
          >
            <Search className="h-4.5 w-4.5" size={18} />
          </button>
          <Link
            to="/cart"
            aria-label="My cart"
            className="relative h-9 w-9 grid place-items-center rounded-md hover:bg-accent transition-colors"
          >
            <ShoppingCart size={18} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-brand text-brand-foreground text-[10px] font-semibold grid place-items-center">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                aria-label="Dashboard"
                title={`Signed in as ${user.name}`}
                className="hidden sm:grid h-9 w-9 place-items-center rounded-md hover:bg-accent transition-colors"
              >
                <LayoutDashboard size={18} />
              </Link>
              <button
                onClick={() => { signOut(); navigate({ to: "/" }); }}
                aria-label="Sign out"
                className="hidden sm:grid h-9 w-9 place-items-center rounded-md hover:bg-accent transition-colors"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link
              to="/signin"
              className="hidden sm:inline-flex items-center rounded-md bg-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground hover:opacity-90"
            >
              Sign in
            </Link>
          )}
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((s) => !s)}
            className="sm:hidden h-9 w-9 grid place-items-center rounded-md hover:bg-accent"
          >
            {open ? <X size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
            <Link
              to="/menu"
              onClick={() => setSearchOpen(false)}
              className="flex items-center gap-2 rounded-md border border-input bg-card px-3 py-2 text-sm text-muted-foreground hover:border-brand"
            >
              <Search size={16} />
              Browse the full menu…
            </Link>
          </div>
        </div>
      )}

      {open && (
        <div className="sm:hidden border-t border-border bg-background">
          <nav className="mx-auto max-w-7xl px-4 py-2 flex flex-col">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: n.to === "/" }}
                activeProps={{ className: "text-brand" }}
                className="py-2.5 text-sm font-medium"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

