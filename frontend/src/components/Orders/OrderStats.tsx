"use client";

import { useOrderStore } from "@/store/orderStore";
import { CheckCircle2, RotateCw, XCircle, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderStats() {
  const { orders } = useOrderStore();

  const total = orders.length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;
  const processing = orders.filter((o) => o.status === "Processing").length;
  const cancelled = orders.filter((o) => o.status === "Cancelled").length;

  const stats = [
    { label: "Total Orders", value: total, icon: ShoppingBag, color: "text-blue-500 bg-blue-50 border-blue-100" },
    { label: "Delivered", value: delivered, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { label: "Processing", value: processing, icon: RotateCw, color: "text-amber-600 bg-amber-50 border-amber-100" },
    { label: "Cancelled", value: cancelled, icon: XCircle, color: "text-red-600 bg-red-50 border-red-100" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.04 }}
            className="p-4 border border-gray-100 bg-white rounded-2xl shadow-sm flex items-center gap-3"
          >
            {/* Round Icon status */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${stat.color}`}>
              <Icon className="w-4.5 h-4.5" />
            </div>

            {/* details */}
            <div className="min-w-0">
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                {stat.label}
              </p>
              <h4 className="text-base font-black text-gray-900 mt-0.5 tracking-tight">
                {stat.value}
              </h4>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
