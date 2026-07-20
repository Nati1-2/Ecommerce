"use client";

import { useAuditLogs } from "@/hooks/useAdminAuditQuery";
import { Clock, Shield, CheckCircle2, UserCheck, AlertTriangle } from "lucide-react";

export default function ActivityTimeline() {
  const { data: logs = [], isLoading } = useAuditLogs();

  if (isLoading) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Chronological Activity Timeline Trajectory
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sequential order of administrative changes and platform actions.</p>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {logs.map((log) => (
          <div key={log.id} className="relative space-y-1">
            <div className="absolute -left-6 top-1 p-1 bg-blue-600 text-white rounded-full ring-4 ring-white dark:ring-slate-900">
              <UserCheck className="w-3 h-3" />
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-900 dark:text-white">{log.user} ({log.role})</span>
                <span className="text-slate-400 font-mono text-[10px]">{log.createdAt}</span>
              </div>
              <p className="font-mono text-purple-600 dark:text-purple-400 font-bold">{log.action}</p>
              <p className="text-slate-500">{log.resource}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
