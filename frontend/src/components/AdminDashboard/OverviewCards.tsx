"use client";

import { PlatformStats } from "@/types/admin";
import { Users, Store, Package, ShoppingBag, DollarSign, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  stats: PlatformStats;
}

function formatRevenue(amount?: number): string {
  const val = typeof amount === "number" ? amount : 0;
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}K`;
  return `$${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function OverviewCards({ stats }: Props) {
  const safeStats = stats || ({} as PlatformStats);

  const cards = [
    {
      title: "Registered Users",
      value: (safeStats.users ?? 0).toLocaleString(),
      growth: safeStats.usersGrowth ?? 0,
      icon: Users,
      bgColor: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40",
      gradient: "from-blue-500/5 to-transparent",
    },
    {
      title: "Marketplace Vendors",
      value: (safeStats.vendors ?? 0).toLocaleString(),
      growth: safeStats.vendorsGrowth ?? 0,
      icon: Store,
      bgColor: "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-900/40",
      gradient: "from-purple-500/5 to-transparent",
    },
    {
      title: "Active Catalog Items",
      value: (safeStats.products ?? 0).toLocaleString(),
      growth: safeStats.productsGrowth ?? 0,
      icon: Package,
      bgColor: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40",
      gradient: "from-amber-500/5 to-transparent",
    },
    {
      title: "Processed Orders",
      value: (safeStats.orders ?? 0).toLocaleString(),
      growth: safeStats.ordersGrowth ?? 0,
      icon: ShoppingBag,
      bgColor: "bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 border border-teal-200/60 dark:border-teal-900/40",
      gradient: "from-teal-500/5 to-transparent",
    },
    {
      title: "Gross Merchandise Value",
      value: formatRevenue(safeStats.revenue),
      growth: safeStats.revenueGrowth ?? 0,
      icon: DollarSign,
      bgColor: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40",
      gradient: "from-emerald-500/5 to-transparent",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isPositive = card.growth > 0;
        const isNeutral = card.growth === 0;
        const GrowthIcon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
        const growthColor = isNeutral
          ? "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          : isPositive
          ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800"
          : "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800";

        return (
          <div
            key={card.title}
            className={`bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all hover:border-slate-300 dark:hover:border-slate-700 flex flex-col justify-between space-y-4 relative overflow-hidden bg-gradient-to-br ${card.gradient}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-2xl ${card.bgColor} shadow-2xs`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
                {card.value}
              </p>

              <div className="flex items-center gap-1.5 mt-2">
                <span className={`flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-full border shadow-2xs ${growthColor}`}>
                  <GrowthIcon className="w-3 h-3" />
                  <span>
                    {isNeutral
                      ? "0%"
                      : `${isPositive ? "+" : ""}${card.growth}%`}
                  </span>
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
