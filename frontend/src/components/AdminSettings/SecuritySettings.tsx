"use client";

import { useState, useEffect } from "react";
import { useSystemSettings, useUpdateSettingsSection } from "@/hooks/useAdminSettingsQuery";
import { useAdminSettingsStore } from "@/store/adminSettingsStore";
import { ShieldCheck, Save, ShieldAlert, Key } from "lucide-react";

export default function SecuritySettings() {
  const { data: settings, isLoading } = useSystemSettings();
  const updateMutation = useUpdateSettingsSection();
  const markDirty = useAdminSettingsStore((state) => state.markDirty);

  const [twoFactorRequired, setTwoFactorRequired] = useState(true);
  const [sessionTimeoutMins, setSessionTimeoutMins] = useState(30);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);

  useEffect(() => {
    if (settings?.security) {
      setTwoFactorRequired(settings.security.twoFactorRequired);
      setSessionTimeoutMins(settings.security.sessionTimeoutMins);
      setMaxLoginAttempts(settings.security.maxLoginAttempts);
    }
  }, [settings]);

  if (isLoading || !settings) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      section: "security",
      payload: { twoFactorRequired, sessionTimeoutMins, maxLoginAttempts },
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            Security Audit & Access Control Center
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage two-factor authentication, session timeouts, and brute-force login protections.</p>
        </div>
        <span className="text-xs font-black px-3 py-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full">
          Security Score: {settings.security.securityScore}/100
        </span>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Require Two-Factor Authentication (2FA) For Admins</p>
              <p className="text-[11px] text-slate-400">Enforce Google Authenticator TOTP or SMS code on admin login</p>
            </div>
            <input
              type="checkbox"
              checked={twoFactorRequired}
              onChange={(e) => {
                setTwoFactorRequired(e.target.checked);
                markDirty("twoFactorRequired", e.target.checked);
              }}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">Admin Session Idle Timeout (Minutes)</label>
            <input
              type="number"
              value={sessionTimeoutMins}
              onChange={(e) => {
                setSessionTimeoutMins(Number(e.target.value));
                markDirty("sessionTimeoutMins", Number(e.target.value));
              }}
              min={5}
              max={120}
              className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-bold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">Max Failed Login Attempts Before Lockout</label>
            <input
              type="number"
              value={maxLoginAttempts}
              onChange={(e) => {
                setMaxLoginAttempts(Number(e.target.value));
                markDirty("maxLoginAttempts", Number(e.target.value));
              }}
              min={3}
              max={10}
              className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-bold"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            className="px-5 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Security Policies
          </button>
        </div>
      </form>
    </div>
  );
}
