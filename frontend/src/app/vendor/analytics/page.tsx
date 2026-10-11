"use client";

import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { vendorApi } from "@/services/api/vendorApi";

const AnalyticsCharts = dynamic(() => import("@/components/vendor/analytics/AnalyticsCharts"), {
  ssr: false,
  loading: () => <div className="h-96 bg-slate-200  rounded-3xl animate-pulse max-w-7xl mx-auto" />,
});

export default function VendorAnalyticsPage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["vendor-analytics"],
    queryFn: vendorApi.getAnalytics,
  });

  if (isLoading || !analytics) {
    return (
      <div className="h-96 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 animate-pulse max-w-7xl mx-auto flex items-center justify-center text-slate-400 text-xs font-semibold">
        Aggregating business analytics from live database...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Business Analytics & Market Intelligence
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Deep dive into conversion rates, average order values, category revenues, and regional performance.
        </p>
      </div>

      <AnalyticsCharts analytics={analytics} />
    </div>
  );
}
