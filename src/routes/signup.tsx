import { createFileRoute } from "@tanstack/react-router";
import { SignUpPage } from "@/pages/SimplePages";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — Shedi-Mall" }] }),
  component: SignUpPage,
});
