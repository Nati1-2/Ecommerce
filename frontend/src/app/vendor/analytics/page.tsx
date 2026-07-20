"use client";

import { useQuery } from "@tanstack/react-query";
import { vendorApi } from "@/services/api/vendorApi";
import AnalyticsCharts from "@/components/vendor/analytics/AnalyticsCharts";

export default function VendorAnalyticsPage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["vendor-analytics"],
    queryFn: vendorApi.getAnalytics,
  });

  if (isLoading || !analytics) {
    return <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse max-w-7xl mx-auto" />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Business Analytics & Insights</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Deep dive into conversion rates, average order values, category revenues, and regional performance.
        </p>
      </div>

      <AnalyticsCharts analytics={analytics} />
    </div>
  );
}
