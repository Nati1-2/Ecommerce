"use client";

import { usePaymentSummary } from "@/hooks/useAdminOrderQuery";
import { CreditCard, CheckCircle2, AlertTriangle, Clock, RefreshCcw } from "lucide-react";

export default function PaymentSummary() {
  const { data, isLoading } = usePaymentSummary();

  if (isLoading || !data) {
    return <div className="h-28 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  const items = [
    {
      title: "Successful Payments",
      val: `$${(data.successfulAmount / 1000000).toFixed(1)}M`,
      sub: `${data.successfulPayments.toLocaleString()} transactions`,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    },
    {
      title: "Pending Escrow Holds",
      val: `${data.pendingPayments.toLocaleString()} holds`,
      sub: "Awaiting delivery confirmation",
      icon: Clock,
      color: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    },
    {
      title: "Failed Charges",
      val: `${data.failedPayments.toLocaleString()} failed`,
      sub: "3D Secure 2.0 declines",
      icon: AlertTriangle,
      color: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
    },
    {
      title: "Processed Refunds",
      val: `$${(data.refundedAmount / 1000).toFixed(0)}k`,
      sub: `${data.refundedPayments.toLocaleString()} refunds issued`,
      icon: RefreshCcw,
      color: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((it) => {
        const Icon = it.icon;

        return (
          <div
            key={it.title}
            className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{it.title}</p>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{it.val}</p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">{it.sub}</p>
            </div>
            <div className={`p-3 rounded-2xl ${it.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
