"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Portal Error caught by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-2xl mx-auto flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Admin Portal Notice
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {error?.message || "A temporary issue occurred while rendering the administration dashboard. Your session is active."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Admin Dashboard</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
