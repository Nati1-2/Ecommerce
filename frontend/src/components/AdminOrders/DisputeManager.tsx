"use client";

import { useDisputes, useResolveDispute } from "@/hooks/useAdminOrderQuery";
import { AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";

export default function DisputeManager() {
  const { data: disputes = [], isLoading } = useDisputes();
  const resolveMutation = useResolveDispute();

  if (isLoading || disputes.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Customer Dispute Resolution Queue</h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-full">
          {disputes.length} Open Disputes
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {disputes.map((disp) => (
          <div
            key={disp.id}
            className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">Order: {disp.orderId}</span>
              <span className="text-[10px] text-slate-400">{disp.createdAt}</span>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">Complaint: {disp.complaintReason}</p>
              <p className="text-slate-500">Customer: {disp.customerName} • Seller: {disp.vendorStore}</p>
              <p className="text-slate-400 italic">"Vendor: {disp.vendorResponse}"</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
              <button
                onClick={() => resolveMutation.mutate({ disputeId: disp.id, resolution: "Dismiss" })}
                className="px-3 py-1 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Dismiss Case
              </button>
              <button
                onClick={() => resolveMutation.mutate({ disputeId: disp.id, resolution: "Refund" })}
                className="px-3.5 py-1.5 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Approve Customer Refund
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
