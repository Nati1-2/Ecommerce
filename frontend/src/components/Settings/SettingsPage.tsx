"use client";

import { useEffect, useState } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import SettingsSidebar from "./SettingsSidebar";
import AccountSettings from "./AccountSettings";
import NotificationSettings from "./NotificationSettings";
import PrivacySettings from "./PrivacySettings";
import SecuritySettings from "./SecuritySettings";
import ActiveSessions from "./ActiveSessions";
import ConnectedApps from "./ConnectedApps";
import AppearanceSettings from "./AppearanceSettings";
import LanguageSettings from "./LanguageSettings";
import DataManagement from "./DataManagement";
import DangerZone from "./DangerZone";
import Toast from "@/components/ui/Toast";
import { settingsApi } from "@/services/api/settings";
import SettingsSkeleton from "./SettingsSkeleton";
import { Menu } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function SettingsPage() {
  const { activeTab, setSettings } = useSettingsStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch initial settings
    settingsApi.getSettings().then((data) => {
      setSettings(data);
      setIsLoading(false);
    });
  }, [setSettings]);

  const renderActiveTab = () => {
    if (isLoading) return <SettingsSkeleton />;

    switch (activeTab) {
      case "account": return <AccountSettings />;
      case "security": return <SecuritySettings />;
      case "notifications": return <NotificationSettings />;
      case "privacy": return <PrivacySettings />;
      case "sessions": return <ActiveSessions />;
      case "apps": return <ConnectedApps />;
      case "appearance": return <AppearanceSettings />;
      case "language": return <LanguageSettings />;
      case "data": return <DataManagement />;
      case "danger": return <DangerZone />;
      default: return <AccountSettings />;
    }
  };

  const activeTabName = {
    account: "Account Settings",
    security: "Security",
    notifications: "Notifications",
    privacy: "Privacy",
    sessions: "Active Sessions",
    apps: "Connected Apps",
    appearance: "Appearance",
    language: "Language",
    data: "Your Data",
    danger: "Danger Zone",
  }[activeTab] || "Settings";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-24 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {activeTabName}
          </h1>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -mr-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Settings
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Manage your account preferences, security, and data.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28">
              <SettingsSidebar />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {renderActiveTab()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm bg-white dark:bg-gray-900 shadow-2xl lg:hidden border-r border-gray-200 dark:border-gray-800 flex flex-col"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <SettingsSidebar onNavClick={() => setIsMobileMenuOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Toast />
    </div>
  );
}
