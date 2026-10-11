"use client";

import { usePaymentSummary } from "@/hooks/useAdminOrderQuery";
import { CheckCircle2, AlertTriangle, Clock, RefreshCcw } from "lucide-react";
import AdminMetricCard from "@/components/AdminShared/AdminMetricCard";

export default function PaymentSummary() {
  const { data, isLoading } = usePaymentSummary();

  if (isLoading || !data) {
    return <div className="h-28 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse" />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <AdminMetricCard
        title="Successful Payments"
        value={`$${(data.successfulAmount / 1000000).toFixed(1)}M`}
        comparison={`${data.successfulPayments.toLocaleString()} transactions`}
        icon={CheckCircle2}
        variant="emerald"
      />
      <AdminMetricCard
        title="Pending Escrow Holds"
        value={`${data.pendingPayments.toLocaleString()} holds`}
        comparison="Awaiting delivery"
        icon={Clock}
        variant="amber"
      />
      <AdminMetricCard
        title="Failed Charges"
        value={`${data.failedPayments.toLocaleString()} failed`}
        comparison="3D Secure declines"
        icon={AlertTriangle}
        variant="slate"
      />
      <AdminMetricCard
        title="Processed Refunds"
        value={`$${(data.refundedAmount / 1000).toFixed(0)}k`}
        comparison={`${data.refundedPayments.toLocaleString()} refunds issued`}
        icon={RefreshCcw}
        variant="violet"
      />
    </div>
  );
}
