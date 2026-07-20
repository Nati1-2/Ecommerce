"use client";

import { ReviewStatsData } from "@/types/adminReview";
import { MessageSquare, Star, Clock, AlertTriangle, ShieldOff, TrendingUp } from "lucide-react";

interface Props {
  stats: ReviewStatsData;
}

export default function ReviewStats({ stats }: Props) {
  const cards = [
    {
      title: "Total Marketplace Reviews",
      count: "5,000,000",
      growth: stats.totalGrowth,
      icon: MessageSquare,
      color: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Average Storefront Rating",
      count: `${stats.avgRating} ⭐`,
      growth: 0.2,
      icon: Star,
      color: "bg-amber-50 dark:bg-amber-950/40 text-amber-500",
    },
    {
      title: "Pending Moderation Queue",
      count: stats.pendingCount.toLocaleString(),
      growth: 5.4,
      icon: Clock,
      color: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400",
    },
    {
      title: "Reported Content Queue",
      count: stats.reportedCount.toLocaleString(),
      growth: -2.1,
      icon: AlertTriangle,
      color: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400",
    },
    {
      title: "Removed Policy Violations",
      count: stats.removedCount.toLocaleString(),
      growth: -1.4,
      icon: ShieldOff,
      color: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                  {card.growth > 0 ? `↑ ${card.growth}%` : `↓ ${Math.abs(card.growth)}%`} vs last mo
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
