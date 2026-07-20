"use client";

import { useClearCache } from "@/hooks/useAdminSettingsQuery";
import { Server, RefreshCw, Trash2, CheckCircle2 } from "lucide-react";

export default function CacheManager() {
  const clearCacheMutation = useClearCache();

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-blue-600" />
          Redis Memory Cache & Session Store
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Purge stale catalog query caches, refresh session data, or re-index product search keys.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-slate-400 font-semibold">Cache Hit Ratio</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">98.4%</p>
          <p className="text-[10px] text-slate-400 mt-1">1.2M queries served from RAM</p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-slate-400 font-semibold">Redis Memory Usage</p>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">4.2 GB / 16 GB</p>
          <p className="text-[10px] text-slate-400 mt-1">Key eviction policy: volatile-lru</p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-slate-400 font-semibold">Active Key Namespace</p>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">450,000 Keys</p>
          <p className="text-[10px] text-slate-400 mt-1">Product, Category & Cart keys</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
        <p className="text-xs text-slate-500">Purging cache forces next API request to hit PostgreSQL cluster.</p>
        <button
          type="button"
          disabled={clearCacheMutation.isPending}
          onClick={() => clearCacheMutation.mutate()}
          className="px-5 py-2.5 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-500/20 flex items-center gap-1.5 transition-colors text-xs disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear All Redis Cache</span>
        </button>
      </div>
    </div>
  );
}
