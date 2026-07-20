"use client";

import { useAdminSettingsStore } from "@/store/adminSettingsStore";
import { useSystemSettings } from "@/hooks/useAdminSettingsQuery";

import SettingsSidebar from "@/components/AdminSettings/SettingsSidebar";
import GeneralSettings from "@/components/AdminSettings/GeneralSettings";
import UserSettings from "@/components/AdminSettings/UserSettings";
import VendorSettings from "@/components/AdminSettings/VendorSettings";
import ProductSettings from "@/components/AdminSettings/ProductSettings";
import OrderSettings from "@/components/AdminSettings/OrderSettings";
import PaymentSettings from "@/components/AdminSettings/PaymentSettings";
import ShippingSettings from "@/components/AdminSettings/ShippingSettings";
import NotificationSettings from "@/components/AdminSettings/NotificationSettings";
import SecuritySettings from "@/components/AdminSettings/SecuritySettings";
import IntegrationSettings from "@/components/AdminSettings/IntegrationSettings";
import FeatureFlags from "@/components/AdminSettings/FeatureFlags";
import MaintenanceSettings from "@/components/AdminSettings/MaintenanceSettings";
import CacheManager from "@/components/AdminSettings/CacheManager";
import DatabaseStatus from "@/components/AdminSettings/DatabaseStatus";
import SystemHealth from "@/components/AdminSettings/SystemHealth";
import SettingsSaveBar from "@/components/AdminSettings/SettingsSaveBar";
import SettingsSkeleton from "@/components/AdminSettings/SettingsSkeleton";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function AdminSettingsPage() {
  const activeSection = useAdminSettingsStore((state) => state.activeSection);
  const { data: settings, isLoading, isError, refetch } = useSystemSettings();

  if (isLoading || !settings) return <SettingsSkeleton />;

  if (isError) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-3xl text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200">
          Unable to Load System Settings
        </h3>
        <p className="text-xs text-rose-600 dark:text-rose-400">
          The Configuration Service microservice encountered a timeout retrieving cluster environment variables.
        </p>
        <button
          onClick={() => refetch()}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin System Control Panel & Settings</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enterprise microservices configuration gateway, feature flags, security policies, and DB backups.
          </p>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Vertical Sidebar */}
        <div className="lg:col-span-1">
          <SettingsSidebar />
        </div>

        {/* Right Content Workspace */}
        <div className="lg:col-span-3 space-y-6">
          {activeSection === "general" && <GeneralSettings />}
          {activeSection === "users" && <UserSettings />}
          {activeSection === "vendors" && <VendorSettings />}
          {activeSection === "products" && <ProductSettings />}
          {activeSection === "orders" && <OrderSettings />}
          {activeSection === "payments" && <PaymentSettings />}
          {activeSection === "shipping" && <ShippingSettings />}
          {activeSection === "notifications" && <NotificationSettings />}
          {activeSection === "security" && <SecuritySettings />}
          {activeSection === "integrations" && <IntegrationSettings />}
          {activeSection === "feature-flags" && <FeatureFlags />}
          {activeSection === "maintenance" && <MaintenanceSettings />}
          {activeSection === "cache" && <CacheManager />}
          {activeSection === "database" && <DatabaseStatus />}
          {activeSection === "health" && <SystemHealth />}
        </div>
      </div>

      {/* Floating Save Changes Bar */}
      <SettingsSaveBar />
    </div>
  );
}
