"use client";

import { VendorOrder, OrderStatus } from "@/types/vendor";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
  orders: VendorOrder[];
  onUpdateStatus?: (orderId: string, status: OrderStatus) => void;
}

export default function RecentOrdersTable({ orders, onUpdateStatus }: Props) {
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/40";
      case "Processing":
        return "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/40";
      case "Shipped":
        return "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800/40";
      case "Delivered":
        return "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40";
      case "Cancelled":
        return "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800/40";
      default:
        return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between">
      <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Customer Orders</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Latest customer orders requiring fulfillment or dispatch.
          </p>
        </div>
        <Link
          href="/vendor/orders"
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          View All Orders →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
            <tr>
              <th className="py-3.5 px-6">Order ID</th>
              <th className="py-3.5 px-6">Customer</th>
              <th className="py-3.5 px-6">Product</th>
              <th className="py-3.5 px-6">Amount</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {orders.slice(0, 5).map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-4 px-6 font-bold text-slate-900 dark:text-white font-mono text-xs">
                  {order.orderNumber}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={order.customerAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80"}
                      alt={order.customerName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-xs">{order.customerName}</p>
                      <p className="text-[11px] text-slate-400">{order.customerEmail}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 max-w-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={order.items[0]?.productImage}
                      alt={order.items[0]?.productName}
                      className="w-8 h-8 rounded-lg object-cover bg-slate-100 shrink-0"
                    />
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate">
                      {order.items[0]?.productName}
                      {order.items.length > 1 && ` (+${order.items.length - 1} more)`}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                  ${order.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={cn(
                      "text-[11px] font-bold px-2.5 py-1 rounded-full border",
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
                    className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-none rounded-lg px-2.5 py-1 font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
