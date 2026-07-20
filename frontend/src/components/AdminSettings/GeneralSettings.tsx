"use client";

import { useState, useEffect } from "react";
import { useSystemSettings, useUpdateSettingsSection } from "@/hooks/useAdminSettingsQuery";
import { useAdminSettingsStore } from "@/store/adminSettingsStore";
import { Globe, Save } from "lucide-react";

export default function GeneralSettings() {
  const { data: settings, isLoading } = useSystemSettings();
  const updateMutation = useUpdateSettingsSection();
  const markDirty = useAdminSettingsStore((state) => state.markDirty);

  const [platformName, setPlatformName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [currency, setCurrency] = useState("USD ($)");
  const [timezone, setTimezone] = useState("UTC-8 (Pacific Time)");

  useEffect(() => {
    if (settings?.general) {
      setPlatformName(settings.general.platformName);
      setLogoUrl(settings.general.logoUrl);
      setWebsiteUrl(settings.general.websiteUrl);
      setCurrency(settings.general.currency);
      setTimezone(settings.general.timezone);
    }
  }, [settings]);

  if (isLoading || !settings) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      section: "general",
      payload: { platformName, logoUrl, websiteUrl, currency, timezone },
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          General Platform Identity & Localization
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Configure platform branding, default currency, and regional timezone settings.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">Platform Brand Name *</label>
            <input
              type="text"
              value={platformName}
              onChange={(e) => {
                setPlatformName(e.target.value);
                markDirty("platformName", e.target.value);
              }}
              className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">Website URL *</label>
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => {
                setWebsiteUrl(e.target.value);
                markDirty("websiteUrl", e.target.value);
              }}
              className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-medium"
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300">Logo URL *</label>
          <input
            type="text"
            value={logoUrl}
            onChange={(e) => {
              setLogoUrl(e.target.value);
              markDirty("logoUrl", e.target.value);
            }}
            className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-medium"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">Default Currency</label>
            <select
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value);
                markDirty("currency", e.target.value);
              }}
              className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-semibold"
            >
              <option value="USD ($)">USD ($) - US Dollar</option>
              <option value="EUR (€)">EUR (€) - Euro</option>
              <option value="GBP (£)">GBP (£) - British Pound</option>
              <option value="CAD ($)">CAD ($) - Canadian Dollar</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => {
                setTimezone(e.target.value);
                markDirty("timezone", e.target.value);
              }}
              className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-semibold"
            >
              <option value="UTC-8 (Pacific Time)">UTC-8 (Pacific Time)</option>
              <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
              <option value="UTC+0 (GMT/London)">UTC+0 (GMT/London)</option>
              <option value="UTC+1 (Central European)">UTC+1 (Central European)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            className="px-5 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save General Settings
          </button>
        </div>
      </form>
    </div>
  );
}
