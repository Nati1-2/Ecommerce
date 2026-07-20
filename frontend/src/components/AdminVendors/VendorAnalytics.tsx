"use client";

import { useVendorAnalytics } from "@/hooks/useAdminVendorQuery";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface Props {
  vendorId: string;
}

export default function VendorAnalytics({ vendorId }: Props) {
  const { data = [], isLoading } = useVendorAnalytics(vendorId);

  if (isLoading) {
    return <div className="h-44 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />;
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          Store Revenue Trajectory (Last 6 Months)
        </h4>
        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full">
          +24.8% YoY
        </span>
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="vendorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#007BFF" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#007BFF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#94A3B8" }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#94A3B8" }} tickFormatter={(val) => `$${val / 1000}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0F172A",
                borderColor: "#1E293B",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "12px",
              }}
              formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
            />
            <Area type="monotone" dataKey="revenue" stroke="#007BFF" strokeWidth={2.5} fillOpacity={1} fill="url(#vendorRev)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
