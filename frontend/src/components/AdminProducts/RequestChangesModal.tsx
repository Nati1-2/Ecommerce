"use client";

import { useState } from "react";
import { useAdminProductStore } from "@/store/adminProductStore";
import { useRequestChanges } from "@/hooks/useAdminProductQuery";
import { MessageSquare, X, Send } from "lucide-react";

export default function RequestChangesModal() {
  const { requestChangesProduct, setRequestChangesProduct } = useAdminProductStore();
  const requestChangesMutation = useRequestChanges();
  const [notes, setNotes] = useState("");

  if (!requestChangesProduct) return null;

  const handleConfirm = () => {
    if (notes.trim()) {
      requestChangesMutation.mutate({
        id: requestChangesProduct.id,
        notes: notes.trim(),
      });
      setRequestChangesProduct(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Request Vendor Modifications
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">SKU: {requestChangesProduct.sku}</p>
            </div>
          </div>
          <button onClick={() => setRequestChangesProduct(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <p className="text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
            Send specific feedback to <strong className="text-blue-600">{requestChangesProduct.vendorStore}</strong> detailing required updates before catalog publishing.
          </p>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Required Modifications Feedback *
            </label>
            <textarea
              rows={4}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Please upload higher resolution white-background main product images (minimum 1000x1000px) and expand the product description."
              className="w-full mt-1.5 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setRequestChangesProduct(null)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!notes.trim()}
            className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            Send Change Request
          </button>
        </div>
      </div>
    </div>
  );
}
