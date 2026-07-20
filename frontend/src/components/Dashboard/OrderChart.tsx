"use client";

import { useState } from "react";
import { useDashboardStore } from "@/store/dashboardStore";
import { BarChart3, TrendingUp, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

const HISTORICAL_DATA = [
  { month: "Jan", orders: 2 },
  { month: "Feb", orders: 4 },
  { month: "Mar", orders: 3 },
  { month: "Apr", orders: 6 },
  { month: "May", orders: 5 },
  { month: "Jun", orders: 8 },
  { month: "Jul", orders: 12 },
];

export default function OrderChart() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Math dimensions
  const chartHeight = 120;
  const maxOrders = Math.max(...HISTORICAL_DATA.map((d) => d.orders));

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-5 select-none relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-4.5 h-4.5 text-[#007BFF]" />
            Order Analytics
          </h3>
          <p className="text-[10px] text-gray-400 font-semibold leading-none">
            Purchase frequency timeline
          </p>
        </div>

        <span className="text-[9px] font-black text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1.5 shrink-0">
          <TrendingUp className="w-3.5 h-3.5" />
          +24% vs last Q
        </span>
      </div>

      {/* SVG Interactive Bar Chart */}
      <div className="relative pt-4 pb-2">
        <div className="flex justify-between items-end h-32 relative">
          
          {/* Grid lines background */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
            <div className="border-t border-dashed border-gray-100 w-full" />
            <div className="border-t border-dashed border-gray-100 w-full" />
            <div className="border-t border-dashed border-gray-100 w-full" />
            <div className="border-t border-dashed border-gray-100 w-full" />
          </div>

          {HISTORICAL_DATA.map((data, idx) => {
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
                    className="absolute -top-12 bg-gray-900 text-white font-black text-[9px] px-2.5 py-1.5 rounded-xl shadow z-20 flex flex-col items-center pointer-events-none shrink-0"
                  >
                    <span>{data.orders} Orders</span>
                    <span className="text-[7px] text-gray-400 font-bold mt-0.5">{data.month} 2026</span>
                    <div className="w-1.5 h-1.5 bg-gray-900 rotate-45 absolute -bottom-0.75 left-1/2 -translate-x-1/2" />
                  </motion.div>
                )}

                {/* Animated Bar Column */}
                <div className="w-7 sm:w-8.5 bg-gray-50 rounded-t-xl overflow-hidden h-28 flex items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${barHeightPercent}%` }}
                    transition={{ duration: 0.7, delay: idx * 0.05 }}
                    className={`w-full rounded-t-lg transition-all duration-200 ${
                      isHovered
                        ? "bg-[#007BFF] shadow-lg shadow-blue-500/20"
                        : "bg-blue-200/60 group-hover:bg-blue-300/80"
                    }`}
                  />
                </div>

                {/* X axis labels */}
                <span className="text-[10px] text-gray-400 font-bold mt-2">
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
