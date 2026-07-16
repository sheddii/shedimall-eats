import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SignUpPage } from "@/pages/SimplePages";

export const Route = createFileRoute("/signup")({
  validateSearch: z.object({ redirect: z.string().optional() }).partial(),
  head: () => ({ meta: [{ title: "Sign up — Shedi-Mall" }] }),
  component: SignUpPage,
});
