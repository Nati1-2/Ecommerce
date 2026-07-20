"use client";

import { useNotificationChannels } from "@/hooks/useAdminNotificationQuery";
import { Mail, Bell, Smartphone, Zap, CheckCircle2 } from "lucide-react";

export default function ChannelCards() {
  const { data: channels = [], isLoading } = useNotificationChannels();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        ))}
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "Email":
        return <Mail className="w-5 h-5 text-blue-500" />;
      case "Push":
        return <Bell className="w-5 h-5 text-purple-500" />;
      case "SMS":
        return <Smartphone className="w-5 h-5 text-emerald-500" />;
      default:
        return <Zap className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {channels.map((ch) => (
        <div
          key={ch.id}
          className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-2xl">{getIcon(ch.type)}</div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">{ch.name}</h4>
                <p className="text-[10px] text-slate-400 font-mono">Type: {ch.type}</p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> {ch.status}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-[10px] text-slate-400">Total Volume</p>
              <p className="font-extrabold text-slate-900 dark:text-white">{ch.sentTotal.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400">Success Rate</p>
              <p className="font-extrabold text-emerald-600 dark:text-emerald-400">{ch.successRate}%</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
