"use client";

import { useState } from "react";
import { useAdminProductStore } from "@/store/adminProductStore";
import { useRejectProduct } from "@/hooks/useAdminProductQuery";
import { XCircle, X } from "lucide-react";

export default function RejectProductModal() {
  const { rejectModalProduct, setRejectModalProduct } = useAdminProductStore();
  const rejectMutation = useRejectProduct();
  const [reason, setReason] = useState("Policy violation");
  const [notes, setNotes] = useState("");

  if (!rejectModalProduct) return null;

  const handleConfirm = () => {
    rejectMutation.mutate({
      id: rejectModalProduct.id,
      reason,
      notes: notes || "Product submission violates marketplace quality or trademark guidelines.",
    });
    setRejectModalProduct(null);
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
                Reject Product Listing
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">SKU: {rejectModalProduct.sku}</p>
            </div>
          </div>
          <button onClick={() => setRejectModalProduct(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
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
              <option value="Missing information">Missing information / Incomplete Description</option>
              <option value="Policy violation">Policy violation / Trademark Issue</option>
              <option value="Incorrect category">Incorrect Taxonomy Category Selected</option>
              <option value="Invalid pricing">Invalid pricing / Out-of-bounds MSRP</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Additional Notes for Vendor
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Please provide authentic brand authorization for luxury item selling."
              className="w-full mt-1.5 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setRejectModalProduct(null)}
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
