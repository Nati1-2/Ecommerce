"use client";

import { useState } from "react";
import { AdminOrderModel } from "@/types/adminOrder";
import { useAdminOrderStore } from "@/store/adminOrderStore";
import { useRouter } from "next/navigation";
import {
  Eye,
  RefreshCcw,
  DollarSign,
  XCircle,
  Truck,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  order: AdminOrderModel;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onCancel: (id: string) => void;
}

export default function OrderRow({ order, isSelected, onToggleSelect, onCancel }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const { setOrderDetailsModal, setStatusModalOrder, setRefundModalOrder } = useAdminOrderStore();

  const getOrderStatusBadge = (status: AdminOrderModel["orderStatus"]) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800";
      case "Shipped":
        return "bg-blue-50 text-blue-600 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800";
      case "Processing":
      case "Confirmed":
        return "bg-purple-50 text-purple-600 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800";
      case "Pending":
        return "bg-amber-50 text-amber-600 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800";
      case "Cancelled":
      case "Refunded":
        return "bg-rose-50 text-rose-600 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800";
    }
  };

  const getPaymentStatusBadge = (status: AdminOrderModel["paymentStatus"]) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800";
      case "Pending":
        return "bg-amber-50 text-amber-600 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800";
      default:
        return "bg-rose-50 text-rose-600 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800";
    }
  };

  const mainProduct = order.products[0];

  return (
    <tr className={cn("hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors", isSelected && "bg-blue-50/30 dark:bg-blue-900/10")}>
      <td className="py-4 px-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(order.id)}
          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
        />
      </td>

      {/* Order ID */}
      <td className="py-4 px-6">
        <span
          onClick={() => setOrderDetailsModal(order)}
          className="font-bold text-blue-600 dark:text-blue-400 font-mono text-xs cursor-pointer hover:underline"
        >
          {order.id}
        </span>
      </td>

      {/* Customer */}
      <td className="py-4 px-6 max-w-xs">
        <div className="flex items-center gap-3">
          <img
            src={order.customerAvatar}
            alt={order.customerName}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 shrink-0"
          />
          <div className="min-w-0">
            <p className="font-bold text-slate-900 dark:text-white text-xs truncate">{order.customerName}</p>
            <p className="text-[11px] text-slate-400 truncate">{order.customerEmail}</p>
          </div>
        </div>
      </td>

      {/* Vendor Store */}
      <td className="py-4 px-6">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{order.vendorStore}</span>
      </td>

      {/* Item Preview */}
      <td className="py-4 px-6 max-w-xs">
        {mainProduct && (
          <div className="flex items-center gap-2">
            <img
              src={mainProduct.image}
              alt={mainProduct.name}
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{mainProduct.name}</p>
              <p className="text-[10px] text-slate-400">Qty: {mainProduct.quantity} • {mainProduct.variant}</p>
            </div>
          </div>
        )}
      </td>

      {/* Amount */}
      <td className="py-4 px-6">
        <p className="text-xs font-extrabold text-slate-900 dark:text-white">
          ${order.amount.toLocaleString()}
        </p>
      </td>

      {/* Payment Status */}
      <td className="py-4 px-6">
        <span className={cn("text-[11px] font-bold px-2.5 py-0.5 rounded-full border", getPaymentStatusBadge(order.paymentStatus))}>
          {order.paymentStatus}
        </span>
      </td>

      {/* Order Status */}
      <td className="py-4 px-6">
        <span className={cn("text-[11px] font-bold px-2.5 py-0.5 rounded-full border", getOrderStatusBadge(order.orderStatus))}>
          {order.orderStatus}
        </span>
      </td>

      {/* Created Date */}
      <td className="py-4 px-6 text-xs text-slate-700 dark:text-slate-300 font-medium">
        {order.createdAt}
      </td>

      {/* Actions */}
      <td className="py-4 px-6 text-right relative">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setOrderDetailsModal(order)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
            title="View Order Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-40 text-left text-xs font-semibold">
                <button
                  onClick={() => {
                    setOrderDetailsModal(order);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  <span>View Details</span>
                </button>

                <button
                  onClick={() => {
                    setStatusModalOrder(order);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <RefreshCcw className="w-3.5 h-3.5 text-purple-500" />
                  <span>Update Status</span>
                </button>

                {order.orderStatus !== "Refunded" && (
                  <button
                    onClick={() => {
                      setRefundModalOrder(order);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center gap-2"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Process Refund</span>
                  </button>
                )}

                {order.orderStatus !== "Cancelled" && (
                  <button
                    onClick={() => {
                      onCancel(order.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 mt-1 pt-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel Order</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}
