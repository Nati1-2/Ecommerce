"use client";

import { useProductAnalytics } from "@/hooks/useAdminAnalyticsQuery";
import { Package, Eye, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function ProductPerformance() {
  const { data: products = [], isLoading } = useProductAnalytics();

  if (isLoading) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Product Performance & Top Sellers</h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">Itemized Revenue Ranking</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold uppercase">
            <tr>
              <th className="py-2.5 px-3">Product Name & SKU</th>
              <th className="py-2.5 px-3">Vendor Store</th>
              <th className="py-2.5 px-3">Page Views</th>
              <th className="py-2.5 px-3">Sales Count</th>
              <th className="py-2.5 px-3 text-right">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-3 px-3">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      {p.status === "top" ? (
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      )}
                      {p.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</p>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{p.vendor}</td>
                <td className="py-3 px-3 text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Eye className="w-3 h-3 text-slate-400" /> {p.views.toLocaleString()}
                  </span>
                </td>
                <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">{p.sales.toLocaleString()}</td>
                <td className="py-3 px-3 text-right font-extrabold text-blue-600 dark:text-blue-400">${p.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
