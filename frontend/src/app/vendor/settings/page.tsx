"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vendorApi } from "@/services/api/vendorApi";
import { useVendorStore } from "@/store/vendorStore";
import StoreProfile from "@/components/vendor/settings/StoreProfile";
import ShippingSettings from "@/components/vendor/settings/ShippingSettings";
import TaxSettings from "@/components/vendor/settings/TaxSettings";
import ReturnSettings from "@/components/vendor/settings/ReturnSettings";
import { VendorStoreSettings } from "@/types/vendor";

export default function VendorSettingsPage() {
  const queryClient = useQueryClient();
  const { showToast } = useVendorStore();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["vendor-settings"],
    queryFn: vendorApi.getSettings,
  });

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<VendorStoreSettings>) => vendorApi.updateSettings(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-settings"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });
      showToast("Store settings saved successfully", "success");
    },
  });

  if (isLoading || !settings) {
    return (
      <div className="h-96 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 animate-pulse max-w-7xl mx-auto flex items-center justify-center text-slate-400 text-xs font-semibold">
        Fetching store configuration from live database...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Store Configurations & Merchant Preferences
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Customize store branding, legal entities, tax rates, return policies, and delivery rules.
        </p>
      </div>

      {/* Store Profile & Legal Info */}
      <StoreProfile
        settings={settings}
        onSave={(updates) => updateMutation.mutate(updates)}
        isSaving={updateMutation.isPending}
      />

      {/* Shipping & Delivery Configuration */}
      <ShippingSettings
        settings={settings}
        onSave={(updates) => updateMutation.mutate(updates)}
        isSaving={updateMutation.isPending}
      />

      {/* Tax & VAT Configuration */}
      <TaxSettings
        settings={settings}
        onSave={(updates) => updateMutation.mutate(updates)}
        isSaving={updateMutation.isPending}
      />

      {/* Returns & Refund Policy */}
      <ReturnSettings
        settings={settings}
        onSave={(updates) => updateMutation.mutate(updates)}
        isSaving={updateMutation.isPending}
      />
    </div>
  );
}
