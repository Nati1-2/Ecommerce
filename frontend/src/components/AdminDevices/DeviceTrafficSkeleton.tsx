"use client";

import React from "react";

export default function DeviceTrafficSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 h-32 space-y-3">
            <div className="h-3 w-24 bg-slate-200 rounded" />
            <div className="h-8 w-32 bg-slate-200 rounded" />
            <div className="h-3 w-40 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      {/* Filter Bar Skeleton */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 h-24" />

      {/* Table Skeleton */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-200" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-48 bg-slate-200 rounded" />
                <div className="h-2.5 w-32 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="h-4 w-28 bg-slate-200 rounded" />
            <div className="h-4 w-20 bg-slate-200 rounded" />
            <div className="h-8 w-24 bg-slate-100 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
