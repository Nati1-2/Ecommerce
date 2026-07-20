"use client";

import { useAdminAuditStore } from "@/store/adminAuditStore";
import ChangeHistory from "@/components/AdminAudit/ChangeHistory";
import { X, ShieldAlert, Terminal, Globe, Smartphone, User, MapPin } from "lucide-react";

export default function AuditDetailsDrawer() {
  const { selectedLog, setSelectedLog } = useAdminAuditStore();

  if (!selectedLog) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between p-6 overflow-y-auto space-y-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Audit Event Investigation
                </h3>
                <p className="text-xs font-mono text-blue-600 dark:text-blue-400 mt-0.5">{selectedLog.id}</p>
              </div>
            </div>
            <button onClick={() => setSelectedLog(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Actor & Action Details */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-500" /> {selectedLog.user}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-600 font-bold text-[10px]">
                Role: {selectedLog.role}
              </span>
            </div>
            <p className="text-slate-500 font-mono text-[11px]">Email: {selectedLog.userEmail}</p>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-bold text-purple-600 font-mono">{selectedLog.action}</span>
              <span className="text-slate-400 font-mono">{selectedLog.createdAt}</span>
            </div>
          </div>

          {/* Resource & Location Metadata */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 flex items-center gap-1 font-bold text-[10px]">
                <Globe className="w-3 h-3 text-blue-500" /> Network IP & Geolocation
              </span>
              <p className="font-mono font-bold text-slate-900 dark:text-white">{selectedLog.ip}</p>
              <p className="text-slate-500 text-[11px]">{selectedLog.location}</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 flex items-center gap-1 font-bold text-[10px]">
                <Smartphone className="w-3 h-3 text-purple-500" /> Device & User Agent
              </span>
              <p className="font-bold text-slate-900 dark:text-white text-[11px]">{selectedLog.device}</p>
              <p className="text-slate-500 text-[11px]">{selectedLog.browser}</p>
            </div>
          </div>

          {/* Before vs After Diff Comparison */}
          <ChangeHistory diffs={selectedLog.diff} />

          {/* Raw JSON Event Payload */}
          {selectedLog.rawPayload && (
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Terminal className="w-4 h-4 text-emerald-500" /> Raw OpenSearch JSON Event Payload
              </span>
              <pre className="p-4 bg-slate-900 text-emerald-400 rounded-2xl font-mono text-[11px] overflow-x-auto">
                {JSON.stringify(selectedLog.rawPayload, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={() => setSelectedLog(null)}
            className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md"
          >
            Close Investigation
          </button>
        </div>
      </div>
    </div>
  );
}
