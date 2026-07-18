import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Check, Pencil, ClipboardCheck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/data/menu";
import {
  // buildWhatsAppOrderUrl, // WhatsApp confirmation temporarily disabled
  PAYMENT_ACCOUNT,
  PAYMENT_NAME,
  PAYMENT_METHOD,
} from "@/lib/whatsapp";

type Step = "details" | "review" | "paid";

export function CheckoutPage() {
  const { lines, subtotal, count, clear } = useCart();
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<Step>("details");

  if (lines.length === 0 && step !== "paid") {
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

  const canReview = name.trim() && phone.trim() && address.trim();

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT_ACCOUNT);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  // WhatsApp confirmation flow — kept for future re-enable.
  // const sendOrder = () => {
  //   const url = buildWhatsAppOrderUrl(lines, subtotal, {
  //     name: name.trim(),
  //     phone: phone.trim(),
  //     address: address.trim(),
  //     notes: notes.trim(),
  //   });
  //   window.open(url, "_blank", "noopener,noreferrer");
  // };

  const markPaid = () => {
    setStep("paid");
    clear();
  };

  if (step === "paid") {
    return (
      <section className="mx-auto max-w-2xl px-4 sm:px-6 py-20 text-center">
        <div className="mx-auto mb-6 h-14 w-14 grid place-items-center rounded-full bg-brand/15 text-brand">
          <Check size={28} />
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-brand">Order received</p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-2 mb-3">
          Thanks, {name.split(" ")[0] || "friend"}!
        </h1>
        <p className="text-muted-foreground mb-8">
          We've logged your order and will confirm your payment shortly. A rider will reach you at {phone}.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/menu" className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:opacity-90">
            Order more
          </Link>
          <Link to="/dashboard" className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent">
            Back to dashboard
          </Link>
        </div>
      </section>
    );
  }

  const stepBadge = (n: number, label: string, active: boolean, done: boolean) => (
    <div className="flex items-center gap-2">
      <span
        className={`h-6 w-6 grid place-items-center rounded-full text-[11px] font-semibold ${
          done
            ? "bg-brand text-brand-foreground"
            : active
              ? "bg-brand/15 text-brand border border-brand/40"
              : "bg-muted text-muted-foreground"
        }`}
      >
        {done ? <Check size={12} /> : n}
      </span>
      <span className={`text-xs font-medium ${active || done ? "text-foreground" : "text-muted-foreground"}`}>
        {label}
      </span>
    </div>
  );

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-brand">Checkout</p>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-1 mb-6">
        Complete your order
      </h1>

      {/* Stepper */}
      <div className="flex items-center gap-3 sm:gap-4 mb-8 flex-wrap">
        {stepBadge(1, "Details", step === "details", step !== "details")}
        <span className="h-px w-6 sm:w-10 bg-border" />
        {stepBadge(2, "Review & Pay", step === "review", false)}
      </div>

      <div className="grid md:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-8">
          {step === "details" ? (
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
                <button
                  onClick={() => setStep("review")}
                  disabled={!canReview}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ClipboardCheck size={16} />
                  Review order
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Review summary */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-semibold">Review your order</h2>
                  <button
                    onClick={() => setStep("details")}
                    className="inline-flex items-center gap-1 rounded-md border border-input px-2.5 py-1.5 text-xs font-medium hover:bg-accent"
                  >
                    <Pencil size={12} />
                    Edit
                  </button>
                </div>

                <dl className="grid sm:grid-cols-2 gap-3 text-sm mb-6">
                  <div className="rounded-md bg-background border border-border px-4 py-3">
                    <dt className="text-xs text-muted-foreground uppercase tracking-wide">Name</dt>
                    <dd className="mt-0.5 font-medium">{name}</dd>
                  </div>
                  <div className="rounded-md bg-background border border-border px-4 py-3">
                    <dt className="text-xs text-muted-foreground uppercase tracking-wide">Phone</dt>
                    <dd className="mt-0.5 font-medium">{phone}</dd>
                  </div>
                  <div className="sm:col-span-2 rounded-md bg-background border border-border px-4 py-3">
                    <dt className="text-xs text-muted-foreground uppercase tracking-wide">Address</dt>
                    <dd className="mt-0.5 font-medium whitespace-pre-wrap">{address}</dd>
                  </div>
                  {notes.trim() && (
                    <div className="sm:col-span-2 rounded-md bg-background border border-border px-4 py-3">
                      <dt className="text-xs text-muted-foreground uppercase tracking-wide">Notes</dt>
                      <dd className="mt-0.5 font-medium whitespace-pre-wrap">{notes}</dd>
                    </div>
                  )}
                </dl>

                <h3 className="text-sm font-semibold mb-3">Items ({count})</h3>
                <ul className="divide-y divide-border rounded-md border border-border overflow-hidden">
                  {lines.map(({ item, qty }) => (
                    <li key={item.id} className="flex items-center gap-3 p-3 bg-background">
                      <img src={item.image} alt={item.name} className="h-12 w-12 rounded-md object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(item.price)} × {qty}
                        </p>
                      </div>
                      <span className="text-sm font-semibold">{formatPrice(item.price * qty)}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex justify-between text-base font-semibold border-t border-border pt-4">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>

              {/* Payment instructions */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-display text-xl font-semibold mb-1">Payment</h2>
                <p className="text-sm text-muted-foreground mb-5">
                  Transfer the exact total to the account below, then tap "I have paid" to submit your order.
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
            </>
          )}
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

          {step === "review" ? (
            <button
              onClick={markPaid}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:opacity-90"
            >
              <Check size={16} />
              I have paid — submit order
            </button>
          ) : (
            <button
              onClick={() => setStep("review")}
              disabled={!canReview}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ClipboardCheck size={16} />
              Review order
            </button>
          )}

          {/*
            WhatsApp confirmation button — temporarily disabled.
            <button
              onClick={sendOrder}
              className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-md border border-input px-4 py-2.5 text-sm font-semibold hover:bg-accent"
            >
              <MessageCircle size={16} />
              Confirm order via WhatsApp
            </button>
          */}

          <Link
            to="/cart"
            className="mt-3 block text-center text-xs text-muted-foreground hover:text-foreground"
          >
            ← Back to cart
          </Link>
        </aside>
      </div>
    </section>
  );
}
