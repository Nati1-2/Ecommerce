"use client";

import { useTrackingStore } from "@/store/trackingStore";
import { MessageSquare, Bell, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotificationHistory() {
  const { trackingHistory } = useTrackingStore();

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-4 select-none">
      <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
        <Bell className="w-4.5 h-4.5 text-gray-400" />
        Logistics Event Log
      </h3>

      {trackingHistory.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 rounded-2xl border border-gray-100/50">
          <p className="text-xs text-gray-400 font-bold">No recent logs recorded.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
          {trackingHistory.map((event, idx) => (
            <div
              key={idx}
              className={cn(
                "flex gap-3.5 items-start p-3.5 rounded-2xl border border-gray-100/60 transition-colors",
                idx === 0 ? "bg-blue-50/10 border-blue-100/30" : "bg-white"
              )}
            >
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 text-gray-400">
                <MessageSquare className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-gray-400 font-bold">
                    {event.timestamp}
                  </span>
                  <span className="text-[9px] font-black text-[#007BFF] bg-blue-50 px-1.5 py-0.5 rounded-md">
                    {event.location}
                  </span>
                </div>
                <p className="text-xs font-black text-gray-900 mt-1 leading-snug">
                  {event.status}
                </p>
                <p className="text-[10px] text-gray-500 font-semibold mt-0.5 leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
