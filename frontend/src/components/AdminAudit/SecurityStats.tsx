"use client";

import { useAuditStats } from "@/hooks/useAdminAuditQuery";
import { Shield, Activity, Lock, AlertTriangle, UserCheck } from "lucide-react";

export default function SecurityStats() {
  const { data: stats, isLoading } = useAuditStats();

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Audit Logs Index",
      count: "25,000,000",
      sub: "Elasticsearch OpenSearch Cluster",
      icon: Shield,
      color: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Today's Ingested Events",
      count: stats.todayEvents.toLocaleString(),
      sub: "~1,400 events/minute",
      icon: Activity,
      color: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400",
    },
    {
      title: "Failed Login Attempts",
      count: stats.failedLogins.toLocaleString(),
      sub: "WAF Brute-force rate limited",
      icon: Lock,
      color: "bg-amber-50 dark:bg-amber-950/40 text-amber-500",
    },
    {
      title: "Active Security Alerts",
      count: stats.securityAlerts.toString(),
      sub: "Requires SOC investigation",
      icon: AlertTriangle,
      color: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400",
    },
    {
      title: "Admin Modifications",
      count: stats.adminActions.toLocaleString(),
      sub: "Recorded with diff history",
      icon: UserCheck,
      color: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">{card.title}</p>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{card.count}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-1">{card.sub}</p>
            </div>
            <div className={`p-2.5 rounded-2xl ${card.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
