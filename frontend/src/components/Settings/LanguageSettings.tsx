"use client";

import { useSettingsStore } from "@/store/settingsStore";
import { settingsApi } from "@/services/api/settings";
import { useState } from "react";
import { Check } from "lucide-react";

export default function LanguageSettings() {
  const { settings, updateLocalSetting, showToast } = useSettingsStore();
  const [isSaving, setIsSaving] = useState(false);

  const languages = [
    { code: "en", name: "English", region: "United States" },
    { code: "fr", name: "Français", region: "France" },
    { code: "de", name: "Deutsch", region: "Germany" },
    { code: "es", name: "Español", region: "Spain" },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await settingsApi.updateSettings({ language: settings.language });
      showToast("Language updated successfully");
    } catch (error) {
      showToast("Unable to save language", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Language</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Select your preferred language for the interface.
        </p>
      </div>

      <div className="max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {languages.map((lang) => {
            const isActive = settings.language === lang.code;

            return (
              <button
                key={lang.code}
                onClick={() => updateLocalSetting("language", lang.code)}
                className={`flex items-center justify-between p-4 rounded-xl border text-left transition-colors ${
                  isActive
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-500 ring-1 ring-blue-600 dark:ring-blue-500"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <div>
                  <h3 className={`font-medium ${isActive ? "text-blue-900 dark:text-blue-400" : "text-gray-900 dark:text-white"}`}>
                    {lang.name}
                  </h3>
                  <p className={`text-sm mt-0.5 ${isActive ? "text-blue-700 dark:text-blue-300" : "text-gray-500 dark:text-gray-400"}`}>
                    {lang.region}
                  </p>
                </div>
                {isActive && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            );
          })}
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
