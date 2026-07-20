"use client";

import { useState } from "react";
import { VendorStoreSettings } from "@/types/vendor";
import { Save, Receipt, Percent } from "lucide-react";

interface Props {
  settings: VendorStoreSettings;
  onSave: (updates: Partial<VendorStoreSettings>) => void;
  isSaving?: boolean;
}

export default function TaxSettings({ settings, onSave, isSaving }: Props) {
  const [vatNumber, setVatNumber] = useState(settings.tax.vatNumber);
  const [taxRatePercent, setTaxRatePercent] = useState(settings.tax.taxRatePercent);
  const [pricesIncludeTax, setPricesIncludeTax] = useState(settings.tax.pricesIncludeTax);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      tax: {
        vatNumber,
        taxRatePercent: Number(taxRatePercent),
        pricesIncludeTax,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tax & Regulatory Configuration</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage sales tax calculations, VAT IDs, and price inclusive options.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-1.5 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save Tax Settings"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">VAT / Tax Identification Number</label>
          <input
            type="text"
            value={vatNumber}
            onChange={(e) => setVatNumber(e.target.value)}
            placeholder="US-892341908-VAT"
            className="w-full mt-1 px-4 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Default Sales Tax Rate (%)</label>
          <input
            type="number"
            step="0.1"
            value={taxRatePercent}
            onChange={(e) => setTaxRatePercent(Number(e.target.value))}
            className="w-full mt-1 px-4 py-2.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
        <div>
          <p className="text-xs font-bold text-slate-900 dark:text-white">Catalog Prices Include Sales Tax</p>
          <p className="text-[11px] text-slate-400">If enabled, store prices automatically incorporate tax rate.</p>
        </div>
        <input
          type="checkbox"
          checked={pricesIncludeTax}
          onChange={(e) => setPricesIncludeTax(e.target.checked)}
          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 dark:bg-slate-800"
        />
      </div>
    </form>
  );
}
