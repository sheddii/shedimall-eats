import { createFileRoute, redirect } from "@tanstack/react-router";
import { MenuPage } from "@/pages/MenuPage";
import { readStoredUser } from "@/contexts/AuthContext";

export const Route = createFileRoute("/menu")({
  beforeLoad: ({ location }) => {
    if (typeof window === "undefined") return;
    if (!readStoredUser()) {
      throw redirect({ to: "/signin", search: { redirect: location.href } });
    }
  },
  head: () => ({
    meta: [
      { title: "Menu — Shedi-Mall" },
      { name: "description", content: "Browse our full menu of dishes, fries, and drinks." },
      { property: "og:title", content: "Menu — Shedi-Mall" },
      { property: "og:description", content: "Dishes, Fries, and Drinks — pick your favourite." },
    ],
  }),
  component: MenuPage,
});
