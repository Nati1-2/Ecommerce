"use client";

export default function VisitorTrackerSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="space-y-2">
          <div className="h-7 w-64 bg-slate-200 rounded-xl" />
          <div className="h-4 w-96 bg-slate-100 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-28 bg-slate-200 rounded-xl" />
          <div className="h-10 w-32 bg-slate-200 rounded-xl" />
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="h-4 w-24 bg-slate-100 rounded-lg" />
            <div className="h-8 w-32 bg-slate-200 rounded-xl" />
            <div className="h-3 w-40 bg-slate-100 rounded-md" />
          </div>
        ))}
      </div>

      {/* Charts / Distribution Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6" />
        <div className="h-72 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="h-10 bg-slate-100 rounded-xl w-full" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-14 bg-slate-50 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
