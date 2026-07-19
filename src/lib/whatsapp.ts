import type { CartLine } from "@/contexts/CartContext";
import { formatPrice } from "@/data/menu";

export type OrderDetails = {
  name: string;
  phone: string;
  address: string;
  notes?: string;
};

export const WHATSAPP_NUMBER = "2348165897193";
export const PAYMENT_ACCOUNT = "8165897193";
export const PAYMENT_NAME = "Chukwuemeka Shedrack";
export const PAYMENT_METHOD = "Palmpay";

export function buildOrderMessage(lines: CartLine[], subtotal: number, d: OrderDetails) {
  const items = lines
    .map((l) => `- ${l.item.name} × ${l.qty} — ${formatPrice(l.item.price * l.qty)}`)
    .join("\n");
  return [
    "Shedi-Mall payment confirmation",
    "",
    `Hi, I've just made payment for my order. Here are the details:`,
    "",
    `Customer: ${d.name}`,
    `Phone: ${d.phone}`,
    `Address: ${d.address}`,
    `Notes: ${d.notes?.trim() ? d.notes.trim() : "—"}`,
    "",
    "Items ordered:",
    items,
    "",
    `Total paid: ${formatPrice(subtotal)}`,
    `Payment method: ${PAYMENT_METHOD} transfer to ${PAYMENT_ACCOUNT} (${PAYMENT_NAME})`,
    "",
    "Please confirm receipt and arrange delivery. Thank you!",
  ].join("\n");
}

export function buildWhatsAppOrderUrl(lines: CartLine[], subtotal: number, d: OrderDetails) {
  const text = encodeURIComponent(buildOrderMessage(lines, subtotal, d));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
