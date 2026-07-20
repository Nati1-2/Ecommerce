"use client";

import { useState, useEffect } from "react";
import { useSystemSettings, useUpdateSettingsSection } from "@/hooks/useAdminSettingsQuery";
import { useAdminSettingsStore } from "@/store/adminSettingsStore";
import { CreditCard, Save, Eye, EyeOff, Lock } from "lucide-react";

export default function PaymentSettings() {
  const { data: settings, isLoading } = useSystemSettings();
  const updateMutation = useUpdateSettingsSection();
  const markDirty = useAdminSettingsStore((state) => state.markDirty);

  const [stripeEnabled, setStripeEnabled] = useState(true);
  const [stripePublicKey, setStripePublicKey] = useState("");
  const [stripeSecretKey, setStripeSecretKey] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [paypalEnabled, setPaypalEnabled] = useState(true);
  const [bankTransferEnabled, setBankTransferEnabled] = useState(true);

  useEffect(() => {
    if (settings?.payments) {
      setStripeEnabled(settings.payments.stripeEnabled);
      setStripePublicKey(settings.payments.stripePublicKey);
      setStripeSecretKey(settings.payments.stripeSecretKey);
      setPaypalEnabled(settings.payments.paypalEnabled);
      setBankTransferEnabled(settings.payments.bankTransferEnabled);
    }
  }, [settings]);

  if (isLoading || !settings) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      section: "payments",
      payload: { stripeEnabled, stripePublicKey, stripeSecretKey, paypalEnabled, bankTransferEnabled },
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          Payment Gateway & Merchant Credentials
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage Stripe Connect, PayPal Gateway API keys, and escrow bank payouts.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Enable Stripe Connect Gateway</p>
              <p className="text-[11px] text-slate-400">Process credit card payments and seller split payouts</p>
            </div>
            <input
              type="checkbox"
              checked={stripeEnabled}
              onChange={(e) => {
                setStripeEnabled(e.target.checked);
                markDirty("stripeEnabled", e.target.checked);
              }}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>
        </div>

        {stripeEnabled && (
          <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300">Stripe Publishable Key (PK) *</label>
              <input
                type="text"
                value={stripePublicKey}
                onChange={(e) => {
                  setStripePublicKey(e.target.value);
                  markDirty("stripePublicKey", e.target.value);
                }}
                className="w-full mt-1.5 px-3.5 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Stripe Restricted Secret Key (SK) *</span>
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="text-[10px] text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1"
                >
                  {showSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {showSecret ? "Hide Secret" : "Reveal Secret"}
                </button>
              </label>
              <input
                type={showSecret ? "text" : "password"}
                value={stripeSecretKey}
                onChange={(e) => {
                  setStripeSecretKey(e.target.value);
                  markDirty("stripeSecretKey", e.target.value);
                }}
                className="w-full mt-1.5 px-3.5 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-mono"
              />
            </div>
          </div>
        )}

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Enable PayPal Express Gateway</p>
              <p className="text-[11px] text-slate-400">Accept PayPal wallet balances and credit</p>
            </div>
            <input
              type="checkbox"
              checked={paypalEnabled}
              onChange={(e) => {
                setPaypalEnabled(e.target.checked);
                markDirty("paypalEnabled", e.target.checked);
              }}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            className="px-5 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Payment Settings
          </button>
        </div>
      </form>
    </div>
  );
}
