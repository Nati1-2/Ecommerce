"use client";

import { useLoginHistory } from "@/hooks/useAdminAuditQuery";
import { Key, CheckCircle2, XCircle, ShieldOff } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginActivity() {
  const { data: logins = [], isLoading } = useLoginHistory();

  if (isLoading) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Successful":
        return "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "Failed":
        return "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      default:
        return "bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Authentication & Login History Telemetry</h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">Auth Service Logs</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold uppercase">
            <tr>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Device & Browser</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">IP Address</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {logins.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{log.user}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{log.userEmail}</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">{log.role}</td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{log.device} ({log.browser})</td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{log.location}</td>
                <td className="py-3 px-4 font-mono text-slate-900 dark:text-white text-[11px]">{log.ip}</td>
                <td className="py-3 px-4">
                  <span className={cn("px-2.5 py-0.5 rounded-full border text-[10px] font-bold", getStatusBadge(log.status))}>
                    {log.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-slate-500 font-mono text-[11px]">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
