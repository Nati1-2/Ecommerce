"use client";

import { useMutation } from "@tanstack/react-query";
import { settingsApi } from "@/services/api/settings";
import { useSettingsStore } from "@/store/settingsStore";
import { Download, FileText } from "lucide-react";

export default function DataManagement() {
  const { showToast } = useSettingsStore();

  const exportMutation = useMutation({
    mutationFn: settingsApi.exportData,
    onSuccess: (data) => {
      showToast(data.message, "success");
    },
    onError: () => {
      showToast("Failed to initiate data export", "error");
    }
  });

  return (
    <div className="p-6 sm:p-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Data</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Download a copy of your personal data or request account information.
        </p>
      </div>

      <div className="space-y-6 max-w-3xl">
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-gray-600 dark:text-gray-400 shrink-0">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Download Personal Data
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-lg">
                Get a copy of your account data, including order history, preferences, and saved items. The export will be delivered to your email.
              </p>
            </div>
          </div>
          <button
            onClick={() => exportMutation.mutate()}
            disabled={exportMutation.isPending}
            className="shrink-0 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 w-full sm:w-auto text-center"
          >
            {exportMutation.isPending ? "Preparing Export..." : "Request Data Export"}
          </button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-gray-600 dark:text-gray-400 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Privacy Policy & Terms
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-lg">
                Read how we collect, use, and protect your personal information in our detailed privacy policy.
              </p>
            </div>
          </div>
          <button
            className="shrink-0 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full sm:w-auto text-center"
          >
            View Policy
          </button>
        </div>
      </div>
    </div>
  );
}
