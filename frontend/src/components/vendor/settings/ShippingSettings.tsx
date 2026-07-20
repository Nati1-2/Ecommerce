"use client";

import { useState } from "react";
import { VendorStoreSettings } from "@/types/vendor";
import { Truck, RotateCcw, Receipt, Save } from "lucide-react";

interface Props {
  settings: VendorStoreSettings;
  onSave: (updates: Partial<VendorStoreSettings>) => void;
  isSaving?: boolean;
}

export default function ShippingSettings({ settings, onSave, isSaving }: Props) {
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(settings.shipping.freeShippingThreshold);
  const [standardFee, setStandardFee] = useState(settings.shipping.standardShippingFee);
  const [expressFee, setExpressFee] = useState(settings.shipping.expressShippingFee);
  const [returnWindowDays, setReturnWindowDays] = useState(settings.returns.returnWindowDays);
  const [policyText, setPolicyText] = useState(settings.returns.policyText);
  const [vatNumber, setVatNumber] = useState(settings.tax.vatNumber);
  const [taxRatePercent, setTaxRatePercent] = useState(settings.tax.taxRatePercent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      shipping: {
        ...settings.shipping,
        freeShippingThreshold: Number(freeShippingThreshold),
        standardShippingFee: Number(standardFee),
        expressShippingFee: Number(expressFee),
      },
      returns: {
        ...settings.returns,
        returnWindowDays: Number(returnWindowDays),
        policyText,
      },
      tax: {
        ...settings.tax,
        vatNumber,
        taxRatePercent: Number(taxRatePercent),
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Shipping, Returns & Tax Rules</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure delivery fees, customer refund policies, and VAT tax rates.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-1.5 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save Policy Rules"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Shipping Rates */}
        <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
            <Truck className="w-4 h-4 text-blue-500" />
            <span>Shipping Rates</span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Free Shipping Threshold ($)</label>
            <input
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Standard Shipping Fee ($)</label>
            <input
              type="number"
              step="0.01"
              value={standardFee}
              onChange={(e) => setStandardFee(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Express Shipping Fee ($)</label>
            <input
              type="number"
              step="0.01"
              value={expressFee}
              onChange={(e) => setExpressFee(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
            />
          </div>
        </div>

        {/* Returns */}
        <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
            <RotateCcw className="w-4 h-4 text-purple-500" />
            <span>Return Policy</span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Return Window (Days)</label>
            <input
              type="number"
              value={returnWindowDays}
              onChange={(e) => setReturnWindowDays(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Policy Summary Text</label>
            <textarea
              rows={3}
              value={policyText}
              onChange={(e) => setPolicyText(e.target.value)}
              className="w-full mt-1 px-3 py-2 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
            />
          </div>
        </div>

        {/* Tax */}
        <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
            <Receipt className="w-4 h-4 text-emerald-500" />
            <span>Tax & VAT</span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">VAT Registration Number</label>
            <input
              type="text"
              value={vatNumber}
              onChange={(e) => setVatNumber(e.target.value)}
              className="w-full mt-1 px-3 py-2 text-xs font-mono bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Sales Tax Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={taxRatePercent}
              onChange={(e) => setTaxRatePercent(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
