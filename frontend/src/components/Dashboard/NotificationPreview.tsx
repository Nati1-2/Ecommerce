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
        return { icon: Check, style: "text-emerald-600 bg-emerald-50 border-emerald-100" };
      case "shipping":
        return { icon: Truck, style: "text-blue-600 bg-blue-50 border-blue-100" };
      case "discount":
        return { icon: Tag, style: "text-purple-600 bg-purple-50 border-purple-100" };
      default:
        return { icon: Bell, style: "text-gray-600 bg-gray-50 border-gray-100" };
    }
  };

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-4 select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
          <Bell className="w-4.5 h-4.5 text-gray-400" />
          Alert Center
        </h3>
        {notifications.length > 0 && (
          <button
            onClick={clearNotifications}
            className="text-[9px] font-black text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="py-8 bg-gray-50 border border-gray-100 rounded-2xl text-center flex flex-col items-center justify-center gap-2">
          <BellOff className="w-8 h-8 text-gray-300" />
          <p className="text-xs text-gray-400 font-bold">You are all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((noti) => {
            const config = getNotiIcon(noti.type);
            const NotiIcon = config.icon;

            return (
              <div
                key={noti.id}
                className="flex items-start gap-3.5 p-3.5 rounded-2xl border border-gray-100 bg-white group hover:border-gray-200 transition-all"
              >
                {/* Round icon status */}
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border", config.style)}>
                  <NotiIcon className="w-4 h-4" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] text-gray-400 font-semibold">{noti.time}</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-900 mt-1 leading-snug">
                    {noti.message}
                  </p>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeNotification(noti.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all"
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
