"use client";

import { useReviewReports, useDismissReport, useRemoveReview } from "@/hooks/useAdminReviewQuery";
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

export default function ReportedReviews() {
  const { data: reports = [], isLoading } = useReviewReports();
  const dismissMutation = useDismissReport();
  const removeMutation = useRemoveReview();

  if (isLoading || reports.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Reported Content Moderation Queue</h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-full font-bold">
          {reports.length} Flagged Reviews
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">Review ID: {rep.reviewId}</span>
              <span className="text-[10px] text-slate-400">{rep.createdAt}</span>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">Reason: {rep.reason}</p>
              <p className="text-slate-500">Reporter: {rep.reporterName}</p>
              <p className="text-slate-400 italic">"{rep.comment}"</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
              <button
                onClick={() => dismissMutation.mutate(rep.id)}
                className="px-3 py-1 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Dismiss Flag
              </button>
              <button
                onClick={() => removeMutation.mutate({ id: rep.reviewId, reason: rep.reason })}
                className="px-3.5 py-1.5 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-sm flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Remove Review
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
