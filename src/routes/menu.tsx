import { createFileRoute } from "@tanstack/react-router";
import { MenuPage } from "@/pages/MenuPage";

export const Route = createFileRoute("/menu")({
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
