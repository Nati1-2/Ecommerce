"use client";

import { useState } from "react";
import { X, ArrowUpRight, Landmark } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  onRequestPayout: (amount: number) => void;
}

export default function RequestPayoutModal({
  isOpen,
  onClose,
  availableBalance,
  onRequestPayout,
}: Props) {
  const [amount, setAmount] = useState<number>(availableBalance);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount > 0 && amount <= availableBalance) {
      onRequestPayout(amount);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111827] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200/80 dark:border-slate-800 space-y-6 relative">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-2xl">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base tracking-tight">
                Request Stripe Payout
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Transfer store balance to verified merchant bank
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Payout Amount (Max: ${availableBalance.toLocaleString()})
            </label>
            <input
              type="number"
              step="0.01"
              max={availableBalance}
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full mt-1.5 px-4 py-2.5 text-sm font-black bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200/80 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600 tabular-nums"
            />
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Settlement Rail:</span>
              <span className="font-bold text-slate-900 dark:text-white">Stripe Automated ACH</span>
            </div>
            <div className="flex justify-between">
              <span>Account Target:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">Verified Merchant Vault</span>
            </div>
            <div className="flex justify-between">
              <span>Expected Arrival:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">1-2 Business Days</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={amount <= 0 || amount > availableBalance}
              className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-1.5 disabled:opacity-50 active:scale-95 transition-all"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Submit Payout</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
