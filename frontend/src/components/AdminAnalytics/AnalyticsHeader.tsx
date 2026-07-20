"use client";

import { useAdminAnalyticsStore } from "@/store/adminAnalyticsStore";
import { AnalyticsTimeframe } from "@/types/adminAnalytics";
import { BarChart3, Download, Calendar } from "lucide-react";

export default function AnalyticsHeader() {
  const { dateRange, setDateRange, setIsExportModalOpen } = useAdminAnalyticsStore();

  const options: AnalyticsTimeframe[] = ["Today", "7 Days", "30 Days", "Quarter", "Year"];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Analytics & Business Intelligence</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Real-time marketplace telemetry, gross merchandise value (GMV) trajectory, vendor leaderboards, and conversion funnels.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Date Range Selector Pills */}
        <div className="flex items-center p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-semibold">
          {options.map((opt) => {
            const isSel = dateRange === opt;

            return (
              <button
                key={opt}
                onClick={() => setDateRange(opt)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  isSel
                    ? "bg-blue-600 text-white font-bold shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setIsExportModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-blue-500/25 flex items-center gap-1.5"
        >
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>
    </div>
  );
}
