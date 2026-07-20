"use client";

import { ActivityItem } from "@/types/admin";
import { ShieldCheck, Store, Package, CreditCard, UserX, Clock } from "lucide-react";

interface Props {
  activities: ActivityItem[];
}

export default function ActivityTimeline({ activities }: Props) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "vendor":
        return <Store className="w-3.5 h-3.5 text-blue-500" />;
      case "product":
        return <Package className="w-3.5 h-3.5 text-purple-500" />;
      case "payment":
        return <CreditCard className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent System Audit Log</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Immutable timeline of administrative actions, compliance approvals, and security alerts.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((act, idx) => (
          <div key={act.id} className="flex items-start gap-3 relative">
            {idx !== activities.length - 1 && (
              <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 -z-0" />
            )}

            <img
              src={act.userAvatar}
              alt={act.user}
              className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-slate-200 dark:ring-slate-700 z-10"
            />

            <div className="flex-1 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/60 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  {getCategoryIcon(act.category)}
                  <span>{act.user}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{act.timestamp}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {act.action}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
