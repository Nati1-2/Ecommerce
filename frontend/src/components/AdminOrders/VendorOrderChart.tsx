"use client";

import { useVendorOrderDistribution } from "@/hooks/useAdminOrderQuery";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Store } from "lucide-react";

export default function VendorOrderChart() {
  const { data = [], isLoading } = useVendorOrderDistribution();

  if (isLoading) {
    return <div className="h-56 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5 text-blue-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Vendor Order & Revenue Distribution</h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">Quarterly GMV Allocation</span>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
            <XAxis dataKey="vendor" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#94A3B8" }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#94A3B8" }} tickFormatter={(val) => `$${val / 1000000}M`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0F172A",
                borderColor: "#1E293B",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "12px",
              }}
              formatter={(value: any, name: any) => [
                name === "revenue" ? `$${Number(value).toLocaleString()}` : `${Number(value).toLocaleString()} orders`,
                name === "revenue" ? "Revenue" : "Order Count",
              ]}
            />
            <Bar dataKey="revenue" fill="#007BFF" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
