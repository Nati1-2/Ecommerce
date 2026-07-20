"use client";

import { useVendorAnalytics } from "@/hooks/useAdminAnalyticsQuery";
import { Store, Star, TrendingUp } from "lucide-react";

export default function VendorPerformance() {
  const { data: vendors = [], isLoading } = useVendorAnalytics();

  if (isLoading) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5 text-blue-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Top Marketplace Sellers Leaderboard</h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">Quarterly GMV Ranking</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold uppercase">
            <tr>
              <th className="py-2.5 px-3">Vendor Store</th>
              <th className="py-2.5 px-3">Orders</th>
              <th className="py-2.5 px-3">Gross Revenue</th>
              <th className="py-2.5 px-3">Growth</th>
              <th className="py-2.5 px-3 text-right">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {vendors.map((v) => (
              <tr key={v.vendor} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2.5">
                    <img src={v.logo} alt={v.vendor} className="w-7 h-7 rounded-full object-cover shrink-0" />
                    <span className="font-bold text-slate-900 dark:text-white">{v.vendor}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{v.orders.toLocaleString()}</td>
                <td className="py-3 px-3 font-extrabold text-blue-600 dark:text-blue-400">${v.revenue.toLocaleString()}</td>
                <td className="py-3 px-3 text-emerald-600 font-bold">↑ {v.growth}%</td>
                <td className="py-3 px-3 text-right">
                  <span className="inline-flex items-center gap-1 font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {v.rating}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
