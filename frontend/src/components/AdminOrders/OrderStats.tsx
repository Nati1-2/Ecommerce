"use client";

import { OrderStatsData } from "@/types/adminOrder";
import { ShoppingBag, Clock, CheckCircle2, XCircle, DollarSign, TrendingUp } from "lucide-react";

interface Props {
  stats: OrderStatsData;
}

export default function OrderStats({ stats }: Props) {
  const cards = [
    {
      title: "Total Marketplace Orders",
      count: stats.totalOrders.toLocaleString(),
      growth: stats.totalGrowth,
      icon: ShoppingBag,
      color: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Today's New Orders",
      count: `+${stats.todayOrders.toLocaleString()}`,
      growth: stats.todayGrowth,
      isNewToday: true,
      icon: Clock,
      color: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400",
    },
    {
      title: "Pending Fulfillment",
      count: stats.pendingOrders.toLocaleString(),
      growth: 4.2,
      icon: Clock,
      color: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
    },
    {
      title: "Delivered & Completed",
      count: stats.completedOrders.toLocaleString(),
      growth: 12.1,
      icon: CheckCircle2,
      color: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Cancelled / Returned",
      count: stats.cancelledOrders.toLocaleString(),
      growth: stats.cancelledChange,
      icon: XCircle,
      color: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400",
    },
    {
      title: "Gross Transaction GMV",
      count: `$${(stats.totalRevenue / 1000000).toFixed(1)}M`,
      growth: stats.revenueGrowth,
      icon: DollarSign,
      color: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">{card.title}</p>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{card.count}</p>
              <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-3 h-3" />
                <span>
                  {card.isNewToday ? `+${card.growth}% today` : card.growth > 0 ? `↑ ${card.growth}%` : `↓ ${Math.abs(card.growth)}%`} vs last mo
                </span>
              </div>
            </div>
            <div className={`p-2.5 rounded-2xl ${card.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
