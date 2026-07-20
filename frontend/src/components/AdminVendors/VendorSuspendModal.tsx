"use client";

import { useState } from "react";
import { useAdminVendorStore } from "@/store/adminVendorStore";
import { useSuspendVendor } from "@/hooks/useAdminVendorQuery";
import { AlertOctagon, X, UserX } from "lucide-react";

export default function VendorSuspendModal() {
  const { suspendModalVendor, setSuspendModalVendor } = useAdminVendorStore();
  const suspendMutation = useSuspendVendor();
  const [reason, setReason] = useState("Policy Violation");

  if (!suspendModalVendor) return null;

  const handleConfirm = () => {
    suspendMutation.mutate({ id: suspendModalVendor.id, reason });
    setSuspendModalVendor(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 rounded-2xl">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Suspend Vendor Store
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Store ID: {suspendModalVendor.id}</p>
            </div>
          </div>
          <button onClick={() => setSuspendModalVendor(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <p className="text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
            Are you sure you want to suspend <strong className="text-rose-600">{suspendModalVendor.storeName}</strong> ({suspendModalVendor.ownerName})?
            This will freeze all active product listings, halt new buyer checkouts, and hold Stripe payouts pending investigation.
          </p>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Suspension Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full mt-1.5 px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-rose-600 font-medium"
            >
              <option value="Policy Violation">Policy Violation (Brand Warning / Counterfeit)</option>
              <option value="Fraud">Fraudulent Activity / Suspicious Payout Bank</option>
              <option value="Poor Performance">Poor Fulfillment Score (Excessive Refunds / Late Shipping)</option>
              <option value="Other">Other Operational Compliance Reason</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setSuspendModalVendor(null)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-500/20 flex items-center gap-1.5"
          >
            <UserX className="w-4 h-4" />
            Suspend Store Privileges
          </button>
        </div>
      </div>
    </div>
  );
}
