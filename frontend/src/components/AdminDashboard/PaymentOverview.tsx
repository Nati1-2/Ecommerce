"use client";

import { AdminPayment } from "@/types/admin";
import { CreditCard, CheckCircle2, AlertOctagon, RotateCcw, Landmark, ShieldCheck, Zap } from "lucide-react";

interface Props {
  data: AdminPayment;
}

function formatAmount(amount?: number): string {
  const num = typeof amount === "number" ? amount : 0;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}k`;
  return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function PaymentOverview({ data }: Props) {
  const safeData = data || {
    totalTransactions: 0,
    successfulPayments: 0,
    failedPayments: 0,
    refundsProcessed: 0,
    pendingPayoutsAmount: 0,
    gatewayStatus: "Online",
  };

  const successRate =
    (safeData.totalTransactions ?? 0) > 0
      ? Math.round(((safeData.successfulPayments ?? 0) / (safeData.totalTransactions ?? 1)) * 1000) / 10
      : 100;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
      {/* Stripe Integration Status Banner */}
      <div className="p-5 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center font-black text-2xl shadow-inner border border-white/20">
            S
          </div>
          <div>
            <div className="flex items-center gap-2 font-black text-sm tracking-tight">
              Stripe Escrow & Payout Gateway
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            </div>
            <p className="text-xs text-blue-100 font-medium mt-0.5">
              Live Gateway State: <span className="font-bold text-emerald-300">{safeData.gatewayStatus || "Operational"}</span> • 3D Secure 2.0 Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl backdrop-blur-md text-xs font-bold shrink-0 border border-white/15">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span>PCI-DSS Level 1</span>
        </div>
      </div>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Transactions</p>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
            {(safeData.totalTransactions ?? 0).toLocaleString()}
          </p>
        </div>

        <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800">
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Success Rate</p>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {successRate}%
          </p>
        </div>

        <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800">
          <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">Failed / Declined</p>
          <p className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1 tabular-nums">
            {(safeData.failedPayments ?? 0).toLocaleString()}
          </p>
        </div>

        <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800">
          <p className="text-[10px] text-purple-500 font-bold uppercase tracking-wider">Refunds Settled</p>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
            {(safeData.refundsProcessed ?? 0).toLocaleString()}
          </p>
        </div>

        <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800 col-span-2 sm:col-span-1">
          <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Pending Payouts</p>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
            {formatAmount(safeData.pendingPayoutsAmount)}
          </p>
        </div>
      </div>
    </div>
  );
}
