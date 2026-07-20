"use client";

import { useState, useEffect } from "react";
import { useSystemSettings, useUpdateSettingsSection } from "@/hooks/useAdminSettingsQuery";
import { useAdminSettingsStore } from "@/store/adminSettingsStore";
import { Truck, Save, DollarSign } from "lucide-react";

export default function ShippingSettings() {
  const { data: settings, isLoading } = useSystemSettings();
  const updateMutation = useUpdateSettingsSection();
  const markDirty = useAdminSettingsStore((state) => state.markDirty);

  const [fedexEnabled, setFedexEnabled] = useState(true);
  const [upsEnabled, setUpsEnabled] = useState(true);
  const [dhlEnabled, setDhlEnabled] = useState(true);
  const [flatRateFee, setFlatRateFee] = useState(15.0);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(100.0);

  useEffect(() => {
    if (settings?.shipping) {
      setFedexEnabled(settings.shipping.fedexEnabled);
      setUpsEnabled(settings.shipping.upsEnabled);
      setDhlEnabled(settings.shipping.dhlEnabled);
      setFlatRateFee(settings.shipping.flatRateFee);
      setFreeShippingThreshold(settings.shipping.freeShippingThreshold);
    }
  }, [settings]);

  if (isLoading || !settings) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      section: "shipping",
      payload: { fedexEnabled, upsEnabled, dhlEnabled, flatRateFee, freeShippingThreshold },
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Truck className="w-5 h-5 text-blue-600" />
          Shipping Carriers & Delivery Zone Rates
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Configure carrier API integrations, default flat rate fees, and free shipping triggers.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Enable FedEx Express Carrier</p>
              <p className="text-[11px] text-slate-400">Live shipping rate calculation & tracking code generation</p>
            </div>
            <input
              type="checkbox"
              checked={fedexEnabled}
              onChange={(e) => {
                setFedexEnabled(e.target.checked);
                markDirty("fedexEnabled", e.target.checked);
              }}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Enable UPS Ground Carrier</p>
              <p className="text-[11px] text-slate-400">Standard ground logistics and dispatch labels</p>
            </div>
            <input
              type="checkbox"
              checked={upsEnabled}
              onChange={(e) => {
                setUpsEnabled(e.target.checked);
                markDirty("upsEnabled", e.target.checked);
              }}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">Default Flat Rate Shipping Fee ($)</label>
            <input
              type="number"
              value={flatRateFee}
              onChange={(e) => {
                setFlatRateFee(Number(e.target.value));
                markDirty("flatRateFee", Number(e.target.value));
              }}
              className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-bold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">Free Shipping Order Threshold ($)</label>
            <input
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => {
                setFreeShippingThreshold(Number(e.target.value));
                markDirty("freeShippingThreshold", Number(e.target.value));
              }}
              className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-bold"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            className="px-5 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Shipping Rules
          </button>
        </div>
      </form>
    </div>
  );
}
