import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice, type Category, type MenuItem } from "@/data/menu";
import {
  getMenuItems,
  createMenuItem,
  deleteMenuItem,
  getAdminStats,
  getAllOrders,
  updateOrderStatus,
} from "@/lib/api";

type OrderItem = {
  id: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
  notes?: string;
  subtotal: number;
  status: "pending" | "paid" | "delivered";
  createdAt: string;
  lines: { itemId: string; itemName: string; itemPrice: number; qty: number }[];
};

export function DashboardPage() {
  const { user, isAdmin, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "menu">("overview");

  // Data states
  const [stats, setStats] = useState<{ totalOrders: number; totalSpend: number; recentOrders: OrderItem[] }>({
    totalOrders: 0,
    totalSpend: 0,
    recentOrders: [],
  });
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Form states for creating a new menu item
  const [showAddMenuModal, setShowAddMenuModal] = useState<boolean>(false);
  const [newMenu, setNewMenu] = useState({
    id: "",
    name: "",
    price: "",
    category: "dishes" as Category,
    image: "",
  });
  const [submittingMenu, setSubmittingMenu] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Load backend data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [itemsData, statsData, ordersData] = await Promise.allSettled([
        getMenuItems(),
        getAdminStats(user?.token),
        getAllOrders(user?.token),
      ]);

      if (itemsData.status === "fulfilled") setMenuItems(itemsData.value);
      if (statsData.status === "fulfilled") setStats(statsData.value);
      if (ordersData.status === "fulfilled" && Array.isArray(ordersData.value.orders)) {
        setOrders(ordersData.value.orders);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  // Handle order status update
  const handleStatusChange = async (orderId: string, newStatus: "pending" | "paid" | "delivered") => {
    try {
      await updateOrderStatus(orderId, newStatus, user?.token);
      setFeedback({ type: "success", message: `Order #${orderId.slice(-6)} updated to '${newStatus}'` });
      
      // Update state locally
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      setStats((prev) => ({
        ...prev,
        recentOrders: prev.recentOrders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      }));
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Failed to update order status" });
    }
  };

  // Handle adding new menu item
  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenu.name.trim() || !newMenu.price.trim()) {
      setFeedback({ type: "error", message: "Name and Price are required" });
      return;
    }

    setSubmittingMenu(true);
    try {
      const created = await createMenuItem(
        {
          id: newMenu.id.trim() || undefined,
          name: newMenu.name.trim(),
          price: parseFloat(newMenu.price),
          category: newMenu.category,
          image: newMenu.image.trim() || undefined,
        },
        user?.token
      );

      setFeedback({ type: "success", message: `Menu item '${created.name}' added successfully!` });
      setShowAddMenuModal(false);
      setNewMenu({ id: "", name: "", price: "", category: "dishes", image: "" });
      
      // Reload items
      const updatedList = await getMenuItems();
      setMenuItems(updatedList);
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Failed to add menu item" });
    } finally {
      setSubmittingMenu(false);
    }
  };

  // Handle deleting menu item
  const handleDeleteMenuItem = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete '${name}'?`)) return;
    try {
      await deleteMenuItem(id, user?.token);
      setFeedback({ type: "success", message: `Deleted menu item '${name}'` });
      setMenuItems((prev) => prev.filter((it) => it.id !== id));
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Failed to delete item" });
    }
  };

  // Filtered orders list
  const filteredOrders = orders.filter((o) => (statusFilter === "all" ? true : o.status === statusFilter));

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-brand/10 text-brand px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              {isAdmin ? "⚡ Admin Console" : "User Dashboard"}
            </span>
            <span className="text-xs text-muted-foreground">• Connected to Backend API</span>
          </div>
          <h1 className="font-display text-3xl font-bold mt-2">
            Welcome back, {user?.name || "Admin"} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {user?.email} • Role: <strong className="capitalize">{user?.role || (isAdmin ? "admin" : "user")}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddMenuModal(true)}
            className="rounded-lg bg-brand text-brand-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition-all shadow-sm flex items-center gap-2"
          >
            <span>+</span> Add Menu Item
          </button>
          <button
            onClick={loadDashboardData}
            className="rounded-lg border border-input px-3.5 py-2 text-sm font-medium hover:bg-accent transition-all"
            title="Refresh live data"
          >
            🔄 Refresh
          </button>
          <button
            onClick={signOut}
            className="rounded-lg border border-red-200 text-red-600 px-3.5 py-2 text-sm font-medium hover:bg-red-50 transition-all"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center justify-between text-sm ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="font-bold text-xs hover:opacity-75">
            ✕
          </button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Total Revenue</p>
          <h3 className="font-display text-2xl font-bold mt-2 text-brand">
            {formatPrice(stats.totalSpend || 0)}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Aggregated order total</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Total Orders</p>
          <h3 className="font-display text-2xl font-bold mt-2">{stats.totalOrders || orders.length}</h3>
          <p className="text-xs text-muted-foreground mt-1">System-wide customer orders</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Menu Catalog</p>
          <h3 className="font-display text-2xl font-bold mt-2">{menuItems.length}</h3>
          <p className="text-xs text-muted-foreground mt-1">Active inventory items</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Backend Status</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-display text-lg font-semibold text-emerald-600">Online & Synced</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Express API + MongoDB</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 mb-6">
        {[
          { id: "overview", label: "📊 System Overview" },
          { id: "orders", label: `📦 Orders Management (${orders.length})` },
          { id: "menu", label: `🍔 Menu Inventory (${menuItems.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === tab.id
                ? "bg-brand text-brand-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display text-xl font-semibold mb-4">Recent Customer Orders</h2>
            {loading ? (
              <p className="text-sm text-muted-foreground py-4">Fetching live order records...</p>
            ) : orders.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No orders placed yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-muted/50 text-xs font-semibold text-muted-foreground uppercase">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id} className="hover:bg-muted/30">
                        <td className="p-3 font-mono text-xs font-semibold">#{o.id.slice(-6)}</td>
                        <td className="p-3">
                          <p className="font-medium">{o.name}</p>
                          <p className="text-xs text-muted-foreground">{o.phone}</p>
                        </td>
                        <td className="p-3 text-xs">
                          {o.lines?.map((l) => `${l.itemName} (x${l.qty})`).join(", ") || "No items"}
                        </td>
                        <td className="p-3 font-semibold">{formatPrice(o.subtotal)}</td>
                        <td className="p-3">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                              o.status === "delivered"
                                ? "bg-emerald-100 text-emerald-800"
                                : o.status === "paid"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o.id, e.target.value as any)}
                            className="rounded border border-input text-xs px-2 py-1 bg-background font-medium"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === "orders" && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h2 className="font-display text-xl font-semibold">Orders Directory</h2>
              <p className="text-xs text-muted-foreground">Manage and update customer order fulfillment statuses in real-time</p>
            </div>
            <div className="flex gap-2">
              {["all", "pending", "paid", "delivered"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                    statusFilter === st
                      ? "bg-brand text-brand-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">No orders matching filter '{statusFilter}'</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/50 text-xs font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer Details</th>
                    <th className="p-3">Address</th>
                    <th className="p-3">Line Items</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-muted/30">
                      <td className="p-3 font-mono text-xs font-semibold">#{o.id.slice(-6)}</td>
                      <td className="p-3">
                        <p className="font-semibold">{o.name}</p>
                        <p className="text-xs text-muted-foreground">{o.phone}</p>
                      </td>
                      <td className="p-3 text-xs max-w-[200px] truncate" title={o.address}>
                        {o.address}
                      </td>
                      <td className="p-3 text-xs">
                        <ul className="list-disc list-inside">
                          {o.lines?.map((l, i) => (
                            <li key={i}>
                              {l.itemName} × {l.qty} ({formatPrice(l.itemPrice)})
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-3 font-bold text-brand">{formatPrice(o.subtotal)}</td>
                      <td className="p-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                            o.status === "delivered"
                              ? "bg-emerald-100 text-emerald-800"
                              : o.status === "paid"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value as any)}
                          className="rounded border border-input text-xs px-2.5 py-1.5 bg-background font-semibold hover:border-brand transition-all"
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="paid">💳 Paid</option>
                          <option value="delivered">✅ Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MENU INVENTORY */}
      {activeTab === "menu" && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h2 className="font-display text-xl font-semibold">Menu Items Catalog</h2>
              <p className="text-xs text-muted-foreground">Manage active menu items stored in the MongoDB database</p>
            </div>
            <button
              onClick={() => setShowAddMenuModal(true)}
              className="rounded-lg bg-brand text-brand-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
            >
              + Create New Item
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-border bg-background overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all">
                <div className="h-40 w-full overflow-hidden bg-muted relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";
                    }}
                  />
                  <span className="absolute top-2 right-2 rounded-full bg-black/70 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                    {item.category}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">ID: {item.id}</span>
                    <h3 className="font-display text-base font-semibold mt-1">{item.name}</h3>
                    <p className="text-base font-bold text-brand mt-2">{formatPrice(item.price)}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                    <button
                      onClick={() => handleDeleteMenuItem(item.id, item.name)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-all"
                    >
                      🗑️ Delete Item
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE MENU ITEM MODAL */}
      {showAddMenuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <h3 className="font-display text-xl font-bold">Add New Menu Item</h3>
              <button onClick={() => setShowAddMenuModal(false)} className="text-muted-foreground hover:text-foreground text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMenuItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Special Peppered Chicken"
                  value={newMenu.name}
                  onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
                  className="w-full rounded-lg border border-input px-3.5 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                    Price (NGN) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 4500"
                    value={newMenu.price}
                    onChange={(e) => setNewMenu({ ...newMenu, price: e.target.value })}
                    className="w-full rounded-lg border border-input px-3.5 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newMenu.category}
                    onChange={(e) => setNewMenu({ ...newMenu, category: e.target.value as Category })}
                    className="w-full rounded-lg border border-input px-3.5 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-brand"
                  >
                    <option value="dishes">Dishes</option>
                    <option value="fries">Fries</option>
                    <option value="drinks">Drinks</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                  Custom ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. d7 or leave empty for auto-UUID"
                  value={newMenu.id}
                  onChange={(e) => setNewMenu({ ...newMenu, id: e.target.value })}
                  className="w-full rounded-lg border border-input px-3.5 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                  Image Path / URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. /images/dish-jollof.jpg or https://..."
                  value={newMenu.image}
                  onChange={(e) => setNewMenu({ ...newMenu, image: e.target.value })}
                  className="w-full rounded-lg border border-input px-3.5 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddMenuModal(false)}
                  className="rounded-lg border border-input px-4 py-2 text-sm font-medium hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingMenu}
                  className="rounded-lg bg-brand text-brand-foreground px-5 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {submittingMenu ? "Adding Item..." : "Save Menu Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
