"use client";

import { PaymentTransaction } from "@/types/vendor";

interface Props {
  transactions: PaymentTransaction[];
}

export default function PaymentTable({ transactions }: Props) {
  return (
    <div className="bg-white  rounded-3xl border border-slate-200  shadow-sm p-4 sm:p-6 space-y-4">
      <h3 className="text-base font-bold text-slate-900 ">Transaction Logs & Fees</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50  text-slate-500  text-xs uppercase font-semibold">
            <tr>
              <th className="py-3.5 px-6">Transaction ID</th>
              <th className="py-3.5 px-6">Order Ref</th>
              <th className="py-3.5 px-6">Gross Amount</th>
              <th className="py-3.5 px-6">Platform Fee (2.9%)</th>
              <th className="py-3.5 px-6">Net Earnings</th>
              <th className="py-3.5 px-6">Type</th>
              <th className="py-3.5 px-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 ">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50/50  transition-colors">
                <td className="py-4 px-6 font-mono text-xs font-bold text-slate-900 ">
                  {tx.id}
                </td>
                <td className="py-4 px-6 font-mono text-xs text-blue-600 ">
                  {tx.orderNumber}
                </td>
                <td className="py-4 px-6 font-bold text-slate-900 ">
                  ${tx.amount.toFixed(2)}
                </td>
                <td className="py-4 px-6 text-xs text-rose-500 font-semibold">
                  -${tx.fee.toFixed(2)}
                </td>
                <td className="py-4 px-6 font-extrabold text-emerald-600 ">
                  ${tx.netAmount.toFixed(2)}
                </td>
                <td className="py-4 px-6 text-xs text-slate-600  font-medium">
                  {tx.type}
                </td>
                <td className="py-4 px-6 text-right">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-600 ">
                    {tx.status}
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
