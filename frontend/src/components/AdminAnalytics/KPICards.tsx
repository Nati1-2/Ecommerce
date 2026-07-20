"use client";

import { useKPIMetrics } from "@/hooks/useAdminAnalyticsQuery";
import { DollarSign, TrendingUp, ShoppingBag, Users, Store, Percent } from "lucide-react";

export default function KPICards() {
  const { data: metrics = [], isLoading } = useKPIMetrics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        ))}
      </div>
    );
  }

  const getIcon = (cat: string) => {
    switch (cat) {
      case "gmv":
        return <DollarSign className="w-5 h-5 text-blue-500" />;
      case "revenue":
        return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case "orders":
        return <ShoppingBag className="w-5 h-5 text-purple-500" />;
      case "customers":
        return <Users className="w-5 h-5 text-amber-500" />;
      case "vendors":
        return <Store className="w-5 h-5 text-cyan-500" />;
      default:
        return <Percent className="w-5 h-5 text-rose-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
      {metrics.map((kpi) => (
        <div
          key={kpi.id}
          className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
        >
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">{kpi.title}</p>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{kpi.value}</p>
            <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              <span>↑ {kpi.growth}%</span>
              <span className="text-slate-400 font-normal truncate max-w-[80px]">{kpi.prevComparison}</span>
            </div>
          </div>
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl shrink-0">
            {getIcon(kpi.category)}
          </div>
        </div>
      ))}
    </div>
  );
}
