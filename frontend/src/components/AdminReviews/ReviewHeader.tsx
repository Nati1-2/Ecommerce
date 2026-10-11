"use client";

import { useAdminReviewStore } from "@/store/adminReviewStore";
import { useAdminDashboardStore } from "@/store/adminDashboardStore";
import { Download, ShieldCheck } from "lucide-react";
import AdminPageHeader from "@/components/AdminShared/AdminPageHeader";

export default function ReviewHeader() {
  const setIsExportModalOpen = useAdminReviewStore((state) => state.setIsExportModalOpen);
  const showToast = useAdminDashboardStore((state) => state.showToast);

  return (
    <AdminPageHeader
      title="Review Moderation & Trust Shield"
      description="Monitor customer ratings, inspect AI fake review risk scores, approve pending submissions, and manage reported content."
      breadcrumbs={[{ label: "Reviews" }]}
      badge="Trust & Safety"
      badgeVariant="emerald"
      actions={
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => showToast("AI Spam Filter threshold set to 85% Strict", "info")}
            className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-2xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Moderation Settings</span>
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Reviews</span>
          </button>
        </div>
      }
    />
  );
}
