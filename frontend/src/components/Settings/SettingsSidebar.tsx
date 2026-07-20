"use client";

import { useSettingsStore } from "@/store/settingsStore";
import { cn } from "@/lib/utils";
import { 
  User, Shield, Bell, Eye, MonitorSmartphone, 
  Blocks, Palette, Globe, Database, AlertTriangle 
} from "lucide-react";

interface SettingsSidebarProps {
  onNavClick?: () => void;
}

export default function SettingsSidebar({ onNavClick }: SettingsSidebarProps) {
  const { activeTab, setActiveTab } = useSettingsStore();

  const navGroups = [
    {
      label: "Profile",
      items: [
        { id: "account", label: "Account", icon: User },
        { id: "security", label: "Security", icon: Shield },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "privacy", label: "Privacy", icon: Eye },
      ]
    },
    {
      label: "Devices & Integrations",
      items: [
        { id: "sessions", label: "Active Sessions", icon: MonitorSmartphone },
        { id: "apps", label: "Connected Apps", icon: Blocks },
      ]
    },
    {
      label: "Preferences",
      items: [
        { id: "appearance", label: "Appearance", icon: Palette },
        { id: "language", label: "Language", icon: Globe },
      ]
    },
    {
      label: "Data & Privacy",
      items: [
        { id: "data", label: "Your Data", icon: Database },
        { id: "danger", label: "Danger Zone", icon: AlertTriangle, danger: true },
      ]
    }
  ];

  return (
    <nav className="space-y-8">
      {navGroups.map((group) => (
        <div key={group.label}>
          <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            {group.label}
          </h3>
          <div className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isDanger = item.danger;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onNavClick) onNavClick();
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? isDanger
                        ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-500"
                        : "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-500"
                      : isDanger
                        ? "text-red-600 hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-500/10"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? (isDanger ? "text-red-600 dark:text-red-500" : "text-blue-700 dark:text-blue-500") : "text-gray-400 dark:text-gray-500")} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
