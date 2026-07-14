import { createFileRoute } from "@tanstack/react-router";
import { CartPage } from "@/pages/CartPage";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — Shedi-Mall" }] }),
  component: CartPage,
});
