"use client";

import { useAdminAnalyticsStore } from "@/store/adminAnalyticsStore";
import { useUserGrowth } from "@/hooks/useAdminAnalyticsQuery";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Users, TrendingUp } from "lucide-react";

export default function UserGrowthChart() {
  const dateRange = useAdminAnalyticsStore((state) => state.dateRange);
  const { data = [], isLoading } = useUserGrowth(dateRange);

  if (isLoading) {
    return <div className="h-72 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">User Acquisition & Active Accounts</h3>
        </div>
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
          78% Retention Rate
        </span>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#94A3B8" }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#94A3B8" }} tickFormatter={(val) => `${val / 1000}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0F172A",
                borderColor: "#1E293B",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "12px",
              }}
            />
            <Line type="monotone" dataKey="activeUsers" stroke="#007BFF" strokeWidth={3} dot={{ r: 4 }} name="Active Users" />
            <Line type="monotone" dataKey="returningUsers" stroke="#5AA8FF" strokeWidth={2} strokeDasharray="4 4" name="Returning Users" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
