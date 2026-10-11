"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vendorApi } from "@/services/api/vendorApi";
import { useVendorStore } from "@/store/vendorStore";
import PayoutCard from "@/components/vendor/payments/PayoutCard";
import PaymentTable from "@/components/vendor/payments/PaymentTable";
import RequestPayoutModal from "@/components/vendor/payments/RequestPayoutModal";

export default function VendorPaymentsPage() {
  const queryClient = useQueryClient();
  const { showToast } = useVendorStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["vendor-payments"],
    queryFn: vendorApi.getPayments,
  });

  const payoutMutation = useMutation({
    mutationFn: (amount: number) => vendorApi.requestPayout(amount),
    onSuccess: (payout) => {
      queryClient.invalidateQueries({ queryKey: ["vendor-payments"] });
      showToast(`Payout request for $${payout.amount.toLocaleString()} submitted to Stripe!`, "success");
    },
  });

  if (isLoading || !data) {
    return (
      <div className="h-96 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 animate-pulse max-w-7xl mx-auto flex items-center justify-center text-slate-400 text-xs font-semibold">
        Connecting to live payment records...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Payments & Stripe Direct Disbursements
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Monitor escrow reserves, Stripe Connect express payouts, marketplace fees, and transaction ledgers.
        </p>
      </div>

      <PayoutCard
        balance={data.balance}
        payouts={data.payouts}
        onRequestPayout={() => setIsModalOpen(true)}
      />

      <PaymentTable transactions={data.transactions} />

      <RequestPayoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availableBalance={data.balance.available}
        onRequestPayout={(amount) => payoutMutation.mutate(amount)}
      />
    </div>
  );
}
