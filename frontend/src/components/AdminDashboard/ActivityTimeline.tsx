"use client";

import { ActivityItem } from "@/types/admin";
import { ShieldCheck, Store, Package, CreditCard, Clock, Activity } from "lucide-react";

interface Props {
  activities: ActivityItem[];
}

export default function ActivityTimeline({ activities }: Props) {
  const safeActivities = Array.isArray(activities) ? activities : [];

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "vendor":
        return {
          icon: Store,
          label: "Vendor",
          color: "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border-blue-200/80 dark:border-blue-800",
        };
      case "product":
        return {
          icon: Package,
          label: "Catalog",
          color: "text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 border-purple-200/80 dark:border-purple-800",
        };
      case "payment":
        return {
          icon: CreditCard,
          label: "Payment",
          color: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200/80 dark:border-emerald-800",
        };
      default:
        return {
          icon: ShieldCheck,
          label: "Audit",
          color: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200/80 dark:border-amber-800",
        };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Real-Time Audit & Activity Stream
            </h3>
            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Chronological log of seller onboarding, catalog submissions, and customer transactions.
          </p>
        </div>
      </div>

      {safeActivities.length === 0 ? (
        <div className="py-12 text-center text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
          <Activity className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto stroke-[1.5]" />
          <p className="text-sm font-bold text-slate-600 dark:text-slate-300 mt-2">
            No system audit events recorded yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {safeActivities.map((act) => {
            const badge = getCategoryBadge(act.category);
            const Icon = badge.icon;

            return (
              <div
                key={act.id}
                className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 flex items-start gap-3.5 hover:border-slate-300 dark:hover:border-slate-700 transition-all text-xs"
              >
                <img
                  src={act.userAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
                  alt={act.user}
                  className="w-9 h-9 rounded-xl object-cover shrink-0 ring-2 ring-slate-200 dark:ring-slate-700 shadow-2xs"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 dark:text-white truncate">
                        {act.user}
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border flex items-center gap-1 ${badge.color}`}>
                        <Icon className="w-3 h-3" />
                        {badge.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {act.timestamp}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 font-medium mt-1 leading-relaxed">
                    {act.action}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
