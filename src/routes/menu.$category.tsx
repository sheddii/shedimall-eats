import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { MenuCategoryPage } from "@/pages/MenuCategoryPage";
import type { Category } from "@/data/menu";
import { readStoredUser } from "@/contexts/AuthContext";

const VALID: Category[] = ["dishes", "fries", "drinks"];

export const Route = createFileRoute("/menu/$category")({
  beforeLoad: ({ params, location }) => {
    if (typeof window !== "undefined" && !readStoredUser()) {
      throw redirect({ to: "/signin", search: { redirect: location.href } });
    }
    if (!VALID.includes(params.category as Category)) throw notFound();
  },
  head: ({ params }) => {
    const label = params.category.charAt(0).toUpperCase() + params.category.slice(1);
    return {
      meta: [
        { title: `${label} — Shedi-Mall` },
        { name: "description", content: `Order fresh ${params.category} from Shedi-Mall.` },
        { property: "og:title", content: `${label} — Shedi-Mall` },
      ],
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { category } = Route.useParams();
  return <MenuCategoryPage category={category as Category} />;
}
