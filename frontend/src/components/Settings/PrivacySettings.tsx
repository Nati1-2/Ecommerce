"use client";

import { useSettingsStore } from "@/store/settingsStore";
import { settingsApi } from "@/services/api/settings";
import { useState } from "react";
import Toggle from "@/components/ui/Toggle";

export default function PrivacySettings() {
  const { settings, updateLocalSetting, showToast } = useSettingsStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await settingsApi.updateSettings(settings);
      showToast("Privacy settings saved successfully");
    } catch (error) {
      showToast("Unable to save settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy Controls</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage how your information is used and shared.
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h3 className="text-base font-medium text-gray-900 dark:text-white">Show Reviews Publicly</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Allow your product reviews to be visible on your public profile.</p>
          </div>
          <Toggle
            checked={settings.showReviewsPublicly || false}
            onChange={(v) => updateLocalSetting("showReviewsPublicly", v)}
          />
        </div>

        <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h3 className="text-base font-medium text-gray-900 dark:text-white">Personalized Recommendations</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Allow us to use your browsing history to improve your product recommendations.</p>
          </div>
          <Toggle
            checked={settings.personalizedRecommendations || false}
            onChange={(v) => updateLocalSetting("personalizedRecommendations", v)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-gray-900 dark:text-white">Data Sharing Preferences</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Allow anonymous data sharing with analytics partners to improve services.</p>
          </div>
          <Toggle
            checked={settings.dataSharingPreferences || false}
            onChange={(v) => updateLocalSetting("dataSharingPreferences", v)}
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
