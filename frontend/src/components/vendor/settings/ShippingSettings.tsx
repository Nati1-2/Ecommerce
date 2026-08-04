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
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(settings.shipping.freeShippingThreshold);
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
    <form onSubmit={handleSubmit} className="bg-white  p-6 rounded-3xl border border-slate-200  shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100  pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 ">Shipping Rules</h3>
          <p className="text-xs text-slate-500  mt-0.5">
            Configure delivery fees and free shipping thresholds.
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

      <div className="grid grid-cols-1 gap-6">
        {/* Shipping Rates */}
        <div className="space-y-3 p-4 bg-slate-50  rounded-2xl">
          <div className="flex items-center gap-2 font-bold text-slate-900  text-xs">
            <Truck className="w-4 h-4 text-blue-500" />
            <span>Shipping Rates</span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 ">Free Shipping Threshold ($)</label>
            <input
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 text-xs bg-white  text-slate-900  rounded-xl border border-slate-200  outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 ">Standard Shipping Fee ($)</label>
            <input
              type="number"
              step="0.01"
              value={standardFee}
              onChange={(e) => setStandardFee(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 text-xs bg-white  text-slate-900  rounded-xl border border-slate-200  outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 ">Express Shipping Fee ($)</label>
            <input
              type="number"
              step="0.01"
              value={expressFee}
              onChange={(e) => setExpressFee(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 text-xs bg-white  text-slate-900  rounded-xl border border-slate-200  outline-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
