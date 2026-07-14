import { createFileRoute, notFound } from "@tanstack/react-router";
import { MenuCategoryPage } from "@/pages/MenuCategoryPage";
import type { Category } from "@/data/menu";

const VALID: Category[] = ["dishes", "fries", "drinks"];

export const Route = createFileRoute("/menu/$category")({
  beforeLoad: ({ params }) => {
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
