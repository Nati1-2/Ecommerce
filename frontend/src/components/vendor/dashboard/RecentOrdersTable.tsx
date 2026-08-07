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
        return "bg-amber-50 text-amber-600   border-amber-200 ";
      case "Processing":
        return "bg-blue-50 text-blue-600   border-blue-200 ";
      case "Shipped":
        return "bg-purple-50 text-purple-600   border-purple-200 ";
      case "Delivered":
        return "bg-emerald-50 text-emerald-600   border-emerald-200 ";
      case "Cancelled":
        return "bg-rose-50 text-rose-600   border-rose-200 ";
      default:
        return "bg-slate-100 text-slate-600  ";
    }
  };

  return (
    <div className="bg-white  rounded-3xl border border-slate-100  shadow-sm overflow-hidden flex flex-col justify-between">
      <div className="p-6 pb-4 border-b border-slate-50  flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 ">Recent Customer Orders</h3>
          <p className="text-xs text-slate-500  mt-0.5">
            Latest customer orders requiring fulfillment or dispatch.
          </p>
        </div>
        <Link
          href="/vendor/orders"
          className="text-xs font-semibold text-blue-600  hover:underline"
        >
          View All Orders →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white  border-b border-slate-50 text-slate-400  text-[10px] uppercase font-bold tracking-wider">
            <tr>
              <th className="py-3.5 px-6">Order ID</th>
              <th className="py-3.5 px-6">Customer</th>
              <th className="py-3.5 px-6">Product</th>
              <th className="py-3.5 px-6">Amount</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 ">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 text-xs font-semibold">
                  No orders found in your store yet.
                </td>
              </tr>
            ) : (
              orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50  transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900  font-mono text-xs">
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
                        <p className="font-semibold text-slate-900  text-xs">{order.customerName}</p>
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
                      <span className="text-xs text-slate-700  font-medium truncate">
                        {order.items[0]?.productName}
                        {order.items.length > 1 && ` (+${order.items.length - 1} more)`}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900 ">
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
                      className="text-xs bg-slate-100  text-slate-700  border-none rounded-lg px-2.5 py-1 font-medium focus:ring-2 focus:ring-blue-600 outline-none"
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
