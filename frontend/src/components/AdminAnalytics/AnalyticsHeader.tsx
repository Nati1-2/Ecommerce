"use client";

import { useAdminAnalyticsStore } from "@/store/adminAnalyticsStore";
import { AnalyticsTimeframe } from "@/types/adminAnalytics";
import { Download } from "lucide-react";
import AdminPageHeader from "@/components/AdminShared/AdminPageHeader";

export default function AnalyticsHeader() {
  const { dateRange, setDateRange, setIsExportModalOpen } = useAdminAnalyticsStore();

  const options: AnalyticsTimeframe[] = ["Today", "7 Days", "30 Days", "Quarter", "Year"];

  return (
    <AdminPageHeader
      title="Platform Analytics & Intelligence"
      description="Real-time marketplace telemetry, gross merchandise value (GMV) trajectory, vendor leaderboards, and conversion funnels."
      breadcrumbs={[{ label: "Analytics" }]}
      badge="Business Intelligence"
      badgeVariant="violet"
      actions={
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Range Selector Pills */}
          <div className="flex items-center p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs text-xs font-bold">
            {options.map((opt) => {
              const isSel = dateRange === opt;

              return (
                <button
                  key={opt}
                  onClick={() => setDateRange(opt)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    isSel
                      ? "bg-blue-600 text-white font-black shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      }
    />
  );
}
