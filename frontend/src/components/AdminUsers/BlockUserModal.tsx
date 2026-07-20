"use client";

import { useState } from "react";
import { useAdminUserStore } from "@/store/adminUserStore";
import { useBlockUser } from "@/hooks/useAdminUserQuery";
import { AlertOctagon, X, UserX } from "lucide-react";

export default function BlockUserModal() {
  const { blockUserModalUser, setBlockUserModalUser } = useAdminUserStore();
  const blockUserMutation = useBlockUser();
  const [reason, setReason] = useState("Violation");

  if (!blockUserModalUser) return null;

  const handleConfirm = () => {
    blockUserMutation.mutate({ id: blockUserModalUser.id, reason });
    setBlockUserModalUser(null);
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
                Confirm Account Block
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Restrict marketplace platform access</p>
            </div>
          </div>
          <button onClick={() => setBlockUserModalUser(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <p className="text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
            Are you sure you want to block <strong className="text-rose-600">{blockUserModalUser.name}</strong> ({blockUserModalUser.email})?
            This will immediately invalidate active login sessions and suspend marketplace access.
          </p>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Select Reason for Suspension *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full mt-1.5 px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-rose-600 font-medium"
            >
              <option value="Spam">Spam & Unsolicited Activity</option>
              <option value="Fraud">Fraudulent Activity / Suspicious IP</option>
              <option value="Violation">Platform Terms of Service Violation</option>
              <option value="Other">Other Policy Compliance Reason</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setBlockUserModalUser(null)}
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
            Block User Account
          </button>
        </div>
      </div>
    </div>
  );
}
