"use client";

import { useAdminReviewStore } from "@/store/adminReviewStore";
import { useApproveReview } from "@/hooks/useAdminReviewQuery";
import { CheckCircle2, X } from "lucide-react";

export default function ApproveReviewModal() {
  const { approveModalReview, setApproveModalReview } = useAdminReviewStore();
  const approveMutation = useApproveReview();

  if (!approveModalReview) return null;

  const handleConfirm = () => {
    approveMutation.mutate(approveModalReview.id);
    setApproveModalReview(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Approve Customer Review
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Review ID: {approveModalReview.id}</p>
            </div>
          </div>
          <button onClick={() => setApproveModalReview(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
          <p className="font-semibold text-slate-900 dark:text-white text-sm">
            Approve this review and publish publicly to the storefront?
          </p>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="font-bold text-slate-900 dark:text-white">{approveModalReview.customerName} ({approveModalReview.rating} ⭐)</p>
            <p className="italic text-slate-500 mt-1">"{approveModalReview.comment}"</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setApproveModalReview(null)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve & Publish
          </button>
        </div>
      </div>
    </div>
  );
}
