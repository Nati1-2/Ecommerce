"use client";

import { useNotificationStats } from "@/hooks/useAdminNotificationQuery";
import AdminMetricCard from "@/components/AdminShared/AdminMetricCard";
import { Send, CheckCircle2, AlertTriangle, Eye, MousePointer } from "lucide-react";

export default function NotificationStats() {
  const { data: stats, isLoading } = useNotificationStats();

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <AdminMetricCard
        title="Total Sent"
        value={stats.totalSent.toLocaleString()}
        growth={stats.totalGrowth}
        comparison="vs last mo"
        icon={Send}
        variant="primary"
      />
      <AdminMetricCard
        title="Delivered"
        value={stats.delivered.toLocaleString()}
        comparison={`${stats.deliveryRate}% delivery rate`}
        icon={CheckCircle2}
        variant="emerald"
      />
      <AdminMetricCard
        title="Failed / Bounced"
        value={stats.failed.toLocaleString()}
        comparison="0.5% error rate"
        icon={AlertTriangle}
        variant="amber"
      />
      <AdminMetricCard
        title="Avg Open Rate"
        value={`${stats.openRate}%`}
        growth={4.2}
        comparison="industry avg"
        icon={Eye}
        variant="violet"
      />
      <AdminMetricCard
        title="CTR Click Rate"
        value={`${stats.clickRate}%`}
        growth={2.8}
        comparison="conversion rate"
        icon={MousePointer}
        variant="slate"
      />
    </div>
  );
}
