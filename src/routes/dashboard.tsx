import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { DashboardPage } from "@/pages/DashboardPage";
import { readStoredUser } from "@/contexts/AuthContext";

export const Route = createFileRoute("/dashboard")({
  validateSearch: z.object({ redirect: z.string().optional() }).partial(),
  beforeLoad: ({ location }) => {
    if (typeof window === "undefined") return;
    if (!readStoredUser()) {
      throw redirect({ to: "/signin", search: { redirect: location.href } });
    }
  },
  head: () => ({ meta: [{ title: "Dashboard — Shedi-Mall" }] }),
  component: DashboardPage,
});
