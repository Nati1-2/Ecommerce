"use client";

import { useDashboardStore } from "@/store/dashboardStore";
import { ShoppingCart, Heart, MessageSquare, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function StatsCard() {
  const { orders, wishlistCount, reviewsCount, user } = useDashboardStore();

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingCart,
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/40",
    },
    {
      label: "Wishlist Items",
      value: wishlistCount,
      icon: Heart,
      color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-900/40",
    },
    {
      label: "Reviews Submitted",
      value: reviewsCount,
      icon: MessageSquare,
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/60 dark:border-indigo-900/40",
    },
    {
      label: "Rewards Points",
      value: user.points ?? 0,
      icon: Award,
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/40",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 select-none">
      {stats.map((item, idx) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
            className="p-3.5 sm:p-5 border border-slate-200/80 bg-white rounded-2xl sm:rounded-3xl shadow-xs flex flex-col min-[420px]:flex-row items-start min-[420px]:items-center gap-2.5 sm:gap-3.5 hover:shadow-md hover:border-slate-300 transition-all"
          >
            {/* Icon */}
            <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 border ${item.color}`}>
              <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>

            {/* Content count & label */}
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-bold uppercase tracking-wider leading-snug line-clamp-2">
                {item.label}
              </p>
              <h4 className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5 tracking-tight tabular-nums">
                {item.value.toLocaleString()}
              </h4>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
