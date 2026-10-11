"use client";

import { PlatformStats } from "@/types/admin";
import { Users, Store, Package, ShoppingBag, DollarSign } from "lucide-react";
import AdminMetricCard from "@/components/AdminShared/AdminMetricCard";

interface Props {
  stats: PlatformStats;
}

function formatRevenue(amount?: number): string {
  const val = typeof amount === "number" ? amount : 0;
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}k`;
  return `$${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function OverviewCards({ stats }: Props) {
  const safeStats = stats || ({} as PlatformStats);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      <AdminMetricCard
        title="Registered Users"
        value={safeStats.users ?? 0}
        growth={safeStats.usersGrowth ?? 0}
        comparison="vs last 30d"
        icon={Users}
        variant="primary"
      />
      <AdminMetricCard
        title="Marketplace Vendors"
        value={safeStats.vendors ?? 0}
        growth={safeStats.vendorsGrowth ?? 0}
        comparison="vs last 30d"
        icon={Store}
        variant="violet"
      />
      <AdminMetricCard
        title="Active Catalog Items"
        value={safeStats.products ?? 0}
        growth={safeStats.productsGrowth ?? 0}
        comparison="vs last 30d"
        icon={Package}
        variant="amber"
      />
      <AdminMetricCard
        title="Processed Orders"
        value={safeStats.orders ?? 0}
        growth={safeStats.ordersGrowth ?? 0}
        comparison="vs last 30d"
        icon={ShoppingBag}
        variant="slate"
      />
      <AdminMetricCard
        title="Gross Merchandise Value"
        value={formatRevenue(safeStats.revenue)}
        growth={safeStats.revenueGrowth ?? 0}
        comparison="vs last 30d"
        icon={DollarSign}
        variant="emerald"
      />
    </div>
  );
}
