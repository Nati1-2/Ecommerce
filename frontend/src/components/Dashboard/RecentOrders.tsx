"use client";

import { useDashboardStore } from "@/store/dashboardStore";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Truck, CheckCircle2, RotateCw, AlertTriangle, Eye, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RecentOrders() {
  const { orders } = useDashboardStore();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Shipped":
        return { icon: Truck, style: "text-blue-600 bg-blue-50 border-blue-100" };
      case "Delivered":
        return { icon: CheckCircle2, style: "text-emerald-600 bg-emerald-50 border-emerald-100" };
      case "Processing":
        return { icon: RotateCw, style: "text-amber-600 bg-amber-50 border-amber-100 animate-spin-slow" };
      case "Cancelled":
        return { icon: AlertTriangle, style: "text-red-600 bg-red-50 border-red-100" };
      default:
        return { icon: CheckCircle2, style: "text-gray-600 bg-gray-50 border-gray-100" };
    }
  };

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-4 select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-gray-900">Recent Purchases</h3>
        <button className="text-[10px] font-bold text-[#007BFF] hover:underline flex items-center gap-1 transition-all">
          View All Orders
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {orders.map((order, idx) => {
          const config = getStatusIcon(order.status);
          const StatusIcon = config.icon;

          return (
            <div
              key={order.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 ${
                idx === 0 ? "pt-0" : ""
              } ${idx === orders.length - 1 ? "pb-0" : ""}`}
            >
              {/* Left detail elements */}
              <div className="flex items-center gap-3.5">
                {/* Round status icon */}
                <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border", config.style)}>
                  <StatusIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-gray-900">#{order.id}</span>
                    <span className={cn(
                      "text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 border",
                      order.status === "Delivered" ? "text-emerald-700 bg-emerald-50/50 border-emerald-100" :
                      order.status === "Shipped" ? "text-blue-700 bg-blue-50/50 border-blue-100" :
                      order.status === "Processing" ? "text-amber-700 bg-amber-50/50 border-amber-100" :
                      "text-red-700 bg-red-50/50 border-red-100"
                    )}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                    Purchased on {order.date} • {order.itemsCount} {order.itemsCount === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>

              {/* Right price and CTAs */}
              <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                <span className="text-xs font-black text-gray-900">
                  {formatPrice(order.amount)}
                </span>
                
                <div className="flex items-center gap-2">
                  <Link
                    href={`/orders/${order.id}/tracking`}
                    className="py-2 px-3.5 bg-gray-50 border border-gray-100 hover:border-gray-200 text-gray-700 font-bold text-[10px] rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Truck className="w-3.5 h-3.5 text-gray-400" />
                    Track
                  </Link>
                  <button className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-400 hover:text-gray-700 rounded-xl transition-colors">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
