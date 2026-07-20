"use client";

import { useState, useEffect } from "react";
import { useSystemSettings, useUpdateSettingsSection } from "@/hooks/useAdminSettingsQuery";
import { useAdminSettingsStore } from "@/store/adminSettingsStore";
import { Package, Save } from "lucide-react";

export default function ProductSettings() {
  const { data: settings, isLoading } = useSystemSettings();
  const updateMutation = useUpdateSettingsSection();
  const markDirty = useAdminSettingsStore((state) => state.markDirty);

  const [requireAdminApproval, setRequireAdminApproval] = useState(true);
  const [enableVariants, setEnableVariants] = useState(true);
  const [enableDigitalProducts, setEnableDigitalProducts] = useState(true);
  const [enableReviews, setEnableReviews] = useState(true);

  useEffect(() => {
    if (settings?.products) {
      setRequireAdminApproval(settings.products.requireAdminApproval);
      setEnableVariants(settings.products.enableVariants);
      setEnableDigitalProducts(settings.products.enableDigitalProducts);
      setEnableReviews(settings.products.enableReviews);
    }
  }, [settings]);

  if (isLoading || !settings) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      section: "products",
      payload: { requireAdminApproval, enableVariants, enableDigitalProducts, enableReviews },
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          Product Catalog & Moderation Rules
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Configure product publishing moderation, product variants, and customer reviews.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Require Admin Approval Before Publishing</p>
              <p className="text-[11px] text-slate-400">Newly submitted vendor products must be approved by admin</p>
            </div>
            <input
              type="checkbox"
              checked={requireAdminApproval}
              onChange={(e) => {
                setRequireAdminApproval(e.target.checked);
                markDirty("requireAdminApproval", e.target.checked);
              }}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Enable Product Variants</p>
              <p className="text-[11px] text-slate-400">Allow multi-attribute options (Color, Size, RAM, Storage)</p>
            </div>
            <input
              type="checkbox"
              checked={enableVariants}
              onChange={(e) => {
                setEnableVariants(e.target.checked);
                markDirty("enableVariants", e.target.checked);
              }}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Enable Digital Downloads</p>
              <p className="text-[11px] text-slate-400">Allow selling downloadable software, e-books, and licenses</p>
            </div>
            <input
              type="checkbox"
              checked={enableDigitalProducts}
              onChange={(e) => {
                setEnableDigitalProducts(e.target.checked);
                markDirty("enableDigitalProducts", e.target.checked);
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
            Save Product Rules
          </button>
        </div>
      </form>
    </div>
  );
}
