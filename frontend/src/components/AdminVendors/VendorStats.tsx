"use client";

import { VendorStatsData } from "@/types/adminVendor";
import { Store, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import AdminMetricCard from "@/components/AdminShared/AdminMetricCard";

interface Props {
  stats: VendorStatsData;
}

export default function VendorStats({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <AdminMetricCard
        title="Total Marketplace Sellers"
        value={stats.totalVendors}
        growth={stats.totalGrowth}
        comparison="vs last month"
        icon={Store}
        variant="primary"
      />
      <AdminMetricCard
        title="Active Verified Stores"
        value={stats.activeVendors}
        growth={stats.activeGrowth}
        comparison="operational"
        icon={CheckCircle2}
        variant="emerald"
      />
      <AdminMetricCard
        title="Pending Onboarding Review"
        value={stats.pendingApproval}
        growth={stats.pendingNewToday}
        comparison="new today"
        icon={Clock}
        variant="amber"
      />
      <AdminMetricCard
        title="Suspended / Flagged"
        value={stats.suspendedVendors}
        growth={stats.suspendedChange}
        comparison="compliance flags"
        icon={AlertTriangle}
        variant="slate"
      />
    </div>
  );
}
