"use client";

import { useReportedProducts, useDismissReport, useDeleteProduct } from "@/hooks/useAdminProductQuery";
import { AlertTriangle, Eye, Trash2, Check } from "lucide-react";
import { useAdminProductStore } from "@/store/adminProductStore";

export default function ReportedProducts() {
  const { data: reports = [], isLoading } = useReportedProducts();
  const dismissMutation = useDismissReport();
  const deleteMutation = useDeleteProduct();
  const setReviewDrawerProduct = useAdminProductStore((state) => state.setReviewDrawerProduct);

  if (isLoading || reports.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Reported & Flagged Products Queue</h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-full">
          {reports.length} Open Reports
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="p-4 bg-rose-50/40 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/50 flex items-start gap-3.5"
          >
            <img
              src={rep.productImage}
              alt={rep.productName}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-rose-200 dark:ring-rose-800 shrink-0"
            />
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-600 text-white rounded-md uppercase">
                  {rep.reason}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{rep.date}</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">
                {rep.productName}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Vendor: {rep.vendorStore} • Flagged by: {rep.reportedBy}
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => dismissMutation.mutate(rep.id)}
                  className="px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Check className="w-3 h-3 text-emerald-500" />
                  Dismiss Report
                </button>

                <button
                  onClick={() => deleteMutation.mutate(rep.productId)}
                  className="px-2.5 py-1 text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove Item
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
