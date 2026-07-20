"use client";

export default function NotificationSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-3xl" />

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        ))}
      </div>

      {/* Channel Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
    </div>
  );
}
