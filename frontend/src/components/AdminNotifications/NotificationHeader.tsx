"use client";

import { useAdminNotificationStore, AdminNotificationTab } from "@/store/adminNotificationStore";
import { useRouter } from "next/navigation";
import { Send, Megaphone, LayoutTemplate, Plus } from "lucide-react";

export default function NotificationHeader() {
  const router = useRouter();
  const { activeTab, setActiveTab, setIsCampaignWizardOpen, setIsTemplateModalOpen } =
    useAdminNotificationStore();

  const tabs: { id: AdminNotificationTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "create", label: "Send Notification" },
    { id: "campaigns", label: "Campaigns" },
    { id: "templates", label: "Templates" },
    { id: "logs", label: "Delivery Logs" },
    { id: "realtime", label: "Realtime Events" },
    { id: "analytics", label: "Analytics" },
    { id: "automation", label: "Automation Rules" },
    { id: "settings", label: "Gateway Settings" },
  ];

  const handleTabClick = (tabId: AdminNotificationTab) => {
    setActiveTab(tabId);
    if (tabId === "create") router.push("/admin/notifications/create");
    else if (tabId === "campaigns") router.push("/admin/notifications/campaigns");
    else if (tabId === "templates") router.push("/admin/notifications/templates");
    else router.push("/admin/notifications");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notification Center & FCM Gateway</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Broadcast transactional emails, Firebase push notifications, SMS alerts, marketing campaigns, and Socket.IO events.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <LayoutTemplate className="w-4 h-4 text-purple-500" />
            <span>Manage Templates</span>
          </button>

          <button
            onClick={() => setIsCampaignWizardOpen(true)}
            className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Megaphone className="w-4 h-4 text-emerald-500" />
            <span>Create Campaign</span>
          </button>

          <button
            onClick={() => handleTabClick("create")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-blue-500/25 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Notification</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1 overflow-x-auto p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-semibold">
        {tabs.map((tab) => {
          const isSel = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                isSel
                  ? "bg-blue-600 text-white font-bold shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
