"use client";

import { useGeoAnalytics } from "@/hooks/useAdminAnalyticsQuery";
import { Globe, MapPin } from "lucide-react";

export default function GeoAnalytics() {
  const { data: geoData = [], isLoading } = useGeoAnalytics();

  if (isLoading) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Geographical Sales Distribution</h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">Regional Footprint</span>
      </div>

      <div className="space-y-3 text-xs">
        {geoData.map((g) => (
          <div key={g.region} className="space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                {g.region} ({g.country})
              </span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400">
                {g.sales.toLocaleString()} sales ({g.sharePercentage}%)
              </span>
            </div>

            {/* Region Progress Bar */}
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${g.sharePercentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
