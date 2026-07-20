"use client";

import { useAuditLogs } from "@/hooks/useAdminAuditQuery";
import { useAdminAuditStore } from "@/store/adminAuditStore";
import { Shield, Eye, ShieldAlert, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AuditTable() {
  const { data: logs = [], isLoading } = useAuditLogs();
  const setSelectedLog = useAdminAuditStore((state) => state.setSelectedLog);

  if (isLoading) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-300 dark:border-rose-800";
      case "High":
        return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-300 dark:border-amber-800";
      case "Medium":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-300 dark:border-blue-800";
      default:
        return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Security Audit Log Trajectory</h3>
        </div>
        <span className="text-xs font-mono font-bold text-slate-400">{logs.length} Log Entries Loaded</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold uppercase">
            <tr>
              <th className="py-3 px-4">Event ID</th>
              <th className="py-3 px-4">User / Actor</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Action Event</th>
              <th className="py-3 px-4">Resource Target</th>
              <th className="py-3 px-4">IP & Location</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Timestamp (UTC)</th>
              <th className="py-3 px-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {logs.map((log) => (
              <tr
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 cursor-pointer transition-colors"
              >
                <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">{log.id}</td>
                <td className="py-3 px-4">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{log.user}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{log.userEmail}</p>
                  </div>
                </td>
                <td className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">{log.role}</td>
                <td className="py-3 px-4 font-mono font-bold text-purple-600 dark:text-purple-400">{log.action}</td>
                <td className="py-3 px-4 max-w-xs truncate text-slate-600 dark:text-slate-300">{log.resource}</td>
                <td className="py-3 px-4">
                  <div>
                    <p className="font-mono text-slate-900 dark:text-white text-[11px]">{log.ip}</p>
                    <p className="text-[10px] text-slate-400">{log.location}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={cn("px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold", getSeverityBadge(log.severity))}>
                    {log.severity}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{log.createdAt}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLog(log);
                    }}
                    className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg"
                    title="Inspect Event"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
