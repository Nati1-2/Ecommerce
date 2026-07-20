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
  const latest = data[data.length - 1] || { newUsers: 950, activeUsers: 36800, returningUsers: 27800 };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">User Acquisition & Engagement</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            New signups, daily active users (DAU), and returning customer retention trends.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 bg-blue-50 dark:bg-blue-950/30 rounded-2xl">
          <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">Daily New Users</p>
          <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
            +{latest.newUsers}
          </p>
        </div>
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl">
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Active Users (DAU)</p>
          <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
            {latest.activeUsers.toLocaleString()}
          </p>
        </div>
        <div className="p-3.5 bg-purple-50 dark:bg-purple-950/30 rounded-2xl">
          <p className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">Returning Buyers</p>
          <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
            {latest.returningUsers.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Line Chart */}
      <div className="h-60 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#1e293b",
                borderRadius: "16px",
                color: "#fff",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            />
            <Line type="monotone" dataKey="activeUsers" name="Active Users" stroke="#007BFF" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="returningUsers" name="Returning Customers" stroke="#16A34A" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
