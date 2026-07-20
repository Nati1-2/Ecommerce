"use client";

import { useState } from "react";
import Toggle from "@/components/ui/Toggle";
import { KeyRound, Smartphone, ShieldCheck } from "lucide-react";
import { useSettingsStore } from "@/store/settingsStore";

export default function SecuritySettings() {
  const { showToast } = useSettingsStore();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const handlePasswordChange = () => {
    showToast("Password reset link sent to your email", "info");
  };

  return (
    <div className="p-6 sm:p-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your password and secure your account.
        </p>
      </div>

      <div className="space-y-8 max-w-2xl">
        
        {/* Password */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm text-gray-600 dark:text-gray-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white">Password</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last changed: 30 days ago</p>
            </div>
          </div>
          <button
            onClick={handlePasswordChange}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full sm:w-auto text-gray-900 dark:text-white"
          >
            Change Password
          </button>
        </div>

        {/* 2FA */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm text-blue-600 dark:text-blue-500">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-2">
                Two-Factor Authentication
                {twoFactorEnabled && <ShieldCheck className="w-4 h-4 text-green-500" />}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add an extra layer of security to your account</p>
            </div>
          </div>
          <Toggle
            checked={twoFactorEnabled}
            onChange={(v) => {
              setTwoFactorEnabled(v);
              showToast(v ? "2FA Enabled" : "2FA Disabled", "success");
            }}
          />
        </div>

      </div>
    </div>
  );
}
