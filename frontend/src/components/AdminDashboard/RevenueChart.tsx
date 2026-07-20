"use client";

import { useAdminDashboardStore, AdminTimeframe } from "@/store/adminDashboardStore";
import { RevenuePoint } from "@/types/admin";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { DollarSign, TrendingUp, Filter } from "lucide-react";

interface Props {
  data: RevenuePoint[];
}

export default function RevenueChart({ data }: Props) {
  const { activeTimeframe, setActiveTimeframe } = useAdminDashboardStore();

  const totalPeriodRevenue = data.reduce((acc, d) => acc + d.revenue, 0);
  const totalPeriodProfit = data.reduce((acc, d) => acc + d.profit, 0);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Platform Revenue & Sales Growth</h3>
            <span className="text-[11px] font-bold px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-800">
              Live Stream
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Gross marketplace merchandise value (GMV), order volume, and net platform commissions.
          </p>
        </div>

        {/* Timeframe Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          {(["Today", "7d", "30d", "Year"] as AdminTimeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setActiveTimeframe(tf)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTimeframe === tf
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tf === "7d" ? "7 Days" : tf === "30d" ? "30 Days" : tf}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Callouts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
          <p className="text-xs text-slate-400 font-medium">Period GMV Revenue</p>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
            ${(totalPeriodRevenue / 1000000).toFixed(2)}M
          </p>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
          <p className="text-xs text-slate-400 font-medium">Platform Net Commission (15%)</p>
          <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
            ${(totalPeriodProfit / 1000).toFixed(0)}k
          </p>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl col-span-2 sm:col-span-1">
          <p className="text-xs text-slate-400 font-medium">Avg Conversion Rate</p>
          <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
            4.82%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#007BFF" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#007BFF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16A34A" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#1e293b",
                borderRadius: "16px",
                color: "#fff",
                fontSize: "12px",
                fontWeight: "bold",
              }}
              formatter={(val: any) => [`$${Number(val).toLocaleString()}`, "Amount"]}
            />
            <Area type="monotone" dataKey="revenue" name="Gross Revenue" stroke="#007BFF" strokeWidth={3} fillOpacity={1} fill="url(#revenueGrad)" />
            <Area type="monotone" dataKey="profit" name="Net Profit" stroke="#16A34A" strokeWidth={2} fillOpacity={1} fill="url(#profitGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
