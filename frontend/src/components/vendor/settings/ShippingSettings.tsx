"use client";

import { useState } from "react";
import { VendorStoreSettings } from "@/types/vendor";
import { Truck, Save } from "lucide-react";

interface Props {
  settings: VendorStoreSettings;
  onSave: (updates: Partial<VendorStoreSettings>) => void;
  isSaving?: boolean;
}

export default function ShippingSettings({ settings, onSave, isSaving }: Props) {
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(
    settings.shipping.freeShippingThreshold
  );
  const [standardFee, setStandardFee] = useState(settings.shipping.standardShippingFee);
  const [expressFee, setExpressFee] = useState(settings.shipping.expressShippingFee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      shipping: {
        ...settings.shipping,
        freeShippingThreshold: Number(freeShippingThreshold),
        standardShippingFee: Number(standardFee),
        expressShippingFee: Number(expressFee),
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6"
    >
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
            Shipping Rules & Delivery Fees
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure delivery fees, express rates, and free shipping qualification thresholds.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-1.5 disabled:opacity-50 active:scale-95 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save Shipping Rules"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Free Shipping Threshold ($)
          </label>
          <input
            type="number"
            value={freeShippingThreshold}
            onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
            className="w-full px-3.5 py-2 text-xs font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200/80 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600 tabular-nums"
          />
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Carts equal to or above this amount get free delivery.
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Standard Ground Delivery ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={standardFee}
            onChange={(e) => setStandardFee(Number(e.target.value))}
            className="w-full px-3.5 py-2 text-xs font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200/80 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600 tabular-nums"
          />
          <p className="text-[11px] text-slate-400 dark:text-slate-500">Typical 3-5 business day fulfillment.</p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Express Priority Shipping ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={expressFee}
            onChange={(e) => setExpressFee(Number(e.target.value))}
            className="w-full px-3.5 py-2 text-xs font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200/80 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600 tabular-nums"
          />
          <p className="text-[11px] text-slate-400 dark:text-slate-500">Next-day / 2-day expedited air freight.</p>
        </div>
      </div>
    </form>
  );
}
