"use client";

import { useState, useEffect } from "react";
import { useNotificationSettings, useUpdateSettings } from "@/hooks/useAdminNotificationQuery";
import { Settings, Save, Server, Key, Shield } from "lucide-react";

export default function NotificationSettings() {
  const { data: settingsData, isLoading } = useNotificationSettings();
  const updateSettingsMutation = useUpdateSettings();

  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState(587);
  const [firebaseServerKey, setFirebaseServerKey] = useState("");
  const [twilioAccountSid, setTwilioAccountSid] = useState("");
  const [rateLimitPerMin, setRateLimitPerMin] = useState(5000);

  useEffect(() => {
    if (settingsData) {
      setSmtpHost(settingsData.smtpHost);
      setSmtpPort(settingsData.smtpPort);
      setFirebaseServerKey(settingsData.firebaseServerKey);
      setTwilioAccountSid(settingsData.twilioAccountSid);
      setRateLimitPerMin(settingsData.rateLimitPerMin);
    }
  }, [settingsData]);

  if (isLoading || !settingsData) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate({
      smtpHost,
      smtpPort,
      firebaseServerKey,
      twilioAccountSid,
      rateLimitPerMin,
      retryAttempts: 3,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 max-w-3xl mx-auto">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-500" />
          Notification Microservice & Gateway Settings
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Configure SMTP, Firebase FCM, Twilio SMS, and RabbitMQ rate limits.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">SMTP Provider Host *</label>
            <input
              type="text"
              value={smtpHost}
              onChange={(e) => setSmtpHost(e.target.value)}
              className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">SMTP Port</label>
            <input
              type="number"
              value={smtpPort}
              onChange={(e) => setSmtpPort(Number(e.target.value))}
              className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-mono"
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300">Firebase FCM Server Key (Push) *</label>
          <input
            type="password"
            value={firebaseServerKey}
            onChange={(e) => setFirebaseServerKey(e.target.value)}
            className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-mono"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">Twilio Account SID (SMS)</label>
            <input
              type="text"
              value={twilioAccountSid}
              onChange={(e) => setTwilioAccountSid(e.target.value)}
              className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">RabbitMQ Dispatch Rate Limit (msgs/min)</label>
            <input
              type="number"
              value={rateLimitPerMin}
              onChange={(e) => setRateLimitPerMin(Number(e.target.value))}
              className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-mono font-bold"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            className="px-5 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
