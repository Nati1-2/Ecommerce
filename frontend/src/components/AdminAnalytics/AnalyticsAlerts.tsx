"use client";

import { useAnalyticsAlerts } from "@/hooks/useAdminAnalyticsQuery";
import { AlertCircle, AlertTriangle, Info, Bell } from "lucide-react";

export default function AnalyticsAlerts() {
  const { data: alerts = [], isLoading } = useAnalyticsAlerts();

  if (isLoading || alerts.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Business Intelligence Anomaly Alerts</h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-full font-bold">
          {alerts.length} Active Insights
        </span>
      </div>

      <div className="space-y-2.5 text-xs">
        {alerts.map((alt) => (
          <div
            key={alt.id}
            className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
              alt.severity === "danger"
                ? "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200"
                : alt.severity === "warning"
                ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200"
                : "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200"
            }`}
          >
            {alt.severity === "danger" ? (
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            ) : alt.severity === "warning" ? (
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="font-bold">{alt.title}</p>
                <span className="text-[10px] text-slate-400 font-mono">{alt.timestamp}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mt-0.5">{alt.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
