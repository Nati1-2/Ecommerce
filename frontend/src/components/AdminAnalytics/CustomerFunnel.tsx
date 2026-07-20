"use client";

import { useCustomerFunnel } from "@/hooks/useAdminAnalyticsQuery";
import { Filter, ArrowDown, Clock, Search } from "lucide-react";

export default function CustomerFunnel() {
  const { data: funnel = [], isLoading } = useCustomerFunnel();

  if (isLoading) {
    return <div className="h-72 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Customer Behavior Funnel</h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>Avg Session: 4m 12s</span>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        {funnel.map((st, idx) => (
          <div key={st.stage} className="space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300">
              <span>{idx + 1}. {st.stage}</span>
              <span>{st.count.toLocaleString()} ({st.conversionRate}%)</span>
            </div>

            {/* Funnel Progress Bar */}
            <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500"
                style={{ width: `${st.conversionRate}%` }}
              />
            </div>

            {st.dropoffRate > 0 && (
              <p className="text-[10px] text-rose-500 font-semibold pl-1">
                ↓ {st.dropoffRate}% dropoff rate
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
