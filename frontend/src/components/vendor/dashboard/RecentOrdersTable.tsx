"use client";

import { VendorOrder, OrderStatus } from "@/types/vendor";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";

interface Props {
  orders: VendorOrder[];
  onUpdateStatus?: (orderId: string, status: OrderStatus) => void;
}

export default function RecentOrdersTable({ orders, onUpdateStatus }: Props) {
  const safeOrders = Array.isArray(orders) ? orders : [];

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "Processing":
        return "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "Shipped":
        return "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-800";
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col justify-between">
      <div className="p-6 sm:p-7 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Recent Customer Orders
            </h3>
            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {safeOrders.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real customer orders requiring item fulfillment or dispatch.
          </p>
        </div>
        <Link
          href="/vendor/orders"
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 group"
        >
          <span>View All Orders</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[10px] uppercase font-extrabold tracking-wider">
            <tr>
              <th className="py-3.5 px-6">Order ID</th>
              <th className="py-3.5 px-6">Customer</th>
              <th className="py-3.5 px-6">Product Item</th>
              <th className="py-3.5 px-6">Total Amount</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6 text-right">Fulfillment Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {safeOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShoppingBag className="w-8 h-8 text-slate-300 dark:text-slate-600 stroke-[1.5]" />
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                      No orders placed for your store yet.
                    </p>
                    <p className="text-xs text-slate-400">
                      When customers purchase items from your catalog, their orders will appear here.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              safeOrders.slice(0, 6).map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 font-black text-slate-900 dark:text-white font-mono text-xs">
                    {order.orderNumber}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {order.customerName ? order.customerName.charAt(0).toUpperCase() : "C"}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-xs">{order.customerName}</p>
                        {order.customerEmail && (
                          <p className="text-[11px] text-slate-400">{order.customerEmail}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 max-w-xs">
                    <div className="flex items-center gap-2.5">
                      {order.items[0]?.productImage ? (
                        <img
                          src={order.items[0].productImage}
                          alt={order.items[0]?.productName || "Product"}
                          className="w-8 h-8 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                      )}
                      <span className="text-xs text-slate-800 dark:text-slate-200 font-semibold truncate">
                        {order.items[0]?.productName || "Order Item"}
                        {order.items.length > 1 && ` (+${order.items.length - 1} more)`}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-black text-slate-900 dark:text-white">
                    ${(order.totalAmount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={cn(
                        "text-[10px] font-black px-2.5 py-1 rounded-full border shadow-2xs inline-block",
                        getStatusBadge(order.status)
                      )}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateStatus && onUpdateStatus(order.id, e.target.value as OrderStatus)}
                      className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 rounded-xl px-2.5 py-1.5 font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all cursor-pointer shadow-2xs"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
