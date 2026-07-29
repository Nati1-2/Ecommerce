"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle2,
  RotateCw,
  AlertTriangle,
  ChevronLeft,
  Search,
  Filter,
  ShoppingBag,
  Eye,
  MapPin,
  Calendar,
  Receipt,
} from "lucide-react";

interface Order {
  id: string;
  status: string;
  amount: number;
  date: string;
  itemsCount: number;
}

const STATUS_CONFIG: Record<string, { icon: any; label: string; badge: string; row: string }> = {
  Delivered: {
    icon: CheckCircle2,
    label: "Delivered",
    badge: "text-emerald-700 bg-emerald-50 border-emerald-200",
    row: "border-emerald-100/50",
  },
  Shipped: {
    icon: Truck,
    label: "Shipped",
    badge: "text-blue-700 bg-blue-50 border-blue-200",
    row: "border-blue-100/50",
  },
  Processing: {
    icon: RotateCw,
    label: "Processing",
    badge: "text-amber-700 bg-amber-50 border-amber-200",
    row: "border-amber-100/50",
  },
  Cancelled: {
    icon: AlertTriangle,
    label: "Cancelled",
    badge: "text-red-700 bg-red-50 border-red-200",
    row: "border-red-100/50",
  },
};

const FILTERS = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function OrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated, accessToken } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const token = accessToken || (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null);
    if (!isAuthenticated && !token) {
      router.push("/login");
      return;
    }

    if (user?.id) {
      setLoading(true);
      fetch(`/api/orders?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const mapped = data.map((o: any) => ({
              id: o.orderId || o._id || "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
              status: o.status || "Processing",
              amount: o.totalAmount || o.amount || 0,
              date: new Date(o.createdAt || Date.now()).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }),
              itemsCount: o.items?.length || 1,
            }));
            setOrders(mapped);
          } else {
            setOrders([]);
          }
        })
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, isAuthenticated, accessToken]);

  const filtered = orders.filter((o) => {
    const matchesFilter = activeFilter === "All" || o.status === activeFilter;
    const matchesSearch =
      !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.status.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === "All" ? orders.length : orders.filter((o) => o.status === f).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Dashboard
          </button>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#007BFF]" />
            <h1 className="text-sm font-black text-gray-900">My Orders</h1>
            <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {orders.length} total
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#007BFF] focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                activeFilter === f
                  ? "bg-[#007BFF] text-white shadow-md shadow-blue-500/20"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {f}
              {counts[f] > 0 && (
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                  activeFilter === f ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  {counts[f]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders list */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-gray-100 p-5 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-32" />
                    <div className="h-2.5 bg-gray-100 rounded w-48" />
                  </div>
                  <div className="h-4 bg-gray-100 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm py-20 text-center space-y-4"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8 text-[#007BFF]" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-black text-gray-900">
                {orders.length === 0 ? "No orders yet" : "No orders match your filters"}
              </h2>
              <p className="text-xs text-gray-400 font-semibold max-w-xs mx-auto">
                {orders.length === 0
                  ? "When you place your first order, it will appear here."
                  : "Try changing the status filter or search term."}
              </p>
            </div>
            {orders.length === 0 && (
              <Link
                href="/products"
                className="inline-flex items-center gap-2 py-2.5 px-5 bg-[#007BFF] hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-blue-500/20"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Start Shopping
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order, idx) => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG["Processing"];
              const Icon = cfg.icon;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left: icon + info */}
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${cfg.badge}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-black text-gray-900">#{order.id}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-gray-400 font-semibold">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {order.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Receipt className="w-3 h-3" />
                            {order.itemsCount} {order.itemsCount === 1 ? "item" : "items"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: price + actions */}
                    <div className="flex items-center gap-3 sm:justify-end">
                      <span className="text-base font-black text-gray-900">
                        {formatPrice(order.amount)}
                      </span>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/orders/${order.id}/tracking`}
                          className="flex items-center gap-1.5 py-2 px-3.5 bg-gray-50 hover:bg-blue-50 hover:text-[#007BFF] border border-gray-200 hover:border-blue-200 text-gray-600 font-bold text-[10px] rounded-xl transition-all"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          Track
                        </Link>
                        <button className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-700 rounded-xl transition-all">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Summary footer */}
        {!loading && orders.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Orders", value: orders.length, color: "text-blue-600 bg-blue-50" },
              {
                label: "Total Spent",
                value: formatPrice(orders.reduce((s, o) => s + o.amount, 0)),
                color: "text-gray-900 bg-gray-50",
              },
              {
                label: "Delivered",
                value: orders.filter((o) => o.status === "Delivered").length,
                color: "text-emerald-600 bg-emerald-50",
              },
              {
                label: "In Progress",
                value: orders.filter((o) => ["Processing", "Shipped"].includes(o.status)).length,
                color: "text-amber-600 bg-amber-50",
              },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                <div className={`text-lg font-black ${s.color.split(" ")[0]}`}>{s.value}</div>
                <div className="text-[10px] text-gray-400 font-bold mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
