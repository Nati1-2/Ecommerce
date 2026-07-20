"use client";

import { VendorPayout } from "@/types/vendor";
import { DollarSign, CreditCard, ArrowUpRight, CheckCircle2, Clock, Landmark } from "lucide-react";

interface Props {
  balance: { available: number; pending: number; totalEarnings: number };
  payouts: VendorPayout[];
  onRequestPayout: (amount: number) => void;
}

export default function PayoutCard({ balance, payouts, onRequestPayout }: Props) {
  return (
    <div className="space-y-6">
      {/* Stripe Connect Banner */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-lg">
            S
          </div>
          <div>
            <div className="flex items-center gap-2 font-bold text-sm">
              Stripe Connect Connected
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            </div>
            <p className="text-xs text-blue-100">Direct deposits linked to Chase Bank (ending in ****4092)</p>
          </div>
        </div>

        <button
          onClick={() => onRequestPayout(balance.available)}
          disabled={balance.available <= 0}
          className="px-5 py-2.5 bg-white text-blue-700 font-extrabold text-xs rounded-xl shadow-md hover:bg-blue-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Request Payout (${balance.available.toLocaleString()})</span>
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Available Balance</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ${balance.available.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Ready for instant deposit</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-amber-500">Pending Escrow Payout</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ${balance.pending.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Clears in 2-3 business days</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-blue-500">Total Lifetime Earnings</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ${balance.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Net revenue after commission</p>
        </div>
      </div>

      {/* Payout History List */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Payout History Log</h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {payouts.map((po) => (
            <div key={po.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    ${po.amount.toLocaleString()} {po.currency}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {po.payoutMethod} • Account ****{po.bankAccountLast4}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    po.status === "Paid"
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
                      : "bg-amber-100 text-amber-600 dark:bg-amber-900/30"
                  }`}
                >
                  {po.status}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">Arrives {po.estimatedArrival}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
