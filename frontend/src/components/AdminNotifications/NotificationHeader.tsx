"use client";

import { useAdminNotificationStore, AdminNotificationTab } from "@/store/adminNotificationStore";
import { useRouter } from "next/navigation";
import { Send, Megaphone, LayoutTemplate, Plus } from "lucide-react";
import AdminPageHeader from "@/components/AdminShared/AdminPageHeader";

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
      <AdminPageHeader
        title="Notification Center & Messaging Gateway"
        description="Broadcast transactional emails, Firebase push notifications, SMS alerts, marketing campaigns, and Socket.IO events."
        breadcrumbs={[{ label: "Notifications" }]}
        badge="Omnichannel Comms"
        badgeVariant="violet"
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsTemplateModalOpen(true)}
              className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-2xs"
            >
              <LayoutTemplate className="w-3.5 h-3.5 text-purple-500" />
              <span>Manage Templates</span>
            </button>

            <button
              onClick={() => setIsCampaignWizardOpen(true)}
              className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-2xs"
            >
              <Megaphone className="w-3.5 h-3.5 text-emerald-500" />
              <span>Create Campaign</span>
            </button>

            <button
              onClick={() => handleTabClick("create")}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </div>
        }
      />

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
