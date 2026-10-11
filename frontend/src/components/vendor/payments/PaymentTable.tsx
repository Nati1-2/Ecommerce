"use client";

import { PaymentTransaction } from "@/types/vendor";
import { Receipt } from "lucide-react";

interface Props {
  transactions: PaymentTransaction[];
}

export default function PaymentTable({ transactions }: Props) {
  return (
    <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 sm:p-6 space-y-4">
      <div>
        <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
          Transaction Ledger & Fee Breakdown
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Itemized record of completed order disbursements and processing fees.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="py-3.5 px-6">Transaction ID</th>
              <th className="py-3.5 px-6">Order Ref</th>
              <th className="py-3.5 px-6">Gross Amount</th>
              <th className="py-3.5 px-6">Marketplace Fee</th>
              <th className="py-3.5 px-6">Net Payout</th>
              <th className="py-3.5 px-6">Type</th>
              <th className="py-3.5 px-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                  <Receipt className="w-6 h-6 mx-auto mb-1 text-slate-300 dark:text-slate-600" />
                  No payment transactions recorded yet.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-850 transition-colors">
                  <td className="py-4 px-6 font-mono text-xs font-bold text-slate-900 dark:text-white">
                    {tx.id}
                  </td>
                  <td className="py-4 px-6 font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {tx.orderNumber}
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900 dark:text-white tabular-nums">
                    ${tx.amount.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-xs text-rose-600 dark:text-rose-400 font-semibold tabular-nums">
                    -${tx.fee.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                    ${tx.netAmount.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {tx.type}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
