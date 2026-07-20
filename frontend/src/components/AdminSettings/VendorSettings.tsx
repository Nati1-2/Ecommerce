"use client";

import { useState, useEffect } from "react";
import { useSystemSettings, useUpdateSettingsSection } from "@/hooks/useAdminSettingsQuery";
import { useAdminSettingsStore } from "@/store/adminSettingsStore";
import { Store, Save, Percent } from "lucide-react";

export default function VendorSettings() {
  const { data: settings, isLoading } = useSystemSettings();
  const updateMutation = useUpdateSettingsSection();
  const markDirty = useAdminSettingsStore((state) => state.markDirty);

  const [vendorRegistration, setVendorRegistration] = useState(true);
  const [vendorApprovalRequired, setVendorApprovalRequired] = useState(true);
  const [defaultCommissionPct, setDefaultCommissionPct] = useState(10);
  const [vendorKYCRequired, setVendorKYCRequired] = useState(true);

  useEffect(() => {
    if (settings?.vendors) {
      setVendorRegistration(settings.vendors.vendorRegistration);
      setVendorApprovalRequired(settings.vendors.vendorApprovalRequired);
      setDefaultCommissionPct(settings.vendors.defaultCommissionPct);
      setVendorKYCRequired(settings.vendors.vendorKYCRequired);
    }
  }, [settings]);

  if (isLoading || !settings) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      section: "vendors",
      payload: { vendorRegistration, vendorApprovalRequired, defaultCommissionPct, vendorKYCRequired },
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Store className="w-5 h-5 text-blue-600" />
          Vendor Marketplace & Commission Rules
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Configure seller onboarding approval, commission fees, and identity verification requirements.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Allow Vendor Store Applications</p>
              <p className="text-[11px] text-slate-400">Permit merchants to apply for seller storefront accounts</p>
            </div>
            <input
              type="checkbox"
              checked={vendorRegistration}
              onChange={(e) => {
                setVendorRegistration(e.target.checked);
                markDirty("vendorRegistration", e.target.checked);
              }}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Require Admin Approval For New Vendors</p>
              <p className="text-[11px] text-slate-400">Admins must review KYC documents before store activation</p>
            </div>
            <input
              type="checkbox"
              checked={vendorApprovalRequired}
              onChange={(e) => {
                setVendorApprovalRequired(e.target.checked);
                markDirty("vendorApprovalRequired", e.target.checked);
              }}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>
        </div>

        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Percent className="w-3.5 h-3.5 text-blue-500" /> Default Platform Commission Fee (%)
          </label>
          <input
            type="number"
            value={defaultCommissionPct}
            onChange={(e) => {
              setDefaultCommissionPct(Number(e.target.value));
              markDirty("defaultCommissionPct", Number(e.target.value));
            }}
            min={0}
            max={50}
            className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-extrabold text-sm"
          />
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            className="px-5 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Vendor Rules
          </button>
        </div>
      </form>
    </div>
  );
}
