"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import {
  Truck,
  CheckCircle2,
  RotateCw,
  AlertTriangle,
  Eye,
  ArrowRight,
  X,
  Download,
  RefreshCw,
  Package,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function RecentOrders({ onViewAll }: { onViewAll?: () => void }) {
  const { user } = useAuthStore();
  const addItemToCart = useCartStore((s) => s.addItem);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [reorderedId, setReorderedId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = () => {
    setLoading(true);
    setError(null);
    const userIdQuery = user?.id ? `?userId=${user.id}` : "";
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    fetch(`/api/orders${userIdQuery}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Orders fetch failed: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data)
          ? data
          : data.success && Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.orders)
          ? data.orders
          : [];

        const mapped = list.map((o: any) => ({
          id: o.orderId || o.id || o._id,
          status: o.status || o.orderStatus || "Processing",
          amount: o.pricing?.total || o.totalAmount || o.grandTotal || o.amount || 0,
          date: new Date(o.createdAt || Date.now()).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          itemsCount: o.items?.length || 1,
          items: o.items || [],
          shippingAddress: o.shippingAddress || null,
          trackingNumber: o.trackingNumber || "",
          carrier: o.carrier || "Standard Carrier",
          paymentStatus: o.paymentStatus || "PAID",
        }));
        setOrders(mapped);
      })
      .catch((err) => {
        console.warn("Orders fetch notice:", err.message);
        setError("Unable to retrieve recent orders at this time.");
        setOrders([]);
      })
      .finally(() => setLoading(false));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Shipped":
        return {
          icon: Truck,
          style: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/40",
          pill: "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/40",
        };
      case "Delivered":
        return {
          icon: CheckCircle2,
          style: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40",
          pill: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40",
        };
      case "Processing":
      case "Pending":
        return {
          icon: RotateCw,
          style: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/40",
          pill: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/40",
        };
      case "Cancelled":
        return {
          icon: AlertTriangle,
          style: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-900/40",
          pill: "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-900/40",
        };
      default:
        return {
          icon: Package,
          style: "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
          pill: "text-slate-700 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
        };
    }
  };

  const handleReorder = (order: any) => {
    (order.items || []).forEach((item: any) => {
      addItemToCart({
        productId: item.productId || item.id,
        name: item.name || item.productName || "Product",
        price: item.price || 0,
        image: item.image || item.imageUrl || "",
        quantity: item.quantity || 1,
      });
    });
    setReorderedId(order.id);
    setTimeout(() => setReorderedId(null), 3000);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 shadow-xs space-y-4 select-none">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
            Purchases & Orders
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
            Track fulfillment, receipts, and order statuses
          </p>
        </div>

        {onViewAll && orders.length > 0 && (
          <button
            onClick={onViewAll}
            className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 transition-all cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-12 space-y-3 animate-pulse">
          <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full" />
          <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full" />
        </div>
      ) : error ? (
        <div className="py-8 px-4 text-center rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-2.5">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <p className="text-xs text-rose-700 dark:text-rose-400 font-bold">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-10 px-4 text-center rounded-2xl bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800/60 space-y-3">
          <Package className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto stroke-[1.5]" />
          <div>
            <h4 className="text-xs font-black text-slate-700 dark:text-slate-300">
              No orders placed yet
            </h4>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
              Items you order will appear here with live tracking and receipts.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {orders.map((order, idx) => {
            const config = getStatusIcon(order.status);
            const StatusIcon = config.icon;

            return (
              <div
                key={order.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 ${
                  idx === 0 ? "pt-2" : ""
                } ${idx === orders.length - 1 ? "pb-0" : ""}`}
              >
                {/* Left detail elements */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border",
                      config.style
                    )}
                  >
                    <StatusIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-xs font-black text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                      >
                        #{order.id}
                      </button>
                      <span
                        className={cn(
                          "text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 border",
                          config.pill
                        )}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                      Purchased on {order.date} • {order.itemsCount}{" "}
                      {order.itemsCount === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>

                {/* Right price and CTAs */}
                <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0">
                  <span className="text-xs font-black text-slate-900 dark:text-white tabular-nums">
                    {formatPrice(order.amount)}
                  </span>

                  <div className="flex items-center gap-2">
                    {order.items?.length > 0 && (
                      <button
                        onClick={() => handleReorder(order)}
                        className="py-1.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3 text-slate-400" />
                        <span>{reorderedId === order.id ? "Added!" : "Re-order"}</span>
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200/80 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
                      title="View Order Details"
                      aria-label={`View order ${order.id} details`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl z-10 border border-slate-200/80 dark:border-slate-800 space-y-4 sm:space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      Order #{selectedOrder.id}
                    </h3>
                    <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/80 dark:border-emerald-800">
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                    Placed on {selectedOrder.date}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close order details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status & Tracking info */}
              <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 dark:text-white">
                      Tracking: {selectedOrder.trackingNumber || "Pending Dispatch"}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                      Carrier: {selectedOrder.carrier}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-xl border border-blue-200/60 dark:border-blue-900/40">
                  {selectedOrder.status}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Order Items
                </h4>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                    {selectedOrder.items.map((item: any, i: number) => (
                      <div key={i} className="p-3.5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          {item.image && (
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                              Qty: {item.quantity || 1}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-white tabular-nums">
                          {formatPrice(item.price || 0)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No item breakdown available.</p>
                )}
              </div>

              {/* Shipping & Payment summary */}
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                    Shipping Address
                  </p>
                  {selectedOrder.shippingAddress?.street ? (
                    <>
                      <p className="text-slate-900 dark:text-white font-black">
                        {selectedOrder.shippingAddress.street}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {selectedOrder.shippingAddress.city},{" "}
                        {selectedOrder.shippingAddress.state}{" "}
                        {selectedOrder.shippingAddress.zipCode || selectedOrder.shippingAddress.postalCode}
                      </p>
                    </>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Standard Digital / Electronic Delivery
                    </p>
                  )}
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                    Total Paid
                  </p>
                  <p className="text-slate-900 dark:text-white font-black text-sm tabular-nums">
                    {formatPrice(selectedOrder.amount)}
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                    Encrypted Transaction
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  onClick={handlePrintInvoice}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                {selectedOrder.items?.length > 0 && (
                  <button
                    onClick={() => handleReorder(selectedOrder)}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Re-order Items</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
