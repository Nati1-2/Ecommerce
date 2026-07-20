"use client";

import { useNotificationStore } from "@/store/notificationStore";
import { NotificationSettings as SettingsType } from "@/types";
import { X, Bell, Mail, Smartphone, Package, Tag, Shield } from "lucide-react";
import { useState } from "react";

interface Props {
  onClose: () => void;
}

export default function NotificationSettings({ onClose }: Props) {
  const { settings, updateSettings } = useNotificationStore();
  const [localSettings, setLocalSettings] = useState<SettingsType | null>(settings);

  if (!localSettings) return null;

  const handleToggle = (key: keyof SettingsType) => {
    setLocalSettings((prev) => prev ? { ...prev, [key]: !prev[key] } : null);
  };

  const handleSave = () => {
    if (localSettings) {
      updateSettings(localSettings);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-900 dark:text-white" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Notification Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Delivery Methods</h3>
            <div className="space-y-3">
              <ToggleRow
                icon={<Mail className="w-5 h-5" />}
                title="Email Notifications"
                description="Receive notifications via email"
                checked={localSettings.email}
                onChange={() => handleToggle("email")}
              />
              <ToggleRow
                icon={<Smartphone className="w-5 h-5" />}
                title="Push Notifications"
                description="Receive push notifications on this device"
                checked={localSettings.push}
                onChange={() => handleToggle("push")}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Notification Types</h3>
            <div className="space-y-3">
              <ToggleRow
                icon={<Package className="w-5 h-5 text-blue-500" />}
                title="Order Updates"
                description="Shipping, delivery, and returns"
                checked={localSettings.orders}
                onChange={() => handleToggle("orders")}
              />
              <ToggleRow
                icon={<Tag className="w-5 h-5 text-purple-500" />}
                title="Promotions & Offers"
                description="Flash sales, coupons, and discounts"
                checked={localSettings.promotions}
                onChange={() => handleToggle("promotions")}
              />
              <ToggleRow
                icon={<Shield className="w-5 h-5 text-red-500" />}
                title="Security Alerts"
                description="Logins, password changes, and account activity"
                checked={localSettings.security}
                onChange={() => handleToggle("security")}
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 text-sm font-bold bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ icon, title, description, checked, onChange }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="text-gray-500 dark:text-gray-400">
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{title}</p>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`${
          checked ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
      >
        <span
          aria-hidden="true"
          className={`${
            checked ? "translate-x-5" : "translate-x-0"
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );
}
