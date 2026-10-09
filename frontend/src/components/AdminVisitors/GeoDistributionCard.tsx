"use client";

import { MapPin } from "lucide-react";
import { VisitorStats } from "@/types/adminVisitors";

interface GeoProps {
  stats: VisitorStats;
  onFilterCountry?: (country: string) => void;
}

export default function GeoDistributionCard({ stats, onFilterCountry }: GeoProps) {
  return (
    <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            Top Visitor Geographies
          </h3>
          <p className="text-xs text-slate-500">Global visitor locations and origin countries</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Global IP Geolocation
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {stats.topCountries.map((c) => (
          <button
            key={c.country}
            onClick={() => onFilterCountry?.(c.country)}
            className="p-3 rounded-2xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/70 text-left transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl leading-none">{c.flag}</span>
                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {c.country}
                </span>
              </div>
              <span className="text-xs font-extrabold text-slate-900">{c.percentage}%</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>{c.count} sessions</span>
              <span className="text-[10px] font-mono text-slate-400">{c.countryCode}</span>
            </div>

            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${c.percentage}%` }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
