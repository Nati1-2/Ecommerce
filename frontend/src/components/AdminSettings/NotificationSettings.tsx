"use client";

import { useState, useEffect } from "react";
import { useSystemSettings, useUpdateSettingsSection } from "@/hooks/useAdminSettingsQuery";
import { useAdminSettingsStore } from "@/store/adminSettingsStore";
import { Bell, Save } from "lucide-react";

export default function NotificationSettings() {
  const { data: settings, isLoading } = useSystemSettings();
  const updateMutation = useUpdateSettingsSection();
  const markDirty = useAdminSettingsStore((state) => state.markDirty);

  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState(587);
  const [firebaseServerKey, setFirebaseServerKey] = useState("");
  const [twilioSid, setTwilioSid] = useState("");

  useEffect(() => {
    if (settings?.notifications) {
      setSmtpHost(settings.notifications.smtpHost);
      setSmtpPort(settings.notifications.smtpPort);
      setFirebaseServerKey(settings.notifications.firebaseServerKey);
      setTwilioSid(settings.notifications.twilioSid);
    }
  }, [settings]);

  if (isLoading || !settings) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      section: "notifications",
      payload: { smtpHost, smtpPort, firebaseServerKey, twilioSid },
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          Notification Gateway Credentials & Provider Settings
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Configure SMTP hosts, Firebase Cloud Messaging server keys, and Twilio SMS Account SIDs.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">SMTP Host *</label>
            <input
              type="text"
              value={smtpHost}
              onChange={(e) => {
                setSmtpHost(e.target.value);
                markDirty("smtpHost", e.target.value);
              }}
              className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">SMTP Port</label>
            <input
              type="number"
              value={smtpPort}
              onChange={(e) => {
                setSmtpPort(Number(e.target.value));
                markDirty("smtpPort", Number(e.target.value));
              }}
              className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-mono"
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300">Firebase FCM Server Key (Push Notifications)</label>
          <input
            type="password"
            value={firebaseServerKey}
            onChange={(e) => {
              setFirebaseServerKey(e.target.value);
              markDirty("firebaseServerKey", e.target.value);
            }}
            className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-mono"
          />
        </div>

        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300">Twilio Account SID (SMS Alerts)</label>
          <input
            type="text"
            value={twilioSid}
            onChange={(e) => {
              setTwilioSid(e.target.value);
              markDirty("twilioSid", e.target.value);
            }}
            className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-mono"
          />
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            className="px-5 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Notification Settings
          </button>
        </div>
      </form>
    </div>
  );
}
