"use client";

import { useAdminDashboardStore, AdminTimeframe } from "@/store/adminDashboardStore";
import { RevenuePoint } from "@/types/admin";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useTheme } from "next-themes";
import { TrendingUp, DollarSign, ArrowUpRight } from "lucide-react";

interface Props {
  data: RevenuePoint[];
  totalUsers?: number;
}

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}k`;
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function RevenueChart({ data, totalUsers }: Props) {
  const { activeTimeframe, setActiveTimeframe } = useAdminDashboardStore();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const chartData = Array.isArray(data) ? data : [];
  const totalPeriodRevenue = chartData.reduce((acc, d) => acc + (d?.revenue || 0), 0);
  const totalPeriodProfit = chartData.reduce((acc, d) => acc + (d?.profit || 0), 0);
  const totalPeriodSales = chartData.reduce((acc, d) => acc + (d?.sales || 0), 0);

  const conversionRate =
    totalUsers && totalUsers > 0
      ? `${((totalPeriodSales / totalUsers) * 100).toFixed(2)}%`
      : "3.4%";

  return (
    <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Platform Revenue & Merchandise Volume
            </h3>
            <span className="text-[11px] font-extrabold px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-full border border-emerald-200/80 dark:border-emerald-800">
              Live Stream
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time GMV marketplace gross merchandise value, commission yield, and conversion velocity.
          </p>
        </div>

        {/* Timeframe Segmented Control */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl self-start sm:self-auto border border-slate-200/60 dark:border-slate-700/60">
          {(["Today", "7d", "30d", "Year"] as AdminTimeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setActiveTimeframe(tf)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeTimeframe === tf
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tf === "7d" ? "7 Days" : tf === "30d" ? "30 Days" : tf}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Callouts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
            Period Gross GMV
          </p>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
            {formatCurrency(totalPeriodRevenue)}
          </p>
        </div>
        <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
            Platform Take-Rate (15%)
          </p>
          <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {formatCurrency(totalPeriodProfit)}
          </p>
        </div>
        <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 col-span-2 sm:col-span-1">
          <p className="text-[11px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
            Checkout Conversion
          </p>
          <p className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 tabular-nums">
            {conversionRate}
          </p>
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.15} />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => (val >= 1000 ? `$${val / 1000}k` : `$${val}`)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                borderColor: isDark ? "#1E293B" : "#E2E8F0",
                borderRadius: "16px",
                color: isDark ? "#FFFFFF" : "#0F172A",
                fontSize: "12px",
                fontWeight: "bold",
                boxShadow: isDark
                  ? "0 10px 25px -5px rgba(0, 0, 0, 0.4)"
                  : "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
              }}
              formatter={(val: any) => [`$${Number(val).toLocaleString()}`, "Amount"]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Gross GMV"
              stroke="#2563EB"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#revenueGrad)"
            />
            <Area
              type="monotone"
              dataKey="profit"
              name="Net Commission"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#profitGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
