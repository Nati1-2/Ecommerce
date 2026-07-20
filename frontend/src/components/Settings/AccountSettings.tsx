"use client";

import { useSettingsStore } from "@/store/settingsStore";
import { settingsApi } from "@/services/api/settings";
import { useState } from "react";
import Toggle from "@/components/ui/Toggle";

export default function AccountSettings() {
  const { settings, updateLocalSetting, showToast } = useSettingsStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await settingsApi.updateSettings(settings);
      showToast("Account settings saved successfully");
    } catch (error) {
      showToast("Unable to save settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Account Preferences</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Update your public profile and account details.
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Display Name</label>
            <input
              type="text"
              value={settings.displayName || ""}
              onChange={(e) => updateLocalSetting("displayName", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
            <input
              type="text"
              value={settings.username || ""}
              onChange={(e) => updateLocalSetting("username", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Email Visibility</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Show your email address on your public profile</p>
            </div>
            <Toggle
              checked={settings.emailVisibility || false}
              onChange={(v) => updateLocalSetting("emailVisibility", v)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Phone Visibility</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Show your phone number on your public profile</p>
            </div>
            <Toggle
              checked={settings.phoneVisibility || false}
              onChange={(v) => updateLocalSetting("phoneVisibility", v)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile Visibility</label>
            <select
              value={settings.profileVisibility || "public"}
              onChange={(e) => updateLocalSetting("profileVisibility", e.target.value as any)}
              className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>
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
