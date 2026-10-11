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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
      {stats.map((item, idx) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
            className="p-5 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-xs flex items-center gap-4 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all"
          >
            {/* Round Icon */}
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${item.color}`}>
              <Icon className="w-5 h-5" />
            </div>

            {/* Content math counts */}
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider truncate">
                {item.label}
              </p>
              <h4 className="text-xl font-black text-slate-900 dark:text-white mt-0.5 tracking-tight tabular-nums">
                {item.value.toLocaleString()}
              </h4>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
