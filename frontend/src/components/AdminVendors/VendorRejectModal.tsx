"use client";

import { useState } from "react";
import { useAdminVendorStore } from "@/store/adminVendorStore";
import { useRejectVendor } from "@/hooks/useAdminVendorQuery";
import { XCircle, X } from "lucide-react";

export default function VendorRejectModal() {
  const { rejectModalVendor, setRejectModalVendor } = useAdminVendorStore();
  const rejectMutation = useRejectVendor();
  const [reason, setReason] = useState("Incomplete Business Documentation");
  const [notes, setNotes] = useState("");

  if (!rejectModalVendor) return null;

  const handleConfirm = () => {
    rejectMutation.mutate({
      id: rejectModalVendor.id,
      reason,
      notes: notes || "Please re-upload valid government ID and IRS tax verification documentation.",
    });
    setRejectModalVendor(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-2xl">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Reject Vendor Application
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Application ID: {rejectModalVendor.id}</p>
            </div>
          </div>
          <button onClick={() => setRejectModalVendor(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Rejection Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full mt-1.5 px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-amber-600 font-medium"
            >
              <option value="Incomplete Business Documentation">Incomplete Business Documentation</option>
              <option value="Invalid Tax EIN Registration">Invalid Tax EIN Registration</option>
              <option value="Prohibited Product Category">Prohibited Product Category</option>
              <option value="Unverified Identity Documents">Unverified Identity Documents</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Admin Feedback Notes for Seller
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Your business license document expired in 2024. Please re-submit a current state license."
              className="w-full mt-1.5 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setRejectModalVendor(null)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-1.5"
          >
            <XCircle className="w-4 h-4" />
            Send Rejection Notice
          </button>
        </div>
      </div>
    </div>
  );
}
