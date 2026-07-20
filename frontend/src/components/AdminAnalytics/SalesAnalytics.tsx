"use client";

import { ShoppingCart, CreditCard, RotateCcw, Percent, DollarSign } from "lucide-react";

export default function SalesAnalytics() {
  const salesMetrics = [
    { label: "Average Order Value (AOV)", value: "$125.00", growth: "+4.2%", icon: DollarSign, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/40" },
    { label: "Cart Conversion Rate", value: "68.4%", growth: "+2.1%", icon: ShoppingCart, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40" },
    { label: "Checkout Completion", value: "85.2%", growth: "+1.8%", icon: CreditCard, color: "text-purple-500 bg-purple-50 dark:bg-purple-950/40" },
    { label: "Repeat Purchase Rate", value: "42.0%", growth: "+5.4%", icon: RotateCcw, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/40" },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Sales & Checkout Performance</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Key purchase efficiency metrics</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {salesMetrics.map((sm) => {
          const Icon = sm.icon;

          return (
            <div key={sm.label} className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl ${sm.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{sm.growth}</span>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">{sm.label}</p>
                <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{sm.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
