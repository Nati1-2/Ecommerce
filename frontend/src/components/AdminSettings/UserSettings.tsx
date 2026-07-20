"use client";

import { useState, useEffect } from "react";
import { useSystemSettings, useUpdateSettingsSection } from "@/hooks/useAdminSettingsQuery";
import { useAdminSettingsStore } from "@/store/adminSettingsStore";
import { Users, Save } from "lucide-react";

export default function UserSettings() {
  const { data: settings, isLoading } = useSystemSettings();
  const updateMutation = useUpdateSettingsSection();
  const markDirty = useAdminSettingsStore((state) => state.markDirty);

  const [userRegistration, setUserRegistration] = useState(true);
  const [emailVerification, setEmailVerification] = useState(true);
  const [phoneVerification, setPhoneVerification] = useState(false);
  const [minPasswordLength, setMinPasswordLength] = useState(8);

  useEffect(() => {
    if (settings?.users) {
      setUserRegistration(settings.users.userRegistration);
      setEmailVerification(settings.users.emailVerification);
      setPhoneVerification(settings.users.phoneVerification);
      setMinPasswordLength(settings.users.minPasswordLength);
    }
  }, [settings]);

  if (isLoading || !settings) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      section: "users",
      payload: { userRegistration, emailVerification, phoneVerification, minPasswordLength },
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          User & Account Registration Rules
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage signup permission, email verification requirements, and password security policies.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Allow Public User Signups</p>
              <p className="text-[11px] text-slate-400">Allow new customers to create accounts on the marketplace</p>
            </div>
            <input
              type="checkbox"
              checked={userRegistration}
              onChange={(e) => {
                setUserRegistration(e.target.checked);
                markDirty("userRegistration", e.target.checked);
              }}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Require Email Verification</p>
              <p className="text-[11px] text-slate-400">Send verification link to email before activating account</p>
            </div>
            <input
              type="checkbox"
              checked={emailVerification}
              onChange={(e) => {
                setEmailVerification(e.target.checked);
                markDirty("emailVerification", e.target.checked);
              }}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Require SMS Phone Verification</p>
              <p className="text-[11px] text-slate-400">Dispatch Twilio 6-digit OTP code to phone number</p>
            </div>
            <input
              type="checkbox"
              checked={phoneVerification}
              onChange={(e) => {
                setPhoneVerification(e.target.checked);
                markDirty("phoneVerification", e.target.checked);
              }}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>
        </div>

        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300">Minimum Password Length</label>
          <input
            type="number"
            value={minPasswordLength}
            onChange={(e) => {
              setMinPasswordLength(Number(e.target.value));
              markDirty("minPasswordLength", Number(e.target.value));
            }}
            min={6}
            max={32}
            className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-bold"
          />
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            className="px-5 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save User Settings
          </button>
        </div>
      </form>
    </div>
  );
}
