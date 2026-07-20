"use client";

import { useState } from "react";
import { VendorStoreSettings } from "@/types/vendor";
import { Save, RotateCcw } from "lucide-react";

interface Props {
  settings: VendorStoreSettings;
  onSave: (updates: Partial<VendorStoreSettings>) => void;
  isSaving?: boolean;
}

export default function ReturnSettings({ settings, onSave, isSaving }: Props) {
  const [returnWindowDays, setReturnWindowDays] = useState(settings.returns.returnWindowDays);
  const [policyText, setPolicyText] = useState(settings.returns.policyText);
  const [allowRefunds, setAllowRefunds] = useState(settings.returns.allowRefunds);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      returns: {
        returnWindowDays: Number(returnWindowDays),
        policyText,
        allowRefunds,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Customer Return & Refund Rules</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure return windows, policy guidelines, and refund approvals.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-1.5 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save Return Policy"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Return Window (Days)</label>
          <input
            type="number"
            value={returnWindowDays}
            onChange={(e) => setReturnWindowDays(Number(e.target.value))}
            className="w-full mt-1 px-4 py-2.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Allow Automatic Refund Requests</p>
            <p className="text-[11px] text-slate-400">Buyers can request refunds within valid return window.</p>
          </div>
          <input
            type="checkbox"
            checked={allowRefunds}
            onChange={(e) => setAllowRefunds(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 dark:bg-slate-800"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Public Return Policy Guidelines</label>
        <textarea
          rows={4}
          value={policyText}
          onChange={(e) => setPolicyText(e.target.value)}
          className="w-full mt-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
    </form>
  );
}
