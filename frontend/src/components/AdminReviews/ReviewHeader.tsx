"use client";

import { useAdminReviewStore } from "@/store/adminReviewStore";
import { useAdminDashboardStore } from "@/store/adminDashboardStore";
import { Star, Download, ShieldCheck } from "lucide-react";

export default function ReviewHeader() {
  const setIsExportModalOpen = useAdminReviewStore((state) => state.setIsExportModalOpen);
  const showToast = useAdminDashboardStore((state) => state.showToast);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Review Moderation & Trust Shield</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Monitor customer ratings, inspect AI fake review risk scores, approve pending submissions, and manage reported content.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => showToast("AI Spam Filter threshold set to 85% Strict", "info")}
          className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Moderation Settings</span>
        </button>

        <button
          onClick={() => setIsExportModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-blue-500/25 flex items-center gap-1.5"
        >
          <Download className="w-4 h-4" />
          <span>Export Reviews</span>
        </button>
      </div>
    </div>
  );
}
