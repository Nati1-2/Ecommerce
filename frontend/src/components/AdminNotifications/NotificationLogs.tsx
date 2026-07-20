"use client";

import { useNotificationLogs } from "@/hooks/useAdminNotificationQuery";
import { ListFilter, Mail, Bell, Smartphone, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotificationLogs() {
  const { data: logs = [], isLoading } = useNotificationLogs();

  if (isLoading) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "Email":
        return <Mail className="w-3.5 h-3.5 text-blue-500" />;
      case "Push":
        return <Bell className="w-3.5 h-3.5 text-purple-500" />;
      case "SMS":
        return <Smartphone className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Zap className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
      case "Sent":
        return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800";
      case "Pending":
      case "Scheduled":
        return "bg-amber-50 text-amber-600 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800";
      default:
        return "bg-rose-50 text-rose-600 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ListFilter className="w-5 h-5 text-blue-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Delivery Tracking Logs</h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">RabbitMQ Queue Telemetry</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold uppercase">
            <tr>
              <th className="py-3 px-4">Log ID</th>
              <th className="py-3 px-4">Recipient</th>
              <th className="py-3 px-4">Channel</th>
              <th className="py-3 px-4">Message Snippet</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Sent Time</th>
              <th className="py-3 px-4 text-right">Delivered Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">{log.id}</td>
                <td className="py-3 px-4">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{log.recipientName}</p>
                    <p className="text-[10px] text-slate-400">{log.recipientEmail}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                    {getChannelIcon(log.channel)} {log.channel}
                  </span>
                </td>
                <td className="py-3 px-4 max-w-xs truncate text-slate-600 dark:text-slate-300">{log.messageSnippet}</td>
                <td className="py-3 px-4">
                  <span className={cn("px-2.5 py-0.5 rounded-full border text-[10px] font-bold", getStatusBadge(log.status))}>
                    {log.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{log.sentTime}</td>
                <td className="py-3 px-4 text-right text-slate-500 font-mono text-[11px]">{log.deliveredTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
