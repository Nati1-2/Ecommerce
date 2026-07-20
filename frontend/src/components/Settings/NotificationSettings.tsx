"use client";

import { useSettingsStore } from "@/store/settingsStore";
import { settingsApi, UserSettings } from "@/services/api/settings";
import { useState } from "react";
import Toggle from "@/components/ui/Toggle";

export default function NotificationSettings() {
  const { settings, updateLocalSetting, showToast } = useSettingsStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await settingsApi.updateSettings(settings);
      showToast("Notification preferences saved successfully");
    } catch (error) {
      showToast("Unable to save settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const updatePreference = (key: keyof UserSettings["notificationPreferences"], value: boolean) => {
    updateLocalSetting("notificationPreferences", {
      ...(settings.notificationPreferences || {
        orderUpdates: false,
        promotions: false,
        discounts: false,
        newProducts: false,
        newsletter: false,
      }),
      [key]: value
    });
  };

  return (
    <div className="p-6 sm:p-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Preferences</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Choose how you receive updates and alerts.
        </p>
      </div>

      <div className="space-y-8 max-w-2xl">
        
        {/* Email Notifications */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email Notifications</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive emails about your account and activity</p>
            </div>
            <Toggle
              checked={settings.emailNotifications || false}
              onChange={(v) => updateLocalSetting("emailNotifications", v)}
            />
          </div>

          <div className={`space-y-4 ${!settings.emailNotifications ? "opacity-50 pointer-events-none" : ""}`}>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notificationPreferences?.orderUpdates || false}
                onChange={(e) => updatePreference("orderUpdates", e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Order Updates</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Shipping and delivery status</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notificationPreferences?.promotions || false}
                onChange={(e) => updatePreference("promotions", e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Promotions</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Sales and special offers</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notificationPreferences?.discounts || false}
                onChange={(e) => updatePreference("discounts", e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Discounts</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Personalized discount codes</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notificationPreferences?.newProducts || false}
                onChange={(e) => updatePreference("newProducts", e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">New Products</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Updates on new arrivals</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notificationPreferences?.newsletter || false}
                onChange={(e) => updatePreference("newsletter", e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Newsletter</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Weekly digest and news</p>
              </div>
            </label>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Push Notifications</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Receive alerts on your devices</p>
          </div>
          <Toggle
            checked={settings.pushNotifications || false}
            onChange={(v) => updateLocalSetting("pushNotifications", v)}
          />
        </div>

        {/* SMS Alerts */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">SMS Alerts</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Get order tracking updates via text message</p>
          </div>
          <Toggle
            checked={settings.smsAlerts || false}
            onChange={(v) => updateLocalSetting("smsAlerts", v)}
          />
        </div>

      </div>

      <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
