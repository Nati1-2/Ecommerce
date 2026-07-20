"use client";

import { useState } from "react";
import { useAdminAuditStore } from "@/store/adminAuditStore";
import { useUpdateRetention } from "@/hooks/useAdminAuditQuery";
import { Clock, X, Save, HardDrive } from "lucide-react";

export default function RetentionSettings() {
  const { isRetentionModalOpen, setIsRetentionModalOpen } = useAdminAuditStore();
  const updateRetentionMutation = useUpdateRetention();

  const [retentionDays, setRetentionDays] = useState(365);
  const [archiveToGlacier, setArchiveToGlacier] = useState(true);

  if (!isRetentionModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateRetentionMutation.mutate(retentionDays);
    setIsRetentionModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-2xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Audit Log Retention Policy
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Configure OpenSearch & S3 retention limits</p>
            </div>
          </div>
          <button onClick={() => setIsRetentionModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">Active Hot Log Retention (Days)</label>
            <input
              type="number"
              value={retentionDays}
              onChange={(e) => setRetentionDays(Number(e.target.value))}
              min={30}
              max={1095}
              className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-bold"
            />
          </div>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Auto-Archive Aged Logs to AWS S3 Glacier</p>
              <p className="text-[11px] text-slate-400">Compress and move logs older than 90 days to cold storage</p>
            </div>
            <input
              type="checkbox"
              checked={archiveToGlacier}
              onChange={(e) => setArchiveToGlacier(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsRetentionModalOpen(false)}
              className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Save Policy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
