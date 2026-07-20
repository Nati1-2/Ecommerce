"use client";

import { useAdminAnalyticsStore } from "@/store/adminAnalyticsStore";
import { useRevenueAnalytics } from "@/hooks/useAdminAnalyticsQuery";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { TrendingUp, DollarSign } from "lucide-react";

export default function RevenueChart() {
  const { dateRange, activeChartTab, setActiveChartTab } = useAdminAnalyticsStore();
  const { data = [], isLoading } = useRevenueAnalytics(dateRange);

  if (isLoading) {
    return <div className="h-80 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  const getMetricKey = () => {
    switch (activeChartTab) {
      case "gmv":
        return "gmv";
      case "profit":
        return "profit";
      default:
        return "revenue";
    }
  };

  const getMetricColor = () => {
    switch (activeChartTab) {
      case "gmv":
        return "#5AA8FF";
      case "profit":
        return "#16A34A";
      default:
        return "#007BFF";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      {/* Header & Metric Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Revenue & Marketplace GMV Performance</h3>
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full">
              <TrendingUp className="w-3 h-3" /> +22.1% YoY
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Gross merchandise value, net commission revenue, and gross profit trajectory.
          </p>
        </div>

        {/* Chart View Selector */}
        <div className="flex items-center p-1 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setActiveChartTab("revenue")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeChartTab === "revenue"
                ? "bg-blue-600 text-white font-bold shadow-sm"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            Commission Revenue
          </button>

          <button
            onClick={() => setActiveChartTab("gmv")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeChartTab === "gmv"
                ? "bg-blue-600 text-white font-bold shadow-sm"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            Gross GMV
          </button>

          <button
            onClick={() => setActiveChartTab("profit")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeChartTab === "profit"
                ? "bg-blue-600 text-white font-bold shadow-sm"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            Net Profit
          </button>
        </div>
      </div>

      {/* Recharts Area Graph */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getMetricColor()} stopOpacity={0.4} />
                <stop offset="95%" stopColor={getMetricColor()} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#94A3B8" }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#94A3B8" }} tickFormatter={(val) => `$${val / 1000000}M`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0F172A",
                borderColor: "#1E293B",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "12px",
              }}
              formatter={(value: any) => [`$${Number(value).toLocaleString()}`, activeChartTab.toUpperCase()]}
            />
            <Area type="monotone" dataKey={getMetricKey()} stroke={getMetricColor()} strokeWidth={3} fillOpacity={1} fill="url(#revGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
