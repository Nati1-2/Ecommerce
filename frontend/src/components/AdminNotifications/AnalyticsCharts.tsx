"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { BarChart3, TrendingUp } from "lucide-react";

export default function AnalyticsCharts() {
  const data = [
    { date: "Mon", sent: 180000, delivered: 172000, openRate: 71 },
    { date: "Tue", sent: 210000, delivered: 201000, openRate: 74 },
    { date: "Wed", sent: 195000, delivered: 186000, openRate: 72 },
    { date: "Thu", sent: 240000, delivered: 230000, openRate: 76 },
    { date: "Fri", sent: 280000, delivered: 268000, openRate: 78 },
    { date: "Sat", sent: 220000, delivered: 210000, openRate: 70 },
    { date: "Sun", sent: 175000, delivered: 168000, openRate: 68 },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Notification Broadcast & Delivery Analytics</h3>
        </div>
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
          94.6% Avg Delivery
        </span>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="notifGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#007BFF" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#007BFF" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              formatter={(value: any) => [`${Number(value).toLocaleString()}`, "Notifications"]}
            />
            <Area type="monotone" dataKey="sent" stroke="#007BFF" strokeWidth={3} fillOpacity={1} fill="url(#notifGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
