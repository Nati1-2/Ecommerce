"use client";

import { ProductStatsData } from "@/types/adminProduct";
import { Package, Clock, CheckCircle2, XCircle, AlertTriangle, TrendingUp } from "lucide-react";

interface Props {
  stats: ProductStatsData;
}

export default function ProductStats({ stats }: Props) {
  const cards = [
    {
      title: "Total Marketplace Catalog",
      count: stats.totalProducts.toLocaleString(),
      growth: stats.productsGrowth,
      icon: Package,
      color: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Pending Approval Queue",
      count: stats.pendingApproval.toLocaleString(),
      growth: stats.pendingNewToday,
      isNewToday: true,
      icon: Clock,
      color: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
    },
    {
      title: "Approved Published Items",
      count: stats.approvedProducts.toLocaleString(),
      growth: stats.approvedGrowth,
      icon: CheckCircle2,
      color: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Rejected Submissions",
      count: stats.rejectedProducts.toLocaleString(),
      growth: stats.rejectedChange,
      icon: XCircle,
      color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    },
    {
      title: "Reported / Flagged Items",
      count: stats.reportedProducts.toLocaleString(),
      growth: stats.reportedFlags,
      isFlagged: true,
      icon: AlertTriangle,
      color: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{card.title}</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{card.count}</p>
              <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>
                  {card.isNewToday
                    ? `+${card.growth} new today`
                    : card.isFlagged
                    ? `${card.growth} new flags`
                    : card.growth > 0
                    ? `↑ ${card.growth}%`
                    : `↓ ${Math.abs(card.growth)}%`} vs last month
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-2xl ${card.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
