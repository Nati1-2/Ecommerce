"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Star } from "lucide-react";

export default function RatingAnalytics() {
  const ratingDistribution = [
    { stars: "5 Stars", percentage: 75, count: 3750000 },
    { stars: "4 Stars", percentage: 15, count: 750000 },
    { stars: "3 Stars", percentage: 5, count: 250000 },
    { stars: "2 Stars", percentage: 3, count: 150000 },
    { stars: "1 Star", percentage: 2, count: 100000 },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Marketplace Rating Distribution</h3>
        </div>
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
          4.8 ⭐ Platform Average
        </span>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ratingDistribution} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" opacity={0.5} />
            <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#94A3B8" }} tickFormatter={(v) => `${v}%`} />
            <YAxis dataKey="stars" type="category" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#94A3B8" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0F172A",
                borderColor: "#1E293B",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "12px",
              }}
              formatter={(value: any, name: any, item: any) => [
                `${value}% (${item.payload.count.toLocaleString()} reviews)`,
                "Share",
              ]}
            />
            <Bar dataKey="percentage" fill="#F59E0B" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
