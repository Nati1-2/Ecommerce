"use client";

export default function SettingsSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
      <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        <div className="lg:col-span-3 h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
      </div>
    </div>
  );
}
