"use client";

import { useAdminProductStore } from "@/store/adminProductStore";
import { useApproveProduct } from "@/hooks/useAdminProductQuery";
import { CheckCircle2, X } from "lucide-react";

export default function ApproveProductModal() {
  const { approveModalProduct, setApproveModalProduct } = useAdminProductStore();
  const approveMutation = useApproveProduct();

  if (!approveModalProduct) return null;

  const handleConfirm = () => {
    approveMutation.mutate(approveModalProduct.id);
    setApproveModalProduct(null);
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
                Approve Catalog Product
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">SKU: {approveModalProduct.sku}</p>
            </div>
          </div>
          <button onClick={() => setApproveModalProduct(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
          Are you sure you want to approve <strong className="text-emerald-600">{approveModalProduct.name}</strong> from vendor <strong className="text-slate-900 dark:text-white">{approveModalProduct.vendorStore}</strong> and publish it live to the marketplace catalog?
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setApproveModalProduct(null)}
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
            Approve & Publish Live
          </button>
        </div>
      </div>
    </div>
  );
}
