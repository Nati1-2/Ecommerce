"use client";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 animate-pulse">
      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl" />

      {/* Health & Orders Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
      </div>

      {/* Tables Skeleton */}
      <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
    </div>
  );
}
