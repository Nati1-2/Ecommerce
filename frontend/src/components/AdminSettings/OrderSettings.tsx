"use client";

import { useState, useEffect } from "react";
import { useSystemSettings, useUpdateSettingsSection } from "@/hooks/useAdminSettingsQuery";
import { useAdminSettingsStore } from "@/store/adminSettingsStore";
import { ShoppingBag, Save } from "lucide-react";

export default function OrderSettings() {
  const { data: settings, isLoading } = useSystemSettings();
  const updateMutation = useUpdateSettingsSection();
  const markDirty = useAdminSettingsStore((state) => state.markDirty);

  const [autoConfirmation, setAutoConfirmation] = useState(true);
  const [allowCancellation, setAllowCancellation] = useState(true);
  const [returnPolicyDays, setReturnPolicyDays] = useState(30);

  useEffect(() => {
    if (settings?.orders) {
      setAutoConfirmation(settings.orders.autoConfirmation);
      setAllowCancellation(settings.orders.allowCancellation);
      setReturnPolicyDays(settings.orders.returnPolicyDays);
    }
  }, [settings]);

  if (isLoading || !settings) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      section: "orders",
      payload: { autoConfirmation, allowCancellation, returnPolicyDays },
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-blue-600" />
          Order Workflow & Return Policies
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage automated order processing, customer cancellation permissions, and return claim windows.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Auto-Confirm Payment Authorized Orders</p>
              <p className="text-[11px] text-slate-400">Automatically set order state to 'Confirmed' upon Stripe payment</p>
            </div>
            <input
              type="checkbox"
              checked={autoConfirmation}
              onChange={(e) => {
                setAutoConfirmation(e.target.checked);
                markDirty("autoConfirmation", e.target.checked);
              }}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Allow Customer Pre-Shipment Cancellation</p>
              <p className="text-[11px] text-slate-400">Customers can cancel order before vendor dispatches item</p>
            </div>
            <input
              type="checkbox"
              checked={allowCancellation}
              onChange={(e) => {
                setAllowCancellation(e.target.checked);
                markDirty("allowCancellation", e.target.checked);
              }}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>
        </div>

        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300">Return Policy Window (Days)</label>
          <input
            type="number"
            value={returnPolicyDays}
            onChange={(e) => {
              setReturnPolicyDays(Number(e.target.value));
              markDirty("returnPolicyDays", Number(e.target.value));
            }}
            min={7}
            max={90}
            className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-bold"
          />
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            className="px-5 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Order Rules
          </button>
        </div>
      </form>
    </div>
  );
}
