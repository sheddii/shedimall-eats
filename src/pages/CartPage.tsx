import { Link } from "@tanstack/react-router";
import { Trash2, Minus, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/data/menu";

export function CartPage() {
  const { lines, subtotal, setQty, remove, clear } = useCart();

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <h1 className="font-display text-4xl font-semibold mb-8">Your cart</h1>
      {lines.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Link to="/menu" className="mt-4 inline-flex items-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground">
            Browse menu
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-[1fr_320px] gap-8">
          <ul className="space-y-3">
            {lines.map(({ item, qty }) => (
              <li key={item.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-3">
                <img src={item.image} alt={item.name} className="h-20 w-20 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setQty(item.id, qty - 1)} className="h-8 w-8 grid place-items-center rounded-md border border-input hover:bg-accent"><Minus size={14} /></button>
                  <span className="w-8 text-center text-sm font-medium">{qty}</span>
                  <button onClick={() => setQty(item.id, qty + 1)} className="h-8 w-8 grid place-items-center rounded-md border border-input hover:bg-accent"><Plus size={14} /></button>
                </div>
                <button onClick={() => remove(item.id)} aria-label="Remove" className="h-8 w-8 grid place-items-center rounded-md text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
              </li>
            ))}
          </ul>
          <aside className="rounded-xl border border-border bg-card p-6 h-fit">
            <h2 className="font-display text-xl font-semibold mb-4">Summary</h2>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Items</span>
              <span className="font-medium">{lines.reduce((s, l) => s + l.qty, 0)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-muted-foreground">Delivery</span>
              <span className="font-medium">Calculated at checkout</span>
            </div>
            <Link
              to="/checkout"
              className="block w-full text-center rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-brand-foreground hover:opacity-90"
            >
              Proceed to checkout
            </Link>
            <button onClick={clear} className="mt-2 w-full rounded-md border border-input px-4 py-2 text-sm hover:bg-accent">
              Clear cart
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}
