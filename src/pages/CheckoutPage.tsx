import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Check, MessageCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/data/menu";
import {
  buildWhatsAppOrderUrl,
  PAYMENT_ACCOUNT,
  PAYMENT_NAME,
  PAYMENT_METHOD,
} from "@/lib/whatsapp";

export function CheckoutPage() {
  const { lines, subtotal, count } = useCart();
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);

  if (lines.length === 0) {
    return (
      <section className="mx-auto max-w-2xl px-4 sm:px-6 py-16 text-center">
        <h1 className="font-display text-3xl font-semibold mb-3">Checkout</h1>
        <p className="text-muted-foreground mb-6">Your cart is empty.</p>
        <Link
          to="/menu"
          className="inline-flex items-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground"
        >
          Browse menu
        </Link>
      </section>
    );
  }

  const canSend = name.trim() && phone.trim() && address.trim();

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT_ACCOUNT);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const sendOrder = () => {
    if (!canSend) return;
    const url = buildWhatsAppOrderUrl(lines, subtotal, {
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      notes: notes.trim(),
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-brand">Checkout</p>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-1 mb-8">
        Complete your order
      </h1>

      <div className="grid md:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-8">
          {/* Delivery details */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold mb-4">Delivery details</h2>
            <div className="grid gap-4">
              <label className="block">
                <span className="block text-sm font-medium mb-1.5">Full name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="block">
                <span className="block text-sm font-medium mb-1.5">Phone</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  placeholder="e.g. 0803 000 0000"
                  className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="block">
                <span className="block text-sm font-medium mb-1.5">Delivery address</span>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  autoComplete="street-address"
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="block">
                <span className="block text-sm font-medium mb-1.5">
                  Notes <span className="text-muted-foreground font-normal">(optional)</span>
                </span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Landmark, extras, dietary notes…"
                  className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
            </div>
          </div>

          {/* Payment instructions */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold mb-1">Payment</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Transfer the exact total to the account below, then send your order via WhatsApp to confirm.
            </p>
            <dl className="grid gap-3 text-sm">
              <div className="flex justify-between items-center rounded-md bg-background border border-border px-4 py-3">
                <dt className="text-muted-foreground">Method</dt>
                <dd className="font-medium">{PAYMENT_METHOD} (manual transfer)</dd>
              </div>
              <div className="flex justify-between items-center rounded-md bg-background border border-border px-4 py-3">
                <dt className="text-muted-foreground">Account number</dt>
                <dd className="flex items-center gap-2">
                  <span className="font-mono font-semibold tracking-wider">{PAYMENT_ACCOUNT}</span>
                  <button
                    onClick={copyAccount}
                    className="inline-flex items-center gap-1 rounded-md border border-input px-2 py-1 text-xs hover:bg-accent"
                    aria-label="Copy account number"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </dd>
              </div>
              <div className="flex justify-between items-center rounded-md bg-background border border-border px-4 py-3">
                <dt className="text-muted-foreground">Account name</dt>
                <dd className="font-medium">{PAYMENT_NAME}</dd>
              </div>
              <div className="flex justify-between items-center rounded-md bg-brand/10 border border-brand/30 px-4 py-3">
                <dt className="text-muted-foreground">Amount</dt>
                <dd className="font-display text-lg font-semibold text-brand">{formatPrice(subtotal)}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Order summary */}
        <aside className="rounded-xl border border-border bg-card p-6 h-fit md:sticky md:top-20">
          <h2 className="font-display text-xl font-semibold mb-4">Order summary</h2>
          <ul className="space-y-2 mb-4">
            {lines.map(({ item, qty }) => (
              <li key={item.id} className="flex justify-between text-sm gap-3">
                <span className="min-w-0 truncate">
                  {item.name} <span className="text-muted-foreground">× {qty}</span>
                </span>
                <span className="font-medium shrink-0">{formatPrice(item.price * qty)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-border pt-3 mb-4 space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Items</span>
              <span>{count}</span>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>
          <button
            onClick={sendOrder}
            disabled={!canSend}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageCircle size={16} />
            I have paid — send order via WhatsApp
          </button>
          <p className="mt-3 text-xs text-muted-foreground text-center">
            Opens WhatsApp with your order details prefilled.
          </p>
          <Link
            to="/cart"
            className="mt-2 block text-center text-xs text-muted-foreground hover:text-foreground"
          >
            ← Back to cart
          </Link>
        </aside>
      </div>
    </section>
  );
}
