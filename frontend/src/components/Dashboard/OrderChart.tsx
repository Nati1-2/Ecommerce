"use client";

import { useState } from "react";
import { useDashboardStore } from "@/store/dashboardStore";
import { BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderChart() {
  const { orders } = useDashboardStore();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Group orders by month
  const ordersByMonth: Record<string, number> = {
    Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0,
  };

  orders.forEach((order) => {
    if (order.date) {
      const date = new Date(order.date);
      if (!isNaN(date.getTime())) {
        const monthStr = date.toLocaleString("en-US", { month: "short" });
        if (ordersByMonth[monthStr] !== undefined) {
          ordersByMonth[monthStr]++;
        }
      }
    }
  });

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonthIdx = new Date().getMonth();
  const historicalData = [];

  for (let i = 6; i >= 0; i--) {
    const idx = (currentMonthIdx - i + 12) % 12;
    const month = months[idx];
    historicalData.push({
      month,
      orders: ordersByMonth[month] || 0,
    });
  }

  // Calculate real trend between current and previous month
  const currentMonthOrders = historicalData[historicalData.length - 1]?.orders || 0;
  const prevMonthOrders = historicalData[historicalData.length - 2]?.orders || 0;
  let trendPercent = 0;
  if (prevMonthOrders > 0) {
    trendPercent = Math.round(((currentMonthOrders - prevMonthOrders) / prevMonthOrders) * 100);
  } else if (currentMonthOrders > 0) {
    trendPercent = 100;
  }

  const maxOrders = Math.max(...historicalData.map((d) => d.orders), 1);
  const totalPeriodOrders = historicalData.reduce((acc, d) => acc + d.orders, 0);

  return (
    <div className="p-6 border border-slate-200/80 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-xs space-y-5 select-none relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
            Order Analytics
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold leading-none">
            Purchase frequency (last 7 months)
          </p>
        </div>

        {totalPeriodOrders > 0 ? (
          <span
            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0 border ${
              trendPercent > 0
                ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800"
                : trendPercent < 0
                ? "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800"
                : "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            }`}
          >
            {trendPercent > 0 ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : trendPercent < 0 ? (
              <TrendingDown className="w-3.5 h-3.5" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            {trendPercent > 0 ? `+${trendPercent}%` : `${trendPercent}%`} vs last mo
          </span>
        ) : (
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
            0 orders recorded
          </span>
        )}
      </div>

      {/* Interactive Bar Chart */}
      <div className="relative pt-4 pb-2">
        <div className="flex justify-between items-end h-32 relative">
          {/* Grid lines background */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
            <div className="border-t border-dashed border-slate-200 dark:border-slate-800 w-full" />
            <div className="border-t border-dashed border-slate-200 dark:border-slate-800 w-full" />
            <div className="border-t border-dashed border-slate-200 dark:border-slate-800 w-full" />
            <div className="border-t border-dashed border-slate-200 dark:border-slate-800 w-full" />
          </div>

          {historicalData.map((data, idx) => {
            const barHeightPercent = (data.orders / maxOrders) * 100;
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={data.month}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="flex flex-col items-center flex-1 group cursor-pointer relative"
              >
                {/* Tooltip Overlay */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: -8, scale: 1 }}
                    className="absolute -top-12 bg-slate-900 dark:bg-slate-800 text-white font-black text-[10px] px-2.5 py-1.5 rounded-xl shadow-lg z-20 flex flex-col items-center pointer-events-none shrink-0 border border-slate-700 whitespace-nowrap"
                  >
                    <span>{data.orders} {data.orders === 1 ? "Order" : "Orders"}</span>
                    <span className="text-[8px] text-slate-400 font-bold mt-0.5">{data.month}</span>
                    <div className="w-1.5 h-1.5 bg-slate-900 dark:bg-slate-800 rotate-45 absolute -bottom-0.75 left-1/2 -translate-x-1/2" />
                  </motion.div>
                )}

                {/* Animated Bar Column */}
                <div className="w-7 sm:w-8.5 bg-slate-100 dark:bg-slate-800/60 rounded-t-xl overflow-hidden h-28 flex items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${barHeightPercent}%` }}
                    transition={{ duration: 0.6, delay: idx * 0.04 }}
                    className={`w-full rounded-t-lg transition-all duration-200 ${
                      data.orders === 0
                        ? "bg-transparent"
                        : isHovered
                        ? "bg-blue-600 dark:bg-blue-500 shadow-lg shadow-blue-500/20"
                        : "bg-blue-400/60 dark:bg-blue-500/40 group-hover:bg-blue-500/80"
                    }`}
                  />
                </div>

                {/* X axis labels */}
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-2">
                  {data.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
