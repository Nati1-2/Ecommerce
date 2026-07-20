"use client";

import { useState } from "react";
import { useAdminReviewStore } from "@/store/adminReviewStore";
import { useRemoveReview } from "@/hooks/useAdminReviewQuery";
import { Trash2, X } from "lucide-react";

export default function RemoveReviewModal() {
  const { removeModalReview, setRemoveModalReview } = useAdminReviewStore();
  const removeMutation = useRemoveReview();
  const [reason, setReason] = useState("Fake review");

  if (!removeModalReview) return null;

  const handleConfirm = () => {
    removeMutation.mutate({ id: removeModalReview.id, reason });
    setRemoveModalReview(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 rounded-2xl">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Remove Customer Review
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Review ID: {removeModalReview.id}</p>
            </div>
          </div>
          <button onClick={() => setRemoveModalReview(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Select Removal Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-rose-600 font-medium"
            >
              <option value="Fake review">Fake review / Non-customer manipulation</option>
              <option value="Spam">Spam & Unsolicited External Links</option>
              <option value="Offensive content">Offensive Language / Profanity</option>
              <option value="Policy violation">Marketplace Community Policy Violation</option>
              <option value="Incorrect information">Factually Incorrect Information</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setRemoveModalReview(null)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-500/20 flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            Confirm Removal
          </button>
        </div>
      </div>
    </div>
  );
}
