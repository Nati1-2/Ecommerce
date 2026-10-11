"use client";

import { VendorMetrics } from "@/types/vendor";
import { DollarSign, ShoppingBag, PackageCheck, Users, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  metrics: VendorMetrics;
}

export default function RevenueCards({ metrics }: Props) {
  const cards = [
    {
      title: "Store Gross Revenue",
      value: `$${(metrics.totalRevenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: `${metrics.revenueChangePercent >= 0 ? "+" : ""}${metrics.revenueChangePercent}%`,
      isUp: metrics.revenueChangePercent > 0,
      isNeutral: metrics.revenueChangePercent === 0,
      icon: DollarSign,
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40",
      gradient: "from-blue-500/5 to-transparent",
    },
    {
      title: "Total Customer Orders",
      value: (metrics.totalOrders ?? 0).toLocaleString(),
      change: `${metrics.ordersChangePercent >= 0 ? "+" : ""}${metrics.ordersChangePercent}%`,
      isUp: metrics.ordersChangePercent > 0,
      isNeutral: metrics.ordersChangePercent === 0,
      icon: ShoppingBag,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40",
      gradient: "from-emerald-500/5 to-transparent",
    },
    {
      title: "Units Sold",
      value: (metrics.productsSold ?? 0).toLocaleString(),
      change: `${metrics.productsSoldChangePercent >= 0 ? "+" : ""}${metrics.productsSoldChangePercent}%`,
      isUp: metrics.productsSoldChangePercent > 0,
      isNeutral: metrics.productsSoldChangePercent === 0,
      icon: PackageCheck,
      color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-900/40",
      gradient: "from-purple-500/5 to-transparent",
    },
    {
      title: "Active Buyers",
      value: (metrics.totalCustomers ?? 0).toLocaleString(),
      change: `${metrics.customersChangePercent >= 0 ? "+" : ""}${metrics.customersChangePercent}%`,
      isUp: metrics.customersChangePercent > 0,
      isNeutral: metrics.customersChangePercent === 0,
      icon: Users,
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40",
      gradient: "from-amber-500/5 to-transparent",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:shadow-md transition-all hover:border-slate-300 dark:hover:border-slate-700 relative overflow-hidden bg-gradient-to-br ${card.gradient}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-2xl ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {card.value}
              </h3>
              <div className="flex items-center gap-1.5 mt-2.5">
                <span
                  className={`text-xs font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-full border shadow-2xs ${
                    card.isNeutral
                      ? "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                      : card.isUp
                      ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800"
                      : "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800"
                  }`}
                >
                  {card.isNeutral ? (
                    <Minus className="w-3 h-3" />
                  ) : card.isUp ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  {card.change}
                </span>
                <span className="text-[11px] font-medium text-slate-400">vs last 30d</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
