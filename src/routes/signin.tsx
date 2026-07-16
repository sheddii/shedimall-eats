import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SignInPage } from "@/pages/SimplePages";

export const Route = createFileRoute("/signin")({
  validateSearch: z.object({ redirect: z.string().optional() }).partial(),
  head: () => ({ meta: [{ title: "Sign in — Shedi-Mall" }] }),
  component: SignInPage,
});
