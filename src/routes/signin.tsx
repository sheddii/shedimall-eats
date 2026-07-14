import { createFileRoute } from "@tanstack/react-router";
import { SignInPage } from "@/pages/SimplePages";

export const Route = createFileRoute("/signin")({
  head: () => ({ meta: [{ title: "Sign in — Shedi-Mall" }] }),
  component: SignInPage,
});
