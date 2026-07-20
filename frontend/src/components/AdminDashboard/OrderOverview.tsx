"use client";

import { AdminOrder } from "@/types/admin";
import { ShoppingBag, Clock, PackageCheck, Truck, CheckCircle2, XCircle } from "lucide-react";

interface Props {
  orders: AdminOrder[];
}

export default function OrderOverview({ orders }: Props) {
  const total = orders.length || 1;
  const pending = orders.filter((o) => o.status === "Pending").length;
  const processing = orders.filter((o) => o.status === "Processing").length;
  const shipped = orders.filter((o) => o.status === "Shipped").length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;
  const cancelled = orders.filter((o) => o.status === "Cancelled").length;

  const statuses = [
    { label: "Pending", count: pending, percent: Math.round((pending / total) * 100), color: "bg-amber-500", text: "text-amber-500", icon: Clock },
    { label: "Processing", count: processing, percent: Math.round((processing / total) * 100), color: "bg-blue-500", text: "text-blue-500", icon: PackageCheck },
    { label: "Shipped", count: shipped, percent: Math.round((shipped / total) * 100), color: "bg-purple-500", text: "text-purple-500", icon: Truck },
    { label: "Delivered", count: delivered, percent: Math.round((delivered / total) * 100), color: "bg-emerald-500", text: "text-emerald-500", icon: CheckCircle2 },
    { label: "Cancelled", count: cancelled, percent: Math.round((cancelled / total) * 100), color: "bg-rose-500", text: "text-rose-500", icon: XCircle },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Global Order Fulfillment Pipeline</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time status breakdown across all platform vendor orders.
          </p>
        </div>
      </div>

      {/* Progress Bars List */}
      <div className="space-y-4">
        {statuses.map((st) => {
          const Icon = st.icon;

          return (
            <div key={st.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                  <Icon className={`w-4 h-4 ${st.text}`} />
                  <span>{st.label}</span>
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {st.count} orders ({st.percent}%)
                </span>
              </div>

              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${st.color} rounded-full transition-all duration-500`}
                  style={{ width: `${Math.max(st.percent, 4)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
