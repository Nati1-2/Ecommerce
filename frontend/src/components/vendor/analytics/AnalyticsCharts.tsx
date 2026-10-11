"use client";

import { VendorAnalytics } from "@/types/vendor";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { DollarSign, ShoppingBag, RefreshCw, MapPin } from "lucide-react";

interface Props {
  analytics: VendorAnalytics;
}

export default function AnalyticsCharts({ analytics }: Props) {
  const colors = ["#2563EB", "#059669", "#7C3AED", "#D97706", "#DB2777"];

  return (
    <div className="space-y-8">
      {/* Key Conversion KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Store Conversion Rate</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
              {analytics.conversionRate}%
            </p>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              High visitor-to-sale performance
            </span>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-2xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Average Order Value (AOV)</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
              ${analytics.averageOrderValue.toFixed(2)}
            </p>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              Benchmark above target
            </span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Repeat Buyer Retention</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
              {analytics.repeatCustomerRate}%
            </p>
            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold">
              Strong customer loyalty
            </span>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-2xl">
            <RefreshCw className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Category Revenue Bar Chart & Top Regions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category breakdown chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              Revenue Breakdown by Category
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comparative gross sales distribution across product verticals
            </p>
          </div>

          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.categoryBreakdown}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748B" opacity={0.15} />
                <XAxis
                  dataKey="category"
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <Tooltip
                  content={({ active, payload }: { active?: boolean; payload?: readonly any[] }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 text-xs space-y-1 shadow-xl">
                          <p className="font-bold">{data.category}</p>
                          <p className="text-blue-400 font-black">
                            Revenue: ${data.revenue.toLocaleString()}
                          </p>
                          <p className="text-slate-400">{data.sales} units sold</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="revenue" radius={[10, 10, 0, 0]}>
                  {analytics.categoryBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Geographic Regions */}
        <div className="lg:col-span-1 bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              Top Geographic Markets
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Regional sales and order volume
            </p>
          </div>

          <div className="space-y-3 mt-5">
            {analytics.topGeographicRegions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No regional data recorded yet.</p>
            ) : (
              analytics.topGeographicRegions.map((region) => (
                <div
                  key={region.region}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{region.region}</h4>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">{region.sales} orders</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-slate-900 dark:text-white tabular-nums">
                    ${region.revenue.toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
