"use client";

import { useState } from "react";
import { X, ArrowUpRight, CheckCircle2, Landmark } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-white  rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200  space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100  pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50  text-blue-600 rounded-2xl">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900  text-base">Request Stripe Payout</h3>
              <p className="text-xs text-slate-400 mt-0.5">Transfer funds to linked bank account</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 ">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 ">
              Payout Amount (Max: ${availableBalance.toLocaleString()})
            </label>
            <input
              type="number"
              step="0.01"
              max={availableBalance}
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full mt-1.5 px-4 py-2.5 text-sm font-extrabold bg-slate-50  text-slate-900  rounded-xl border border-slate-200  outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="p-4 bg-slate-50  rounded-2xl text-xs space-y-1.5 text-slate-600 ">
            <div className="flex justify-between">
              <span>Payout Method:</span>
              <span className="font-bold text-slate-900 ">Stripe Direct Deposit</span>
            </div>
            <div className="flex justify-between">
              <span>Destination Bank:</span>
              <span className="font-mono font-bold text-slate-900 ">Chase ****4092</span>
            </div>
            <div className="flex justify-between">
              <span>Processing Time:</span>
              <span className="font-bold text-emerald-600 ">1-2 Business Days</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600  hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={amount <= 0 || amount > availableBalance}
              className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 disabled:opacity-50"
            >
              <ArrowUpRight className="w-4 h-4" />
              Submit Payout Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
