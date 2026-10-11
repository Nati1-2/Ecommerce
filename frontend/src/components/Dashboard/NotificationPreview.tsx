"use client";

import { useDashboardStore } from "@/store/dashboardStore";
import { Bell, BellOff, X, Check, Truck, Tag, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotificationPreview() {
  const { notifications, removeNotification, clearNotifications } =
    useDashboardStore();

  const getNotiIcon = (type: string) => {
    switch (type) {
      case "success":
        return {
          icon: Check,
          style: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40",
        };
      case "shipping":
        return {
          icon: Truck,
          style: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/40",
        };
      case "discount":
        return {
          icon: Tag,
          style: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200/60 dark:border-purple-900/40",
        };
      default:
        return {
          icon: Bell,
          style: "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
        };
    }
  };

  return (
    <div className="p-6 border border-slate-200/80 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-xs space-y-4 select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500" />
          Alert Center
        </h3>
        {notifications.length > 0 && (
          <button
            onClick={clearNotifications}
            className="text-[10px] font-bold text-slate-400 dark:text-slate-500 hover:text-rose-500 transition-colors uppercase tracking-widest flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="py-8 bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl text-center flex flex-col items-center justify-center gap-2">
          <BellOff className="w-8 h-8 text-slate-300 dark:text-slate-600 stroke-[1.5]" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">You are all caught up!</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">No unread notifications at this time.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {notifications.slice(0, 4).map((noti) => {
            const config = getNotiIcon(noti.type);
            const NotiIcon = config.icon;

            return (
              <div
                key={noti.id}
                className="flex items-start gap-3.5 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 group hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                {/* Round icon status */}
                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border", config.style)}>
                  <NotiIcon className="w-4 h-4" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold block">
                    {noti.time}
                  </span>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 leading-snug">
                    {noti.message}
                  </p>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeNotification(noti.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-500 rounded-lg transition-all cursor-pointer"
                  aria-label="Dismiss notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
