import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/pages/AboutPage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Shedi-Mall" },
      { name: "description", content: "Our story, our kitchen, and the people behind Shedi-Mall." },
      { property: "og:title", content: "About — Shedi-Mall" },
      { property: "og:description", content: "A neighborhood kitchen, going online." },
    ],
  }),
  component: AboutPage,
});
