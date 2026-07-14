import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/pages/ContactPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Shedi-Mall" },
      { name: "description", content: "Get in touch with the Shedi-Mall team." },
      { property: "og:title", content: "Contact — Shedi-Mall" },
    ],
  }),
  component: ContactPage,
});
