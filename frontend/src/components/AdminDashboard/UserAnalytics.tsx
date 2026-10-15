"use client";

import { UserGrowthPoint } from "@/types/admin";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Users, UserPlus, UserCheck } from "lucide-react";

interface Props {
  data: UserGrowthPoint[];
}

export default function UserAnalytics({ data }: Props) {
  const chartData = Array.isArray(data) ? data : [];
  const latest = chartData[chartData.length - 1] || { newUsers: 0, activeUsers: 0, returningUsers: 0 };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            User Acquisition & DAU
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Signups and daily active customer retention.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/40 rounded-2xl border border-blue-100/60 dark:border-blue-900/40 text-center">
          <p className="text-[10px] font-extrabold uppercase text-blue-600 dark:text-blue-400">New</p>
          <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5 tabular-nums">
            +{latest.newUsers ?? 0}
          </p>
        </div>
        <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100/60 dark:border-emerald-900/40 text-center">
          <p className="text-[10px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400">DAU Active</p>
          <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5 tabular-nums">
            {(latest.activeUsers ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="p-3.5 bg-purple-50/70 dark:bg-purple-950/40 rounded-2xl border border-purple-100/60 dark:border-purple-900/40 text-center">
          <p className="text-[10px] font-extrabold uppercase text-purple-600 dark:text-purple-400">Returning</p>
          <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5 tabular-nums">
            {(latest.returningUsers ?? 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Line Chart */}
      <div className="h-60 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.15} />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                borderColor: "#E2E8F0",
                borderRadius: "16px",
                color: "#0F172A",
                fontSize: "12px",
                fontWeight: "bold",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
              }}
            />
            <Line
              type="monotone"
              dataKey="activeUsers"
              name="Active Users"
              stroke="#2563EB"
              strokeWidth={3}
              dot={{ r: 3, fill: "#2563EB" }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="returningUsers"
              name="Returning Customers"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 3, fill: "#10B981" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
