"use client";

import { AdminPayment } from "@/types/admin";
import { CreditCard, CheckCircle2, AlertOctagon, RotateCcw, Landmark, ShieldCheck } from "lucide-react";

interface Props {
  data: AdminPayment;
}

export default function PaymentOverview({ data }: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      {/* Stripe Integration Status Banner */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-xl">
            S
          </div>
          <div>
            <div className="flex items-center gap-2 font-bold text-sm">
              Stripe Payments & Escrow Gateway
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            </div>
            <p className="text-xs text-blue-100">
              Gateway Status: <span className="font-bold text-emerald-300">{data.gatewayStatus}</span> • 3D Secure 2.0 Enabled
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl backdrop-blur-md text-xs font-bold shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span>PCI-DSS Level 1 Compliant</span>
        </div>
      </div>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-400 font-medium">Total Transactions</p>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {data.totalTransactions.toLocaleString()}
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Successful Payments</p>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {data.successfulPayments.toLocaleString()}
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
          <p className="text-xs text-rose-500 font-medium">Failed / Declined</p>
          <p className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {data.failedPayments.toLocaleString()}
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
          <p className="text-xs text-purple-500 font-medium">Refunds Processed</p>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {data.refundsProcessed.toLocaleString()}
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 col-span-2 sm:col-span-1">
          <p className="text-xs text-amber-500 font-medium">Pending Payouts</p>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
            ${(data.pendingPayoutsAmount / 1000000).toFixed(2)}M
          </p>
        </div>
      </div>
    </div>
  );
}
