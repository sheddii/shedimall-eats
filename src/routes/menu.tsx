import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { readStoredUser } from "@/contexts/AuthContext";

export const Route = createFileRoute("/menu")({
  beforeLoad: ({ location }) => {
    if (typeof window === "undefined") return;
    if (!readStoredUser()) {
      throw redirect({ to: "/signin", search: { redirect: location.href } });
    }
  },
  component: () => <Outlet />,
});
