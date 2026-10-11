"use client";

import { useKPIMetrics } from "@/hooks/useAdminAnalyticsQuery";
import { DollarSign, TrendingUp, ShoppingBag, Users, Store, Percent, LucideIcon } from "lucide-react";
import AdminMetricCard from "@/components/AdminShared/AdminMetricCard";

export default function KPICards() {
  const { data: metrics = [], isLoading } = useKPIMetrics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        ))}
      </div>
    );
  }

  const getCardConfig = (cat: string): { icon: LucideIcon; variant: "primary" | "emerald" | "amber" | "violet" | "slate" } => {
    switch (cat) {
      case "gmv":
        return { icon: DollarSign, variant: "primary" };
      case "revenue":
        return { icon: TrendingUp, variant: "emerald" };
      case "orders":
        return { icon: ShoppingBag, variant: "violet" };
      case "customers":
        return { icon: Users, variant: "amber" };
      case "vendors":
        return { icon: Store, variant: "slate" };
      default:
        return { icon: Percent, variant: "primary" };
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
      {metrics.map((kpi) => {
        const config = getCardConfig(kpi.category);
        return (
          <AdminMetricCard
            key={kpi.id}
            title={kpi.title}
            value={kpi.value}
            growth={kpi.growth}
            comparison={kpi.prevComparison}
            icon={config.icon}
            variant={config.variant}
          />
        );
      })}
    </div>
  );
}
