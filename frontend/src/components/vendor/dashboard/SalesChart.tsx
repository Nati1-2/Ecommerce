"use client";

import { useState } from "react";
import { DailyAnalyticsPoint } from "@/types/vendor";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Props {
  data: DailyAnalyticsPoint[];
}

export default function SalesChart({ data }: Props) {
  const [metric, setMetric] = useState<"revenue" | "orders" | "profit">("revenue");

  const metricConfig = {
    revenue: { label: "Revenue", color: "#007BFF", stroke: "#007BFF", prefix: "$" },
    orders: { label: "Orders", color: "#10B981", stroke: "#10B981", prefix: "" },
    profit: { label: "Profit", color: "#8B5CF6", stroke: "#8B5CF6", prefix: "$" },
  };

  const current = metricConfig[metric];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sales & Performance Analytics</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Daily breakdown of store revenue, volume and estimated profit.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
          {(["revenue", "orders", "profit"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                metric === m
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={current.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={current.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 12 }}
              tickFormatter={(val) => (current.prefix ? `${current.prefix}${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}` : val)}
            />
            <Tooltip
              content={({ active, payload }: { active?: boolean; payload?: any[] }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as DailyAnalyticsPoint;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs space-y-1">
                      <p className="font-bold text-slate-300">{item.date}</p>
                      <p className="text-blue-400 font-bold">
                        {current.label}: {current.prefix}{item[metric].toLocaleString()}
                      </p>
                      <p className="text-slate-400 text-[10px]">Conversion: {item.conversionRate}% ({item.views} views)</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey={metric}
              stroke={current.stroke}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#chartGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
