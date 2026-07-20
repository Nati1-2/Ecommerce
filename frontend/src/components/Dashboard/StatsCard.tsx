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
      color: "text-blue-500 bg-blue-50 border-blue-100/50",
    },
    {
      label: "Wishlist Items",
      value: wishlistCount,
      icon: Heart,
      color: "text-rose-500 bg-rose-50 border-rose-100/50",
    },
    {
      label: "Reviews Submitted",
      value: reviewsCount,
      icon: MessageSquare,
      color: "text-indigo-500 bg-indigo-50 border-indigo-100/50",
    },
    {
      label: "Rewards Points",
      value: user.points,
      icon: Award,
      color: "text-amber-500 bg-amber-50 border-amber-100/50",
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
            className="p-5 border border-gray-100 bg-white rounded-3xl shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            {/* Round Icon */}
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${item.color}`}>
              <Icon className="w-5 h-5" />
            </div>

            {/* Content math counts */}
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                {item.label}
              </p>
              <h4 className="text-lg font-black text-gray-900 mt-0.5 tracking-tight">
                {item.value.toLocaleString()}
              </h4>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
