import { Link } from "@tanstack/react-router";
import { Facebook, Youtube, Instagram, Settings } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/menu", label: "Menu" },
  { to: "/contact", label: "Contact" },
] as const;

// X (Twitter) icon — lucide's Twitter is legacy; inline X logo.
function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2H21l-6.53 7.46L22 22h-6.828l-4.77-6.24L4.8 22H2l7-8L2 2h6.914l4.3 5.68L18.244 2Zm-1.196 18h1.68L7.06 4H5.28l11.768 16Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-foreground mb-4">Follow us</h3>
          <div className="flex items-center gap-2">
            {[
              { href: "https://facebook.com", label: "Facebook", icon: <Facebook size={18} /> },
              { href: "https://youtube.com", label: "YouTube", icon: <Youtube size={18} /> },
              { href: "https://x.com", label: "X", icon: <XIcon /> },
              { href: "https://instagram.com", label: "Instagram", icon: <Instagram size={18} /> },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 grid place-items-center rounded-md border border-border hover:bg-brand hover:text-brand-foreground hover:border-brand transition-colors"
              >
                {s.icon}
              </a>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">© {new Date().getFullYear()} Shedi-Mall. All rights reserved.</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-foreground mb-4">Explore</h3>
          <ul className="grid grid-cols-2 gap-y-2">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className="text-sm text-muted-foreground hover:text-brand transition-colors"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-foreground mb-4">Account</h3>
          <div className="flex flex-col gap-3 items-start">
            <Link
              to="/settings"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand"
            >
              <Settings size={16} /> Settings
            </Link>
            <div className="flex gap-2">
              <Link
                to="/signin"
                className="inline-flex items-center rounded-md border border-input px-3.5 py-2 text-sm font-medium hover:bg-accent"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center rounded-md bg-brand px-3.5 py-2 text-sm font-medium text-brand-foreground hover:opacity-90"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
