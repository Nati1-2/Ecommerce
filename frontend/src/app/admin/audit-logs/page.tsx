"use client";

import { useAdminAuditStore } from "@/store/adminAuditStore";
import { useAuditStats } from "@/hooks/useAdminAuditQuery";

import AuditHeader from "@/components/AdminAudit/AuditHeader";
import SecurityStats from "@/components/AdminAudit/SecurityStats";
import AuditFilters from "@/components/AdminAudit/AuditFilters";
import AuditTable from "@/components/AdminAudit/AuditTable";
import ActivityTimeline from "@/components/AdminAudit/ActivityTimeline";
import SecurityEvents from "@/components/AdminAudit/SecurityEvents";
import LoginActivity from "@/components/AdminAudit/LoginActivity";
import SecurityAlerts from "@/components/AdminAudit/SecurityAlerts";
import RealtimeMonitor from "@/components/AdminAudit/RealtimeMonitor";
import AuditDetailsDrawer from "@/components/AdminAudit/AuditDetailsDrawer";
import ComplianceReports from "@/components/AdminAudit/ComplianceReports";
import RetentionSettings from "@/components/AdminAudit/RetentionSettings";
import AuditSkeleton from "@/components/AdminAudit/AuditSkeleton";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function AdminAuditLogsPage() {
  const activeViewTab = useAdminAuditStore((state) => state.activeViewTab);
  const { data: stats, isLoading, isError, refetch } = useAuditStats();

  if (isLoading || !stats) return <AuditSkeleton />;

  if (isError) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-3xl text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200">
          Unable to Load Audit Logs
        </h3>
        <p className="text-xs text-rose-600 dark:text-rose-400">
          The Audit Log Service microservice & OpenSearch cluster encountered an index fetch timeout.
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
      {/* Header & View Navigation Tabs */}
      <AuditHeader />

      {/* Security Overview Cards */}
      <SecurityStats />

      {/* Socket.IO Realtime Telemetry Monitor */}
      <RealtimeMonitor />

      {/* View Switcher Content */}
      {activeViewTab === "logs" && (
        <>
          <AuditFilters />
          <AuditTable />
        </>
      )}

      {activeViewTab === "timeline" && <ActivityTimeline />}
      {activeViewTab === "security-events" && <SecurityEvents />}
      {activeViewTab === "logins" && <LoginActivity />}
      {activeViewTab === "alerts" && <SecurityAlerts />}

      {/* Shared Inspection Drawers & Modals */}
      <AuditDetailsDrawer />
      <ComplianceReports />
      <RetentionSettings />
    </div>
  );
}
