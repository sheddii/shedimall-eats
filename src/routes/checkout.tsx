import { createFileRoute, redirect } from "@tanstack/react-router";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { readStoredUser } from "@/contexts/AuthContext";

export const Route = createFileRoute("/checkout")({
  beforeLoad: ({ location }) => {
    if (typeof window !== "undefined" && !readStoredUser()) {
      throw redirect({ to: "/signin", search: { redirect: location.href } });
    }
  },
  head: () => ({
    meta: [
      { title: "Checkout — Shedi-Mall" },
      { name: "description", content: "Complete your Shedi-Mall order with Palmpay transfer and WhatsApp confirmation." },
    ],
  }),
  component: CheckoutPage,
});
