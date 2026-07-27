import { MENU, type MenuItem, type Category } from "@/data/menu";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3001").replace(/\/+$/, "");

/**
 * Normalizes image URL (handles static asset imports vs backend public image paths)
 */
export function resolveImageUrl(imagePath?: string): string {
  if (!imagePath) return "/images/placeholder.jpg";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("data:")) {
    return imagePath;
  }
  if (imagePath.startsWith("/assets/") || imagePath.startsWith("blob:") || imagePath.startsWith("src/assets/")) {
    return imagePath;
  }
  // Point to backend static images if relative
  if (imagePath.startsWith("/")) {
    return `${API_BASE}${imagePath}`;
  }
  return `${API_BASE}/${imagePath}`;
}

/**
 * Fetch all menu items from backend database, with static MENU array fallback
 */
export async function getMenuItems(category?: Category): Promise<MenuItem[]> {
  try {
    const url = category 
      ? `${API_BASE}/api/menu/${category}`
      : `${API_BASE}/api/menu`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    
    if (data && Array.isArray(data.items)) {
      return data.items.map((item: any) => ({
        id: String(item.id || item._id),
        name: item.name,
        price: Number(item.price),
        category: item.category as Category,
        image: resolveImageUrl(item.image),
      }));
    }
  } catch (err) {
    console.warn("⚠️ Failed to fetch menu items from backend API, using client fallback:", err);
  }

  // Fallback to static client menu if API is unreachable
  if (category) {
    return MENU.filter((item) => item.category === category);
  }
  return MENU;
}

/**
 * Create a new menu item (Admin only)
 */
export async function createMenuItem(
  itemData: { id?: string; name: string; price: number; category: string; image?: string },
  token?: string
): Promise<MenuItem> {
  const res = await fetch(`${API_BASE}/api/menu`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(itemData),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || errData.error || "Failed to create menu item");
  }

  const data = await res.json();
  const created = data.item;
  return {
    id: String(created.id || created._id),
    name: created.name,
    price: Number(created.price),
    category: created.category,
    image: resolveImageUrl(created.image),
  };
}

/**
 * Update an existing menu item (Admin only)
 */
export async function updateMenuItem(
  id: string,
  itemData: Partial<{ name: string; price: number; category: string; image: string }>,
  token?: string
): Promise<MenuItem> {
  const res = await fetch(`${API_BASE}/api/menu/item/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(itemData),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || errData.error || "Failed to update menu item");
  }

  const data = await res.json();
  const updated = data.item;
  return {
    id: String(updated.id || updated._id),
    name: updated.name,
    price: Number(updated.price),
    category: updated.category,
    image: resolveImageUrl(updated.image),
  };
}

/**
 * Delete a menu item (Admin only)
 */
export async function deleteMenuItem(id: string, token?: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/menu/item/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || errData.error || "Failed to delete menu item");
  }
}

/**
 * Fetch system-wide admin stats from backend
 */
export async function getAdminStats(token?: string) {
  const res = await fetch(`${API_BASE}/api/dashboard/admin/stats`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || errData.error || "Failed to fetch admin stats");
  }

  return res.json();
}

/**
 * Fetch all customer orders in system (Admin only)
 */
export async function getAllOrders(token?: string) {
  const res = await fetch(`${API_BASE}/api/orders/admin/all`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || errData.error || "Failed to fetch all orders");
  }

  return res.json();
}

/**
 * Update status of an order (Admin only)
 */
export async function updateOrderStatus(orderId: string, status: "pending" | "paid" | "delivered", token?: string) {
  const res = await fetch(`${API_BASE}/api/orders/admin/${encodeURIComponent(orderId)}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || errData.error || "Failed to update order status");
  }

  return res.json();
}
