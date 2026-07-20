"use client";

import { useAdminNotificationStore } from "@/store/adminNotificationStore";
import { useNotificationStats } from "@/hooks/useAdminNotificationQuery";

import NotificationHeader from "@/components/AdminNotifications/NotificationHeader";
import NotificationStats from "@/components/AdminNotifications/NotificationStats";
import ChannelCards from "@/components/AdminNotifications/ChannelCards";
import NotificationComposer from "@/components/AdminNotifications/NotificationComposer";
import EmailBuilder from "@/components/AdminNotifications/EmailBuilder";
import PushBuilder from "@/components/AdminNotifications/PushBuilder";
import RealtimeManager from "@/components/AdminNotifications/RealtimeManager";
import CampaignTable from "@/components/AdminNotifications/CampaignTable";
import CampaignBuilder from "@/components/AdminNotifications/CampaignBuilder";
import TemplateTable from "@/components/AdminNotifications/TemplateTable";
import TemplateEditor from "@/components/AdminNotifications/TemplateEditor";
import NotificationLogs from "@/components/AdminNotifications/NotificationLogs";
import AudienceSelector from "@/components/AdminNotifications/AudienceSelector";
import AnalyticsCharts from "@/components/AdminNotifications/AnalyticsCharts";
import AutomationRules from "@/components/AdminNotifications/AutomationRules";
import NotificationSettings from "@/components/AdminNotifications/NotificationSettings";
import NotificationSkeleton from "@/components/AdminNotifications/NotificationSkeleton";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function AdminNotificationsPage() {
  const activeTab = useAdminNotificationStore((state) => state.activeTab);
  const { data: stats, isLoading, isError, refetch } = useNotificationStats();

  if (isLoading || !stats) return <NotificationSkeleton />;

  if (isError) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-3xl text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200">
          Unable to Load Notification Gateway
        </h3>
        <p className="text-xs text-rose-600 dark:text-rose-400">
          The Notification Service microservice & RabbitMQ message broker encountered a connection timeout.
        </p>
        <button
          onClick={() => refetch()}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Page Header & Tab Pills */}
      <NotificationHeader />

      {/* Overview View */}
      {activeTab === "overview" && (
        <>
          <NotificationStats />
          <ChannelCards />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnalyticsCharts />
            <AudienceSelector />
          </div>
          <NotificationLogs />
        </>
      )}

      {/* Composer View */}
      {activeTab === "create" && (
        <>
          <NotificationComposer />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EmailBuilder />
            <PushBuilder />
          </div>
        </>
      )}

      {/* Campaigns View */}
      {activeTab === "campaigns" && <CampaignTable />}

      {/* Templates View */}
      {activeTab === "templates" && <TemplateTable />}

      {/* Logs View */}
      {activeTab === "logs" && <NotificationLogs />}

      {/* Realtime Events View */}
      {activeTab === "realtime" && <RealtimeManager />}

      {/* Analytics View */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsCharts />
          <AudienceSelector />
        </div>
      )}

      {/* Automation Rules View */}
      {activeTab === "automation" && <AutomationRules />}

      {/* Gateway Settings View */}
      {activeTab === "settings" && <NotificationSettings />}

      {/* Shared Modals */}
      <CampaignBuilder />
      <TemplateEditor />
    </div>
  );
}
