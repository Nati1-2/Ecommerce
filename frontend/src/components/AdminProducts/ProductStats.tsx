"use client";

import { ProductStatsData } from "@/types/adminProduct";
import { Package, Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import AdminMetricCard from "@/components/AdminShared/AdminMetricCard";

interface Props {
  stats: ProductStatsData;
}

export default function ProductStats({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <AdminMetricCard
        title="Total Catalog"
        value={stats.totalProducts || 0}
        growth={stats.productsGrowth || 0}
        comparison="vs last mo"
        icon={Package}
        variant="primary"
      />
      <AdminMetricCard
        title="Pending Approval"
        value={stats.pendingApproval || 0}
        growth={stats.pendingNewToday || 0}
        comparison="new today"
        icon={Clock}
        variant="amber"
      />
      <AdminMetricCard
        title="Approved Published"
        value={stats.approvedProducts || 0}
        growth={stats.approvedGrowth || 0}
        comparison="live in store"
        icon={CheckCircle2}
        variant="emerald"
      />
      <AdminMetricCard
        title="Rejected Items"
        value={stats.rejectedProducts || 0}
        growth={stats.rejectedChange || 0}
        comparison="non-compliant"
        icon={XCircle}
        variant="slate"
      />
      <AdminMetricCard
        title="Reported / Flagged"
        value={stats.reportedProducts || 0}
        growth={stats.reportedFlags || 0}
        comparison="flagged cases"
        icon={AlertTriangle}
        variant="slate"
      />
    </div>
  );
}

