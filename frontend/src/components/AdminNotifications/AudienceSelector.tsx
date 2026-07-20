"use client";

import { Users, Filter } from "lucide-react";

export default function AudienceSelector() {
  const segments = [
    { name: "New Customers (<7 Days)", count: 14500, share: 6 },
    { name: "Active Verified Buyers", count: 185000, share: 74 },
    { name: "Inactive Buyers (>30 Days)", count: 35000, share: 14 },
    { name: "Marketplace Vendors", count: 12500, share: 5 },
    { name: "Platform Administrators", count: 45, share: 1 },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Audience Segmentation Index</h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">Target Cohorts</span>
      </div>

      <div className="space-y-3 text-xs">
        {segments.map((seg) => (
          <div key={seg.name} className="space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300">
              <span>{seg.name}</span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400">
                {seg.count.toLocaleString()} ({seg.share}%)
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${seg.share}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
