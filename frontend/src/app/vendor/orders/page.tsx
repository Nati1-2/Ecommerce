"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vendorApi } from "@/services/api/vendorApi";
import { useVendorStore } from "@/store/vendorStore";
import OrderTimelineModal from "@/components/vendor/orders/OrderTimelineModal";
import { VendorOrder, OrderStatus } from "@/types/vendor";
import {
  ShoppingBag,
  Clock,
  PackageCheck,
  Truck,
  CheckCircle2,
  Eye,
  Search,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function VendorOrdersPage() {
  const queryClient = useQueryClient();
  const { showToast } = useVendorStore();
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [activeModalOrder, setActiveModalOrder] = useState<VendorOrder | null>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["vendor-orders"],
    queryFn: vendorApi.getOrders,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      vendorApi.updateOrderStatus(id, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["vendor-orders"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-metrics"] });
      showToast(`Order ${updated.orderNumber} updated to ${updated.status}`, "success");
    },
  });

  // Calculate Order Statistics
  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const processingCount = orders.filter((o) => o.status === "Processing").length;
  const shippedCount = orders.filter((o) => o.status === "Shipped").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;

  const filteredOrders = orders.filter((o) => {
    const matchesTab = selectedStatusTab === "All" || o.status === selectedStatusTab;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Customer Orders & Fulfillment
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Track incoming customer orders, manage shipping labels, update statuses, and generate tax invoices.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Pending</p>
            <p className="text-xl font-black text-slate-900 dark:text-white tabular-nums">{pendingCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Processing</p>
            <p className="text-xl font-black text-slate-900 dark:text-white tabular-nums">{processingCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-xl">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Shipped</p>
            <p className="text-xl font-black text-slate-900 dark:text-white tabular-nums">{shippedCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Delivered</p>
            <p className="text-xl font-black text-slate-900 dark:text-white tabular-nums">{deliveredCount}</p>
          </div>
        </div>
      </div>

      {/* Orders Filter & Table */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl w-full sm:w-auto">
            {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedStatusTab(tab)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  selectedStatusTab === tab
                    ? "bg-white dark:bg-[#111827] text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Order # or customer email..."
              className="w-full pl-10 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200/80 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Order ID</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Items Preview</th>
                <th className="py-3.5 px-6">Total Amount</th>
                <th className="py-3.5 px-6">Payment</th>
                <th className="py-3.5 px-6">Fulfillment Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs font-semibold">
                    Fetching live orders from MongoDB...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">
                          No Customer Orders Found
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Orders placed by customers for your store products will appear here with live updates.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-850 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-xs text-slate-900 dark:text-white">
                      {order.orderNumber}
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900 dark:text-white text-xs">{order.customerName}</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">{order.customerEmail}</p>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate block">
                        {order.items[0]?.productName || "Product"}
                        {order.items.length > 1 && ` (+${order.items.length - 1} more)`}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-black text-slate-900 dark:text-white tabular-nums">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={cn(
                          "text-[11px] font-bold px-2 py-0.5 rounded-full border",
                          order.paymentStatus === "Paid"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800/60"
                        )}
                      >
                        {order.paymentStatus} ({order.paymentMethod})
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatusMutation.mutate({
                            id: order.id,
                            status: e.target.value as OrderStatus,
                          })
                        }
                        className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 font-semibold outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setActiveModalOrder(order)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-sm shadow-blue-500/20 active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <OrderTimelineModal
        order={activeModalOrder}
        onClose={() => setActiveModalOrder(null)}
        onPrintInvoice={(o) => showToast(`Printed Tax Invoice for ${o.orderNumber}`, "success")}
        onPrintShippingLabel={(o) => showToast(`Generated Shipping Label for ${o.orderNumber}`, "success")}
      />
    </div>
  );
}
