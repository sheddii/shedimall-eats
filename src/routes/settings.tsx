import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/pages/SimplePages";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Shedi-Mall" }] }),
  component: SettingsPage,
});
