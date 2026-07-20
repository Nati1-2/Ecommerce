"use client";

import { useState } from "react";
import { useAdminOrderStore } from "@/store/adminOrderStore";
import { useProcessRefund } from "@/hooks/useAdminOrderQuery";
import { DollarSign, X, ShieldCheck } from "lucide-react";

export default function RefundModal() {
  const { refundModalOrder, setRefundModalOrder } = useAdminOrderStore();
  const refundMutation = useProcessRefund();
  const [amount, setAmount] = useState<number>(refundModalOrder?.amount || 0);
  const [reason, setReason] = useState("Defective / Damaged Item");

  if (!refundModalOrder) return null;

  const handleConfirm = () => {
    refundMutation.mutate({
      id: refundModalOrder.id,
      amount: amount || refundModalOrder.amount,
      reason,
    });
    setRefundModalOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Process Stripe Escrow Refund
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Charge ID: {refundModalOrder.stripeChargeId}</p>
            </div>
          </div>
          <button onClick={() => setRefundModalOrder(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex justify-between text-slate-500">
              <span>Customer:</span>
              <span className="font-bold text-slate-900 dark:text-white">{refundModalOrder.customerName}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Payment Gateway:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{refundModalOrder.paymentMethod}</span>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Refund Amount ($) *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              max={refundModalOrder.amount}
              className="w-full mt-1.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-600 font-bold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Refund Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
            >
              <option value="Defective / Damaged Item">Defective / Damaged Item</option>
              <option value="Item Not Delivered">Item Not Delivered / Lost Package</option>
              <option value="Customer Cancellation">Customer Cancellation</option>
              <option value="Dispute Resolution Agreement">Dispute Resolution Agreement</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setRefundModalOrder(null)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            Approve Stripe Refund
          </button>
        </div>
      </div>
    </div>
  );
}
