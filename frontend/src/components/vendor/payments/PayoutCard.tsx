"use client";

import { VendorPayout } from "@/types/vendor";
import { ArrowUpRight, CheckCircle2, Landmark, Clock } from "lucide-react";

interface Props {
  balance: { available: number; pending: number; totalEarnings: number };
  payouts: VendorPayout[];
  onRequestPayout: (amount: number) => void;
}

export default function PayoutCard({ balance, payouts, onRequestPayout }: Props) {
  return (
    <div className="space-y-6">
      {/* Stripe Connect Banner */}
      <div className="p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-3xl shadow-lg shadow-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-xl shrink-0">
            S
          </div>
          <div>
            <div className="flex items-center gap-2 font-bold text-sm">
              <span>Stripe Connect Merchant Gateway</span>
              <span className="flex items-center gap-1 text-[11px] font-semibold bg-emerald-400/25 text-emerald-200 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                Active
              </span>
            </div>
            <p className="text-xs text-blue-100/90 mt-0.5">
              Automated automated express payouts deposited to your verified settlement account.
            </p>
          </div>
        </div>

        <button
          onClick={() => onRequestPayout(balance.available)}
          disabled={balance.available <= 0}
          className="px-5 py-2.5 bg-white hover:bg-blue-50 text-blue-700 font-black text-xs rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0 active:scale-95"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Request Payout (${balance.available.toLocaleString()})</span>
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Available for Payout</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
            ${balance.available.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Ready for immediate bank deposit</p>
        </div>

        <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Pending Escrow Settlement</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
            ${balance.pending.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Clears once order fulfillment concludes</p>
        </div>

        <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Lifetime Realized Earnings</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
            ${balance.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Net store earnings after marketplace fees</p>
        </div>
      </div>

      {/* Payout History List */}
      <div className="bg-white dark:bg-[#111827] p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
          Recent Payout Disbursements
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {payouts.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <Clock className="w-5 h-5 mx-auto mb-1 text-slate-300 dark:text-slate-600" />
              No payout transfers recorded yet.
            </div>
          ) : (
            payouts.map((po) => (
              <div key={po.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 shrink-0">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white tabular-nums">
                      ${po.amount.toLocaleString()} {po.currency}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      {po.payoutMethod} • Account ****{po.bankAccountLast4}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      po.status === "Paid"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                    }`}
                  >
                    {po.status}
                  </span>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                    Est. arrival {po.estimatedArrival}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
