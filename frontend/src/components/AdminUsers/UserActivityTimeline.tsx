"use client";

import { UserActivityEvent } from "@/types/adminUser";
import { LogIn, ShoppingBag, Star, Shield, Laptop } from "lucide-react";

interface Props {
  events: UserActivityEvent[];
  isLoading?: boolean;
}

export default function UserActivityTimeline({ events, isLoading }: Props) {
  if (isLoading) {
    return <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />;
  }

  const getEventIcon = (category: string) => {
    switch (category) {
      case "login":
        return <LogIn className="w-3.5 h-3.5 text-blue-500" />;
      case "order":
        return <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />;
      case "review":
        return <Star className="w-3.5 h-3.5 text-amber-500" />;
      case "security":
        return <Shield className="w-3.5 h-3.5 text-rose-500" />;
      default:
        return <Laptop className="w-3.5 h-3.5 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-3">
      {events.length === 0 ? (
        <p className="text-xs text-slate-400">No activity recorded yet.</p>
      ) : (
        events.map((ev) => (
          <div key={ev.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl text-xs space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                {getEventIcon(ev.category)}
                <span>{ev.action}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{ev.timestamp}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px]">{ev.details}</p>
            <div className="text-[10px] text-slate-400 pt-0.5 flex items-center justify-between font-mono">
              <span>IP: {ev.ipAddress}</span>
              <span>{ev.browser}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
