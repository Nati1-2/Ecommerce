"use client";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 animate-pulse">
      {/* Hero Header Skeleton */}
      <div className="h-28 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800" />

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-36 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800" />
        ))}
      </div>

      {/* Shortcuts Skeleton */}
      <div className="h-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800" />

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-96 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800" />
        <div className="lg:col-span-1 h-96 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800" />
      </div>

      {/* Dual Panel Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-80 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800" />
        <div className="h-80 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800" />
      </div>
    </div>
  );
}
