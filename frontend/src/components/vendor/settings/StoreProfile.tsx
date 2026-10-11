"use client";

import { useState } from "react";
import { VendorStoreSettings } from "@/types/vendor";
import { Save, Store, ShieldCheck } from "lucide-react";

interface Props {
  settings: VendorStoreSettings;
  onSave: (updates: Partial<VendorStoreSettings>) => void;
  isSaving?: boolean;
}

export default function StoreProfile({ settings, onSave, isSaving }: Props) {
  const [storeName, setStoreName] = useState(settings.storeName);
  const [logo, setLogo] = useState(settings.logo);
  const [banner, setBanner] = useState(settings.banner);
  const [description, setDescription] = useState(settings.description);
  const [email, setEmail] = useState(settings.email);
  const [legalName, setLegalName] = useState(settings.companyDetails.legalName);
  const [taxId, setTaxId] = useState(settings.companyDetails.taxId);
  const [registrationNumber, setRegistrationNumber] = useState(
    settings.companyDetails.registrationNumber || ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      storeName,
      logo,
      banner,
      description,
      email,
      companyDetails: {
        legalName,
        taxId,
        registrationNumber,
        address: settings.companyDetails.address || "",
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
            Store Branding & Legal Profile
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Public storefront identity, branding assets, support contacts, and business registration.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-1.5 disabled:opacity-50 active:scale-95 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Name & Branding */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Public Storefront Name
            </label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full mt-1.5 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200/80 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Store Logo Image URL
            </label>
            <input
              type="url"
              required
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              className="w-full mt-1.5 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200/80 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Banner Background URL
            </label>
            <input
              type="url"
              required
              value={banner}
              onChange={(e) => setBanner(e.target.value)}
              className="w-full mt-1.5 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200/80 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Store Biography & Mission
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1.5 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200/80 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all leading-relaxed"
            />
          </div>
        </div>

        {/* Legal & Registration Details (No phone, No address) */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Legal Business Entity Name
            </label>
            <input
              type="text"
              required
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              className="w-full mt-1.5 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200/80 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Tax ID / EIN Number
            </label>
            <input
              type="text"
              required
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              className="w-full mt-1.5 px-4 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200/80 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Merchant Registration ID
            </label>
            <input
              type="text"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              placeholder="e.g. REG-CORP-9801"
              className="w-full mt-1.5 px-4 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200/80 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Customer Support Contact Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1.5 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200/80 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
