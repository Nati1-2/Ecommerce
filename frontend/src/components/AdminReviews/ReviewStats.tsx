"use client";

import { ReviewStatsData } from "@/types/adminReview";
import { MessageSquare, Star, Clock, AlertTriangle, ShieldOff } from "lucide-react";
import AdminMetricCard from "@/components/AdminShared/AdminMetricCard";

interface Props {
  stats: ReviewStatsData;
}

export default function ReviewStats({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <AdminMetricCard
        title="Total Reviews"
        value={stats.totalReviews || 0}
        growth={stats.totalGrowth}
        comparison="vs last mo"
        icon={MessageSquare}
        variant="primary"
      />
      <AdminMetricCard
        title="Storefront Rating"
        value={`${stats.avgRating || 4.8} ⭐`}
        growth={0.2}
        comparison="global score"
        icon={Star}
        variant="amber"
      />
      <AdminMetricCard
        title="Pending Moderation"
        value={stats.pendingCount || 0}
        growth={5.4}
        comparison="awaiting check"
        icon={Clock}
        variant="violet"
      />
      <AdminMetricCard
        title="Reported Content"
        value={stats.reportedCount || 0}
        growth={-2.1}
        comparison="complaints"
        icon={AlertTriangle}
        variant="slate"
      />
      <AdminMetricCard
        title="Policy Violations"
        value={stats.removedCount || 0}
        growth={-1.4}
        comparison="actioned"
        icon={ShieldOff}
        variant="slate"
      />
    </div>
  );
}
