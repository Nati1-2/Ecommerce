"use client";

import { PlatformStats } from "@/types/admin";
import { Users, Store, Package, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";

interface Props {
  stats: PlatformStats;
}

export default function OverviewCards({ stats }: Props) {
  const cards = [
    {
      title: "Total Registered Users",
      value: stats.users.toLocaleString(),
      growth: stats.usersGrowth,
      icon: Users,
      color: "from-blue-600 to-indigo-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Total Marketplace Vendors",
      value: stats.vendors.toLocaleString(),
      growth: stats.vendorsGrowth,
      icon: Store,
      color: "from-purple-600 to-pink-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400",
    },
    {
      title: "Total Listed Products",
      value: stats.products.toLocaleString(),
      growth: stats.productsGrowth,
      icon: Package,
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
    },
    {
      title: "Total Processed Orders",
      value: stats.orders.toLocaleString(),
      growth: stats.ordersGrowth,
      icon: ShoppingBag,
      color: "from-teal-600 to-emerald-600",
      bgColor: "bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400",
    },
    {
      title: "Platform Gross Revenue",
      value: `$${(stats.revenue / 1000000).toFixed(1)}M`,
      growth: stats.revenueGrowth,
      icon: DollarSign,
      color: "from-emerald-600 to-green-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-2xl ${card.bgColor}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {card.value}
              </p>

              <div className="flex items-center gap-1 mt-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>↑ {card.growth}% this month</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
