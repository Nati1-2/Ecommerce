"use client";

import { useMarketingAnalytics } from "@/hooks/useAdminAnalyticsQuery";
import { Megaphone, Target, DollarSign } from "lucide-react";

export default function MarketingAnalytics() {
  const { data: sources = [], isLoading } = useMarketingAnalytics();

  if (isLoading) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-blue-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Marketing Channel Attribution & ROAS</h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full font-bold">
          Avg ROAS: 4.8x
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {sources.map((src) => (
          <div key={src.channel} className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/60 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
              <span>{src.channel}</span>
              <span className="text-blue-600 dark:text-blue-400 font-extrabold">{src.share}% share</span>
            </div>

            <div className="flex items-center justify-between text-slate-500 pt-1">
              <span>Visitors: <strong>{src.visitors.toLocaleString()}</strong></span>
              <span>Conversions: <strong className="text-emerald-600">{src.conversions.toLocaleString()}</strong></span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-semibold pt-1 border-t border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-400">CAC: ${src.cac.toFixed(2)}</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold">ROAS: {src.roas}x</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
