import { useQuery } from "@tanstack/react-query";
import { getMenuItems } from "@/lib/api";
import type { Category } from "@/data/menu";

/**
 * Query key factory for menu items.
 * All menu queries share the ['menu'] root so that
 * queryClient.invalidateQueries({ queryKey: ['menu'] })
 * busts every cached variant at once.
 */
export const menuKeys = {
  all: ["menu"] as const,
  byCategory: (category: Category) => ["menu", category] as const,
};

/**
 * Fetches menu items from the backend (with static-data fallback).
 * - Refetches when the browser tab regains focus.
 * - Polls every 60 s so customers always see a fresh menu.
 * - Shares a single cache entry per category, so an admin mutation
 *   that invalidates ['menu'] forces every mounted menu component
 *   to refetch immediately.
 */
export function useMenuItems(category?: Category) {
  return useQuery({
    queryKey: category ? menuKeys.byCategory(category) : menuKeys.all,
    queryFn: () => getMenuItems(category),
    staleTime: 30_000,          // data is "fresh" for 30 s after fetch
    refetchInterval: 60_000,    // background poll every 60 s
    refetchOnWindowFocus: true, // refetch when the user switches back to the tab
  });
}
